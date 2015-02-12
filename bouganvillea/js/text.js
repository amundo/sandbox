app.Text = function(data){
 
  this.metadata = data.metadata;
  this.phrases = data.transcript;

  this.add = function(sentence){
    this.phrases.push(sentence);
  }
}

app.TextView = function(model, el){

  this.text = model; 
  this.el = document.querySelector(el);

  this.render = app.templates.text;
}


