/*
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

*/

var SearchableLexiconView = function(options){
  this.lexicon = options.lexicon;
  this.el = options.el;

  this.initialize = function(){
    this.render();
  }.bind(this)

  this.renderWord = function(word){
    var 
      el = document.createElement('li'),
      content = '<strong class=token>' + word.token + '</strong> <span class=gloss>' + word.gloss + '</span>';
  
    el.innerHTML = content;
    return el;
  }

  this.template = `
<div class=lexicon>
  <div class=search>
    <header>
      <input type=search>
    </header>
    <ol class=results></ol>
  </div>

  <ol class=words></ol>
</div>
`

  this.render = function(){
    var 
      lexiconDiv = new DOMParser().parseFromString(this.template, 'text/html').querySelector('div.lexicon'),
      wordsOL = lexiconDiv.querySelector('.words');

    this.lexicon.forEach(function(word){
      wordsOL.appendChild(this.renderWord(word))
    }.bind(this))

    this.el.appendChild(lexiconDiv);

  }.bind(this);

  this.load = function(words){
    this.lexicon.reset(words); 
  }

  this.loadFromURL = function(url){
    getJSON(
      url, 
      function(data){ 
        this.lexicon.reset(words); 
      }, 
      function(err){ console.log(err) }
   )
  }

  this.render();
}


