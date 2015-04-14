describe("ScriptionParser", function() {
  var 

    scriptionParser = new ScriptionParser(),
    text,
    txt;

  beforeEach(function(){
    txt = `
Va̠’a va.

Alrighty then.

Va’a
good

va
just



Kixi-ra.

He (should) come.

kixi
to.come

ra
3M




Suu könúna cuarto-i.

But my room is super crowded.

su
but

kö-nuna
NEG-open

cuarto
room

i
1SG




Kua̠’á na̠ yuví ndéé xí’in-i.

I have a ton of roommates

kua’a
a.lot

na yuvi
people

ndeé
living

xi’in
with

i
me
`
  })

  describe('initializes', function(){ 
    it('exists', function(){
      expect(scriptionParser).toBeDefined();
    })
  })

  describe('parses', function(){ 

    it('has methods', function(){
      expect(scriptionParser.parseStanzas).toBeDefined();
      expect(scriptionParser.parseStanza).toBeDefined();
    })

    it('finds four stanzas in txt', function(){
      expect(scriptionParser.parseStanzas(txt).length).toBe(4)
    })

    it('finds four stanzas in txt', function(){
      expect(scriptionParser.parseStanzas(txt).length).toBe(4)
    })

    it('can convert scription into Text', function(){
      var text = new Text(scriptionParser.parseStanzas(txt));
      var phrases = scriptionParser.parseStanzas(txt).map(scriptionParser.parseStanza);
    })

    it('can parse a phrase stanza', function(){
      phrase = new Phrase(
      expect(scriptionParser.phrases.length).toBe(4)
    })

    xit('finds four phrases', function(){
      expect(scriptionParser.phrases.length).toBe(4)
    })
  })
  

});

