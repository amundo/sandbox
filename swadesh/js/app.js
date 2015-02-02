var app = {};


app.render = function(word){
  var section = document.querySelector("section#word");
  Object.keys(word).forEach(function(field){
    if(section.querySelector('.' + field)){
      section.querySelector('.' + field).textContent = word[field];
    }
  })
}

function init(data){
  app.words = data.words;
  app.byID = nest('id', app.words);
  app.byEn = nest('en', app.words);
  app.byEs = nest('es', app.words);
  app.mic = document.querySelector('img.mic');

  app.current = app.words[0];
  app.render(app.current);
}

app.at = function(id){
  return app.byID[id];
}

app.next = function(){
  if(!app.recording){
    var nextID = Math.min(app.current.id + 1, app.words.length - 1);
    app.current = app.byID[nextID];
    app.render(app.current);
  }
}

app.prev = function(){
  if(!app.recording){
    var prevID = Math.max(app.current.id - 1, 1);
    app.current = app.byID[prevID];
    app.render(app.current);
  }
}


app.save = function(){
  if(app.mic.src.endsWith('mic.svg')){
    app.recording = true;
    app.mic.src = 'mic_red.svg';
    app.current.start = (performance.now() - app.origin) / 1000;
  } else { 
    app.recording = false;
    app.mic.src = 'mic.svg';
    app.current.stop = (performance.now() - app.origin) / 1000;
  }
}

var next = document.querySelector('#next');
var prev = document.querySelector('#prev');
var mic = document.querySelector('img.mic');


next.addEventListener('click', app.next);

// next.addEventListener('click', function(ev){
//   app.next();
// })

prev.addEventListener('click', app.prev);
//function(ev){
 // app.prev();
//})

mic.addEventListener('click', app.save);

document.body.addEventListener('keyup', function(ev){
  switch(ev.which){
    case 32: 
      app.save();
      break;
    case 39: 
      app.next();
      break;
    case 40: 
      app.prev();
      break;
  }
})

getJSON('data/swadesh.json', init);
