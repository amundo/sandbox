// DOM selector that returns an array (not node list) of nodes
var $ = function(selector) {
  var nodeList = document.querySelectorAll(selector);
  var nodes = Array.prototype.slice.call(nodeList);
  return nodes;
}.bind(document);

// Event System
var ObserverList = function() {
  this.observers = [];
  
  this.observers.add = function(observer, action) {
    var sub = {
      action: action,
      observer: observer
    };
    this.observers.push(sub);
  };
  
  this.notify = function(action) {
    var subs = this.observers.filter(function(sub) {
      return sub.action === action;
    });
    
    this.subs.forEach(function(sub) {
      sub.observer.update(sub.action);
    });
  };
  
  this.observers.remove = function(observer, action) {
    // Function to remove the observer
  };
};

// Models
var Model = function(data) {
  ObserverList.call(this);
  
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
      value: function(action, data) {
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
  ObserverList.call(this);
  
  this.model = model;
  
  this.update = function(action, data) {
  };
};

var Collection = function(model, options) {
  ObserverList.call(this);
  
  this.model = model;
  
  this.update = function(action, data) {
  };
};

// The model is a single phrase
var phraseView = function(model, options) {
  View.call(this, model, options);
};

// The model is an array of phrases
var phrasesView = function(model, options) {
  View.call(this, model, options);
  
  this.addEventListener('click', function(ev) {
    // Get ev, look at target, collect data from DOM, pass data to observers
    this.notify(action, data);
  });
};