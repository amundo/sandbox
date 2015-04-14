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
console.log(this.searchableLexiconView.el.outerHTML);
      expect(this.searchableLexiconView.el.querySelector('input[type="search"]')).not.toBe(null);
    })

  })

  describe('can', function(){

    it('render', function(){
      var beforeRender = this.searchableLexiconView.el.outerHTML;
      this.searchableLexiconView.render();
      var html = this.searchableLexiconView.el.outerHTML;
      expect(html).not.toBe(beforeRender);
      expect(html.contains('carro')).toBe(true);
    })

  })

  xdescribe('searches its lexicon', function(){
    
  })

})
