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
<div class="searchable lexicon">
  <div class=search>
    <header>
      <input type=search placeholder="search lexicon">
    </header>
    <ol class=results></ol>
  </div>

  <ol class=words></ol>
</div>
`

  this.render = function(){
    var 
      searchableLexiconDiv = new DOMParser().parseFromString(this.template, 'text/html').querySelector('.searchable.lexicon'),
      wordsOL = searchableLexiconDiv.querySelector('.words');

    this.lexicon.forEach(function(word){
      wordsOL.appendChild(this.renderWord(word))
    }.bind(this))

    this.el.innerHTML = '';
    this.el.appendChild(searchableLexiconDiv);

    this.setUpListeners();
  }.bind(this);

  this.setUpListeners = function(){
    var searchBox = this.el.querySelector('.search input');
    searchBox.addEventListener('keyup', function(ev){
      if(ev.which == 13){
        this.lexicon.search(this.value);
      }
    }.bind(this))
  }.bind(this);

  this.render();
}


