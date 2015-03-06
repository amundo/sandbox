// DOM selector that returns an array (not node list) of nodes
var $ = function(selector) {
  var nodeList = document.querySelectorAll(selector);
  var nodes = Array.prototype.slice.call(nodeList);
  return nodes;
}.bind(document);

// Event System
var EventRegistry = function() {
  this.evRegistry = [];
  
  this.evRegistry.add = function(evType, observer) {
    var registeredEvent = {
      evType: evType,
      observer: observer
    };
    
    this.evRegistry.push(registeredEvent);
  };
  
  this.notify = function(evType) {
    this.evRegistry.forEach(function(event) {
      event.observer.update(evType);
    });
  };
  
  this.evRegistry.remove = function(evType, observer) {
    var registeredEvent = this.evRegistry.filter(function(registeredEvent) {
      return registeredEvent.evType === evType && registeredEvent.observer === observer;
    });
  };
};

// Models
var Model = function(data) {
  EventRegistry.call(this);
  
  Object.keys(data).forEach(function(key) {
    this[key] = data[key];
  }, this);
  
  Object.defineProperties(this, {
    "json": {
      get: function() {
        return JSON.stringify(this);
      }
    },
    
    "update": {
      value: function(evType) {
      }
    }
  });
};

var Text = function(data) {
  Model.call(this, data);
};

var Phrase = function(data) {
  Model.call(this, data);
};

var Word = function(data) {
  Model.call(this, data);
};

// Views & Collections
var View = function(model, options) {
  EventRegistry.call(this);
  
  model.evRegistry.add(this);
  this.evRegistry.add(model);
  
  this.update = function(evType) {
  };
};

var Collection = function(model, options) {
  EventRegistry.call(this);
  
  model.evRegistry.add(this);
  this.evRegistry.add(model);
  
  this.update = function(evType) {
  };
};

// The model is a single phrase
var phraseView = function(model, options) {
  View.call(this, model, options);
};

// The model is an array of phrases
var phrasesView = function(model, options) {
  View.call(this, model, options);
};