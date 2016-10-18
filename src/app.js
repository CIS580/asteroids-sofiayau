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
var laser = new Laser({x:0, y:0}, 20);
var backgroundMusic = new Audio();
backgroundMusic.src = 'assets/backgroundMusic.mp3'
var win = new Audio();
win.src = "assets/win.wav";
var lose = new Audio();
lose.src = "assets/lose.wav";

var score = 0;
var level = 1;
var lives = 3;

var lasers = [];
var asteroids = [];
var axisList =[];
for (var i =0; i<13; i++){
  asteroid = new Asteroid({x:Math.floor(Math.random() * canvas.width +1) ,
    y:Math.floor(Math.random()*canvas.height + 1)},canvas,2);
  asteroids.push(asteroid);
  axisList.push(asteroids[i]);
}
backgroundMusic.play();

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
  //while (lives >= 0){
  //Handle Collisions between asteroids
  asteroids.forEach(function(asteroid){
    asteroid.position.x += elapsedTime * asteroid.velocity.x;
    asteroid.position.y += elapsedTime * asteroid.velocity.y;
  });

  var active = [];
  var potentiallyColliding =[];
  asteroids.forEach(function(asteroid){
    active = active.filter(function(oasteriod){
      return asteroid.position.x - oasteriod.position.x < asteroid.radius + oasteriod.radius;
    });
    active.forEach(function(oasteriod){
      potentiallyColliding.push({a: oasteriod, b:asteroid});
    });
    active.push(asteroid);
  });

  var collisions = [];
  potentiallyColliding.forEach(function(pair){
    var distSquared = Math.pow(pair.a.position.x - pair.b.position.x, 2) +
    Math.pow(pair.a.position.y - pair.b.position.y, 2);
    if(distSquared < 576){
      pair.a.color = 'yellow';
      pair.b.color = 'red';
      //Break into small pieces
      pair.a.size = 0.5;
      pair.b.size = 0.5;
      collisions.push(pair);
      backgroundMusic.pause();
      win.play();
    }

  });

  //Handle Hit between laser and asteroids
  asteroids.sort(function(a,b){
    return a.position.x - b.position.x;
  });
  lasers.sort(function(a,b){
    return a.position.x - b.position.x;
  });

  //Handle Collisions between ship and asteroids
  var player_active = [];
  var player_potentiallyColliding =[];
  asteroids.forEach(function(asteroid){
    player_active = player_active.filter(function(player){
      return asteroid.position.x - player.position.x < asteroid.radius;
    });
    active.forEach(function(player){
      potentiallyColliding.push({a: player, b:asteroid});
    });
    active.push(asteroid);
  });

  var player_collisions = [];
  player_potentiallyColliding.forEach(function(pair){
    var distSquared = Math.pow(pair.a.position.x - pair.b.position.x, 2) +
    Math.pow(pair.a.position.y - pair.b.position.y, 2);
    if(distSquared < Math.pow(pair.a.radius)){
      collisions.push(pair);
      backgroundMusic.pause();
      win.play();
    }

  });

  player.update(elapsedTime);
  lasers.forEach(function(laser){
    laser.update(elapsedTime);
  });
  asteroids.forEach(function(asteroid){
    asteroid.update(elapsedTime);
  });
  backgroundMusic.pause();
  lose.play();
  //lives -= 1 ;

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
  ctx.fillText("Score:"+ score, 10, 20);
  ctx.fillText("Level:" + level, 100, 20);
  ctx.fillText("Lives:" + lives, 200, 20);
  //lives display in GUI way
  //ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(220,20);
  ctx.lineTo(120, 50);
  ctx.stroke();

  asteroids.forEach(function(asteroid){
    asteroid.render(elapsedTime,ctx);
  });
  lasers.forEach(function(laser){
    laser.render(elapsedTime, ctx);
  });
  player.render(elapsedTime, ctx);
}
