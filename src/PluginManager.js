const fs = require('fs');
const path = require('path');
const Logger = require("./Log");
const Plugin = require("./Plugin");

// A small utility functor to find a plugin with a given name
const nameMatches = targetName => pl => pl.plugin.name.toLowerCase() === targetName.toLowerCase();

const SYNC_INTERVAL = 5000;

function messageIsCommand(message) {
    if (!message.entities) return;
    const entity = message.entities[0];
    return entity.offset === 0 && entity.type === "bot_command";
}

// Note: we only parse commands at the start of the message,
// therefore we suppose entity.offset = 0
function parseCommand(message) {
    const entity = message.entities[0];

    const rawCommand = message.text.substring(1, entity.length);
    let command;
    if (rawCommand.search("@") === -1)
        command = rawCommand;
    else
        command = rawCommand.substring(0, rawCommand.search("@"));

    let args = [];
    if (message.text.length > entity.length) {
        args = message.text.slice(entity.length + 1).split(" ");
    }

    return {args, command};
}

module.exports = class PluginManager {
    constructor(bot, config, auth) {
        this.bot = bot;
        this.log = new Logger("PluginManager", config);
        this.auth = auth;
        this.plugins = [];

        this.config = config;

        const events = Object.keys(Plugin.handlerNames)
            // We handle the message event by ourselves.
            .filter(prop => prop !== "message")
            // Events beginning with an underscore (eg. _command) are internal.
            .filter(prop => prop[0] !== "_");

        // Registers a handler for every Telegram event.
        // It runs the message through the proxy and forwards it to the plugin manager.
        for (const eventName of events) {
            bot.on(
                eventName,
                message => {
                    this.parseHardcoded(message);
                    Promise.all(
                        this.plugins
                            .filter(plugin => plugin.plugin.isProxy)
                            .map(plugin => plugin.proxy(eventName, message))
                        )
                       .then(() => this.emit(
                            "message",
                            message
                        ))
                       .then(() => this.emit(
                            eventName,
                            message
                        ))
                        .catch(err => {
                            if (err) this.log.error("Message rejected with error", err);
                        });
                }
            );
        }
    }

    parseHardcoded(message) {
        // Hardcoded commands
        if (!messageIsCommand(message)) return;
        const {command, args} = parseCommand(message);
        // Skip everything if we're not interested in this command
        if (command !== "help" && command !== "enable" && command !== "disable") return;
        let [pluginName, targetChat] = args;

        if (command === "help") {
            const availablePlugins = this.plugins
                .map(pl => pl.plugin)
                .filter(pl => !pl.isHidden);
            if (pluginName) {
                pluginName = pluginName.toLowerCase();
                const plugin = availablePlugins
                    .filter(pl => pl.name.toLowerCase() === pluginName)[0];

                if (plugin)
                    this.bot.sendMessage(
                        message.chat.id,
                        `*${plugin.name}* - ${plugin.description}\n\n${plugin.help}`,
                        {
                            parse_mode: "markdown",
                            disable_web_page_preview: true
                        }
                    );
                else
                    this.bot.sendMessage(message.chat.id, "No such plugin.");
            } else {
                this.bot.sendMessage(
                    message.chat.id,
                    availablePlugins
                        .map(pl => `*${pl.name}*: ${pl.description}`)
                        .join("\n"),
                    {
                        parse_mode: "markdown",
                        disable_web_page_preview: true
                    }
                );
            }

            return;
        }

        if (!this.auth.isAdmin(message.from.id)) return;
        // Syntax: /("enable"|"disable") pluginName [targetChat|"chat"]
        // The string "chat" will enable the plugin in the current chat.
        if (targetChat === "chat") targetChat = message.chat.id;
        targetChat = Number(targetChat);
        // Checks if it is already in this.plugins
        const isGloballyEnabled = this.plugins.some(nameMatches(pluginName));
        let response;
        switch (command) {
        case "enable":
            if (targetChat) {
                if (isGloballyEnabled) {
                    response = "Plugin already enabled.";
                } else {
                    try {
                        this.loadAndAdd(pluginName);
                        const plugin = this.plugins.find(nameMatches(pluginName));
                        plugin.blacklist.delete(targetChat);
                        response = `Plugin enabled successfully for chat ${targetChat}.`;
                    } catch (e) {
                        this.log.warn(e);
                        if (/^Cannot find module/.test(e.message))
                            response = "No such plugin. Did you spell it correctly? Note that names are case-sensitive.";
                        else
                            response = "Couldn't load plugin: " + e.message;
                    }
                }
            } else if (isGloballyEnabled) {
                response = "Plugin already enabled.";
            } else {
                this.log.info(`Enabling ${pluginName} from message interface`);
                try {
                    this.loadAndAdd(pluginName);
                    response = "Plugin enabled successfully.";
                } catch (e) {
                    this.log.warn(e);
                    if (/^Cannot find module/.test(e.message))
                        if (/src.plugins/.test(e.message))
                            response = "No such plugin. Did you spell it correctly? Note that names are case-sensitive.";
                        else
                            response = e.message.replace(/Cannot find module '([^']+)'/, "The plugin has a missing dependency: `$1`");
                    else
                        response = "Couldn't load plugin, check console for errors.";
                }
            }
            break;
        case "disable":
            if (targetChat) {
                if (isGloballyEnabled) {
                    const plugin = this.plugins.find(nameMatches(pluginName));
                    plugin.blacklist.add(targetChat);
                    response = `Plugin disabled successfully for chat ${targetChat}.`;
                } else {
                    response = "Plugin isn't enabled.";
                }
            } else if (isGloballyEnabled) {
                const outcome = this.removePlugin(pluginName);
                response = outcome ? "Plugin disabled successfully." : "An error occurred.";
            } else {
                response = "Plugin already disabled.";
            }
            break;
        default:
            break;
        }
        this.bot.sendMessage(message.chat.id, response);
    }

    // Instantiates the plugin.
    // Returns the plugin itself.
    loadPlugin(pluginName) {
        const pluginPath = path.join(__dirname, 'plugins', pluginName);
        /* Invalidates the require() cache.
         * This allows for "hot fixes" to plugins: just /disable it, make the
         * required changes, and /enable it again.
         * If the cache wasn't invalidated, the plugin would be loaded from
         * cache rather than from disk, meaning that your changes wouldn't apply.
         * Method: https://stackoverflow.com/a/16060619
         */
        delete require.cache[require.resolve(pluginPath)];
        const ThisPlugin = require(pluginPath);

        this.log.debug(`Required ${pluginName}`);

        // Load the blacklist and database from disk
        const databasePath = PluginManager.getDatabasePath(pluginName);
        let db = {};
        let blacklist = [];

        if (fs.existsSync(databasePath)) {
            const data = JSON.parse(fs.readFileSync(databasePath, "utf8"));
            db = data.db;
            blacklist = data.blacklist;
        }

        const loadedPlugin = new ThisPlugin({
            db,
            blacklist,
            bot: this.bot,
            config: this.config,
            auth: this.auth
        });

        // Bind all the methods from the bot API
        for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(this.bot))) {
            if (typeof this.bot[method] !== "function") continue;
            if (method === "constructor" || method === "on" || method === "onText") continue;
            if (/^_/.test(method)) continue; // Do not expose internal methods
            this.log.debug(`Binding ${method}`);
            loadedPlugin[method] = this.bot[method].bind(this.bot);
        }

        this.log.debug(`Created ${pluginName}.`);

        return loadedPlugin;
    }

    // Adds the plugin to the list of active plugins
    addPlugin(loadedPlugin) {
        this.plugins.push(loadedPlugin);
        this.log.verbose(`Added ${loadedPlugin.plugin.name}.`);
    }

    // Returns true if the plugin was added successfully, false otherwise.
    loadAndAdd(pluginName, persist = true) {
        try {
            const plugin = this.loadPlugin(pluginName);
            this.log.debug(pluginName + " loaded correctly.");
            this.addPlugin(plugin);
            if (persist) {
                this.config.activePlugins.push(pluginName);
                fs.writeFileSync("config.json", JSON.stringify(this.config, null, 4));
            }
        } catch (e) {
            this.log.warn(`Failed to initialize plugin ${pluginName}.`);
            throw e;
        }
    }

    // Load and add every plugin in the list.
    loadPlugins(pluginNames, persist = true) {
        this.log.verbose(`Loading and adding ${pluginNames.length} plugins...`);
        Error.stackTraceLimit = 5; // Avoid printing useless data in stack traces

        const log = pluginNames.map(name => {
            try {
                this.loadAndAdd(name, persist);
                return true;
            } catch (e) {
                this.log.warn(e);
                return false;
            }
        });
        if (log.some(result => result !== true)) {
            this.log.warn("Some plugins couldn't be loaded.");
        }

        Error.stackTraceLimit = 10; // Reset to default value
    }

    // Returns true if at least one plugin was removed
    removePlugin(pluginName, persist = true) {
        this.log.verbose(`Removing plugin ${pluginName}`);
        if (persist) {
            this.config.activePlugins = this.config.activePlugins.filter(name => !nameMatches(name));
            fs.writeFileSync("config.json", JSON.stringify(this.config, null, 4));
        }
        const prevPluginNum = this.plugins.length;
        const isCurrentPlugin = nameMatches(pluginName);
        this.plugins.filter(isCurrentPlugin).forEach(pl => pl.stop());
        this.plugins = this.plugins.filter(pl => !isCurrentPlugin(pl));
        const curPluginNum = this.plugins.length;
        return (prevPluginNum - curPluginNum) > 0;
    }

    stopPlugins() {
        return Promise.all(this.plugins.map(pl => pl.stop()));
    }

    static getDatabasePath(pluginName) {
        return path.join(__dirname, '..', 'db', 'plugin_' + pluginName + '.json');
    }

    startSynchronization() {
        this.synchronizationInterval = setInterval(() => {
            this.log.debug(`Starting synchronization`);
            this.plugins.forEach(plugin => {
                fs.writeFile(
                    PluginManager.getDatabasePath(plugin.plugin.name),
                    JSON.stringify({
                        db: plugin.db,
                        blacklist: Array.from(plugin.blacklist)
                    }),
                    err => {
                        if (err) {
                            this.log.error("Error synchronizing the database", err);
                        }
                    }
                );
            });
        }, SYNC_INTERVAL);
    }

    stopSynchronization() {
        if (this.synchronizationInterval) {
            clearInterval(this.synchronizationInterval);
        }
    }

    emit(event, message) {
        this.log.debug(`Triggered event ${event}`);

        // Skip the "message" event in order to avoid duplicates
        if (event !== "message") {
            // If the current message is a command, fire an additional _command event
            // and also deal with the `get commands()` shortcut
            if (messageIsCommand(message)) {
                const {command, args} = parseCommand(message);
                this.rawEmit("_command", {message, command, args});
                // Loop through all shortcuts...
                for (const plugin of this.plugins) {
                    try {
                        for (const trigger of Object.keys(plugin.commands)) {
                            // Until you find one that matches
                            if (command !== trigger)
                                continue;
                            // Call the shortcut, and deal appropriately with the return value
                            const ret = plugin.commands[trigger]({message, args});
                            if (typeof ret === "string" || typeof ret === "number") {
                                this.bot.sendMessage(message.chat.id, ret);
                                break;
                            }
                            if (typeof ret === "undefined")
                                break;
                            switch (ret.type) {
                            case "text":
                                this.bot.sendMessage(message.chat.id, ret.text, ret.options);
                                break;
                            case "audio":
                                this.bot.sendAudio(message.chat.id, ret.audio, ret.options);
                                break;
                            case "document":
                                this.bot.sendDocument(message.chat.id, ret.document, ret.options);
                                break;
                            case "photo":
                                this.bot.sendPhoto(message.chat.id, ret.photo, ret.options);
                                break;
                            case "sticker":
                                this.bot.sendSticker(message.chat.id, ret.sticker, ret.options);
                                break;
                            case "video":
                                this.bot.sendVideo(message.chat.id, ret.video, ret.options);
                                break;
                            case "voice":
                                this.bot.sendVoice(message.chat.id, ret.voice, ret.options);
                                break;
                            case "status":
                            case "chatAction":
                                this.bot.sendChatAction(message.chat.id, ret.status, ret.options);
                                break;

                            default:
                                this.log.error(`Unrecognized reply type ${ret.type}`);
                                break;
                            }
                            break;
                        }
                    } catch (e) {
                        this.log.error(`Plugin ${plugin.plugin.name} threw an exception while handling command shortcuts`);
                        this.log.error(e);
                    }
                }
            } else if (message.query !== undefined) {
                const parts = message.query.split(" ");
                const command = parts[0].toLowerCase();
                const args = parts.length > 1 ? parts.slice(1) : [];
                this.rawEmit("_inline_command", {message, command, args});
            }
        }

        this.rawEmit(event, {message});
    }

    rawEmit(event, message) {
        const handlerName = Plugin.handlerNames[event];
        for (const plugin of this.plugins) {
            if (!(handlerName in plugin))
                return;
            try {
                plugin[handlerName](message);
            } catch (e) {
                this.log.error(`Plugin ${plugin.plugin.name} threw an exception while receiving '${event}'`);
                this.log.error(e);
            }
        }
    }
};
