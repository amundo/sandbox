describe('TextView', function(){ 

  beforeEach(function(){
    this.el = document.createElement('div');
    this.el.id = 'text';

    this.text = new Text(
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

    this.textView = new TextView({
      el: this.el,
      text: this.text,
    })
  })

  describe('can render text to its node', function(){

  })

})
