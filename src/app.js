"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Asteroid = require('./asteroid.js');
const Laser = require('./laser.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var image = new Image();
image.src = 'assets/Asteroid_01.GIF';

var axisList = [];
var asteroids = [];
for(var i = 0;i < 16; i++){
  asteroids.push({
    number:i,
    position:{x: 0, y:0},
    angle:0,
    velocity:{x:0, y:0},
    color:'white',
    hit:false
  });
  axisList.push(asteroids[i]);

}
axisList.sort(function(a,b){return a.position.x - b.position.x});

canvas.onkeyup = function(event){
  var direction = {
    //begin with first asteroid
    x:asteroids[0].position.x - player.x,
    y:asteroids[0].position.y - player.y
  }
  var denom = direction.x * direction.x + direction.y * direction.y;
  direction.x /= denom;
  direction.y /= denom;
  asteroids[0].velocity.x = player.power * direction.x;
  asteroids[0].velocity.y = player.power * direction.y;
  player.thrusting = false;
  player.steerLeft = false;
  player.steerRight = false;


}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  if(player.steerRight || player.steerLeft || player.thrusting){
    player.power += 0.1 *elapsedTime;
  }

  //move asteroids
  asteroids.forEach(function(asteroid, index){
    asteroid.color = 'gray';
    asteroid.position.x += elapsedTime * asteroid.velocity.x;
    asteroid.position.y += elapsedTime * asteroid.velocity.y;
    if(asteroid.position.x < 15 || asteroid.position.x > 1009){
      asteroid.velocity.x = -asteroid.velocity.x;
    }
    if(asteroid.position.y < 15 || asteroid.position.y > 497){
      asteroid.velocity.y = -asteroid.velocity.y;
    }
    asteroid.velocity.x *= 0.999;
    asteroid.velocity.y *= 0.999;

    //check for collisions

  });
  //re-sort our axis list by x
  axisList.sort(function(a,b){return a.position.x - b.position.x});
  //active list will hold all asteroids
  var active = [];
  //potentially colliding list will hold
  var potentiallyColliding = [];
  //consider the collisions
  axisList.forEach(function(asteroid, aindex){
    //remove asteroids
    active = active.filter(function(oasteriod){
      return asteroid.position.x - oasteriod.position.x < 30;
    });
    //look at the pair
    active.forEach(function(oasteriod, bindex){
      potentiallyColliding.push({a: oasteriod, b:asteroid});
      //put the current asteroid to the active
      active.push(asteroid);
    });
    //real collision between pairs
    var collisions = [];
    potentiallyColliding.forEach(function(pair){
      //distance between them
      var distSquared =
      Math.pow(pair.a.position.x - pair.b.position.x,2)+
      Math.pow(pair.a.position.y - pair.b.position.y,2);
      if(distSquared < 900){
        pair.a.color = 'red';
        pair.b.color = 'green';
        collisions.push(pair);
      }//15*15

    });
  });
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */

function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillText("Score:", 10, 20);
  ctx.fillText("Level:", 100, 20);
  ctx.fillText("Lives:", 200, 20);
  //lives display in GUI way
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(50, 250);
  ctx.stroke();
  player.render(elapsedTime, ctx);
}
