var Transliterator = function(rules){
  var escapeRegExp = function(unescaped){
    return (unescaped).replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }

  var unescapeUPlus = function(side){
    if(side.startsWith('U+')){ 
      var codePoint = side.split('U+')[1];
      return String.fromCodePoint(parseInt(codePoint, 16));
    } else { 
      return side
    }
  }

  this.transliterate = function(text){
    rules.forEach(function(rule){ 
      var before = new RegExp(escapeRegExp(rule.before), 'g');
      var after = unescapeUPlus(rule.after);
      
      text = text.replace(before, after);
    })
    return text.normalize('NFC');
  }
}

var TranscriptionView = function(options){
  var 
    el = options.el,
    input = options.box,
    toggleRulesButton = el.querySelector('button'),
    ruleList = el.querySelector('textarea#ruleList'),
    rules = [];

  this.el = el;

  toggleRulesButton.addEventListener('click', function(){
    ruleList.classList.toggle('hidden');
  })

  this.processRulesText = function(){
    var rules = ruleList.value.trim().split('\n');

    rules = rules.map(function(rule){
         return rule.split(/[ \t]/g).map(String.trim)
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

  this.transliterate = function(text){
    var transliterator = new Transliterator(this.processRulesText())
    return transliterator.transliterate(text)
  }

  input.addEventListener('input', function(ev){
    var start = ev.target.selectionStart,
        end = ev.target.selectionEnd;

    ev.target.value = this.transliterate(ev.target.value);

    ev.target.setSelectionRange(end, end);

  }.bind(this))
  
}

