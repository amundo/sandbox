var app = app || {};

var renderPhrase = function(phrase){
  var 
    div = document.createElement('div');
    html = '';

  div.classList.add('phrase');
  
  html += '<span class=phraseId><audio src=' + app.text.metadata.media + '#t=' + phrase.startTime + ',' + phrase.endTime + '></audio> (' + phrase.id + ')</span>';
  html += '<p lang=mixtec>' + phrase.transcription + '</p>';
  html += '<ol class=words>';

  phrase.words.forEach(function(word){
    html += '<li><ol class=word>';
    html +=   '<li class=token lang=mixtec>' + word.token + '</li>';
    html +=   '<li class=gloss lang=en>' + word.gloss + '</li>';
    html += '</ol></li>';
  })

  html += '</ol>';
  html += '<p lang=en>' + phrase.translations.en + '</p>';

  div.insertAdjacentHTML('afterbegin', html);
  return div;
}

var renderText = function(text){
  var fragment = document.createDocumentFragment();

  text.phrases.forEach(function(phrase){
      
    fragment.appendChild(renderPhrase(phrase));
 
  })

  return fragment;
}

app.initText = function(text){
  var 
    textDiv = document.querySelector('#text div'),
    textFragment = renderText(text);

  textDiv.innerHTML = '';
  textDiv.appendChild(textFragment);
  
  [].slice.call(document.querySelectorAll('.phraseId')).forEach(function(phraseId){
    var audio = phraseId.querySelector('audio');
    phraseId.addEventListener('click', function(ev){
      audio.play(); 
      audio.remove();
    })
  })
  
}

var loader = document.querySelector('input[type="file"]');

loader.addEventListener('change', function(ev){
  var file = ev.currentTarget.files[0];

  var reader = new FileReader();
  
  reader.onload = function(ev){
    var text = JSON.parse(this.result);
    app.text = text;
    app.initText(text);
  }

  reader.readAsText(file);
})

var pasteTextButton = document.querySelector('button#pasteText');

pasteTextButton.addEventListener('click', function(ev){
  var 
    textDiv = document.querySelector('#text div'), 
    ta = document.querySelector('#text textarea'); 

  ta.style.display = 'flex';

  ta.addEventListener('keyup', function(ev){
    if(ev.which == 27){
      var text = JSON.parse(this.value);
      app.text = text;
      app.initText(text);
      ta.style.display = 'none'; 
    } 
  })
})

// getJSON('pear2015.04.06.json', function(data){ 
//   app.text = data;
//   app.initText(app.text);
// })
