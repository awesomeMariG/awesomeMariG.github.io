var canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var c = canvas.getContext('2d');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let numStars = 200;
let starRadius = Math.round(canvas.width/24);
let stars = [];
let maxStarSpeed = .3;
let opacityLevel = .05;
let globalOpacityCounter = 5;
let resizeTimer;
let flashingStar = 0;
const preSetColors = [
  '83D9EC',
  'C6E464',
  'FF9E56',
  'FFDC59',
  'FF765C',
  '83D9EC',
];

window.addEventListener("resize", function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function(){
    stars = [];
    starRadius = Math.round(canvas.width/22);
    starRadius = starRadius > 45 ? 45 : starRadius;
    for(var i =0; i< numStars; i++) {
      stars[i] = makeStar();
    }
    console.log(starRadius);
  }, 300);
});

(function main(){
  console.log('canvas linked');
  for(var i =0; i< numStars; i++) {
    stars[i] = makeStar();
  }
  animate();
})();

function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0,0, canvas.width,canvas.height);
  c.globalAlpha = 1;
  c.fillStyle = "black";
  c.fillRect(0,0,canvas.width,canvas.height);
  flashingStar = Math.floor(Math.random() * numStars);
  for(var i =0; i< numStars; i++) {
    if(i === flashingStar) stars[i].opacityCounter += 5;
    stars[i].draw(c);
    stars[i].update();
  }
}

function Star(x,y,radius,speed, color){
  this.x = x;
  this.y = y;
  this.opacityCounter = 0;
  this.radius = radius;
  this.speed = speed;
  this.color = color;
  this.opacity =  Math.random();
  this.blur = 30;
  this.desiredOpacity;
  this.updating = false;

  this.draw = function(canvas) {
    canvas.beginPath();
    canvas.arc(this.x,this.y,this.radius,0, 2*Math.PI);
    canvas.shadowBlur = this.blur;
    canvas.shadowColor = `#${this.color}`;
    canvas.fillStyle = `#${this.color}`;
    canvas.globalAlpha = this.opacity;
    canvas.fill();
  }

  this.update = function(){
    this.x -= this.speed;
    if(this.x + this.radius< 0) {
      this.x = this.radius + canvas.width;
    }
    if(this.opacityCounter >= globalOpacityCounter){
      if(!this.updating) {
        this.updating = true;
        this.desiredOpacity = Math.round(Math.random()* 1000)/1000;;
        updateOpacity(this);
        this.opacityCounter = 0 ;
      }
    }
  }
}

function updateOpacity(star){
  let opacityTimer;
  if(star.desiredOpacity - star.opacity > 0){
    opacityTimer = setInterval(function(){
      if(this.opacity +0.03 >= this.desiredOpacity) {
        this.opacity = this.desiredOpacity;
        this.updating = false;
        clearInterval(opacityTimer);
      }
      else this.opacity += 0.01;
    }.bind(star),100);
  } else {
    opacityTimer = setInterval(function(){
      if(this.opacity-0.03 <= this.desiredOpacity) {
        this.opacity = this.desiredOpacity;
        this.updating = false;
        clearInterval(opacityTimer);
      }
      else this.opacity -= 0.01;
    }.bind(star),100);
  }
}

function makeStar(){
  radius = Math.round(Math.random() * starRadius);
  radius = radius < 1 ? 1 : radius;
  randomX = Math.round(Math.random() * (canvas.width - 2*radius) + radius);
  randomY = Math.round(Math.random() * (canvas.height - 2*radius) + radius);
  opacity = Math.round(Math.random()* 10)/10;
  speed = Math.random() * maxStarSpeed;
  speed = speed < 0.1 ? 0.1 : speed;
  return new Star(randomX, randomY, radius, speed, preSetColors[Math.floor(Math.random() * 5)]);
}
