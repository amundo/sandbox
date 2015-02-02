function countVowels(text){
   var letterArray = text.split('');
   var count = 0;
   var vowels = 'aeiouAEIOU';

   letterArray.forEach(function(letter){
     if(vowels.contains(letter)){
        count += 1
     }
   })
   return count;
}

function addCow(){
  var protocow = document.querySelector('img');
  var newCow = protocow.cloneNode(true);
  var field = document.querySelector('#field');
  field.appendChild(newCow);
}


document.addEventListener('DOMContentLoaded', function(){

var button = document.querySelector('button');

button.addEventListener('click', function(ev){
   var text = document.body.querySelector('input').value;
   var mycount = countVowels(text);
   for(var i=0; i< mycount; i++){
     addCow();
   }
})   


})
