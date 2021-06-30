"use strict"

export class Block {
	constructor (view, x, y, color = "#aaa") {
		this.view = view;
		this.x = x;
		this.y = y;
		this.color = color;
		this.velX = 0; // horizontally stationary
		this.velY = 0; // vertically stationary
		this.height = 20;
		this.width = 40;
		this.resourceCount = 1;
		this.resources = { // resources granted when destroyed
  		Iron: 1,
			Carbon: 0,
			Hydrogen: 1
		};
		this.HP = 1; // hitpoints before being destroyed
	}

	draw() {
		this.view.screen.beginPath();
		this.view.screen.rect(this.x, this.y, this.width, this.height);
		this.view.screen.fillStyle = this.color;
		this.view.screen.fill();
		this.view.screen.closePath();
	}

	update() {
		this.checkBounds();
		this.move();
		this.draw();
	}

	move() {
		this.x += this.velX;
		this.y += this.velY;
	}
	
	stop() {
		this.velX = 0;
		this.velY = 0;
	}
	
	moveRight() {
		this.velX = 3;
	}
	
	moveLeft() {
		this.velX = -3;
	}
	
	checkCollision(drone) {
		let block = this,
				harvest = null;
		
		let pos = {
				leftEdge: block.x,
				rightEdge: block.x + block.width,
				topEdge: block.y,
				bottomEdge: block.y + block.height,
				halfWidth: block.x + block.width / 2,
				halfHeight: block.y + block.height / 2
		};

		if (drone.x + drone.size + 1 > pos.leftEdge &&
				drone.x - drone.size + 1 < pos.rightEdge &&
				drone.y + drone.size + 1 > pos.topEdge &&
				drone.y - drone.size + 1 < pos.bottomEdge) {
			
			// do whatever we gotta do when this kind of block is hit
			harvest = block.collisionExt(drone, pos);

			// contact made at the top or bottom
			if (drone.x + drone.size > pos.leftEdge && drone.x - drone.size < pos.rightEdge) {
				drone.bounceY();
			// contact made at the left or right
			} else if (drone.y + drone.size > pos.topEdge && drone.y - drone.size < pos.bottomEdge) {
				drone.bounceX();
			// contact made at a corner
			} else {
				drone.bounceY();
				drone.bounceX();
			}
		}	
		return harvest;
	}
	
	// Take any collision actions specific to this block type
	collisionExt(source, position) {
		let retVal = null;
		retVal = this.takeDamage(source); 
		return retVal;
	}
	
	takeDamage(source) {
		// only drop resources if destroyed by mining bot
		// take different amounts of damage by type
		let retVal = {},
				block = this,
				types = Object.keys(source.damage);
		
		types.forEach( function(type){
			block.HP -= source.damage[type];
		});
		
		if (this.HP <= 0){
			this.destroy();
			retVal = this.resources;
		}
		
		return retVal;
	}

	destroy() {
		// animations
		// sounds
	}
	
	checkBounds() {
		this.x = this.x < 1 ? 1 : this.x;
		this.y = this.y < 1 ? 1 : this.y;
		
		if ((this.x + this.width) > this.view.width) {
				this.x = this.view.width - this.width + 1;
		}
		if ((this.y + this.height) > this.view.height) {
				this.y =  this.view.height - this.height + 1;
		}
	}
}


export class Paddle extends Block {
	constructor (view) {
		super(view, 0, 0);
		this.width = 80;
		this.height = 5;
		this.color = "#0af";
		this.HP = 5; // right now, this doesn't matter, but it definitely *could* come into play
		this.reset();
	}
	
	reset() {
		this.x = (this.view.width / 2 - this.width / 2);
		this.y = this.view.height - (this.height + 1);
		this.velX = 0;
		this.velY = 0;
	}
	
	collisionExt(source, position) {
		// apply a small horz velocity to drone when it hits the edges
		if ( Math.abs(source.velX) <= source.maxSpeed / 2) {
			if (source.x + source.size < position.halfWidth) {
				source.velX -= Math.random() * source.maxSpeed / 2;
			} else if (source.x - source.size > position.halfWidth) {
				source.velX += Math.random() * source.maxSpeed / 2;
			} else if (source.bounceCount == 0) {
				source.velX = (Math.random() * 2) - 1;
			}
		}
		
		// transfer horz velocity from the paddle
		if ( Math.abs(this.velX) > 0) {
			if (this.velX < 0) {
				source.velX -= 1;
			} else {
				source.velX += 1;	
			}
			
			// don't let the velX exceed the drone's max speed
			if ( Math.abs(source.velX) > source.maxSpeed ) {
				source.velX = source.maxSpeed * source.directionX;
			}
		}
		
		return null;
	}
	
	takeDamage(source) {
		// paddle does not take damage
		return null;
	}
}
