var Transliterator = function(rules){
  var escapeRegExp = function(unescaped){
    return (unescaped).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }
  this.transliterate = function(text){
    rules.forEach(function(rule){ 
      var before = new RegExp(escapeRegExp(rule.before), 'g');
      text = text.replace(before, rule.after) 
    })
    return text;
  }
}

var TranscriptionView = function(options){
  var 
    el = options.el,
    input = el.querySelector('input'),
    toggleRulesButton = el.querySelector('button'),
    ruleList = el.querySelector('textarea#ruleList'),
    rules = [];


  this.el = el;
  this.processRules = function(){
    var rules = ruleList.value.trim().split('\n');

    rules = rules.map(function(rule){
         return rule.split(/[ \t]/g).map(String.trim)
      })

    rules = rules.map(function(rule){
      return rule.map(function(side,i){
        if(side.startsWith('U+')){
          var codePoint = side.split('U+')[1];
          var unicodeString = String.fromCodePoint(parseInt(codePoint, 16));
          return unicodeString
        } else {
          return side
        } 
      })
    })

    var rules = rules.map(function(rule){
      var rule = { 
        before: rule[0],
        after: rule[1]
      }
      console.log(rule);
      return rule;
    })

    return rules
  }

  toggleRulesButton.addEventListener('click', function(){
    ruleList.classList.toggle('hidden');
  })

  this.transliterate = function(text){
    var transliterator = new Transliterator(this.processRules())
    return transliterator.transliterate(text)
  }

  input.addEventListener('input', function(ev){
    ev.target.value = this.transliterate(ev.target.value);
  }.bind(this))
  
}

