var GlossingView = function(options){
  this.el = options.el ||  document.createElement('div');

  this.lexicon = options.lexicon; 

  this.text = options.textView.text; 
  this.textView = options.textView;

  this.glossText = function(){
    this.text.phrases.forEach(function(phrase){
      phrase.autogloss(this.lexicon)
    }.bind(this)) 
  }.bind(this)

  this.render = function(){
    this.textView.el.appendChild(this.textView.render())
  }.bind(this)

}

