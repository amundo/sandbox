// DOM selector that returns an array (not node list) of nodes
var $ = function(selector) {
  var nodeList = document.querySelectorAll(selector);
  var nodes = Array.prototype.slice.call(nodeList);
  return nodes;
}.bind(document);

// Event System
var ObserverList = function() {
  this.observers = [];
  
  this.observers.add = function(observer) {
    this.observers.push(observer);
  };
  
  this.notify = function(ev) {
    this.observers.forEach(function(observer) {
      observer.update(ev);
    });
  };
  
  this.observers.remove = function(observer) {
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
      value: function(ev) {
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
  
  model.observers.add(this);
  this.observers.add(model);
  
  this.update = function(ev) {
  };
};

var Collection = function(model, options) {
  observers.call(this);
  
  model.observers.add(this);
  this.observers.add(model);
  
  this.update = function(ev) {
  };
};

// The model is a single phrase
var phraseView = function(model, options) {
  View.call(this, model, options);
};

// The model is an array of phrases
var phrasesView = function(model, options) {
  View.call(this, model, options);
  
  this.addEventListener('click', this.notify);
};