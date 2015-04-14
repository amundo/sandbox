// Text.js

var Text = function(data){

  this.initialize = function(data){
    this.metadata = data.metadata || {};

    this.phrases = data.phrases || [];
    this.initializePhrases();

  }.bind(this);


  this.initializePhrases = function(){
    var phraseInstances = [];
    this.phrases.forEach(function(phrase){
      phraseInstances.push(new Phrase(phrase))
    })
    this.phrases = phraseInstances;

  }.bind(this)

// how to define a property on a nested object?
/*
  Object.defineProperty(this, 'title', { 
    get : function(){
      if(this.metadata.title){ return this.metadata.title }
      else if(this.phrases && this.phrases[0].transcription){ return this.phrases[0].transcription }
      else { return '' }
    }

  })
*/

  this.initialize(data);
}
