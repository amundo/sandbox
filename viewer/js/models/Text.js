// Text.js

var Text = function(data){
 
  this.initialize = function(){
    this._data = data || {};
    this.phrases = this._data.phrases || [];
    this.metadata = this._data.metadata || {};
  }.bind(this);

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

  this.initialize();
}
