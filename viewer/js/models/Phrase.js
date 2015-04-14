// Phrase
//
// see  PhraseSpec.js for tests.
var Phrase = function(data){
  this.transcription = data.transcription || null;
  this.translations = data.translations || null;
  this.words = data.words || [];
 
  Object.defineProperty(this, 'tokens', {
    get : function(){
      return this.tokenize(this.transcription);
    }
  })

  this.toJSON = function(){
    return { 
      words: this.words,
      transcription: this.transcription,
      translations: this.translations
    }
  }

  this.autogloss = function(lexicon){
    this.tokens.forEach(function(token){
      var matches = lexicon.search(token);
      this.words.push(matches[0])
    }.bind(this))
  }.bind(this);

  this.tokenize = function(){
    return this.transcription.split(' ');  
  }.bind(this)
}
