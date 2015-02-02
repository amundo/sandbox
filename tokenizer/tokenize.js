var splitOnWhitespace = function(text){
  text = text.trim();
  var tokens = text.split(/[\n\t ]+/g);
  return tokens
    .filter(function(token){ return token.length })
}

var depunctuate = function(text, punctuation){
  var 
    punctuation = punctuation || '-\.\?\!‘’\'“”\"', 
    puncRE = new RegExp('[' + punctuation + ']' , 'g');

  return text
    .replace(puncRE, '')
}

var applySteps = function(text, steps){
  steps.forEach(function(fn){
    text = fn(text); 
  })
  return text;
}

function tokenize(text, steps){
  var defaultSteps = [
    String.toLowerCase, 
    depunctuate, 
    splitOnWhitespace
  ];

  steps = steps || defaultSteps;
  return applySteps(text, steps);
}

