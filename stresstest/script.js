app = {};

app.nodes = {
  phraseTemplate: document.querySelector('#phraseTemplate'),
  runTestButton: document.querySelector('#runTestButton'),
  testResultsDisplay: document.querySelector('#testResults p'),
  textTemplate: document.querySelector('#textTemplate'),
  textsView: document.querySelector('.textsView'),
  wordTemplate: document.querySelector('#wordTemplate')
};

app.renderMethods = {
  renderFirst10WithIDs: function() {
    app.nodes.textsView.innerHTML = '';
    texts.forEach(function(text, t) {
      if (t<10) {
        textTemplate.content.querySelector('.textView').id = 'text' + t;
        var phrasesView = textTemplate.content.querySelector('.phrasesView');
        phrasesView.innerHTML = '';
        text.phrases.forEach(function(phrase, p) {
          phraseTemplate.content.querySelector('.phraseView').id = 'text' + t + '_phrase' + p;
          phraseTemplate.content.querySelector('.transcription').textContent = phrase.transcription;
          phraseTemplate.content.querySelector('.translation').textContent = phrase.translation;
          var wordsView = phraseTemplate.content.querySelector('.wordsView');
          wordsView.innerHTML = '';
          phrase.words.forEach(function(word, w) {
            wordTemplate.content.querySelector('.wordView').id = 'text' + t + '_phrase' + p + '_word' + w;
            wordTemplate.content.querySelector('.wordToken').textContent = word.token;
            wordTemplate.content.querySelector('.wordGloss').textContent = word.gloss;
            var newWord = wordTemplate.content.cloneNode(true);
            wordsView.appendChild(newWord);
          });
          var newPhrase = phraseTemplate.content.cloneNode(true);
          phrasesView.appendChild(newPhrase);
        });
        var newText = textTemplate.content.cloneNode(true);
        app.nodes.textsView.appendChild(newText);
      }
    });
  },
  renderWithIDs: function() {
    app.nodes.textsView.innerHTML = '';
    texts.forEach(function(text, t) {
      textTemplate.content.querySelector('.textView').id = 'text' + t;
      var phrasesView = textTemplate.content.querySelector('.phrasesView');
      phrasesView.innerHTML = '';
      text.phrases.forEach(function(phrase, p) {
        phraseTemplate.content.querySelector('.phraseView').id = 'text' + t + '_phrase' + p;
        phraseTemplate.content.querySelector('.transcription').textContent = phrase.transcription;
        phraseTemplate.content.querySelector('.translation').textContent = phrase.translation;
        var wordsView = phraseTemplate.content.querySelector('.wordsView');
        wordsView.innerHTML = '';
        phrase.words.forEach(function(word, w) {
          wordTemplate.content.querySelector('.wordView').id = 'text' + t + '_phrase' + p + '_word' + w;
          wordTemplate.content.querySelector('.wordToken').textContent = word.token;
          wordTemplate.content.querySelector('.wordGloss').textContent = word.gloss;
          var newWord = wordTemplate.content.cloneNode(true);
          wordsView.appendChild(newWord);
        });
        var newPhrase = phraseTemplate.content.cloneNode(true);
        phrasesView.appendChild(newPhrase);
      });
      var newText = textTemplate.content.cloneNode(true);
      app.nodes.textsView.appendChild(newText);
    });
  },
  renderFirst10WithListeners: function() {
    app.nodes.textsView.innerHTML = '';
    texts.forEach(function(text, t) {
      if (t<10) {
        var newText = textTemplate.content.cloneNode(true);
        app.nodes.textsView.appendChild(newText);
        
        var lastText = document.querySelector('.textsView > li:last-child');
        lastText.addEventListener('click', function(ev) {
          console.log(ev.target);
        });
        
        var phrasesView = document.querySelector('.textsView > li:last-child .phrasesView');
        text.phrases.forEach(function(phrase, p) {
          phraseTemplate.content.querySelector('.transcription').textContent = phrase.transcription;
          phraseTemplate.content.querySelector('.translation').textContent = phrase.translation;
          var newPhrase = phraseTemplate.content.cloneNode(true);
          phrasesView.appendChild(newPhrase);
          
          var lastPhrase = document.querySelector('.textsView > li:last-child .phrasesView > li:last-child');
          lastPhrase.addEventListener('click', function(ev) {
            console.log(ev.target);
          });
          
          var wordsView = document.querySelector('.textsView > li:last-child .phrasesView > li:last-child .wordsView');
          phrase.words.forEach(function(word, w) {
            wordTemplate.content.querySelector('.wordToken').textContent = word.token;
            wordTemplate.content.querySelector('.wordGloss').textContent = word.gloss;
            var newWord = wordTemplate.content.cloneNode(true);
            wordsView.appendChild(newWord);
            
            var lastWord = document.querySelector('.textsView > li:last-child .phrasesView > li:last-child .wordsView > li:last-child');
            lastWord.addEventListener('click', function(ev) {
              console.log(ev.target);
            });
          });
        });
      }
    });
  },
  renderWithListeners: function() {
    app.nodes.textsView.innerHTML = '';
    texts.forEach(function(text, t) {
      var newText = textTemplate.content.cloneNode(true);
      app.nodes.textsView.appendChild(newText);
      
      var lastText = document.querySelector('.textsView > li:last-child');
      lastText.addEventListener('click', function(ev) {
        console.log(ev.target);
      });
      
      var phrasesView = document.querySelector('.textsView > li:last-child .phrasesView');
      text.phrases.forEach(function(phrase, p) {
        phraseTemplate.content.querySelector('.transcription').textContent = phrase.transcription;
        phraseTemplate.content.querySelector('.translation').textContent = phrase.translation;
        var newPhrase = phraseTemplate.content.cloneNode(true);
        phrasesView.appendChild(newPhrase);
        
        var lastPhrase = document.querySelector('.textsView > li:last-child .phrasesView > li:last-child');
        lastPhrase.addEventListener('click', function(ev) {
          console.log(ev.target);
        });
        
        var wordsView = document.querySelector('.textsView > li:last-child .phrasesView > li:last-child .wordsView');
        phrase.words.forEach(function(word, w) {
          wordTemplate.content.querySelector('.wordToken').textContent = word.token;
          wordTemplate.content.querySelector('.wordGloss').textContent = word.gloss;
          var newWord = wordTemplate.content.cloneNode(true);
          wordsView.appendChild(newWord);
          
          var lastWord = document.querySelector('.textsView > li:last-child .phrasesView > li:last-child .wordsView > li:last-child');
          lastWord.addEventListener('click', function(ev) {
            console.log(ev.target);
          });
        });
      });
    });
  }
};

app.renderMethod = function() {
  var radioNodes = document.getElementsByName('renderMethod');
  var renderMethod;
  for (var i=0; i<radioNodes.length; i++) {
    if (radioNodes[i].checked === true) {
      renderMethod = radioNodes[i].value;
    }
  }
  return renderMethod;
};

app.runTest = function() {
  app.nodes.runTestButton.textContent = 'Running test. Please wait.';
  app.nodes.testResultsDisplay.innerHTML = 'Running test...'
  var test = new app.Test();
  app.storeTestResults(test);
  app.nodes.runTestButton.textContent = 'Run Test';
  app.nodes.testResultsDisplay.innerHTML = 'The test took ' + test.duration + 'ms to run.';
};

app.storeTestResults = function(test) {
  var testResults;
  if (localStorage.stressTestResults === undefined) {
    testResults = [];
  } else {
    testResults = JSON.parse(localStorage.stressTestResults);
  }
  
  var newResult = {
    date: test.date,
    renderMethod: test.renderMethod,
    browser: test.browser,
    speed: test.duration
  };
  testResults.push(newResult);
  
  localStorage.stressTestResults = JSON.stringify(testResults, null, 2);
};

app.Test = function() {
  this.browser = navigator.userAgent;
  this.date = Date();
  this.renderMethod = app.renderMethod();
  this.startTime = Date.now();
  switch (this.renderMethod) {
    case 'withids':
      app.renderMethods.renderWithIDs();
      break;
    case 'first10withids':
      app.renderMethods.renderFirst10WithIDs();
      break;
    case 'withListeners':
      app.renderMethods.renderWithListeners();
      break;
    case 'first10withListeners':
      app.renderMethods.renderFirst10WithListeners();
      break;
    default:
  }
  this.endTime = Date.now();
  this.duration = this.endTime - this.startTime;
};

app.nodes.runTestButton.addEventListener('click', app.runTest);