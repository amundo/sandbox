function toSeconds(){}

var parseTimestamp = (ts) => {
  var parts =  ts.split('-->').map(String.trim) ;
  return [parts[0], parts[1]]
}

var secondsToTimestamp = (time) => {

  var totalSec = time; 
  var hours = parseInt( totalSec / 3600 ) % 24;
  var minutes = parseInt( totalSec / 60 ) % 60;
  var seconds = totalSec % 60;
  
  var result = (hours < 10 ? "0" + hours : hours) 
     + ":" + (minutes < 10 ? "0" + minutes : minutes) 
     + ":" + (seconds  < 10 ? "0" + seconds : seconds).toFixed(3);

  return result
}

var convertRange = (start, stop) => {
  start = secondsToTimestamp(start);
  stop = secondsToTimestamp(stop);
  return [start, stop].join(" --> ");
}
