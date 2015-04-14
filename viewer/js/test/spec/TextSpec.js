describe("Text", function() {
  var 
    text;

  describe('A Text', function(){ 
    beforeEach(function(){
      text = new Text(
        {
          metadata: {
            titles: {
              en: "A story in Indonesian",
            },
            language: {
              codes: { "iso-639-2": "id", "iso-639-3": "ind", "glottolog": "indo1316" }, 
              names: { en: "Indonesian", id: "Bahasa Indonesia" }
            }
          },
          phrases: [ { transcription: "apa kabar", translations: { en: "How are you?" } } ]
        }
      );
    })

    it('is an instance of Text', function(){
      expect(text instanceof Text).toBe(true);
    })

    it('can be initialized empty', function(){
      expect(new Text() instanceof Text).toBe(true);
    })

    it('has an initialize method', function(){
      expect(typeof text.initialize).toBe('function');
    })

    it('.phrases is an array', function(){
      expect(Array.isArray(text.phrases)).toBe(true);
    })

    it('.phrases is an array of Phrase instances', function(){
      var 
        isPhraseInstance = function(p){ return p instanceof Phrase };
      
      expect(text.phrases.every(isPhraseInstance)).toBe(true);
    })

    it('has a metadata object', function(){
      expect(typeof text.metadata).toBe('object');
    })

    it('has a title', function(){
      expect(typeof text.metadata.titles.en).toBe('string');
    })

  })


  xdescribe('Metadata', function(){
  })

});

