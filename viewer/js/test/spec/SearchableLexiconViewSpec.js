describe('SearchableLexiconView', function(){ 

  beforeEach(function(){
    this.el = document.createElement('div');
    this.el.id = 'lexicon';

    this.lexicon = new Lexicon([
      {token: "persona", gloss: "person"},
      {token: "carro", gloss: "car"},
      {token: "calle", gloss: "street"}
    ])

    this.searchableLexiconView = new SearchableLexiconView({
      el: this.el,
      lexicon: this.lexicon,
    })
    
    this.searchableLexiconView.render();
  })

  describe('has the nodes', function(){

    it('el (the parent)', function(){
      expect(this.searchableLexiconView.el).not.toBe(null);
    })

    it('search box', function(){
      expect(this.searchableLexiconView.el.querySelector('input[type="search"]')).not.toBe(null);
    })

  })

  describe('can', function(){

   xit('render', function(){
      var html = this.searchableLexiconView.el.outerHTML;
      expect(html.contains('carro')).toBe(true);
    })

  })

  xdescribe('searches its lexicon', function(){
    
  })

})
