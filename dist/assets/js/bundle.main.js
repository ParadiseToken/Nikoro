!function(e){function n(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,n),a.l=!0,a.exports}var r={};n.m=e,n.c=r,n.d=function(e,r,t){n.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="/home/yuri/codice/Nikoro/dist",n(n.s=0)}([function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=r(1);r.n(t).a.initHighlightingOnLoad()},function(e,n,r){/*! highlight.js v9.12.0 | BSD3 License | git.io/hljslicense */
!function(e){"object"==typeof window&&window||"object"==typeof self&&self;e(n)}(function(e){function n(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(e){return e.nodeName.toLowerCase()}function t(e,n){var r=e&&e.exec(n);return r&&0===r.index}function a(e){return C.test(e)}function o(e){var n,r,t,o,i=e.className+" ";if(i+=e.parentNode?e.parentNode.className:"",r=k.exec(i))return E(r[1])?r[1]:"no-highlight";for(i=i.split(/\s+/),n=0,t=i.length;t>n;n++)if(o=i[n],a(o)||E(o))return o}function i(e){var n,r={},t=Array.prototype.slice.call(arguments,1);for(n in e)r[n]=e[n];return t.forEach(function(e){for(n in e)r[n]=e[n]}),r}function c(e){var n=[];return function e(t,a){for(var o=t.firstChild;o;o=o.nextSibling)3===o.nodeType?a+=o.nodeValue.length:1===o.nodeType&&(n.push({event:"start",offset:a,node:o}),a=e(o,a),r(o).match(/br|hr|img|input/)||n.push({event:"stop",offset:a,node:o}));return a}(e,0),n}function u(e,t,a){function o(){return e.length&&t.length?e[0].offset!==t[0].offset?e[0].offset<t[0].offset?e:t:"start"===t[0].event?e:t:e.length?e:t}function i(e){function t(e){return" "+e.nodeName+'="'+n(e.value).replace('"',"&quot;")+'"'}l+="<"+r(e)+R.map.call(e.attributes,t).join("")+">"}function c(e){l+="</"+r(e)+">"}function u(e){("start"===e.event?i:c)(e.node)}for(var s=0,l="",f=[];e.length||t.length;){var p=o();if(l+=n(a.substring(s,p[0].offset)),s=p[0].offset,p===e){f.reverse().forEach(c);do{u(p.splice(0,1)[0]),p=o()}while(p===e&&p.length&&p[0].offset===s);f.reverse().forEach(i)}else"start"===p[0].event?f.push(p[0].node):f.pop(),u(p.splice(0,1)[0])}return l+n(a.substr(s))}function s(e){return e.v&&!e.cached_variants&&(e.cached_variants=e.v.map(function(n){return i(e,{v:null},n)})),e.cached_variants||e.eW&&[i(e)]||[e]}function l(e){function n(e){return e&&e.source||e}function r(r,t){return new RegExp(n(r),"m"+(e.cI?"i":"")+(t?"g":""))}function t(a,o){if(!a.compiled){if(a.compiled=!0,a.k=a.k||a.bK,a.k){var i={},c=function(n,r){e.cI&&(r=r.toLowerCase()),r.split(" ").forEach(function(e){var r=e.split("|");i[r[0]]=[n,r[1]?Number(r[1]):1]})};"string"==typeof a.k?c("keyword",a.k):y(a.k).forEach(function(e){c(e,a.k[e])}),a.k=i}a.lR=r(a.l||/\w+/,!0),o&&(a.bK&&(a.b="\\b("+a.bK.split(" ").join("|")+")\\b"),a.b||(a.b=/\B|\b/),a.bR=r(a.b),a.e||a.eW||(a.e=/\B|\b/),a.e&&(a.eR=r(a.e)),a.tE=n(a.e)||"",a.eW&&o.tE&&(a.tE+=(a.e?"|":"")+o.tE)),a.i&&(a.iR=r(a.i)),null==a.r&&(a.r=1),a.c||(a.c=[]),a.c=Array.prototype.concat.apply([],a.c.map(function(e){return s("self"===e?a:e)})),a.c.forEach(function(e){t(e,a)}),a.starts&&t(a.starts,o);var u=a.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([a.tE,a.i]).map(n).filter(Boolean);a.t=u.length?r(u.join("|"),!0):{exec:function(){return null}}}}t(e)}function f(e,r,a,o){function i(e,n){var r,a;for(r=0,a=n.c.length;a>r;r++)if(t(n.c[r].bR,e))return n.c[r]}function c(e,n){if(t(e.eR,n)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?c(e.parent,n):void 0}function u(e,n){return!a&&t(n.iR,e)}function s(e,n){var r=N.cI?n[0].toLowerCase():n[0];return e.k.hasOwnProperty(r)&&e.k[r]}function b(e,n,r,t){var a=t?"":I.classPrefix,o='<span class="'+a,i=r?"":L;return(o+=e+'">')+n+i}function g(){var e,r,t,a;if(!R.k)return n(C);for(a="",r=0,R.lR.lastIndex=0,t=R.lR.exec(C);t;)a+=n(C.substring(r,t.index)),e=s(R,t),e?(k+=e[1],a+=b(e[0],n(t[0]))):a+=n(t[0]),r=R.lR.lastIndex,t=R.lR.exec(C);return a+n(C.substr(r))}function d(){var e="string"==typeof R.sL;if(e&&!x[R.sL])return n(C);var r=e?f(R.sL,C,!0,y[R.sL]):p(C,R.sL.length?R.sL:void 0);return R.r>0&&(k+=r.r),e&&(y[R.sL]=r.top),b(r.language,r.value,!1,!0)}function h(){M+=null!=R.sL?d():g(),C=""}function v(e){M+=e.cN?b(e.cN,"",!0):"",R=Object.create(e,{parent:{value:R}})}function m(e,n){if(C+=e,null==n)return h(),0;var r=i(n,R);if(r)return r.skip?C+=n:(r.eB&&(C+=n),h(),r.rB||r.eB||(C=n)),v(r,n),r.rB?0:n.length;var t=c(R,n);if(t){var a=R;a.skip?C+=n:(a.rE||a.eE||(C+=n),h(),a.eE&&(C=n));do{R.cN&&(M+=L),R.skip||R.sL||(k+=R.r),R=R.parent}while(R!==t.parent);return t.starts&&v(t.starts,""),a.rE?0:n.length}if(u(n,R))throw new Error('Illegal lexeme "'+n+'" for mode "'+(R.cN||"<unnamed>")+'"');return C+=n,n.length||1}var N=E(e);if(!N)throw new Error('Unknown language: "'+e+'"');l(N);var w,R=o||N,y={},M="";for(w=R;w!==N;w=w.parent)w.cN&&(M=b(w.cN,"",!0)+M);var C="",k=0;try{for(var B,A,S=0;R.t.lastIndex=S,B=R.t.exec(r);)A=m(r.substring(S,B.index),B[0]),S=B.index+A;for(m(r.substr(S)),w=R;w.parent;w=w.parent)w.cN&&(M+=L);return{r:k,value:M,language:e,top:R}}catch(e){if(e.message&&-1!==e.message.indexOf("Illegal"))return{r:0,value:n(r)};throw e}}function p(e,r){r=r||I.languages||y(x);var t={r:0,value:n(e)},a=t;return r.filter(E).forEach(function(n){var r=f(n,e,!1);r.language=n,r.r>a.r&&(a=r),r.r>t.r&&(a=t,t=r)}),a.language&&(t.second_best=a),t}function b(e){return I.tabReplace||I.useBR?e.replace(B,function(e,n){return I.useBR&&"\n"===e?"<br>":I.tabReplace?n.replace(/\t/g,I.tabReplace):""}):e}function g(e,n,r){var t=n?M[n]:r,a=[e.trim()];return e.match(/\bhljs\b/)||a.push("hljs"),-1===e.indexOf(t)&&a.push(t),a.join(" ").trim()}function d(e){var n,r,t,i,s,l=o(e);a(l)||(I.useBR?(n=document.createElementNS("http://www.w3.org/1999/xhtml","div"),n.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):n=e,s=n.textContent,t=l?f(l,s,!0):p(s),r=c(n),r.length&&(i=document.createElementNS("http://www.w3.org/1999/xhtml","div"),i.innerHTML=t.value,t.value=u(r,c(i),s)),t.value=b(t.value),e.innerHTML=t.value,e.className=g(e.className,l,t.language),e.result={language:t.language,re:t.r},t.second_best&&(e.second_best={language:t.second_best.language,re:t.second_best.r}))}function h(e){I=i(I,e)}function v(){if(!v.called){v.called=!0;var e=document.querySelectorAll("pre code");R.forEach.call(e,d)}}function m(){addEventListener("DOMContentLoaded",v,!1),addEventListener("load",v,!1)}function N(n,r){var t=x[n]=r(e);t.aliases&&t.aliases.forEach(function(e){M[e]=n})}function w(){return y(x)}function E(e){return e=(e||"").toLowerCase(),x[e]||x[M[e]]}var R=[],y=Object.keys,x={},M={},C=/^(no-?highlight|plain|text)$/i,k=/\blang(?:uage)?-([\w-]+)\b/i,B=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,L="</span>",I={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0};return e.highlight=f,e.highlightAuto=p,e.fixMarkup=b,e.highlightBlock=d,e.configure=h,e.initHighlighting=v,e.initHighlightingOnLoad=m,e.registerLanguage=N,e.listLanguages=w,e.getLanguage=E,e.inherit=i,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},e.C=function(n,r,t){var a=e.inherit({cN:"comment",b:n,e:r,c:[]},t||{});return a.c.push(e.PWM),a.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),a},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e.METHOD_GUARD={b:"\\.\\s*"+e.UIR,r:0},e.registerLanguage("javascript",function(e){var n="[A-Za-z$_][0-9A-Za-z$_]*",r={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},t={cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},a={cN:"subst",b:"\\$\\{",e:"\\}",k:r,c:[]},o={cN:"string",b:"`",e:"`",c:[e.BE,a]};a.c=[e.ASM,e.QSM,o,t,e.RM];var i=a.c.concat([e.CBCM,e.CLCM]);return{aliases:["js","jsx"],k:r,c:[{cN:"meta",r:10,b:/^\s*['"]use (strict|asm)['"]/},{cN:"meta",b:/^#!/,e:/$/},e.ASM,e.QSM,o,e.CLCM,e.CBCM,t,{b:/[{,]\s*/,r:0,c:[{b:n+"\\s*:",rB:!0,r:0,c:[{cN:"attr",b:n,r:0}]}]},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{cN:"function",b:"(\\(.*?\\)|"+n+")\\s*=>",rB:!0,e:"\\s*=>",c:[{cN:"params",v:[{b:n},{b:/\(\s*\)/},{b:/\(/,e:/\)/,eB:!0,eE:!0,k:r,c:i}]}]},{b:/</,e:/(\/\w+|\w+\/)>/,sL:"xml",c:[{b:/<\w+\s*\/>/,skip:!0},{b:/<\w+/,e:/(\/\w+|\w+\/)>/,skip:!0,c:[{b:/<\w+\s*\/>/,skip:!0},"self"]}]}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:n}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:i}],i:/\[|%/},{b:/\$[(.]/},e.METHOD_GUARD,{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]},{bK:"constructor",e:/\{/,eE:!0}],i:/#(?!!)/}}),e})}]);