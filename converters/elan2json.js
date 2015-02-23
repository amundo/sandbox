var lines = before.value.trim().split('\n');

var headers = 'startTime endTime duration transcript notes translation phonemic phonetic'.split(' ');


function labelLine(line) {
  var o = {};
  var parts = line.split('\t');
  headers.forEach(function (header, i) {
    o[header] = parts[i]
  }); 
  return o;
}


// have to hook up the button srry
after.value = JSON.stringify(lines.slice(1).map(labelLine), null, 2);


