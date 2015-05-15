modeling transcription/translation alignment
============================================

Suppose you have a dlxJSON text containing parallel text  but no glosses, and
no lexicon.

You would like to bootstrap the process of glossing the texts, and you know that
certain words are translated only one way. Is there some path to help automatically
gloss those words? Of course everything will be checked by hand down the road, but 
this could really save some time.

Well, how about:

    // guess which transcription words align with which translation words
    function guess(text){
      var 
        alignment = {},
        transcriptions = text.phrases.map(p => p.transcriptions.mixtec),
        translations = text.phrases.map(p => p.transcriptions.en);
      
      transcriptions.forEach((transcription, i) => {
        var tokens = transcription.split(' '),
            translationWords = translations[i].split(' ');
        
        tokens.forEach(token => {
          'token' in alignment ? alignment[token] = alignment.token.concat(translationWords) : alignment.token = translationWords;
        })  
      
      })
      return alignment;
    }
                           
    
    guess(text);


