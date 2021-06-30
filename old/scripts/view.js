"use strict"

export default class View {
	constructor (height, width) {
		this.height = height;
		this.width = width;
		this.canvas = document.getElementById('GameScreen');
		this.screen = this.canvas.getContext('2d');
	}
	
	init() {
		this.canvas.setAttribute('height', this.height);
		this.canvas.setAttribute('width', this.width);
	}
	
	clearCanvas() {
		this.screen.clearRect(0, 0, this.width, this.height);
	}
}