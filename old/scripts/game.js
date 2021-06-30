"use strict"

// IMPORTS
import View from './view.js';
import Drone from './drone.js';
import {Block, Paddle} from './block.js';

export default class Game {
	constructor (state = 'new') {
		this.state = state;
		this.score = 0;
		this.blocks = [];
		this.activeBlocks = [];
		this.blockCount;
		this.paddle;
		this.drones = [];
		this.activeDrone;
		this.view;
		this.LHUD;
		this.RHUD;
		this.THUD;
		this.BHUD;
		this.CHUD;
		this.prevTick;
		this.timer;
		this.resources = {
  		Iron: 0,
			Carbon: 0,
			Hydrogen: 0
		};
	}
	
	init() {
		this.score = 0;
		this.prevTick = Math.floor( Date.now() / 1000 );
		this.timer = 60;
		this.createGameScreen();
		this.createBlockGrid();
		this.createGamePaddle();
		this.equipDrone('temp');
		this.loadGameDrone();
	
		this.play();
	}
	
	updateTimer() {
		let now = Math.floor( Date.now() / 1000 );
		
		if ( now > this.prevTick  ) {
			this.timer -= 1;
			
			if ( this.timer <= 0 ){
				this.end('timeup');
			}
		}
		
		this.prevTick = Math.floor( Date.now() / 1000 );
	}
	
	update() {
		if (this.activeDrone.HP > 0) {
			this.checkBlockCollisions();
			this.getActiveBlocks();
			this.updateScore();
			this.updateTimer();
			this.updateHUD();
		} else if (this.drones.length >= 0) {
			this.loseLife();
		} 
	}
	
	equipDrone(type) {
		// STUB!!
		this.drones.push(new Drone(this.view, "#f0f", 10));
		this.drones.push(new Drone(this.view, "#f0f", 10));
		this.drones.push(new Drone(this.view, "#f0f", 10));
	}
	
	loadGameDrone() {
		this.activeDrone = this.drones.pop();
	}
	
	createGamePaddle() {
		this.paddle = new Paddle(this.view, 1, this.view.height - 21);
		this.blocks.push(this.paddle);
	}
	
	createGameScreen(height = 600, width = 800) {
		this.view = new View(height,width);
		this.view.init();
		
		this.LHUD = 50;
		this.RHUD = this.view.width - 50;
		this.THUD = 50;
		this.BHUD = this.view.height - 50;
		this.CHUD = this.view.width / 2;
	}
	
	createBlockGrid() {
		this.blocks = []; // reset
		
		// Calculate the grid space by view and block dimensions
		let gridY = 50,
				gridX = 10,
				blockWidth = 41,
				blockHeight = 21,
				gridHeight = this.view.height / 2,
				gridWidth = this.view.width - gridX * 2,
				blocksPerRow = Math.floor(gridWidth / blockWidth),
				rowCount = Math.floor(gridHeight / blockHeight);
		
		// Loop through rows
		let rowCounter = 0;
		while (rowCounter <= rowCount) {
			let currY = gridY + (blockHeight * rowCounter);
			
			// Loop through the blocks per row
			let blockCounter = 0;
			while (blockCounter < blocksPerRow) {
				let currX = gridX + (blockWidth * blockCounter),
						gapChance =  Math.random() * 100;
				if (gapChance >= 33) {
					this.blocks.push(new Block(this.view, currX, currY, "#aa8"));
				}
				blockCounter++;
			}
			
			rowCounter++;			
		}
	}
	
	getActiveBlocks() {
		this.activeBlocks = this.blocks.filter(
			function(block){
				return block.HP > 0;
			}
		);
		return this.activeBlocks;
	}
	
	
	checkBlockCollisions() {
		let game = this,
				drone = this.activeDrone,
				blocks = this.activeBlocks,
				collected;

		blocks.forEach(function(block) {
			collected = block.checkCollision(drone);
			
			if (collected != null) {
				game.collectResources(collected);
			}
		});
	}
	
	collectResources(collected) {
		let game = this;

		Object.keys(collected).forEach( function(resource){
			game.resources[resource] += collected[resource];
		});
	}
	
	loseLife() {
		if (this.drones.length > 0) {
			
			this.loadGameDrone();
			this.activeDrone.reset();
			this.paddle.reset();
			
		} else {		
			this.end('lose'); 
		}
	}
	
	updateScore() {
		let tempCount = this.activeBlocks.length - 1;
		if ( tempCount > 0) {
			if (this.blockCount && this.blockCount > tempCount ) {
				this.score += this.blockCount - tempCount;
			}
			this.blockCount = tempCount;
		} else {
			this.score += 1;
			this.end('win');
		}
	}
	
	
	// In-Game Display
	
	updateHUD() {
		this.view.screen.font = '16px sans-serif';
		
		let droneHUD = "Drones: " + this.drones.length;
		this.view.screen.fillText(droneHUD, this.LHUD, this.BHUD);
		
		let scoreHUD = "Score: " + this.score;
		let scoreHUDWidth = this.view.screen.measureText(scoreHUD);
		this.view.screen.fillText(scoreHUD, this.RHUD - scoreHUDWidth.width, this.BHUD);
		
		let timerHUD = this.timer;
		let timerHUDWidth = this.view.screen.measureText(timerHUD);
		this.view.screen.fillText(timerHUD, this.CHUD - timerHUDWidth.width, this.THUD - 20);
	}
	
	
	// State Changes
	
	new() {
		this.state = 'new';
	}
	
	pause() {
		this.state = 'pause';
	}
	
	play() {
		this.state = 'play';
	}
	
	end(condition) {
		this.state = 'end-' + condition;
		console.log('You collected ' + this.resources.Iron + " iron");
	}
}