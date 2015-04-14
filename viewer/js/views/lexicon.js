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

getJSON('data/lex.json', function(data){ 
  window.lexicon = data;
  render(lexicon);
})


var LexiconView = function(el, model){

  this.renderWord = function(word){
    var 
      el = document.createElement('li'),
      content = '<strong lang=mixtec>' + word.token + '</strong> <span lang=en>' + word.gloss + '</span>';
  
    el.innerHTML = content;
    return el;
  }

  this.render = function(){
    var fragment = document.createDocumentFragment();

    this.model.forEach(function(word){
      fragment.appendChild(this.renderWord(word))
    })

    this.el.querySelector('#lexicon #words').appendChild(fragment);
  }.bind(this);

  this.render();
}


