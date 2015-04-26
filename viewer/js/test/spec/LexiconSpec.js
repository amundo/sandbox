describe("Lexicon", function() {
  var 
    lexicon,
    lexiconToRemoveFrom,
    word,
    words;

  beforeEach(function(){
    words = [
      {token: "persona", gloss: "person"},
      {token: "carro", gloss: "car"},
      {token: "calle", gloss: "street"}
    ];
    word = {token: "casa", gloss: "house"};
  })

  describe('can be initialized', function(){ 
    it('is an instance of Lexicon', function(){
      lexicon = new Lexicon(words);
      expect(lexicon instanceof Lexicon).toBe(true);
    })

    it('with no arguments' , function(){
      lexicon = new Lexicon();
    })

    it('with an array of one word' , function(){
      lexicon = new Lexicon([word]);
    })

    it('with an array of three words' , function(){
      lexicon = new Lexicon(words);
    })

    it('doesn’t add duplicates' , function(){
      lexicon = new Lexicon(words);
      lexicon.add(words[0]);
      expect(lexicon.length).toBe(3);
    })

    it('loadFromURL exists', function(){
      lexicon = new Lexicon(words);
      expect(lexicon.loadFromURL).not.toBe(null);
    })

    it('can reset' , function(){
      lexicon = new Lexicon(words);
      lexicon.reset([
        {token: "Persona", gloss: "Person"},
        {token: "Carro",   gloss: "Car"},
        {token: "Calle",   gloss: "Street"}
      ])
      expect(lexicon.length).toBe(3);
      expect(lexicon.contains('Persona')).toBe(true);
      expect(lexicon.contains('persona')).toBe(false);
   })
  })

  describe('can validate words', function(){
    beforeEach(function() {
      lexicon = new Lexicon();
    });

    it('won’t add a word without a token and gloss', function(){
      var tokenOnly = {token: "silla"};
      var glossOnly = {gloss: "chair"};

      lexicon.add(tokenOnly) 
      lexicon.add(glossOnly) 

      expect(lexicon.contains(tokenOnly)).toEqual(false);
      expect(lexicon.contains(glossOnly)).toEqual(false)
    })
    
  })

  describe('adding', function(){

    beforeEach(function() {
      lexicon = new Lexicon(words);
    });

    it('to have a length', function(){
      expect(lexicon.length).not.toBeNull();
    })

    it('to have a length which is a number', function(){
      expect(typeof lexicon.length).toEqual('number');
    })

    it('for a total of three words', function(){
      expect(lexicon.length).toEqual(3);
    })

    it('for a total of four words', function(){
      lexicon.add(word);
      expect(lexicon.length).toEqual(4);
    })

    it('doesn’t add words without glosses', function(){
      lexicon.add({token: "unglossed token, bad"});
    })

    it('doesn’t add duplicates' , function(){
      lexicon = new Lexicon(words);
      lexicon.add(words[0]);
      expect(lexicon.length).toBe(3);
    })


  })


  describe('removal', function(){

    beforeEach(function() {
      lexiconToRemoveFrom = new Lexicon(words);
    });

    it('to remove words', function(){
      lexiconToRemoveFrom.remove({token: "carro"});
      expect(lexiconToRemoveFrom.length).toBe(2);
    })
  })


  describe('searching', function(){
    beforeEach(function() {
      lexicon = new Lexicon(words);
    });

    it('returns an array of results', function(){
      var result = lexicon.search();
      expect(Array.isArray(result)).toBe(true);
    })

    it('can find by token query', function(){
      expect(lexicon.search("carro")).toEqual({results: [{token: "carro", gloss: "car"}, {homonym: false}]});
    })

    it('can find by word query', function(){
      var queryWord = { token: "carro", gloss: "car"};
      expect(lexicon.search(queryWord)).toEqual({ "results": [{token: "carro", gloss: "car"}], {homonym: false}});
    })

    it('marks unknown words as unknown', function(){
      var queryWord = { token: "UNKNOWN###"};
      expect(lexicon.search(queryWord)).toEqual([{token: "carro", gloss: null, unknown: true]);
    })
  })

  describe('checking containment in the lexicon', function(){
    it('can report containment', function(){
      var queryWord = { token: "carro", gloss: "car"};
      expect(lexicon.contains(queryWord)).toEqual(true);
    })

  })

  describe('senses', function(){
    beforeEach(function() {
      lexicon = new Lexicon([
        {token: "nda’a", gloss: "hand"},
        {token: "nda’a", gloss: "OBJ"}
      ]);
    });

    it('can return a list of senses for a token', function(){
      expect(lexicon.senses('nda’a').toEqual([ 'hand', 'OBJ'])
    })
  })

  xdescribe('fuzzy searching', function(){
    beforeEach(function() {
      lexicon = new Lexicon([{token: "péra", gloss: "pear"}]);
    });

    it('can ignore diacritics', function(){
      var result = lexicon.search({token: "pera"}, {sensitivity: "base"});
      expect(result).toEqual([{token: "péra", gloss: "pear"}]);
    })
  })
   

});
