xdescribe("Text", function() {
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

    it('has an initialize method', function(){
      expect(typeof text.initialize).toBe('function');
    })

    it('has a phrases array', function(){
      expect(Array.isArray(text.phrases)).toBe(true);
    })

    it('has a metadata object', function(){
      expect(typeof text.metadata).toBe('object');
    })

    it('has a title', function(){
      expect(typeof text.metadata.titles.en).toBe('string');
    })

  })

  describe('A Text can be initialized', function(){ 
    xit('by providing a text object at initialization', function(){
    })

    xit('by calling `reset(data)`', function(){
    })

  })

  xdescribe('Metadata', function(){
  })

});

