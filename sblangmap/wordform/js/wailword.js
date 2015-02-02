function harvest(){ 
  var words = [],
      data = [],
      //language = document.querySelector('#language').value,
      wordforms = [... document.querySelectorAll('.wordform')];
  
  wordforms.forEach(function(wordform){
  
    var word = {};
  
    word['language'] = 'Blackfoot';
    word['code'] = 'bla';
  
    word.keyword = wordform.querySelector('h2').textContent;
    word.orthographic = wordform.querySelector('.inputOrthographic').value;
    word.phonetic = wordform.querySelector('.inputPhonetic').value;
    word.gloss = wordform.querySelector('.inputGloss').value;
    word.comment = wordform.querySelector('.comment').value;
  
    words.push(word);
  });

  //return JSON.stringify(words, null, 2);
  return words;
}

function stringify(words){
  return JSON.stringify(words, null, 2);
}

function serialize(){
  var words = harvest();
  words = stringify(words)
  var blob = new Blob([words], {type: "text/json;charset=utf-8"});
  saveAs(blob, "bla.json");
}



var exportButton = document.querySelector('#export');

exportButton.addEventListener('click', serialize, false);


