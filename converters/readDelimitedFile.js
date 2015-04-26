function zip(file) {
  var fileReader = new FileReader;
  
  fileReader.onLoadEnd = function(ev) {
    var text = ev.target.result;
    var lines = text.split('\n');
    var headers = lines[0].split('\t');
    
    var zipLine = function(line) {
      var datum = {};
      
      headers.forEach(function(header, i) { datum[header] = line[i]; });
      
      return datum;
    };
  
    var data = lines
      .slice(1)
      .map(function(line) { return line.split('\t'); }).map(zipLine);
    
    console.log(data);
  };
  
  fileReader.readAsText(file);
};

function parseFile(file, parser) {
  var fileReader = new FileReader;
  
  fileReader.onLoadEnd = function(ev) {
    var text = ev.target.result;
    parser(text)
  };
  
  fileReader.readAsText(file);
};
