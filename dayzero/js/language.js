// Language
// --------  
// 
// Represents metadata about a language. Attach to a `Text` object.
//
// <mark>Add validation</mark>
var Language = Backbone.Model.extend({
  defaults: function(){
    return { 
      name : '',
      code : '',
      alphabet : [],
      punctuationPATTERN : "[\-,\?\.\!\…]",
      letterNames : []
    }
  },

  initialize:  function(options){
    _.bindAll(this, 'phonemize', 'depunctuate', 'tokenize')
  },

  // ### phonemize()
  // Split a string into phonemes. 
  // 
  // Assuming the `alphabet` includes both `ng` and `n`, compare:
  //
  //     phonemize('ngalan') → ['ng', 'a', 'l', 'a', 'n']
  //     phonemize('namon') → ['n','a','m','o','n']
  //
  // We want to match «ng» before «n», so sort by length.
  phonemize: function(text){
    var alphabet = this.get('alphabet')
    var letters = alphabet.sort(function(a,b){ return b.length-a.length});
    var phonemeRE = new RegExp('(' + letters.join('|') + ')' );
    return text.match(phonemeRE);
  },

  // ### depunctuate()
  //
  // Delete punctuation characters. 
  depunctuate:  function(text){
    var punctuationRE = new RegExp(this.get('punctuationPATTERN'), 'g');
    return text.split(punctuationRE).join(' ');
  },

  // ### tokenize()
  // `depunctuate()` and then `tokenize()`
  // 
  // _Language-specific._
  tokenize:  function(text){
    return this.depunctuate(text).toLowerCase().trim().split(/[ ]+/);
  }


})

var Languages = {
  'hil' : new Language({ 
     name: 'Hiligaynon',
     code: 'hil',
     punctuationPATTERN : '[\,\?\.\!\…]',
     alphabet: 'a b k d e g h i l m n ng o p r s t u w y'.split(' '),
     letterNames : "a ba ka da e ga ha i la ma na nga o pa ra sa ta u wa ya".split(' ')
  })
};




