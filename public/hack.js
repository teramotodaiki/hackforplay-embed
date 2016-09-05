/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const EventTarget = __webpack_require__(1);

	const Hack = new EventTarget();

	Hack.on = Hack.addEventListener; // synonym

	// Style
	document.documentElement.style.height =
	document.documentElement.style.width =
	document.body.style.height =
	document.body.style.width = '100%';
	document.body.style.margin = 0;
	document.body.style.overflow = 'hidden';

	// Primary canvas
	const canvas = __webpack_require__(5)();
	canvas.addEventListener('resize', () => {
	  Hack.postMessage({
	    method: 'resize',
	    width: canvas.width,
	    height: canvas.height
	  });
	});
	document.body.appendChild(canvas);
	Hack.canvas = canvas; // export as default

	// Connect
	const channel = new MessageChannel();

	channel.port1.onmessage = (event) => {
	  Hack.dispatchEvent(event);
	  if (event.data.method) {
	    const partialEvent = new Event(event.data.method + '.message');
	    partialEvent.data = event.data;
	    Hack.dispatchEvent(partialEvent);
	  }
	};

	Hack.postMessage = (...args) => {
	  return channel.port1.postMessage(...args);
	}; // export as default

	// require
	Hack.on('require.message', (event) => {

	  (callback => {
	    // dependencies
	    requirejs(event.data.dependencies || [], callback);

	  })(() => {
	    // main script
	    const script = new Blob([
	      `define(function (require, exports, module) {
	        ${event.data.code || ''}
	      });`
	    ]);
	    requirejs([window.URL.createObjectURL(script)], () => {
	      // resolved
	      Hack.dispatchEvent(new Event('load'));
	    });

	  });

	});

	window.parent.postMessage('ping', '*', [channel.port2]);

	// Export
	window.Hack = Hack;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Toru Nagashima
	 * @copyright 2015 Toru Nagashima. All rights reserved.
	 * See LICENSE file in root directory for full license.
	 */

	"use strict";

	//-----------------------------------------------------------------------------
	// Requirements
	//-----------------------------------------------------------------------------

	var Commons = __webpack_require__(2);
	var CustomEventTarget = __webpack_require__(3);
	var EventWrapper = __webpack_require__(4);
	var LISTENERS = Commons.LISTENERS;
	var CAPTURE = Commons.CAPTURE;
	var BUBBLE = Commons.BUBBLE;
	var ATTRIBUTE = Commons.ATTRIBUTE;
	var newNode = Commons.newNode;
	var defineCustomEventTarget = CustomEventTarget.defineCustomEventTarget;
	var createEventWrapper = EventWrapper.createEventWrapper;
	var STOP_IMMEDIATE_PROPAGATION_FLAG =
	    EventWrapper.STOP_IMMEDIATE_PROPAGATION_FLAG;

	//-----------------------------------------------------------------------------
	// Constants
	//-----------------------------------------------------------------------------

	/**
	 * A flag which shows there is the native `EventTarget` interface object.
	 *
	 * @type {boolean}
	 * @private
	 */
	var HAS_EVENTTARGET_INTERFACE = (
	    typeof window !== "undefined" &&
	    typeof window.EventTarget !== "undefined"
	);

	//-----------------------------------------------------------------------------
	// Public Interface
	//-----------------------------------------------------------------------------

	/**
	 * An implementation for `EventTarget` interface.
	 *
	 * @constructor
	 * @public
	 */
	var EventTarget = module.exports = function EventTarget() {
	    if (this instanceof EventTarget) {
	        // this[LISTENERS] is a Map.
	        // Its key is event type.
	        // Its value is ListenerNode object or null.
	        //
	        // interface ListenerNode {
	        //     var listener: Function
	        //     var kind: CAPTURE|BUBBLE|ATTRIBUTE
	        //     var next: ListenerNode|null
	        // }
	        Object.defineProperty(this, LISTENERS, {value: Object.create(null)});
	    }
	    else if (arguments.length === 1 && Array.isArray(arguments[0])) {
	        return defineCustomEventTarget(EventTarget, arguments[0]);
	    }
	    else if (arguments.length > 0) {
	        var types = Array(arguments.length);
	        for (var i = 0; i < arguments.length; ++i) {
	            types[i] = arguments[i];
	        }

	        // To use to extend with attribute listener properties.
	        // e.g.
	        //     class MyCustomObject extends EventTarget("message", "error") {
	        //         //...
	        //     }
	        return defineCustomEventTarget(EventTarget, types);
	    }
	    else {
	        throw new TypeError("Cannot call a class as a function");
	    }
	};

	EventTarget.prototype = Object.create(
	    (HAS_EVENTTARGET_INTERFACE ? window.EventTarget : Object).prototype,
	    {
	        constructor: {
	            value: EventTarget,
	            writable: true,
	            configurable: true
	        },

	        addEventListener: {
	            value: function addEventListener(type, listener, capture) {
	                if (listener == null) {
	                    return false;
	                }
	                if (typeof listener !== "function" && typeof listener !== "object") {
	                    throw new TypeError("\"listener\" is not an object.");
	                }

	                var kind = (capture ? CAPTURE : BUBBLE);
	                var node = this[LISTENERS][type];
	                if (node == null) {
	                    this[LISTENERS][type] = newNode(listener, kind);
	                    return true;
	                }

	                var prev = null;
	                while (node != null) {
	                    if (node.listener === listener && node.kind === kind) {
	                        // Should ignore a duplicated listener.
	                        return false;
	                    }
	                    prev = node;
	                    node = node.next;
	                }

	                prev.next = newNode(listener, kind);
	                return true;
	            },
	            configurable: true,
	            writable: true
	        },

	        removeEventListener: {
	            value: function removeEventListener(type, listener, capture) {
	                if (listener == null) {
	                    return false;
	                }

	                var kind = (capture ? CAPTURE : BUBBLE);
	                var prev = null;
	                var node = this[LISTENERS][type];
	                while (node != null) {
	                    if (node.listener === listener && node.kind === kind) {
	                        if (prev == null) {
	                            this[LISTENERS][type] = node.next;
	                        }
	                        else {
	                            prev.next = node.next;
	                        }
	                        return true;
	                    }

	                    prev = node;
	                    node = node.next;
	                }

	                return false;
	            },
	            configurable: true,
	            writable: true
	        },

	        dispatchEvent: {
	            value: function dispatchEvent(event) {
	                // If listeners aren't registered, terminate.
	                var node = this[LISTENERS][event.type];
	                if (node == null) {
	                    return true;
	                }

	                // Since we cannot rewrite several properties, so wrap object.
	                var wrapped = createEventWrapper(event, this);

	                // This doesn't process capturing phase and bubbling phase.
	                // This isn't participating in a tree.
	                while (node != null) {
	                    if (typeof node.listener === "function") {
	                        node.listener.call(this, wrapped);
	                    }
	                    else if (node.kind !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
	                        node.listener.handleEvent(wrapped);
	                    }

	                    if (wrapped[STOP_IMMEDIATE_PROPAGATION_FLAG]) {
	                        break;
	                    }
	                    node = node.next;
	                }

	                return !wrapped.defaultPrevented;
	            },
	            configurable: true,
	            writable: true
	        }
	    }
	);


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @author Toru Nagashima
	 * @copyright 2015 Toru Nagashima. All rights reserved.
	 * See LICENSE file in root directory for full license.
	 */

	"use strict";

	/**
	 * Creates a unique key.
	 *
	 * @param {string} name - A name to create.
	 * @returns {symbol|string}
	 * @private
	 */
	var createUniqueKey = exports.createUniqueKey = (typeof Symbol !== "undefined" ?
	    Symbol :
	    function createUniqueKey(name) {
	        return "[[" + name + "_" + Math.random().toFixed(8).slice(2) + "]]";
	    });

	/**
	 * The key of listeners.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	exports.LISTENERS = createUniqueKey("listeners");

	/**
	 * A value of kind for listeners which are registered in the capturing phase.
	 *
	 * @type {number}
	 * @private
	 */
	exports.CAPTURE = 1;

	/**
	 * A value of kind for listeners which are registered in the bubbling phase.
	 *
	 * @type {number}
	 * @private
	 */
	exports.BUBBLE = 2;

	/**
	 * A value of kind for listeners which are registered as an attribute.
	 *
	 * @type {number}
	 * @private
	 */
	exports.ATTRIBUTE = 3;

	/**
	 * @typedef object ListenerNode
	 * @property {function} listener - A listener function.
	 * @property {number} kind - The kind of the listener.
	 * @property {ListenerNode|null} next - The next node.
	 *      If this node is the last, this is `null`.
	 */

	/**
	 * Creates a node of singly linked list for a list of listeners.
	 *
	 * @param {function} listener - A listener function.
	 * @param {number} kind - The kind of the listener.
	 * @returns {ListenerNode} The created listener node.
	 */
	exports.newNode = function newNode(listener, kind) {
	    return {listener: listener, kind: kind, next: null};
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Toru Nagashima
	 * @copyright 2015 Toru Nagashima. All rights reserved.
	 * See LICENSE file in root directory for full license.
	 */

	"use strict";

	//-----------------------------------------------------------------------------
	// Requirements
	//-----------------------------------------------------------------------------

	var Commons = __webpack_require__(2);
	var LISTENERS = Commons.LISTENERS;
	var ATTRIBUTE = Commons.ATTRIBUTE;
	var newNode = Commons.newNode;

	//-----------------------------------------------------------------------------
	// Helpers
	//-----------------------------------------------------------------------------

	/**
	 * Gets a specified attribute listener from a given EventTarget object.
	 *
	 * @param {EventTarget} eventTarget - An EventTarget object to get.
	 * @param {string} type - An event type to get.
	 * @returns {function|null} The found attribute listener.
	 */
	function getAttributeListener(eventTarget, type) {
	    var node = eventTarget[LISTENERS][type];
	    while (node != null) {
	        if (node.kind === ATTRIBUTE) {
	            return node.listener;
	        }
	        node = node.next;
	    }
	    return null;
	}

	/**
	 * Sets a specified attribute listener to a given EventTarget object.
	 *
	 * @param {EventTarget} eventTarget - An EventTarget object to set.
	 * @param {string} type - An event type to set.
	 * @param {function|null} listener - A listener to be set.
	 * @returns {void}
	 */
	function setAttributeListener(eventTarget, type, listener) {
	    if (typeof listener !== "function" && typeof listener !== "object") {
	        listener = null; // eslint-disable-line no-param-reassign
	    }

	    var prev = null;
	    var node = eventTarget[LISTENERS][type];
	    while (node != null) {
	        if (node.kind === ATTRIBUTE) {
	            // Remove old value.
	            if (prev == null) {
	                eventTarget[LISTENERS][type] = node.next;
	            }
	            else {
	                prev.next = node.next;
	            }
	        }
	        else {
	            prev = node;
	        }

	        node = node.next;
	    }

	    // Add new value.
	    if (listener != null) {
	        if (prev == null) {
	            eventTarget[LISTENERS][type] = newNode(listener, ATTRIBUTE);
	        }
	        else {
	            prev.next = newNode(listener, ATTRIBUTE);
	        }
	    }
	}

	//-----------------------------------------------------------------------------
	// Public Interface
	//-----------------------------------------------------------------------------

	/**
	 * Defines an `EventTarget` implementation which has `onfoobar` attributes.
	 *
	 * @param {EventTarget} EventTargetBase - A base implementation of EventTarget.
	 * @param {string[]} types - A list of event types which are defined as attribute listeners.
	 * @returns {EventTarget} The defined `EventTarget` implementation which has attribute listeners.
	 */
	exports.defineCustomEventTarget = function(EventTargetBase, types) {
	    function EventTarget() {
	        EventTargetBase.call(this);
	    }

	    var descripter = {
	        constructor: {
	            value: EventTarget,
	            configurable: true,
	            writable: true
	        }
	    };

	    types.forEach(function(type) {
	        descripter["on" + type] = {
	            get: function() { return getAttributeListener(this, type); },
	            set: function(listener) { setAttributeListener(this, type, listener); },
	            configurable: true,
	            enumerable: true
	        };
	    });

	    EventTarget.prototype = Object.create(EventTargetBase.prototype, descripter);

	    return EventTarget;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Toru Nagashima
	 * @copyright 2015 Toru Nagashima. All rights reserved.
	 * See LICENSE file in root directory for full license.
	 */

	"use strict";

	//-----------------------------------------------------------------------------
	// Requirements
	//-----------------------------------------------------------------------------

	var createUniqueKey = __webpack_require__(2).createUniqueKey;

	//-----------------------------------------------------------------------------
	// Constsnts
	//-----------------------------------------------------------------------------

	/**
	 * The key of the flag which is turned on by `stopImmediatePropagation` method.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	var STOP_IMMEDIATE_PROPAGATION_FLAG =
	    createUniqueKey("stop_immediate_propagation_flag");

	/**
	 * The key of the flag which is turned on by `preventDefault` method.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	var CANCELED_FLAG = createUniqueKey("canceled_flag");

	/**
	 * The key of the original event object.
	 *
	 * @type {symbol|string}
	 * @private
	 */
	var ORIGINAL_EVENT = createUniqueKey("original_event");

	/**
	 * Method definitions for the event wrapper.
	 *
	 * @type {object}
	 * @private
	 */
	var wrapperPrototypeDefinition = Object.freeze({
	    stopPropagation: Object.freeze({
	        value: function stopPropagation() {
	            var e = this[ORIGINAL_EVENT];
	            if (typeof e.stopPropagation === "function") {
	                e.stopPropagation();
	            }
	        },
	        writable: true,
	        configurable: true
	    }),

	    stopImmediatePropagation: Object.freeze({
	        value: function stopImmediatePropagation() {
	            this[STOP_IMMEDIATE_PROPAGATION_FLAG] = true;

	            var e = this[ORIGINAL_EVENT];
	            if (typeof e.stopImmediatePropagation === "function") {
	                e.stopImmediatePropagation();
	            }
	        },
	        writable: true,
	        configurable: true
	    }),

	    preventDefault: Object.freeze({
	        value: function preventDefault() {
	            if (this.cancelable === true) {
	                this[CANCELED_FLAG] = true;
	            }

	            var e = this[ORIGINAL_EVENT];
	            if (typeof e.preventDefault === "function") {
	                e.preventDefault();
	            }
	        },
	        writable: true,
	        configurable: true
	    }),

	    defaultPrevented: Object.freeze({
	        get: function defaultPrevented() { return this[CANCELED_FLAG]; },
	        enumerable: true,
	        configurable: true
	    })
	});

	//-----------------------------------------------------------------------------
	// Public Interface
	//-----------------------------------------------------------------------------

	exports.STOP_IMMEDIATE_PROPAGATION_FLAG = STOP_IMMEDIATE_PROPAGATION_FLAG;

	/**
	 * Creates an event wrapper.
	 *
	 * We cannot modify several properties of `Event` object, so we need to create the wrapper.
	 * Plus, this wrapper supports non `Event` objects.
	 *
	 * @param {Event|{type: string}} event - An original event to create the wrapper.
	 * @param {EventTarget} eventTarget - The event target of the event.
	 * @returns {Event} The created wrapper. This object is implemented `Event` interface.
	 * @private
	 */
	exports.createEventWrapper = function createEventWrapper(event, eventTarget) {
	    var timeStamp = (
	        typeof event.timeStamp === "number" ? event.timeStamp : Date.now()
	    );
	    var propertyDefinition = {
	        type: {value: event.type, enumerable: true},
	        target: {value: eventTarget, enumerable: true},
	        currentTarget: {value: eventTarget, enumerable: true},
	        eventPhase: {value: 2, enumerable: true},
	        bubbles: {value: Boolean(event.bubbles), enumerable: true},
	        cancelable: {value: Boolean(event.cancelable), enumerable: true},
	        timeStamp: {value: timeStamp, enumerable: true},
	        isTrusted: {value: false, enumerable: true}
	    };
	    propertyDefinition[STOP_IMMEDIATE_PROPAGATION_FLAG] = {value: false, writable: true};
	    propertyDefinition[CANCELED_FLAG] = {value: false, writable: true};
	    propertyDefinition[ORIGINAL_EVENT] = {value: event};

	    // For CustomEvent.
	    if (typeof event.detail !== "undefined") {
	        propertyDefinition.detail = {value: event.detail, enumerable: true};
	    }

	    return Object.create(
	        Object.create(event, wrapperPrototypeDefinition),
	        propertyDefinition
	    );
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const raf = __webpack_require__(6); // requestAnimationFrame shim

	module.exports = (Hack) => {

	  const canvas = document.createElement('canvas');
	  canvas.style.width = '100%';
	  canvas.style.height = '100%';

	  var _width = canvas.width = window.innerWidth;
	  var _height = canvas.height = window.innerHeight;

	  raf(function check () {
	    if (_width !== canvas.width || _height !== canvas.height) {
	      canvas.dispatchEvent(new Event('resize'));
	    }
	    _width = canvas.width;
	    _height = canvas.height;
	    raf(check);
	  });

	  return canvas;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(7)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function () {
	            throw new Error('setTimeout is not defined');
	        }
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function () {
	            throw new Error('clearTimeout is not defined');
	        }
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }
/******/ ]);