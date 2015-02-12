app.Dictionary = function(){
 

}

app.DictionaryView = function(model, el){

  this.text = model; 
  this.el = document.querySelector(el);

  this.render = app.templates.text;
}


