describe('GlossingView', function(){
  beforeEach(function(){

    var text = new Text({
      metadata: { 
        title: "What’s up in Indonesian"
      },
      phrases : [
        { transcription: "apa kabar", translations: {en: "sup"} }
      ] 
    });

    var textView = new TextView({
      text : text,
      el : document.createElement('div')
    })

    var lexicon = new Lexicon([
      {token: "apa", gloss: "what"},
      {token: "kabar", gloss: "new"}
    ]);

    this.glossingView = new GlossingView({
      textView: textView,
      lexicon: lexicon
    });
  })

  afterEach(function(){

  })

  describe('needs', function(){

    it('a lexicon', function(){
      expect(this.glossingView.lexicon).not.toBe(null);
      expect(this.glossingView.lexicon instanceof Lexicon).toBe(true);
    })

    it('a textView', function(){
      expect(this.glossingView.text).not.toBe(null);
      expect(this.glossingView.phrases).not.toBe(null);
      expect(this.glossingView.text instanceof Text).toBe(true);
    })

    it('has glossText method', function(){
      expect(this.glossingView.glossText).not.toBe(null); 
    })

    it('can gloss all phrases', function(){
      this.glossingView.glossText();
      expect(this.glossingView.text.phrases[0].words[0].token).toBe('apa'); 
      expect(this.glossingView.text.phrases[0].words[1].gloss).toBe('new'); 
    })

  })


})
