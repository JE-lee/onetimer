'use strict';

class Node {
  constructor(id){
    this.id = id || Date.now();
    this.callbacks = []; 
    this.delta = 0;
  }
  get callback(){
    return () => {
      // synchronous execution 
      this.callbacks.forEach(callback => callback());
    }
  }
}

class List {
  constructor() {
    this._head = null;
    this._length = 0;
  }
}

var list = List;

class Node$1 {
  constructor(options = {}) {
    this._value = options.value;
    this._next = null;
  }

  get next() {
    return this._next;
  }

  set next(node) {
    this._next = node;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}

var node = Node$1;

class Circular extends list {
  get _last() {
    return this._traverse(this._head, this.length - 1);
  }

  get head() {
    return this.isEmpty() ? undefined : this._head.value;
  }

  get last() {
    return this.isEmpty() ? undefined : this._last.value;
  }

  get length() {
    return this._length;
  }

  _arrayify(value) {
    return Array.isArray(value) ? value : [value];
  }

  _isValid(index) {
    return index >= 0 && index < this.length;
  }

  _traverse(node, index) {
    return (node.next !== this._head && index > 0) ? this._traverse(node.next, index - 1) : node;
  }

  _getNode(index) {
    return this._traverse(this._head, index);
  }

  _addHead(value) {
    const {_head} = this;
    const node$1 = new node({value});
    this._head = node$1;
    this._head.next = this.length === 0 ? node$1 : _head;
    this._length++;
    this._last.next = this._head;
    return this;
  }

  _addNode(value, index = this.length) {
    const node$1 = new node({value});
    const prev = this._getNode(index - 1);
    node$1.next = prev.next;
    this._length++;
    prev.next = node$1;
    return this;
  }

  _removeHead() {
    const {_head} = this;
    this._last.next = _head.next;
    this._head = this._last.next;
    _head.next = null;
    this._length--;
    return this;
  }

  _removeNode(index) {
    const node = this._getNode(index);
    this._getNode(index - 1).next = node.next;
    node.next = null;
    this._length--;
    return this;
  }

  _swap(x, index, swaps) {
    const y = this._getNode(index - 1);
    [x.value, y.value] = [y.value, x.value];
    return swaps > 0 ? this._swap(x.next, index - 1, swaps - 1) : this;
  }

  _map(fn, node = this._head) {
    node.value = fn(node.value);
    return node.next === this._head ? this : this._map(fn, node.next);
  }

  _forEach(fn, node = this._head) {
    if (node.next !== this._head) {
      fn(node.value);
      return this._forEach(fn, node.next);
    }

    return fn(node.value);
  }

  isEmpty() {
    return !this._head && !this._length;
  }

  prepend(...values) {
    values.forEach(value => this._addHead(value));
    return this;
  }

  insert({value, index = this.length}) {
    this._arrayify(value).forEach(value => {
      return (index <= 0) ? this._addHead(value) : this._addNode(value, index);
    });
    return this;
  }

  append(...values) {
    values.forEach(value => {
      return this.isEmpty() ? this._addHead(value) : this._addNode(value);
    });
    return this;
  }

  node(index) {
    if (!this._isValid(index)) {
      return undefined;
    }

    return this._getNode(index);
  }

  set({value, index}) {
    if (!this._isValid(index)) {
      throw new Error('List index out of bounds');
    }

    const target = this._getNode(index);
    target.value = value;
    return this;
  }

  get(index) {
    if (!this._isValid(index)) {
      return undefined;
    }

    const {value} = this._getNode(index);
    return value;
  }

  remove(index = this.length - 1) {
    if (!this._isValid(index)) {
      return undefined;
    }

    if (index === 0) {
      return (this.length === 1) ? this.clear() : this._removeHead();
    }

    return this._removeNode(index);
  }

  forEach(fn) {
    if (this.length === 0) {
      return;
    }

    return this._forEach(fn);
  }

  toArray() {
    const array = [];
    this.forEach(x => array.push(x));
    return array;
  }

  map(fn) {
    const list = new Circular();

    if (this.length === 0) {
      return list;
    }

    list.append(...this.toArray());
    return list._map(fn);
  }

  join(string) {
    return this.toArray().join(string);
  }

  reverse() {
    if (this.isEmpty()) {
      return this;
    }

    const swaps = Math.floor(this.length / 2) - 1;
    return this._swap(this._head, this.length, swaps);
  }

  clear() {
    this._head = null;
    this._length = 0;
    return this;
  }
}

var circular = Circular;

class Linear extends list {
  get _last() {
    return this._traverse(this._head, this.length - 1);
  }

  get head() {
    return this.isEmpty() ? undefined : this._head.value;
  }

  get last() {
    return this.isEmpty() ? undefined : this._last.value;
  }

  get length() {
    return this._length;
  }

  _arrayify(value) {
    return Array.isArray(value) ? value : [value];
  }

  _isValid(index) {
    return index >= 0 && index < this.length;
  }

  _traverse(node, index) {
    return (node.next && index > 0) ? this._traverse(node.next, index - 1) : node;
  }

  _getNode(index) {
    return this._traverse(this._head, index);
  }

  _addHead(value) {
    const {_head} = this;
    this._head = new node({value});
    this._head.next = _head;
    this._length++;
    return this;
  }

  _addNode(value, index = this.length) {
    const node$1 = new node({value});
    const prev = this._getNode(index - 1);
    node$1.next = prev.next;
    prev.next = node$1;
    this._length++;
    return this;
  }

  _removeHead() {
    const {_head} = this;
    this._head = _head.next;
    _head.next = null;
    this._length--;
    return this;
  }

  _removeNode(index) {
    const node = this._getNode(index);
    this._getNode(index - 1).next = node.next;
    node.next = null;
    this._length--;
    return this;
  }

  _swap(x, index, swaps) {
    const y = this._getNode(index - 1);
    [x.value, y.value] = [y.value, x.value];
    return swaps > 0 ? this._swap(x.next, index - 1, swaps - 1) : this;
  }

  _map(fn, node = this._head) {
    node.value = fn(node.value);
    return node.next ? this._map(fn, node.next) : this;
  }

  _forEach(fn, node = this._head) {
    if (node.next) {
      fn(node.value);
      return this._forEach(fn, node.next);
    }

    return fn(node.value);
  }

  isEmpty() {
    return !this._head && !this._length;
  }

  prepend(...values) {
    values.forEach(value => this._addHead(value));
    return this;
  }

  insert({value, index = this.length}) {
    this._arrayify(value).forEach(value => {
      return (index <= 0) ? this._addHead(value) : this._addNode(value, index);
    });
    return this;
  }

  append(...values) {
    values.forEach(value => {
      return this.isEmpty() ? this._addHead(value) : this._addNode(value);
    });
    return this;
  }

  node(index) {
    if (!this._isValid(index)) {
      return undefined;
    }

    return this._getNode(index);
  }

  set({value, index}) {
    if (!this._isValid(index)) {
      throw new Error('List index out of bounds');
    }

    const target = this._getNode(index);
    target.value = value;
    return this;
  }

  get(index) {
    if (!this._isValid(index)) {
      return undefined;
    }

    const {value} = this._getNode(index);
    return value;
  }

  remove(index = this.length - 1) {
    if (!this._isValid(index)) {
      return undefined;
    }

    return (index === 0) ? this._removeHead() : this._removeNode(index);
  }

  forEach(fn) {
    if (this.length === 0) {
      return;
    }

    this._forEach(fn);
  }

  toArray() {
    const array = [];
    this.forEach(x => array.push(x));
    return array;
  }

  map(fn) {
    const list = new Linear();

    if (this.isEmpty()) {
      return list;
    }

    list.append(...this.toArray());
    return list._map(fn);
  }

  join(string) {
    return this.toArray().join(string);
  }

  reverse() {
    if (this.isEmpty()) {
      return this;
    }

    const swaps = Math.floor(this.length / 2) - 1;
    return this._swap(this._head, this.length, swaps);
  }

  clear() {
    this._head = null;
    this._length = 0;
    return this;
  }
}

var linear = Linear;

var singlie = Object.assign({}, {Circular: circular}, {Linear: linear}, {Node: node});
var singlie_1 = singlie.Linear;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var EventEmitter = createCommonjsModule(function (module) {
(function (exports) {

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the first argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the first argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(typeof window !== 'undefined' ? window : commonjsGlobal || {}));
});

class OneTimer{
  constructor(){
    this.line = new singlie_1();
    this.onlyTimer = null;
  }
  InWhichIndex(node){
    // half-interval search
    let id = node.id,
      high = this.line.length - 1,
      low = 0,
      ret = 0;
    while(high > low){
      let middle = Math.ceil((high - low) / 2 + low),
        middleId = this.line.get(middle).id;
  
      if(middleId > id){
        ret = high = middle - 1;
        if(this.line.get(high).id < id) break
      }else if(middleId < id){
        ret = low = middle; 
      }else {
        break
      }

    }
    if(this.line.isEmpty()) return 0
    return this.line.get(ret).id - id > 0 ? ret : (ret + 1) 
  }
  push(delay, callback){
    let _delay = Number(delay) >= 0 ? Number(delay) : 0,
      id = Date.now() + _delay,
      node = new Node(id),
      isEmpty = this.line.isEmpty();
    
    // init callbacks
    node.callbacks = callback instanceof Array ? callback : [callback];
    // find out where to insert
    let index = this.InWhichIndex(node);
    this.line.insert({ value: node, index });
    // recompucate the delta of insert node and prev node
    let insertNode = this.line.node(index),
      prevNode = this.line.node(index - 1 ),
      nextNode = insertNode.next;

    prevNode && (prevNode.value.delta = insertNode.value.id - prevNode.value.id);
    nextNode && (insertNode.value.delta = nextNode.value.id - insertNode.value.id);
    // start the timer when the linked list is empty before insertting node 
    isEmpty && this.startTimer(delay);
  }
  startTimer(delay){
    let line = this.line;
    this.onlyTimer = setTimeout(() => {
      let delta = line.head.delta; 
      // execute callback
      line.head.callback();
      // remove the linked list head
      line.remove(0);
      // stop the line-timer 
      if (line.isEmpty()) {
        this.emitEvent('done');
        return 
      } 
      // start again
      this.startTimer(delta);
    }, delay);
  }
}

// inherit EventEmitter
Object.assign(OneTimer.prototype, EventEmitter.prototype);

module.exports = OneTimer;
