"use strict"

export default class Drone {
	constructor (view, color, size) {
		this.view = view;
		this.color = color;
		this.size = size;
		this.x;
		this.y;
		this.velX;
		this.velY;
		this.directionY;
		this.directionX;
		this.maxSpeed = 3;
		this.reset();
		this.updateCounter = 0;
		this.lastBounceY = 0;
		this.lastBounceX = 0;
		this.bounceCount = 0;
		this.gravity = 0.007;
		this.HP = 2;
		/* 
			this determines how much damage of each type the drone does to blocks
			it could also use a matching defense set that modifies damage *taken* by type
				this would operate by percentage where 0 means immune
			this behavior is *shared* between drones and blocks... can I manage it in one place?
		*/
		this.damage = {
			physical: 1,
			energy: 0,
			chemical: 0
		};
	}

	draw() {
		this.view.screen.beginPath();
		this.view.screen.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
		this.view.screen.fillStyle = this.color;
		this.view.screen.fill();
		this.view.screen.stroke();
		this.view.screen.closePath();
	}

	update(blocks) {
		this.updateCounter++;
		this.checkBounds();
		this.move();
		this.draw();
	}
	
	setGravity(gravity) {
		this.gravity = gravity;
	}

	move() {
		this.velY += this.gravity;
		this.directionX = this.velX / Math.abs(this.velX);
		this.directionY = this.velY / Math.abs(this.velY);
		
		if (Math.abs(this.velY) > this.maxSpeed) {
			this.velY = this.maxSpeed * this.directionY;
		}
		
		this.x += this.velX;
		this.y += this.velY;
	}
	
	bounceY() {
		if (this.updateCounter - this.lastBounceY > 1) {
			this.lastBounceY = this.updateCounter;
			this.bounceCount++;
			this.velY = -(this.velY);
		}
	}
	
	bounceX() {
		if (this.updateCounter - this.lastBounceX > 1) {
			this.lastBounceX = this.updateCounter;
			this.bounceCount++;
			this.velX = -(this.velX);
		}
	}
	
	takeDamage(source) {
		// take different amounts of damage by source & type
		//this.HP -= source.damage['physical'];
		//this.HP -= source.damage['energy'];
		//this.HP -= source.damage['chemical'];
		
		this.HP -= 1;
		
		if (this.HP <= 0){
			this.destroy();
		}
		return this.HP
	}

	destroy() {
		// animations
		// sounds
	}
		
	reset() {
		this.x = (this.view.width / 2) + ((Math.random() * 10) - 5);
		this.y = this.view.height - (this.size * 12);
		this.velX = 0;
		this.velY = 7;
		this.bounceCount = 0;
		this.HP = 2;
	}

	checkBounds() {
		if (this.x >= this.view.width) {
			this.x = this.view.width - (this.size + 1);
		} else if (this.x <= 0) {
			this.x = this.size + 1;
		}
		if (this.y <= 0) {
			this.y = this.size + 1;
		}
		
		if (((this.x + this.size) >= this.view.width) || 
			 ((this.x - this.size) <= 0)) {
				this.bounceX();
		}
		if ((this.y + this.size) >= this.view.height) {
				this.takeDamage("OutOfBounds");
		} else if ((this.y - this.size) <= 0) {
				this.bounceY();
		}
	}
}