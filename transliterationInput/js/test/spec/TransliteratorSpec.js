describe('Transliteration ', function(){
  beforeEach(function(){

    this.transliterator = new Transliterator([
      { before: '{macron}', after:'\u0304'},
      { before: 'a', after:'A'},
      { before: '\`', after:'\u0300'},
      { before: '\'', after:'\u0301'}
    ]);
  })

  afterEach(function(){

  })

  describe('A Transliterator can ', function(){

    it('convert a to A', function(){
      expect(this.transliterator.transliterate('a')).toBe('A');
    })

    it('convert e to ē', function(){
      expect(this.transliterator.transliterate('e{macron}').normalize("NFD")).toBe('ē'.normalize("NFD"));
      expect(this.transliterator.transliterate('e{macron}')).toBe('ē');
    })

    it('convert abba to AbbA', function(){
      expect(this.transliterator.transliterate('abba')).toBe('AbbA');
    })

    it('convert o` to o with combining grave', function(){
      var 
        uPlusRule = [{before: '\`', after:'\u0300'}],
        uPlusTransliterator = new Transliterator(uPlusRule);
      expect(this.transliterator.transliterate('\`')).toBe('\u0300'.normalize('NFC'));
    })

    it('convert U+0301 to acute accent', function(){
      var 
        uPlusRule = [{before: 'U+0301', after:'\u0301'}],
        uPlusTransliterator = new Transliterator(uPlusRule);

      expect(uPlusTransliterator.transliterate('U+0301')).toBe('\u0301');
    })

  })

  describe('A Transliteration Rule parser can ', function(){

    it('parse rule text', function(){
      var ruleText = "o O\n@ \u0259"; 
      var ruleTextParser = new RuleTextParser();

      expect(ruleTextParser.parse(ruleText)).toEqual([
         {before: 'o', after: 'O'},
         {before: '@', after: '\u0259'}
      ]);
    })
  })

})

