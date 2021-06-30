class View {
  constructor(height, width) {
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

class Drone {
  constructor(view, color, size) {
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
    this.view.screen.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
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
      this.velY = -this.velY;
    }
  }

  bounceX() {
    if (this.updateCounter - this.lastBounceX > 1) {
      this.lastBounceX = this.updateCounter;
      this.bounceCount++;
      this.velX = -this.velX;
    }
  }

  takeDamage(source) {
    // take different amounts of damage by source & type
    //this.HP -= source.damage['physical'];
    //this.HP -= source.damage['energy'];
    //this.HP -= source.damage['chemical'];
    this.HP -= 1;

    if (this.HP <= 0) {
      this.destroy();
    }

    return this.HP;
  }

  destroy() {// animations
    // sounds
  }

  reset() {
    this.x = this.view.width / 2 + (Math.random() * 10 - 5);
    this.y = this.view.height - this.size * 12;
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

    if (this.x + this.size >= this.view.width || this.x - this.size <= 0) {
      this.bounceX();
    }

    if (this.y + this.size >= this.view.height) {
      this.takeDamage("OutOfBounds");
    } else if (this.y - this.size <= 0) {
      this.bounceY();
    }
  }

}

class Block {
  constructor(view, x, y, color = "#aaa") {
    this.view = view;
    this.x = x;
    this.y = y;
    this.color = color;
    this.velX = 0; // horizontally stationary

    this.velY = 0; // vertically stationary

    this.height = 20;
    this.width = 40;
    this.resourceCount = 1;
    this.resources = {
      // resources granted when destroyed
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

    if (drone.x + drone.size + 1 > pos.leftEdge && drone.x - drone.size + 1 < pos.rightEdge && drone.y + drone.size + 1 > pos.topEdge && drone.y - drone.size + 1 < pos.bottomEdge) {
      // do whatever we gotta do when this kind of block is hit
      harvest = block.collisionExt(drone, pos); // contact made at the top or bottom

      if (drone.x + drone.size > pos.leftEdge && drone.x - drone.size < pos.rightEdge) {
        drone.bounceY(); // contact made at the left or right
      } else if (drone.y + drone.size > pos.topEdge && drone.y - drone.size < pos.bottomEdge) {
        drone.bounceX(); // contact made at a corner
      } else {
        drone.bounceY();
        drone.bounceX();
      }
    }

    return harvest;
  } // Take any collision actions specific to this block type


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
    types.forEach(function (type) {
      block.HP -= source.damage[type];
    });

    if (this.HP <= 0) {
      this.destroy();
      retVal = this.resources;
    }

    return retVal;
  }

  destroy() {// animations
    // sounds
  }

  checkBounds() {
    this.x = this.x < 1 ? 1 : this.x;
    this.y = this.y < 1 ? 1 : this.y;

    if (this.x + this.width > this.view.width) {
      this.x = this.view.width - this.width + 1;
    }

    if (this.y + this.height > this.view.height) {
      this.y = this.view.height - this.height + 1;
    }
  }

}
class Paddle extends Block {
  constructor(view) {
    super(view, 0, 0);
    this.width = 80;
    this.height = 5;
    this.color = "#0af";
    this.HP = 5; // right now, this doesn't matter, but it definitely *could* come into play

    this.reset();
  }

  reset() {
    this.x = this.view.width / 2 - this.width / 2;
    this.y = this.view.height - (this.height + 1);
    this.velX = 0;
    this.velY = 0;
  }

  collisionExt(source, position) {
    // apply a small horz velocity to drone when it hits the edges
    if (Math.abs(source.velX) <= source.maxSpeed / 2) {
      if (source.x + source.size < position.halfWidth) {
        source.velX -= Math.random() * source.maxSpeed / 2;
      } else if (source.x - source.size > position.halfWidth) {
        source.velX += Math.random() * source.maxSpeed / 2;
      } else if (source.bounceCount == 0) {
        source.velX = Math.random() * 2 - 1;
      }
    } // transfer horz velocity from the paddle


    if (Math.abs(this.velX) > 0) {
      if (this.velX < 0) {
        source.velX -= 1;
      } else {
        source.velX += 1;
      } // don't let the velX exceed the drone's max speed


      if (Math.abs(source.velX) > source.maxSpeed) {
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

class Game {
  constructor(state = 'new') {
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
    this.prevTick = Math.floor(Date.now() / 1000);
    this.timer = 60;
    this.createGameScreen();
    this.createBlockGrid();
    this.createGamePaddle();
    this.equipDrone('temp');
    this.loadGameDrone();
    this.play();
  }

  updateTimer() {
    let now = Math.floor(Date.now() / 1000);

    if (now > this.prevTick) {
      this.timer -= 1;

      if (this.timer <= 0) {
        this.end('timeup');
      }
    }

    this.prevTick = Math.floor(Date.now() / 1000);
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
    this.view = new View(height, width);
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
        rowCount = Math.floor(gridHeight / blockHeight); // Loop through rows

    let rowCounter = 0;

    while (rowCounter <= rowCount) {
      let currY = gridY + blockHeight * rowCounter; // Loop through the blocks per row

      let blockCounter = 0;

      while (blockCounter < blocksPerRow) {
        let currX = gridX + blockWidth * blockCounter,
            gapChance = Math.random() * 100;

        if (gapChance >= 33) {
          this.blocks.push(new Block(this.view, currX, currY, "#aa8"));
        }

        blockCounter++;
      }

      rowCounter++;
    }
  }

  getActiveBlocks() {
    this.activeBlocks = this.blocks.filter(function (block) {
      return block.HP > 0;
    });
    return this.activeBlocks;
  }

  checkBlockCollisions() {
    let game = this,
        drone = this.activeDrone,
        blocks = this.activeBlocks,
        collected;
    blocks.forEach(function (block) {
      collected = block.checkCollision(drone);

      if (collected != null) {
        game.collectResources(collected);
      }
    });
  }

  collectResources(collected) {
    let game = this;
    Object.keys(collected).forEach(function (resource) {
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

    if (tempCount > 0) {
      if (this.blockCount && this.blockCount > tempCount) {
        this.score += this.blockCount - tempCount;
      }

      this.blockCount = tempCount;
    } else {
      this.score += 1;
      this.end('win');
    }
  } // In-Game Display


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
  } // State Changes


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

let game = new Game(); // IN-GAME EVENT LISTENERS

document.addEventListener('keydown', function (e) {
  e.preventDefault();

  if (game.state === 'play') {
    switch (e.keyCode) {
      case 68: // D

      case 39:
        // Right Arrow
        game.paddle.moveRight();
        break;

      case 65: // A

      case 37:
        // Left Arrow
        game.paddle.moveLeft();
        break;

      case 192:
        // ` tilda
        game.state = "pause";
        break;
    }
  }
});
document.addEventListener('keyup', function (e) {
  e.preventDefault();

  if (game.state === 'play') {
    switch (e.keyCode) {
      case 68: // D

      case 65: // A

      case 37: // Left Arrow

      case 39:
        // Right Arrow
        game.paddle.stop();
        break;
    }
  }
}); // GAME LOOP

function runGameLoop() {
  if (game.state === 'play') {
    game.view.clearCanvas();
    game.paddle.update();
    game.activeDrone.update(game.getActiveBlocks());
    game.activeBlocks.forEach(function (block) {
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
} //var gameLoop = 


runGameLoop(); //setInterval(update, 10); //wonder if this update interval can be controlled by rAF instead...
// NON-PLAY SCREEN LOGIC

function readyNonPlayScreen(clearCanvas = true) {
  // clearInterval(gameLoop); // if I move this to rAF, I would need to adjust this as well
  if (clearCanvas) {
    game.view.clearCanvas();
  }

  $('.non-play-screens .screen').addClass('hidden');
  $('.non-play-screens').removeClass('hidden');
}

function showEndRound() {
  readyNonPlayScreen();
  $('.end-timeup.screen').removeClass('hidden');
}

function showWin() {
  readyNonPlayScreen();
  $('.end-win.screen').removeClass('hidden');
}

function showLose() {
  readyNonPlayScreen();
  $('.end-lose.screen').removeClass('hidden');
}

function showPause() {
  readyNonPlayScreen(false);
  $('.non-play-screens').addClass('overlay');
  $('.pause.screen').removeClass('hidden');
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
  $('.non-play-screens').removeClass('overlay');
}

$('.new-game .play').on('click', showGameScreen);
$('.end-timeup .play').on('click', showGameScreen);
$('.end-win .play').on('click', showGameScreen);
$('.end-lose .play').on('click', showGameScreen);
$('.pause .play').on('click', unpause);
