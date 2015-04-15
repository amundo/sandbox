// Text.js

var Text = function(data){

  this.initialize = function(data){
    this.metadata = data && data.metadata ? data.metadata : {};

    this.phrases = data && data.phrases ? data.phrases : [];
    if ( this.phrases.length > 0 ) { this.initializePhrases() };
 
  }.bind(this);

  this.template = `
  <header>
    <input type=file name=text></input>
    <button id=pasteText>paste</button>
  </header>
 <textarea></textarea>
 <div></div>
`

  this.loadFromURL = function(url){
    getJSON(
      url, 
      function(data){ this.initialize(data) }.bind(this), 
      function(err){ console.log(err) }.bind(this)
    )
  }.bind(this)

  this.initializePhrases = function(){
    var phraseInstances = [];
    this.phrases.forEach(function(phrase){
      phraseInstances.push(new Phrase(phrase))
    })
    this.phrases = phraseInstances;

  }.bind(this)

  this.reset = function(data){
    this.initialize(data);
  }.bind(this)

  this.toJSON = function(){
    return { 
      metadata : this.metadata,
      phrases : this.phrases
    }
  }

  this.initialize(data);
}
