(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Asteroid = require('./asteroid.js');

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

},{"./asteroid.js":2,"./game.js":3,"./player.js":4}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Asteroids class
 */
module.exports = exports = Asteroids;

var random = getRandomInt(1, 5);
/**
 * @constructor Asteroid
 * Creates a new asteroid object
 * @param {Postition} position object specifying an x and y
 */
function Asteroid(position,size, canvas) {
  switch (size){
    case 1:
      this.worldWidth = canvas.width;
      this.worldHeight = canvas.height;
      this.position = {
        x: position.x,
        y: position.y
      };
      this.velocity = {
        x: 1,
        y: 0
      }
      this.angle = 0;
      this.radius  = 64;
      this.size = 64;
      this.mass = 1;
      this.spritesheet = new Image();
      this.spritesheet.src = 'assets/Asteroid_'+random+'.GIF';
      break;
    case 2:
      this.worldWidth = canvas.width;
      this.worldHeight = canvas.height;
      this.position = {
        x: position.x,
        y: position.y
      };
      this.velocity = {
        x: 2,
        y: 2
      }
      this.angle = 0;
      this.radius  = 64;
      this.size = 32;
      this.mass = 2;
      this.spritesheet = new Image();
      this.spritesheet.src = 'assets/Asteroid_'+random+'.GIF';
      break;
    case 3:
      this.worldWidth = canvas.width;
      this.worldHeight = canvas.height;
      this.position = {
        x: position.x,
        y: position.y
      };
      this.velocity = {
        x: 3,
        y: 2
      }
      this.angle = 0;
      this.radius  = 64;
      this.size = 16;
      this.mass = 3;
      this.spritesheet = new Image();
      this.spritesheet.src = 'assets/Asteroid_'+random+'.GIF';
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
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x + this.size < 0) this.position.x += (this.worldWidth + this.size);
  if(this.position.x > this.worldWidth) this.position.x -= (this.worldWidth + this.size);
  if(this.position.y + this.size < 0) this.position.y += (this.worldWidth + this.size);
  if(this.position.y > this.worldHeight) this.position.y -= (this.worldWidth + this.size);
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  switch(random){
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;

  }
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

const MS_PER_FRAME = 1000/8;
const MAX_VELOCITY = 5;

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
