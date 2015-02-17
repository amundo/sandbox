function degrees2radians(deg) {
    return deg * Math.PI / 180
}

var can = document.querySelector('canvas');
var ctx = can.getContext('2d');
ctx.translate(0.5, 0.5);

var cx = 150;
var cy = 150;
ctx.fillStyle = 'lightgray';

// in case you like using degrees
function degrees2radians(deg) {
    return deg * Math.PI / 180
}

function circle(ctx,cx,cy,radius){
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.arc(cx, cy, radius, degrees2radians(270), degrees2radians(270+360), false); 
  ctx.closePath();
  ctx.fill();
}

function slice(ctx,cx,cy,radius, startAngle, stopAngle){
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.arc(cx, cy, radius, degrees2radians(startAngle), degrees2radians(stopAngle), false); 
  ctx.lineTo(cx,cy);
  ctx.closePath();
  ctx.fill();
}

circle(ctx, 150, 150, 150)

function mark(ctx, at){
  ctx.fillStyle = 'gray';
  slice(ctx, 150,150,150, at, at+1.5)
}

function updateMeter(sequence, max){
  sequence.forEach(function(item){
    mark(ctx, item / max * 360)
  })
}



