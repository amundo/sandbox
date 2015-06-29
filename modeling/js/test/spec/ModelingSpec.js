describe('Modeling', function(){
  beforeEach(function(){

    var lexicon = [];
  
    var text = {
      metadata: { 
        title: "Sample Parallel Text"
      },
      phrases : [
        {
          translations:   { en: "what is your name" },
          transcriptions: { id: "siapa nama anda" }
        },
        { 
          translations:   { en: "my name is" },
          transcriptions: { id: "nama saya " }
        },
        {
          translations:   { en: "where are you from" },
          transcriptions: { id: "anda berasal dari mana" }
        },
        { 
          translations:   { en: "what is new"}, 
          transcriptions: { id: "apa kabar" } 
        },
        {
          transcriptions: { id: "good morning" },
          translations:   { en: "selamat pagi" }
        },
        {
          transcriptions: { id: "good afternoon" },
          translations:   { en: "selamat siang" }
        },
        {
          transcriptions: { id: "good evening" },
          translations:   { en: "selamat sore" }
        },
        {
          transcriptions: { id: "good night" },
          translations:   { en: "selamat malam" }
        }
      ] 
    };

    this.alignment = guess(text, 'id', 'en');

  })

  describe('Text Alignment', function(){

    it('exists ', function(){
      expect(this.alignment).not.toBe(null)
    })

    it('model of ‘good’ ', function(){
      expect(this.alignment['good']).toEqual({ "selamat": 4, "pagi": 1, "siang" : 1, "sore" :1, "malam": 1})
    })

    it('best for ‘good’ is ‘selamat’', function(){
      expect(this.alignment['good']).toEqual({ "selamat": 4, "pagi": 1, "siang" : 1, "sore" :1, "malam": 1})
    })


  })


})
