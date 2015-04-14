describe("Phrase", function() {
  var 
    phraseData,
    phrase,

    unglossedPhrase,
    transcriptionAndTranslation,

    glossedPhrase,
    words,
    lexicon;

  describe('can be initialized', function(){ 

    beforeEach(function(){
      transcriptionAndTranslation = { transcription: "apa kabar", translations: { en: "How are you?" } }
    })

    it('as an unglossed phrase', function(){
      unglossedPhrase = new Phrase(transcriptionAndTranslation);
      expect(unglossedPhrase).not.toBe(null);
    })

    it('has a tokenize method', function(){
      unglossedPhrase = new Phrase(transcriptionAndTranslation);
      expect(unglossedPhrase.tokenize).toBeDefined();
    })

    it('has a transcription', function(){
      expect(unglossedPhrase.transcription).toBeDefined();
    })
  })

  describe('sample has two words', function(){ 

    beforeEach(function(){
      transcriptionAndTranslation = { transcription: "apa kabar", translations: { en: "How are you?" } };
      unglossedPhrase = new Phrase(transcriptionAndTranslation);
    })

    it('has two tokens', function(){ 
      var tokenCount = unglossedPhrase.tokens.length;
      expect(tokenCount).toEqual(2);
    })

    it('has tokens "apa" and "kabar"', function(){ 
      expect(unglossedPhrase.tokens[0]).toBe("apa");
      expect(unglossedPhrase.tokens[1]).toBe("kabar");
    })
  })

  describe('can autogloss', function(){ 

    beforeEach(function(){
      phraseData = { transcription: "apa kabar", translations: { en: "How are you?" } };
      lexicon = new Lexicon([{token: "apa", gloss: "what"},{token: "kabar", gloss: "new"}]);
      phrase = new Phrase(phraseData);
    })

    it('has two tokens', function(){ 
      var tokenCount = phrase.tokens.length;
      expect(tokenCount).toEqual(2);
    })

    it('has tokens "apa" and "kabar"', function(){ 
      expect(phrase.tokens[0]).toBe("apa");
      expect(phrase.tokens[1]).toBe("kabar");
    })

    it('can autogloss', function(){ 
      var unglossed = new Phrase({transcription: "apa kabar", translations: {en: "sup"}});
      unglossed.autogloss(lexicon);
      var glossed = {
        words: [{token: "apa", gloss: "what"}, {token: "kabar", gloss: "new" }], 
        transcription: "apa kabar", 
        translations: {en: "sup"}
      };
      /* this forces the Phrase's toJSON method to be called  for the sake of .toEqual */
      expect(JSON.parse(JSON.stringify(unglossed))).toEqual(glossed);
    })

    it('has glosses "up" and "new"', function(){ 
      var phrase = new Phrase({transcription: "apa kabar", translations: {en: "sup"}});
      phrase.autogloss(lexicon);
      expect(phrase.words[0].gloss).toBe("what");
      expect(phrase.words[1].gloss).toBe("new");
    })

  })
  

});

