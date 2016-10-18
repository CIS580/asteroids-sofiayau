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
