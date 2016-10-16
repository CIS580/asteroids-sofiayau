"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Asteroids class
 */
module.exports = exports = Asteroid;

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
