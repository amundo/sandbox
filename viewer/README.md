viewer
======

This app is an app to render and gloss a text in DLX JSON format.

goals for features:

*  populate from lexicon file

Tests are included. To see them, open tests/SpecRunner.html in a browser.

Some questions have come up:

**Is `GlossingView` the place to fire off `autogloss`ing of each phrase in the text?**

The reason I did this is that it seems like it should be possible to `autogloss` a phrase from any `Lexicon`. 

So I’ve put a `autogloss(lexicon)` signature on the `Phrase` object.  

**What to do about homonyms?**

This is an albatross. When a `Phrase` `autogloss`es itself, and the `Lexicon` returns an array of more than one `Word`s that contain that `token`, what should happen? For now we’ll assume that the disambiguation should only be done by the linguist. This suggests that the `Phrase` should _retain_ the whole array of undisambuated lookups for its homonymic words…

Perhaps we define a `Homonym` object which is just an array of words. Then a `Phrase` containing a homonym might look like:

    var phrase = {
      transcription: "fui al banco",
      translations: { en: "I went to the bank." },
      words: [
        { token: "fui", gloss: "I.went" },
        { token: "al", gloss: "to.the" },
        [
          { token: "banco", gloss: "bank.of.river" },
          { token: "banco", gloss: "bank.for.money"}
        ]
      ]
    }
    
…or something.
