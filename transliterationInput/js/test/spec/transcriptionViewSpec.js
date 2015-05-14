describe('TranscriptionView', function(){
  beforeEach(function(){

    this.transliterator = new Transliterator([
      { before: 'a', after:'A'},
      { before: '\'', after:'\u0301'},
    ]);
  })

  afterEach(function(){

  })

  describe('Transliteration', function(){

    it('converts a to A', function(){
      expect(this.transliterator.transliterate('a')).toBe('A');
    })

    it('converts abba to AbbA', function(){
      expect(this.transliterator.transliterate('abba')).toBe('AbbA');
    })

    it('converts o\' to ó', function(){
      expect(this.transliterator.transliterate('o\'')).toBe('o\u0301');
    })


  })

  describe('Transliteration', function(){
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
    

    it('has an input', function(){
      expect(this.tv.el.nodeName).toBe('DIV'); 
    })

    it('transliterates on input event', function(){
      var before =  'a\'';
      var input = this.tv.el.querySelector('input');
      input.value = before
      var inputEvent = new KeyboardEvent("input");
      input.dispatchEvent(inputEvent);
      expect(input.value).toBe('A\u0301'); 
    })
  })

})
