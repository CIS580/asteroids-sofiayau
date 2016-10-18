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
