var TextView = function(options){
  this.text = options.text || new Text();
  this.el = options.el || document.createElement('div');

  this.renderPhrase = function(phrase){
    var 
      div = document.createElement('div');

    div.classList.add('phrase');

    div.insertAdjacentHTML('afterbegin',  
`   <p class=transcription>${phrase.transcription}</p>
    <ol class=words></ol>
    <p class=translation>${phrase.translations.en}</p>`) 

    var wordsOL = div.querySelector('ol.words');

    phrase.words.forEach(function(word){
      wordsOL.insertAdjacentHTML('afterbegin', 
`   <li>
      <ol class=word>
        <li class=token>${word.token}</li>
        <li class=gloss>${word.gloss}</li>
      </ol>
    </li>
`)
    })
  
    return div;
  }

  this.render = function(text){
    var fragment = document.createDocumentFragment();
    this.text.phrases.forEach(function(phrase){
      fragment.appendChild(this.renderPhrase(phrase));
    }, this)
    return fragment;
  }.bind(this)
  
  this.initialize = function(){
    var 
      textFragment = this.render();
  
    this.el.innerHTML = '';
    this.el.appendChild(textFragment);
    
    // [].slice.call(document.querySelectorAll('.phrase header')).forEach(function(phraseHeader){
    //   var 
    //     audio = phraseHeader.querySelector('audio');
    //     phraseId = phraseHeader.querySelector('.phraseId');
  
    //   phraseId.addEventListener('click', function(ev){
    //     audio.play(); 
    //     audio.remove();
    //   })
    // })
    
  }.bind(this)
  
  
  this.initialize();
}
