var GlossingView = function(data){
  this.el = data.el ||  document.createElement('div');
  this.text = data.text || new Text(); 
  this.lexicon = data.lexicon || new Lexicon(); 

  this.glossText = function(){
    this.text.phrases.forEach(function(phrase){
      phrase.autogloss(this.lexicon)
    }.bind(this)) 
  }.bind(this)

}

