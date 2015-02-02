
function transliterate(text, rules) {
  rules.forEach(function (rule) {
    var 
      before = rule[0],
      after = rule[1];
    
    text = text.replace(before, after, 'g');
  })
  return text;
}

function transliterateMixtec(text) {
  var rules = [
    ['=',
    '̱'] // a= -> a̱
  ];
  return transliterate(text, rules)
}
var mixtecInput = document.body.querySelector('form input.transcription')

mixtecInput.addEventListener('keyup', function () {
  this.value = transliterateMixtec(this.value)
})


