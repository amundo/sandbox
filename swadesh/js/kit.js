
var getJSON = function(url, successHandler, errorHandler) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      successHandler && successHandler(xhr.response);
    } else {
      errorHandler && errorHandler(status);
    }
  };
  xhr.send();
};


function render(template, data){
  var 
    fields = Object.keys(data),
    node = document.importNode(template.content, true);
  
  fields.forEach(function(field){
    if(node.querySelector('.' + field)){
      node.querySelector('.' + field).textContent = data[field]
    }
  })

  return node;
}


function nest(attribute, collection){
  var nested = {};
  collection.forEach(function(item){
    var key = item[attribute];
    nested[key] = item;
  })
  return nested;
}

