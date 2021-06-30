"use strict"

import Game from './game.js';

// GAME CONFIG
let game = new Game();


// IN-GAME EVENT LISTENERS
document.addEventListener('keydown', function(e){
	e.preventDefault();
	
	if (game.state === 'play') {
		switch (e.keyCode) {
			case 68: // D
			case 39: // Right Arrow
				game.paddle.moveRight();
				break;
			case 65: // A
			case 37: // Left Arrow
				game.paddle.moveLeft();
				break;
			case 192: // ` tilda
				game.state = "pause";
				break;
		}
	}
});

document.addEventListener('keyup', function(e){
	e.preventDefault();
	
	if (game.state === 'play') {
		switch (e.keyCode) { // find the new non-deprecated method
			case 68: // D
			case 65: // A
			case 37: // Left Arrow
			case 39: // Right Arrow
				game.paddle.stop();
				break;
		}
	}
});


// GAME LOOP
function runGameLoop() {
	if (game.state === 'play') {
			game.view.clearCanvas();
			game.paddle.update();
			game.activeDrone.update(game.getActiveBlocks());
			game.activeBlocks.forEach(function(block) {
				block.update();
			});
			if (game.activeDrone.alive == false) {
				game.loseLife();
			}
			game.update();
			requestAnimationFrame(runGameLoop);
	} else if (game.state.startsWith('end-')) {
		switch (game.state) {
			case 'end-timeup':
				showEndRound();
				break;
			case 'end-lose':
				showLose();
				break;
			case 'end-win':
				showWin();
				break;
		}
	} else if (game.state === 'pause') {
		showPause();
	}
}
//var gameLoop = 
runGameLoop(); //setInterval(update, 10); //wonder if this update interval can be controlled by rAF instead...


// NON-PLAY SCREEN LOGIC
function readyNonPlayScreen(clearCanvas = true) {
	// clearInterval(gameLoop); // if I move this to rAF, I would need to adjust this as well
	if (clearCanvas) {
		game.view.clearCanvas();
	}
	// TODO $('.non-play-screens .screen').addClass('hidden');
	// TODO $('.non-play-screens').removeClass('hidden');
}
function showEndRound() {
	readyNonPlayScreen();
	// TODO $('.end-timeup.screen').removeClass('hidden');
}
function showWin() {
	readyNonPlayScreen();
	// TODO $('.end-win.screen').removeClass('hidden');
}
function showLose() {
	readyNonPlayScreen();
	// TODO $('.end-lose.screen').removeClass('hidden');
}
function showPause() {
	readyNonPlayScreen(false);
	// TODO $('.non-play-screens').addClass('overlay');
	// TODO $('.pause.screen').removeClass('hidden');
}
function showGameScreen(isNew = true) {
	$('.non-play-screens').addClass('hidden');
	if (isNew) {
		game.init();
	}
	runGameLoop();
	/*
	clearInterval(gameLoop);
	gameLoop = setInterval(update, 10);
	*/
}
function unpause() {
	game.state = "play";
	showGameScreen(false);
	// TODO $('.non-play-screens').removeClass('overlay');
}

// TODO $('.new-game .play').on('click', showGameScreen);
// TODO $('.end-timeup .play').on('click', showGameScreen);
// TODO $('.end-win .play').on('click', showGameScreen);
// TODO $('.end-lose .play').on('click', showGameScreen);
// TODO $('.pause .play').on('click', unpause);