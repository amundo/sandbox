function augment(destination, source) {
  Object.keys(source).forEach(function(key){
    destination[key] = source[key];
  })

  return destination; 
}

// DOM selector that returns an array (not node list) of nodes
var $ = function(selector) {
  var 
    nodeList = document.querySelectorAll(selector),
    nodes = Array.prototype.slice.call(nodeList);

  if(nodes.length == 1){
    return nodes[0]
  } else { 
    return nodes;
  }
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
  
  augment(this, data);
  
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

  this.phrases = this.phrases.map(function(phraseData){
    return new Phrase(phraseData)
  }) 

};

var Phrase = function(data) {
  Model.call(this, data);

  this.words = this.words.map(function(wordData){
    return new Word(wordData)
  }) 
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
