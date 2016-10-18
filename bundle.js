(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var score = 0;
var level = 1;
var lives = 3;

var lasers = [];
var asteroids = [];
var axisList =[];
for (var i =0; i<13; i++){
  asteroid = new Asteroid({x:Math.floor(Math.random() * canvas.width +1) ,
    y:Math.floor(Math.random()*canvas.height + 1)},canvas);
  asteroids.push(asteroid);
  axisList.push(asteroids[i]);
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
      collisions.push(pair);
    }
  });

  //Handle Collisions between ship and asteroids
  asteroids.sort(function(a,b){
    return a.position.x - b.position.x;
  });
  lasers.sort(function(a,b){
    return a.position.x - b.position.x;
  });
  player.update(elapsedTime);
  lasers.forEach(function(laser){
    laser.update(elapsedTime);
  });
  asteroids.forEach(function(asteroid){
    asteroid.update(elapsedTime);
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

},{"./asteroid.js":2,"./game.js":3,"./laser.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;
const MAX_VELOCITY = 1;

/**
 * @module exports the Asteroids class
 */
module.exports = exports = Asteroid;

var random = getRandomInt(1, 3);
/**
 * @constructor Asteroid
 * Creates a new asteroid object
 * @param {Postition} position object specifying an x and y
 */
function Asteroid(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.angle = Math.random() * 2 -1;
  this.velocity = {
    x: Math.sin(this.angle) * 0.5,
    y: Math.cos(this.angle) * 0.5
  };
  this.color = "white";
  switch (random){
  // large
    case 1:
      // difference among large, medium, small asteroids
      this.radius  = 30;
      this.size = 64;
      this.mass = 1;
      break;

    //medium
    case 2:
    // difference among large, medium, small asteroids
      this.radius  = 15;
      this.size = 32;
      this.mass = 2;
      break;
      //small
    case 3:
  // difference among large, medium, small asteroids
    this.radius  = 5;
    this.size = 16;
    this.mass = 3;
      break;
    }
  }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * @function updates the asteroid object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {

  // Apply velocity
  this.position.x -= this.velocity.x;
  this.position.y -= this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;

  switch(random){
    case 1:
      this.angle -= 0.2;
      break;
    case 2:
      this.angle += 0.1;
      break;
    case 3:
      this.angle -= 0.05;
      break;
  }
  console.log(this.position.x, this.position.y);
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  ctx.save();
  switch(random){
    case 1:
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.strokeStyle = this.color;
      ctx.stroke();
      break;
    case 2:
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.strokeStyle = this.color;
      ctx.stroke();
      break;
    case 3:
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.strokeStyle = this.color;
      ctx.stroke();
      break;
  }
    ctx.restore();
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Asteroids class
 */
module.exports = exports = Laser;

function Laser (position, angle){
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: Math.sin(angle) * 2,
    y: Math.cos(angle) * 2
  }
  this.angle = angle;
  this.radius  = 4;

}

Laser.prototype.update = function(time){

// Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
// Wrap around the screen
//if(this.position.x < 0) this.position.x += this.worldWidth;
//if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
//if(this.position.y < 0) this.position.y += this.worldHeight;
//if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
  }


Laser.prototype.render = function(time, ctx){
  ctx.save();
  ctx.strokeStyle = 'Green';
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(-1,-3);
  ctx.lineTo(-1,5);
  ctx.lineTo(2, 5);
  ctx.lineTo(2,-3);
  ctx.closePath();

  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.restore();
  //draw
}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;
const MAX_VELOCITY = 3;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;

  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
    }
  }
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
    if(this.velocity.x > MAX_VELOCITY){
      this.velocity.x = MAX_VELOCITY;
    }
    // different direction
    else if(this.velocity.x > -1 * MAX_VELOCITY){
      this.velocity.x = -1 * MAX_VELOCITY;
    }
    if(this.velocity.y > MAX_VELOCITY){
      this.velocity.y = MAX_VELOCITY;
    }
    // different direction
    else if(this.velocity.y > -1 * MAX_VELOCITY){
      this.velocity.y = -1 * MAX_VELOCITY;
    }
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

},{}]},{},[1]);
