!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return e[i].call(r.exports,r,r.exports,t),r.loaded=!0,r.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e){e=e.map(function(e){var t=new Blob(["define(function (require, exports, module) {"+e.code+"});"]);return e.src=URL.createObjectURL(t),e});var t=e.filter(function(e){return"string"==typeof e.alias}).map(function(e){return i({},e.alias,e.src)}),n={map:{"*":Object.assign.apply(null,[].concat(t))}},r=e.filter(function(e){return e.isEntryPoint}).map(function(e){return e.alias||e.src});requirejs(n,r,function(){l.emit("load")})}var s=n(1),a=n(2);a.debug=!1;var o=function(e){return e.currentStyle||document.defaultView.getComputedStyle(e)},l=new s,h=o(document.body);Object.defineProperty(l,"view",{get:function(){return{width:parseInt(h.width,10),height:parseInt(h.height,10)}},set:function(e){var t=h;h=e,l.emit("viewchange",t,e)}}),l.createCanvas=function(e,t){var n=document.createElement("canvas");return n.width=e,n.height=t,n.style.margin=0,n.style.padding=0,document.body.appendChild(n),l.view=n,n};var c=addEventListener;window.addEventListener=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return"message"===t[0]&&"function"==typeof t[1]&&!function(){var e=t[1];t[1]=function(){for(var t=arguments.length,n=Array(t),i=0;i<t;i++)n[i]=arguments[i];var r=n[0],s=r.data,a=r.source;return a===parent&&(n[0]={origin:"*",data:s,source:a}),e.apply(window,n)}}(),c.apply(window,t)};var u=new a.Model({size:function(){return l.view}});u.then(function(e){l.parent=e,r(e.model.files),addEventListener("resize",function(){return e.emit("resize",l.view)}),l.on("viewchange",function(){return e.emit("resize",l.view)}),l.on("load",function(){return e.emit("load")})}),window.Hack=l},function(e,t,n){var i;!function(r){function s(){this._events={},this._conf&&a.call(this,this._conf)}function a(e){e?(this._conf=e,e.delimiter&&(this.delimiter=e.delimiter),this._events.maxListeners=e.maxListeners!==r?e.maxListeners:f,e.wildcard&&(this.wildcard=e.wildcard),e.newListener&&(this.newListener=e.newListener),this.wildcard&&(this.listenerTree={})):this._events.maxListeners=f}function o(e){console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",e),console.trace&&console.trace()}function l(e){this._events={},this.newListener=!1,a.call(this,e)}function h(e,t,n,i){if(!n)return[];var r,s,a,o,l,c,u,f=[],d=t.length,p=t[i],v=t[i+1];if(i===d&&n._listeners){if("function"==typeof n._listeners)return e&&e.push(n._listeners),[n];for(r=0,s=n._listeners.length;r<s;r++)e&&e.push(n._listeners[r]);return[n]}if("*"===p||"**"===p||n[p]){if("*"===p){for(a in n)"_listeners"!==a&&n.hasOwnProperty(a)&&(f=f.concat(h(e,t,n[a],i+1)));return f}if("**"===p){u=i+1===d||i+2===d&&"*"===v,u&&n._listeners&&(f=f.concat(h(e,t,n,d)));for(a in n)"_listeners"!==a&&n.hasOwnProperty(a)&&("*"===a||"**"===a?(n[a]._listeners&&!u&&(f=f.concat(h(e,t,n[a],d))),f=f.concat(h(e,t,n[a],i))):f=a===v?f.concat(h(e,t,n[a],i+2)):f.concat(h(e,t,n[a],i)));return f}f=f.concat(h(e,t,n[p],i+1))}if(o=n["*"],o&&h(e,t,o,i+1),l=n["**"])if(i<d){l._listeners&&h(e,t,l,d);for(a in l)"_listeners"!==a&&l.hasOwnProperty(a)&&(a===v?h(e,t,l[a],i+2):a===p?h(e,t,l[a],i+1):(c={},c[a]=l[a],h(e,t,{"**":c},i+1)))}else l._listeners?h(e,t,l,d):l["*"]&&l["*"]._listeners&&h(e,t,l["*"],d);return f}function c(e,t){e="string"==typeof e?e.split(this.delimiter):e.slice();for(var n=0,i=e.length;n+1<i;n++)if("**"===e[n]&&"**"===e[n+1])return;for(var s=this.listenerTree,a=e.shift();a!==r;){if(s[a]||(s[a]={}),s=s[a],0===e.length)return s._listeners?("function"==typeof s._listeners&&(s._listeners=[s._listeners]),s._listeners.push(t),!s._listeners.warned&&this._events.maxListeners>0&&s._listeners.length>this._events.maxListeners&&(s._listeners.warned=!0,o(s._listeners.length))):s._listeners=t,!0;a=e.shift()}return!0}var u=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},f=10;l.EventEmitter2=l,l.prototype.delimiter=".",l.prototype.setMaxListeners=function(e){e!==r&&(this._events||s.call(this),this._events.maxListeners=e,this._conf||(this._conf={}),this._conf.maxListeners=e)},l.prototype.event="",l.prototype.once=function(e,t){return this.many(e,1,t),this},l.prototype.many=function(e,t,n){function i(){0===--t&&r.off(e,i),n.apply(this,arguments)}var r=this;if("function"!=typeof n)throw new Error("many only accepts instances of Function");return i._origin=n,this.on(e,i),r},l.prototype.emit=function(){this._events||s.call(this);var e=arguments[0];if("newListener"===e&&!this.newListener&&!this._events.newListener)return!1;var t,n,i,r,a,o=arguments.length;if(this._all&&this._all.length){if(a=this._all.slice(),o>3)for(t=new Array(o),r=0;r<o;r++)t[r]=arguments[r];for(i=0,n=a.length;i<n;i++)switch(this.event=e,o){case 1:a[i].call(this,e);break;case 2:a[i].call(this,e,arguments[1]);break;case 3:a[i].call(this,e,arguments[1],arguments[2]);break;default:a[i].apply(this,t)}}if(this.wildcard){a=[];var l="string"==typeof e?e.split(this.delimiter):e.slice();h.call(this,a,l,this.listenerTree,0)}else{if(a=this._events[e],"function"==typeof a){switch(this.event=e,o){case 1:a.call(this);break;case 2:a.call(this,arguments[1]);break;case 3:a.call(this,arguments[1],arguments[2]);break;default:for(t=new Array(o-1),r=1;r<o;r++)t[r-1]=arguments[r];a.apply(this,t)}return!0}a&&(a=a.slice())}if(a&&a.length){if(o>3)for(t=new Array(o-1),r=1;r<o;r++)t[r-1]=arguments[r];for(i=0,n=a.length;i<n;i++)switch(this.event=e,o){case 1:a[i].call(this);break;case 2:a[i].call(this,arguments[1]);break;case 3:a[i].call(this,arguments[1],arguments[2]);break;default:a[i].apply(this,t)}return!0}if(!this._all&&"error"===e)throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");return!!this._all},l.prototype.emitAsync=function(){this._events||s.call(this);var e=arguments[0];if("newListener"===e&&!this.newListener&&!this._events.newListener)return Promise.resolve([!1]);var t,n,i,r,a,o=[],l=arguments.length;if(this._all){if(l>3)for(t=new Array(l),r=1;r<l;r++)t[r]=arguments[r];for(i=0,n=this._all.length;i<n;i++)switch(this.event=e,l){case 1:o.push(this._all[i].call(this,e));break;case 2:o.push(this._all[i].call(this,e,arguments[1]));break;case 3:o.push(this._all[i].call(this,e,arguments[1],arguments[2]));break;default:o.push(this._all[i].apply(this,t))}}if(this.wildcard){a=[];var c="string"==typeof e?e.split(this.delimiter):e.slice();h.call(this,a,c,this.listenerTree,0)}else a=this._events[e];if("function"==typeof a)switch(this.event=e,l){case 1:o.push(a.call(this));break;case 2:o.push(a.call(this,arguments[1]));break;case 3:o.push(a.call(this,arguments[1],arguments[2]));break;default:for(t=new Array(l-1),r=1;r<l;r++)t[r-1]=arguments[r];o.push(a.apply(this,t))}else if(a&&a.length){if(l>3)for(t=new Array(l-1),r=1;r<l;r++)t[r-1]=arguments[r];for(i=0,n=a.length;i<n;i++)switch(this.event=e,l){case 1:o.push(a[i].call(this));break;case 2:o.push(a[i].call(this,arguments[1]));break;case 3:o.push(a[i].call(this,arguments[1],arguments[2]));break;default:o.push(a[i].apply(this,t))}}else if(!this._all&&"error"===e)return arguments[1]instanceof Error?Promise.reject(arguments[1]):Promise.reject("Uncaught, unspecified 'error' event.");return Promise.all(o)},l.prototype.on=function(e,t){if("function"==typeof e)return this.onAny(e),this;if("function"!=typeof t)throw new Error("on only accepts instances of Function");return this._events||s.call(this),this.emit("newListener",e,t),this.wildcard?(c.call(this,e,t),this):(this._events[e]?("function"==typeof this._events[e]&&(this._events[e]=[this._events[e]]),this._events[e].push(t),!this._events[e].warned&&this._events.maxListeners>0&&this._events[e].length>this._events.maxListeners&&(this._events[e].warned=!0,o(this._events[e].length))):this._events[e]=t,this)},l.prototype.onAny=function(e){if("function"!=typeof e)throw new Error("onAny only accepts instances of Function");return this._all||(this._all=[]),this._all.push(e),this},l.prototype.addListener=l.prototype.on,l.prototype.off=function(e,t){function n(e){if(e!==r){var t=Object.keys(e);for(var i in t){var s=t[i],a=e[s];a instanceof Function||"object"!=typeof a||null===a||(Object.keys(a).length>0&&n(e[s]),0===Object.keys(a).length&&delete e[s])}}}if("function"!=typeof t)throw new Error("removeListener only takes instances of Function");var i,s=[];if(this.wildcard){var a="string"==typeof e?e.split(this.delimiter):e.slice();s=h.call(this,null,a,this.listenerTree,0)}else{if(!this._events[e])return this;i=this._events[e],s.push({_listeners:i})}for(var o=0;o<s.length;o++){var l=s[o];if(i=l._listeners,u(i)){for(var c=-1,f=0,d=i.length;f<d;f++)if(i[f]===t||i[f].listener&&i[f].listener===t||i[f]._origin&&i[f]._origin===t){c=f;break}if(c<0)continue;return this.wildcard?l._listeners.splice(c,1):this._events[e].splice(c,1),0===i.length&&(this.wildcard?delete l._listeners:delete this._events[e]),this.emit("removeListener",e,t),this}(i===t||i.listener&&i.listener===t||i._origin&&i._origin===t)&&(this.wildcard?delete l._listeners:delete this._events[e],this.emit("removeListener",e,t))}return n(this.listenerTree),this},l.prototype.offAny=function(e){var t,n=0,i=0;if(e&&this._all&&this._all.length>0){for(t=this._all,n=0,i=t.length;n<i;n++)if(e===t[n])return t.splice(n,1),this.emit("removeListenerAny",e),this}else{for(t=this._all,n=0,i=t.length;n<i;n++)this.emit("removeListenerAny",t[n]);this._all=[]}return this},l.prototype.removeListener=l.prototype.off,l.prototype.removeAllListeners=function(e){if(0===arguments.length)return!this._events||s.call(this),this;if(this.wildcard)for(var t="string"==typeof e?e.split(this.delimiter):e.slice(),n=h.call(this,null,t,this.listenerTree,0),i=0;i<n.length;i++){var r=n[i];r._listeners=null}else this._events&&(this._events[e]=null);return this},l.prototype.listeners=function(e){if(this.wildcard){var t=[],n="string"==typeof e?e.split(this.delimiter):e.slice();return h.call(this,t,n,this.listenerTree,0),t}return this._events||s.call(this),this._events[e]||(this._events[e]=[]),u(this._events[e])||(this._events[e]=[this._events[e]]),this._events[e]},l.prototype.listenerCount=function(e){return this.listeners(e).length},l.prototype.listenersAny=function(){return this._all?this._all:[]},i=function(){return l}.call(t,n,t,e),!(i!==r&&(e.exports=i))}()},function(e,t,n){/**
	 * postmate - A powerful, simple, promise-based postMessage library
	 * @version v1.0.2
	 * @link https://github.com/dollarshaveclub/postmate
	 * @author Jacob Kelley <jakie8@gmail.com>
	 * @license MIT */
!function(t,n){e.exports=n()}(this,function(){"use strict";function e(){var e;c.debug&&(e=console).log.apply(e,arguments)}function t(e){var t=document.createElement("a");return t.href=e,t.origin}function n(e,t){return e.origin===t&&"object"===r(e.data)&&"postmate"in e.data&&e.data.type===o}function i(e,t){var n="function"==typeof e[t]?e[t]():e[t];return c.Promise.resolve(n)}var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},s=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),o="application/x-postmate-v1+json",l=function(){function t(n){var i=this;s(this,t),this.parent=n.parent,this.frame=n.frame,this.child=n.child,this.childOrigin=n.childOrigin,this.events={},e("Parent: Registering API"),e("Parent: Awaiting messages..."),this.listener=function(t){var n=((t||{}).data||{}).value||{},r=n.data,s=n.name;"emit"===t.data.postmate&&(e("Parent: Received event emission: "+s),s in i.events&&i.events[s].call(i,r))},this.parent.addEventListener("message",this.listener,!1),e("Parent: Awaiting event emissions from Child")}return a(t,[{key:"get",value:function(e){var t=this;return new c.Promise(function(n){var i=(new Date).getTime(),r=function s(e){e.data.uid===i&&"reply"===e.data.postmate&&(t.parent.removeEventListener("message",s,!1),n(e.data.value))};parent.addEventListener("message",r,!1),t.child.postMessage({postmate:"request",type:o,property:e,uid:i},t.childOrigin)})}},{key:"on",value:function(e,t){this.events[e]=t}},{key:"destroy",value:function(){e("Parent: Destroying Postmate instance"),window.removeEventListener("message",this.listener,!1),this.frame.parentNode.removeChild(this.frame)}}]),t}(),h=function(){function t(r){var a=this;s(this,t),this.model=r.model,this.parent=r.parent,this.parentOrigin=r.parentOrigin,this.child=r.child,e("Child: Registering API"),e("Child: Awaiting messages..."),this.child.addEventListener("message",function(t){if(n(t,a.parentOrigin)){e("Child: Received request",t.data);var r=t.data,s=r.property,l=r.uid;i(a.model,s).then(function(e){return t.source.postMessage({property:s,postmate:"reply",type:o,uid:l,value:e},t.origin)})}})}return a(t,[{key:"emit",value:function(t,n){e('Child: Emitting Event "'+t+'"',n),this.parent.postMessage({postmate:"emit",type:o,value:{name:t,data:n}},this.parentOrigin)}}]),t}(),c=function(){function i(e){s(this,i);var t=e.container,n=e.url,r=e.model;return this.parent=window,this.frame=document.createElement("iframe"),(t||document.body).appendChild(this.frame),this.child=this.frame.contentWindow,this.model=r||{},this.sendHandshake(n)}return a(i,[{key:"sendHandshake",value:function(r){var s=this,a=t(r);return new i.Promise(function(t,i){var h=function c(r){return!!n(r,a)&&("handshake-reply"===r.data.postmate?(e("Parent: Received handshake reply from Child"),s.parent.removeEventListener("message",c,!1),s.childOrigin=r.origin,e("Parent: Saving Child origin",s.childOrigin),t(new l(s))):(e("Parent: Invalid handshake reply"),i("Failed handshake")))};s.parent.addEventListener("message",h,!1),s.frame.onload=function(){e("Parent: Sending handshake"),s.child.postMessage({postmate:"handshake",type:o,model:s.model},a)},e("Parent: Loading frame"),s.frame.src=r})}}]),i}();return c.debug=!1,c.Promise=window.Promise,c.Model=function(){function t(e){return s(this,t),this.child=window,this.model=e,this.parent=this.child.parent,this.sendHandshakeReply()}return a(t,[{key:"sendHandshakeReply",value:function(){var t=this;return new c.Promise(function(n,i){var r=function s(r){if("handshake"===r.data.postmate){e("Child: Received handshake from Parent"),t.child.removeEventListener("message",s,!1),e("Child: Sending handshake reply to Parent"),r.source.postMessage({postmate:"handshake-reply",type:o},r.origin),t.parentOrigin=r.origin;var a=r.data.model;if(a){for(var l=Object.keys(a),c=0;c<l.length;c++)a.hasOwnProperty(l[c])&&(t.model[l[c]]=a[l[c]]);e("Child: Inherited and extended model from Parent")}return e("Child: Saving Parent origin",t.parentOrigin),n(new h(t))}return i("Handshake Reply Failed")};t.child.addEventListener("message",r,!1)})}}]),t}(),c})}]);