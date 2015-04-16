var parseDelimited = function(text, rowDelimiter, columnDelimiter){
  var 
    collection = [],
    rowDelimiter = rowDelimiter,
    columnDelimiter = columnDelimiter,
    headers;
  
  // this zip is cooler but more confusing at first :)
  function zip(keys, values){
    return keys.reduce(function(o, key, i){
      o[key] = values[i];
      return o;
    }, {})
  }

  function zip(keys, values){
    var o = {};
    keys.forEach(function(key, i){
      o[key] = values[i];
      return o;
    })
    return o
  }

  rows = text
    .trim()
    .split(rowDelimiter)
    .map(function(line){ 
       return line
         .split(columnDelimiter)
         .map(String.trim)
    });

  headers = rows.shift()

  collection = rows
    .reduce(function(collection, current){
      collection.push(zip(headers, current));
      return collection;
    }, [])

  return collection; 
}


var csv2json = function(text){
  return parseDelimited(text, '\n', ',')
}

var tsv2json = function(text){
  return parseDelimited(text, '\n', '\t')
}

var scription2json = function(text){
  return parseDelimited(text, '\n\n', '\n')
}

/*
var tsv = `model	 make	 year
Honda	 Civic	 2015
Corvette	 Fancy	 1966
Yugo	 Crapola	 1952`

var csv = `model, make, year
Honda, Civic, 2015
Corvette, Fancy, 1966
Yugo, Crapola, 1952`

var scription = `
model
make
year

Honda
Civic
2015

Corvette
Fancy
1966

Yugo
Crapola
1952
`

function show(data){ console.log(JSON.stringify(data, null, 2)) };
show(csv2json(csv))
show(tsv2json(tsv))
show(scription2json(scription))


*/
