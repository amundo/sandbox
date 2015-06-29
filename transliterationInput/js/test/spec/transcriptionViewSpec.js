describe('TranscriptionView', function(){
  beforeEach(function(){

    this.transliterator = new Transliterator([
      { before: 'a', after:'A'},
      { before: '\`', after:'\u0300'},
      { before: '\'', after:'\u0301'}
    ]);
  })

  afterEach(function(){

  })

  describe('Transliterator', function(){

    it('converts a to A', function(){
      expect(this.transliterator.transliterate('a')).toBe('A');
    })


    it('converts abba to AbbA', function(){
      expect(this.transliterator.transliterate('abba')).toBe('AbbA');
    })

    it('converts o` to o with combining grave', function(){
      var 
        uPlusRule = [{before: '\`', after:'\u0300'}],
        uPlusTransliterator = new Transliterator(uPlusRule);
      expect(this.transliterator.transliterate('\`')).toBe('\u0300'.normalize('NFC'));
    })

    it('converts U+0301 to acute accent', function(){
      var 
        uPlusRule = [{before: 'U+0301', after:'\u0301'}],
        uPlusTransliterator = new Transliterator(uPlusRule);

      expect(uPlusTransliterator.transliterate('U+0301')).toBe('\u0301');
    })

  })

  describe('TranscriptionView', function(){
    beforeEach(function(){
      var mock = ` <div class=transcriptionView>
<input lang=sanm1296_type>
<p lang=sanm1296>
<button id=toggleRules>rules</button>
<textarea id=ruleList>
a A
b B
c C
' U+0301
</textarea>
</div>`;
       this.section = document.createElement('section');
       this.section.id = 'testSection';
       this.section.insertAdjacentHTML('afterbegin', mock);
       document.body.appendChild(this.section);
       
       this.tv = new TranscriptionView({
          el: document.querySelector('div.transcriptionView')
       })
    })

    afterEach(function(){
      [].slice.call(document.querySelectorAll('#testSection')).map(function(section ){ section.remove() })
    })

    xit('has a processRulesText method', function(){
      expect(this.tv.processRulesText).not.toBe(null); 
    })

    it('has a tv', function(){
      expect(this.tv).not.toBe(null); 
    })

    xit('has an input', function(){
      expect(this.tv.el.nodeName).toBe('DIV'); 
    })

    xit('transliterates on input event', function(){
      var before =  'a\'';
      var input = this.tv.el.querySelector('input');
      input.value = before
      var inputEvent = new KeyboardEvent("input");
      input.dispatchEvent(inputEvent);
      expect(input.value).toBe('A\u0301'); 
    })

    xit('transliterates on input event', function(){
    })

  })

})

