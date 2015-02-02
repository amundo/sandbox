var 
  text = [],
  sentenceForm       = document.querySelector('form'),
  textNode           = document.querySelector('#text'),
  transcriptionInput = document.querySelector('input.transcription'),
  translationInput   = document.querySelector('input.translation');

function render(templateSelector, data){
  var 
    fields = Object.keys(data),
    template = document.querySelector(templateSelector),
    node = document.importNode(template.content, true);
  
  fields.forEach(function(field){
    node.querySelector('.' + field).textContent = data[field]
  })

  return node;
}

function save(){
  localStorage.text = JSON.stringify(text);
}

function loadText(){
  if(localStorage.text){
    text = JSON.parse(localStorage.text);
  } else { 
    text = [];
    localStorage.text = JSON.stringify(text);
  }
  renderText();
}

sentenceForm.addEventListener('submit', function(submitEvent){
  submitEvent.preventDefault();   

  var sentence = {
    transcription: transcriptionInput.value,
    translation:  translationInput.value
  };

  text.push(sentence);

  this.reset();
  transcriptionInput.focus();

  save();
  renderText();
});

function renderText(){
  textNode.innerHTML = '';
  text.forEach(function(sentence){
    var eg = render('#sentenceTemplate', sentence)
    textNode.appendChild(eg);
  })   
}

window.addEventListener('load', loadText);
