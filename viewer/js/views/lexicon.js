function renderWord(word){
  var 
    el = document.createElement('li'),
    content = '<strong lang=mixtec>' + word.token + '</strong> <span lang=en>' + word.gloss + '</span>';

  el.innerHTML = content;
  return el;
  
}

function render(lexicon){
  var fragment = document.createDocumentFragment();
  lexicon.forEach(function(word){
    fragment.appendChild(renderWord(word))
  })
  document.querySelector('#lexicon #words').appendChild(fragment);
}

getJSON('lex.json', function(data){ 
  window.lexicon = data;
  render(lexicon);
})

