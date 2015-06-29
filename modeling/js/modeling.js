function frequency(seuqence){
  var tally = {};
 
  sequence.reduce((tally, current) => {
    tally[current] ? tally[current] += 1 : tally[current] = 0;
    return tally;
  }, {})

  return tally;
}

// guess which transcription words align with which translation words
function guess(text, from, to){
  var 
    alignment = {},
    transcriptions = text.phrases.map(p => p.transcriptions[from]),
    translations = text.phrases.map(p => p.translations[to]);
  
  transcriptions.forEach((transcription, i) => {
    var tokens = transcription.toLowerCase().split(' '),
        translationWords = translations[i].toLowerCase().split(' ');
    
    tokens.forEach(function(token){
      translationWords.forEach(function(translationWord){
        if(!(token in alignment)) { alignment[token] = {} }
        alignment[token][translationWord] ? alignment[token][translationWord] += 1 : alignment[token][translationWord] =  1
      })
    }) 
  
  })

  
  return alignment;
}
                       

//guess(text);


