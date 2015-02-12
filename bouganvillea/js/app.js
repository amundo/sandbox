app.nodes = {};
 
'header main footer #text #phrases #dictionary'
  .split(' ')
  .forEach(function(selector){ 
    var key = selector.replace('#','').replace('.','')
    app.nodes[key] = document.querySelector(selector);
  })

app.templates = {};
 
document.querySelectorAll('template').forEach(function(template){
  var key = template.id.replace('#','').replace('Template','').toLowerCase();
  app.templates[key] = template ;
})


getJSON('http://glyph.local/~pat/Languages/mixtec/corpus/working_at_calfresh/working_at_calfresh.json', initialize);

function  initialize(data){
  
  app.text = new app.Text(data);
  app.dictionary = new app.Dictionary();

}

