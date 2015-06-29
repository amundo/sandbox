/*

  Transliterator

  A simple library for doing transliteration from rule sets.

*/

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
    return text;
  }
}

var RuleTextParser = function(){
  this.parse = function(ruleText){
    var rules = ruleText.trim().split('\n')
      .map(rule => {
        return rule.split(/[ \t]+/).map(String.trim)
      })

    return rules.map(rule => {
      return { before: rule[0], after:rule[1]} 
    })
  }
}

