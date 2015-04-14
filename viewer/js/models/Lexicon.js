// Lexicon
//
// see  LexiconSpec.js for tests.
var Lexicon = function(words){
  this._words = words || [];

  this.add = function(word){
    if( !('gloss' in word && 'token' in word) ){ return };

    if( !(this.contains(word)) ) { 
      this._words.push(word)
    }

  }.bind(this)

  this.remove = function(word){
    var matches = this.search(word);
    matches.forEach(function(word, i){
      this._words.splice(i,1);
    }.bind(this))
  }.bind(this)

  Object.defineProperty(this, 'length', {
    enumerable: false,
    get : function(){
      return this._words.length;
    } 
  }) 

  this.search = function(query, options){
    var query = query || {};
    if(typeof query === 'string'){
      query = { token: query };
    }
    var keys = Object.keys(query)
 
    return this._words.filter(function(word){
      return keys.every(function(key){
        var 
          queryValue = query[key],
          wordValue = word[key];
        return wordValue == queryValue;
      })
    })
  }

  this.contains = function(query){
    return this.search(query).length > 0;
  }.bind(this);


 
}
