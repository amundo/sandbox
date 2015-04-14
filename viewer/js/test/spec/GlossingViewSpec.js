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

    var lexicon = new Lexicon([
      {token: "apa", gloss: "what"},
      {token: "kabar", gloss: "new"}
    ]);

    this.glossingView = new GlossingView({
      text: text,
      lexicon: lexicon
    });
  })

  afterEach(function(){

  })

  describe('inits a Text and a Lexicon', function(){

    it('has a lexicon', function(){
      expect(this.glossingView.lexicon).not.toBe(null);
      expect(this.glossingView.lexicon instanceof Lexicon).toBe(true);
    })

    it('has a text', function(){
      expect(this.glossingView.text).not.toBe(null);
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
