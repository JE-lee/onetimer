(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.OneTimer = factory());
}(this, function () { 'use strict';

  var node = class {
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
  };

  class List {
    constructor() {
      this._head = null;
      this._last = null;
      this._length = 0;
    }

    get head() {
      return this._head;
    }

    get last() {
      return this._last;
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

    clear() {
      this._head = null;
      this._last = null;
      this._length = 0;
      return this;
    }

    get(index) {
      const {value} = this.node(index);
      return value;
    }

    isCircular() {
      return this.constructor.name === 'Circular';
    }

    isEmpty() {
      return !this._head && this._length === 0;
    }

    isLinear() {
      return this.constructor.name === 'Linear';
    }

    node(index) {
      if (!this._isValid(index)) {
        throw new RangeError('List index out of bounds');
      }

      let count = 0;
      let {_head: node} = this;

      while (index !== count) {
        node = node.next;
        count++;
      }

      return node;
    }

    set({value, index}) {
      const node = this.node(index);
      node.value = value;
      return this;
    }
  }

  var list = List;

  class Node {
    constructor(value) {
      this._next = null;
      this._value = value;
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

  var node$1 = Node;

  class Linear extends list {
    _addHead(value) {
      const {_head} = this;
      const node = new node$1(value);
      node.next = _head;
      this._head = node;
      this._length++;
    }

    _addLast(value) {
      const node = new node$1(value);
      this._last.next = node;
      this._last = node;
      this._length++;
    }

    _addNode(value, index) {
      const node = new node$1(value);
      const prev = this.node(index - 1);
      node.next = prev.next;
      prev.next = node;
      this._length++;
    }

    _initializeList(value) {
      const node = new node$1(value);
      this._head = node;
      this._last = node;
      this._length++;
    }

    _removeHead() {
      const {next} = this._head;

      if (!next) {
        return this.clear();
      }

      this._head = next;
      this._length--;
      return this;
    }

    _removeLast() {
      const prev = this.node(this.length - 2);
      prev.next = null;
      this._last = prev;
      this._length--;
      return this;
    }

    _removeNode(index) {
      const prev = this.node(index - 1);
      const {next: node} = prev;
      prev.next = node.next;
      this._length--;
      return this;
    }

    append(...values) {
      values.forEach(value => {
        if (this.isEmpty()) {
          return this._initializeList(value);
        }

        return this._addLast(value);
      });
      return this;
    }

    filter(fn) {
      const list = new Linear();

      this.forEach(x => {
        if (fn(x)) {
          list.append(x);
        }
      });

      return list;
    }

    forEach(fn) {
      let {_head: node} = this;

      while (node) {
        fn(node.value);
        node = node.next;
      }

      return this;
    }

    includes(value) {
      let {_head: node} = this;

      while (node) {
        if (node.value === value) {
          return true;
        }

        node = node.next;
      }

      return false;
    }

    indexOf(value) {
      let counter = 0;
      let {_head: node} = this;

      while (node) {
        if (node.value === value) {
          return counter;
        }

        counter++;
        node = node.next;
      }

      return -1;
    }

    insert({value, index}) {
      this._arrayify(value).forEach(x => {
        if (index === 0) {
          return this.prepend(x);
        }

        if (index === this.length) {
          return this.append(x);
        }

        return this._addNode(x, index);
      });
      return this;
    }

    join(separator = ',') {
      let result = '';
      let {_head: node} = this;

      while (node) {
        result += node.value;

        if (node.next) {
          result += separator;
        }

        node = node.next;
      }

      return result;
    }

    map(fn) {
      const list = new Linear();
      this.forEach(x => list.append(fn(x)));
      return list;
    }

    prepend(...values) {
      values.forEach(value => {
        if (this.isEmpty()) {
          return this._initializeList(value);
        }

        return this._addHead(value);
      });
      return this;
    }

    reduce(fn, acc) {
      let result = acc;

      this.forEach(x => {
        result = fn(result, x);
      });

      return result;
    }

    remove(index) {
      if (!this._isValid(index)) {
        throw new RangeError('List index out of bounds');
      }

      if (index === 0) {
        return this._removeHead();
      }

      if (index === this.length - 1) {
        return this._removeLast();
      }

      return this._removeNode(index);
    }

    reverse() {
      const list = new Linear();
      this.forEach(x => list.prepend(x));
      return list;
    }

    toArray() {
      const array = [];
      this.forEach(x => array.push(x));
      return array;
    }

    toCircular() {
      const Circular = circular;
      const list = new Circular();
      this.forEach(x => list.append(x));
      return list;
    }

    toString() {
      return this.join(',');
    }
  }

  var linear = Linear;

  class Circular extends list {
    _addHead(value) {
      const {_head} = this;
      const node = new node$1(value);
      node.next = _head;
      this._last.next = node;
      this._head = node;
      this._length++;
    }

    _addLast(value) {
      const {_head} = this;
      const node = new node$1(value);
      node.next = _head;
      this._last.next = node;
      this._last = node;
      this._length++;
    }

    _addNode(value, index) {
      const node = new node$1(value);
      const prev = this.node(index - 1);
      node.next = prev.next;
      prev.next = node;
      this._length++;
    }

    _initializeList(value) {
      const node = new node$1(value);
      node.next = node;
      this._head = node;
      this._last = node;
      this._length++;
    }

    _removeHead() {
      const {next: node} = this._head;

      if (node === this._head) {
        return this.clear();
      }

      this._last.next = node;
      this._head = node;
      this._length--;
      return this;
    }

    _removeLast() {
      const prev = this.node(this.length - 2);
      prev.next = this._head;
      this._last = prev;
      this._length--;
      return this;
    }

    _removeNode(index) {
      const prev = this.node(index - 1);
      const {next: node} = prev;
      prev.next = node.next;
      this._length--;
      return this;
    }

    append(...values) {
      values.forEach(value => {
        if (this.isEmpty()) {
          return this._initializeList(value);
        }

        return this._addLast(value);
      });
      return this;
    }

    filter(fn) {
      const list = new Circular();

      this.forEach(x => {
        if (fn(x)) {
          list.append(x);
        }
      });

      return list;
    }

    forEach(fn) {
      let {_head: node} = this;

      if (node) {
        do {
          fn(node.value);
          node = node.next;
        } while (node !== this._head);
      }

      return this;
    }

    includes(value) {
      let {_head: node} = this;

      if (node) {
        do {
          if (node.value === value) {
            return true;
          }

          node = node.next;
        } while (node !== this._head);
      }

      return false;
    }

    indexOf(value) {
      let counter = 0;
      let {_head: node} = this;

      if (node) {
        do {
          if (node.value === value) {
            return counter;
          }

          counter++;
          node = node.next;
        } while (node !== this._head);
      }

      return -1;
    }

    insert({value, index}) {
      this._arrayify(value).forEach(x => {
        if (index === 0) {
          return this.prepend(x);
        }

        if (index === this.length) {
          return this.append(x);
        }

        return this._addNode(x, index);
      });
      return this;
    }

    join(separator = ',') {
      let result = '';
      let {_head: node} = this;

      if (node) {
        do {
          result += node.value;

          if (node.next !== this._head) {
            result += separator;
          }

          node = node.next;
        } while (node !== this._head);
      }

      return result;
    }

    map(fn) {
      const list = new Circular();
      this.forEach(x => list.append(fn(x)));
      return list;
    }

    prepend(...values) {
      values.forEach(value => {
        if (this.isEmpty()) {
          return this._initializeList(value);
        }

        return this._addHead(value);
      });
      return this;
    }

    reduce(fn, acc) {
      let result = acc;

      this.forEach(x => {
        result = fn(result, x);
      });

      return result;
    }

    remove(index) {
      if (!this._isValid(index)) {
        throw new RangeError('List index out of bounds');
      }

      if (index === 0) {
        return this._removeHead();
      }

      if (index === this.length - 1) {
        return this._removeLast();
      }

      return this._removeNode(index);
    }

    reverse() {
      const list = new Circular();
      this.forEach(x => list.prepend(x));
      return list;
    }

    toArray() {
      const array = [];
      this.forEach(x => array.push(x));
      return array;
    }

    toLinear() {
      const Linear = linear;
      const list = new Linear();
      this.forEach(x => list.append(x));
      return list;
    }

    toString() {
      return this.join(',');
    }
  }

  var circular = Circular;

  var singlie = Object.assign({}, {Circular: circular}, {Linear: linear}, {Node: node$1});

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

  //import Node from './node'
  //import { Linear } from 'singlie'
  //import EventEmitter from 'wolfy87-eventemitter'

  class OneTimer{
    constructor(){
      this.line = new singlie.Linear();
      this.onlyTimer = null;
    }
    shouldInWhichIndex(node){
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
          ret = middle; 
          break
        }

      }
      if(this.line.isEmpty()) return 0
      return this.line.get(ret).id - id > 0 ? ret : (ret + 1) 
    }
    push(delay, callback){
      let _delay = Number(delay) >= 0 ? Number(delay) : 0,
        id = Date.now() + _delay,
        node$1 = new node(id),
        isEmpty = this.line.isEmpty();
      
      // init callbacks
      node$1.callbacks = callback instanceof Array ? callback : [callback];
      // find out where to insert
      let index = this.shouldInWhichIndex(node$1);
      this.line.insert({ value: node$1, index });
      // recompucate the delta of insert node and prev node
      let insertNode = this.line.node(index),
        prevNode = index > 0 && this.line.node(index - 1),
        nextNode = insertNode.next;

      prevNode && (prevNode.value.delta = insertNode.value.id - prevNode.value.id);
      nextNode && (insertNode.value.delta = nextNode.value.id - insertNode.value.id);
      // start the timer when the linked list is empty before insertting node 
      isEmpty && this.startTimer(delay);
      // start timer 
      if (!isEmpty && index == 0){
        clearTimeout(this.onlyTimer);
        this.startTimer(insertNode.value.id - Date.now());
      }
      return node$1
    }
    setTimeout(callback, delay){
      return this.push(delay, callback)
    }
    remove(node$1){
      if(!(node$1 instanceof node)) return 
      let index = this.line.indexOf(node$1);
      if(index >= 0){
        let prevNode = index > 0 && this.line.node(index - 1),
          nextNode = index < this.line.length - 1 && this.line.node(index + 1);
        this.line.remove(index);

        // recompucate the delta prev node
        prevNode && nextNode && (prevNode.value.delta = nextNode.value.id - prevNode.value.id);

        // if need to startTimer
        if(index == 0){
          clearTimeout(this.onlyTimer);
          !this.line.isEmpty() && this.startTimer(node$1.id - Date.now() + node$1.delta);
          this.$$removedHead = this.$$callbacking;
        }
      }
    }
    clearTimeout(node){
      return this.remove(node)
    }
    startTimer(delay){
      let line = this.line;
      this.onlyTimer = setTimeout(() => {
        let delta = line.head.value.delta; 
        // execute callback
        this.$$callbacking = true; 
        line.head.value.callback();
        this.$$callbacking = false;
        // remove the linked list head
        // if not remove the line.head in the callback
        !this.$$removedHead && line.remove(0);
        // stop the line-timer 
        if (line.isEmpty()) {
          this.emitEvent('done');
          return 
        } 
        // start again
        // if not remove the line.head in the callback
        !this.$$removedHead && this.startTimer(delta);
      }, delay);
      this.emitEvent('timeout', [delay]);
    }
    get linkedline(){
      return this.line.toArray()
    }
    pause(){
      clearTimeout(this.onlyTimer);
      this.status = 'pausing';
    }
    restart(){
      if(!this.line.isEmpty() && this.status == 'pausing'){
        this.startTimer(this.line.head.value.id - Date.now());
        this.status = 'processing';
      }
    }

  }

  // inherit EventEmitter
  Object.assign(OneTimer.prototype, EventEmitter.prototype);

  var OneTimer_1 =  OneTimer;

  return OneTimer_1;

}));
