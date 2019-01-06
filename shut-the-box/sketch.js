var wt; // width of the canvas
var ht; // height of the canvas
var game; // game to track during play
var status = 0; // status of the game:
// 0 - ready to roll
// 1 - ready to pick
// 2 - game end
var diceRoll = []; // array of current dice roll
var dice = []; // array of dice objects for current roll
var availablePlays = []; // array of plays available based on the current roll
// and state of the game
var numTiles = 12; // number of tiles in this game
var onMobile = false; // when on mobile, disable some visualization features
var soundRoll, soundClick, soundWin, soundLose;
var soundPlayed = false;

// class to create sound elements
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}

// initial setup
function setup() {
  wt = Math.min(windowWidth, windowHeight);
  ht = wt;

  soundRoll = new sound('../assets/roll.wav');
  soundClick = new sound('../assets/click.wav');
  soundWin = new sound('../assets/win.wav');
  soundLose = new sound('../assets/lose.wav');

  onMobile = mobileAndTabletCheck();
  createCanvas(wt, ht);
  game = new Game(numTiles, 2, 2)
  // when on mobile, don't loop constantly
  // instead selectively draw after key actions
  if (onMobile) {
    noLoop()
    draw();
  }
}

// Determine if the user is on mobile or not
// Credit: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobileAndTabletCheck() {
  var check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

// update canvas size appropriately
function windowResized() {
  wt = Math.min(windowWidth, windowHeight);
  ht = wt;
  resizeCanvas(wt, ht);
}

// drawing calls - called in a loop
function draw() {
  clear();
  background(51);
  drawGame();
  drawScore();
  drawDiceButton();
  drawGameModeButton();
  drawDice();
  checkGame();
}

// draw the tiles across the top third of the canvas
function drawGame() {
  for (var i = 0; i < game.tiles.length; i++) {
    this.drawTile(i, game.tiles[i]);
  }
}

// draw the score (bottom right of canvas)
function drawScore() {
  textSize(wt * 0.03);
  fill(255, 255, 255);
  text("Score: " + game.getScore(), wt * 0.90, ht * 0.98);
}

// check whether the game is a win or a loss
function checkGame() {
  if (game.isWin()) {
    status = 2;
    if (!soundPlayed) {
      soundWin.play();
      soundPlayed = true;
    }
    drawWin();
  } else if (status > 0 && game.isLoss(diceRoll)) {
    status = 2;
    if (!soundPlayed) {
      soundLose.play();
      soundPlayed = true;
    }
    drawLoss();
  }
}

// draw losing game splash
function drawLoss() {
  textAlign(CENTER);
  textSize(wt * 0.10);
  strokeWeight(6);
  fill(200, 0, 0);
  text("Sorry, you lose!", wt / 2, ht / 2);
  strokeWeight(1);
}

// draw winning game splash
function drawWin() {
  textAlign(CENTER);
  textSize(wt * 0.10);
  strokeWeight(6);
  fill(0, 200, 0);
  text("YOU WIN!", wt / 2, ht / 2);
  strokeWeight(1);
}

// draws the given tile at the given index
function drawTile(index, tile) {
  var offset = Math.floor((wt / game.tiles.length) * 0.10);
  var xpos = Math.floor(wt / game.tiles.length) * index + offset;
  var ypos = Math.floor(ht / 3);
  var w = Math.floor((wt / game.tiles.length) * 0.95);
  var h = -(Math.floor(ht / 3));

  // draw a squatty tile if it has been dropped
  if (tile.isDown) {
    ypos = 0;
    h = Math.floor(ht / 10);
  }

  // change tile color if it can be played and the mouse is on top of it
  fill(139, 69, 19);
  if (tileIsSelected(tile)) {
    fill(180, 90, 24);
  }

  rect(xpos, ypos, w, h);

  // if the tile hasn't been dropped, draw its value
  if (!tile.isDown) {
    textAlign(CENTER);
    fill(0, 0, 0);
    textSize(wt * 0.05);
    text(tile.tileNumber, xpos + (w / 2), ypos + (h / 2));
  }
}

// returns whether the tile is selected
// tiles aren't selected if they are dropped
// tiles aren't selected unless the state of the game allows it
// tiles aren't selected unless they are part of a valid play
function tileIsSelected(tile) {
  if (tile.isDown) {
    return false;
  } else if (status != 1) {
    return false;
  } else if (tileIsInAvailablePlay(tile.tileNumber)) {
    var availablePlay = getAvailablePlayForTile(tile.tileNumber);
    var isSelected = false;
    for (var i = 0; i < availablePlay.length; i++) {
      if (mouseIsOnTile(availablePlay[i])) {
        isSelected = true;
      }
    }
    return isSelected;
  } else {
    return false;
  }
}

// given a tile number, determine if it is part of an available play
function tileIsInAvailablePlay(tileNumber) {
  for (var i = 0; i < availablePlays.length; i++) {
    for (var j = 0; j < availablePlays[i].length; j++) {
      if (availablePlays[i][j] == tileNumber) {
        return true;
      }
    }
  }
  return false;
}

// retrieve the available play for a given tile
function getAvailablePlayForTile(tileNumber) {
  for (var i = 0; i < availablePlays.length; i++) {
    for (var j = 0; j < availablePlays[i].length; j++) {
      if (availablePlays[i][j] == tileNumber) {
        return availablePlays[i];
      }
    }
  }
  return [];
}

// determine if the mouse is on the given tilenumber
function mouseIsOnTile(tileNumber) {
  var index = tileNumber - 1;

  var offset = Math.floor((wt / game.tiles.length) * 0.10);
  var xpos = Math.floor(wt / game.tiles.length) * index + offset;
  var ypos = Math.floor(ht / 3);
  var w = Math.floor((wt / game.tiles.length) * 0.95);
  var h = -(Math.floor(ht / 3));

  return ((mouseX >= xpos) && (mouseX <= (xpos + w))) &&
    ((mouseY <= ypos) && (mouseY >= ypos + h));
}

// draws the roll dice button in the bottom right of the canvas
function drawDiceButton() {
  fill(210, 210, 210);
  if (diceButtonSelected()) {
    fill(230, 230, 230);
  }
  rect(wt * 0.01, ht * 0.90, wt * 0.15, ht * 0.09);

  textAlign(CENTER);
  fill(0, 0, 0);
  textSize(wt * 0.04);
  text("Roll", wt * 0.08, ht * 0.94);
  text("Dice", wt * 0.08, ht * 0.98);
}

// determines if the roll dice button is selected
function diceButtonSelected() {
  return ((mouseX >= (wt * 0.01) && mouseX <= (wt * 0.15)) &&
    (mouseY >= (ht * 0.90) && mouseY <= (ht * 0.99)) &&
    (status == 0));
}

// draws the game mode button in the middle bottom of the board
function drawGameModeButton() {
  fill(210, 210, 210);
  if (gameModeButtonSelected()) {
    fill(230, 230, 230);
  }

  rect(wt * 0.40, ht * 0.90, wt * 0.20, ht * 0.09);

  var gameModeString;
  switch (numTiles) {
    case 12:
      gameModeString = "9 Tile"
      break;
    default:
      gameModeString = "12 Tile"
  }
  textAlign(CENTER);
  fill(0, 0, 0);
  textSize(wt * 0.04);
  text("Switch to", wt * 0.50, ht * 0.94);
  text(gameModeString, wt * 0.50, ht * 0.98);
}

// determine if the game mode button is selected
function gameModeButtonSelected() {
  return ((mouseX >= (wt * 0.40) && mouseX <= (wt * 0.60)) &&
    (mouseY >= (ht * 0.90) && mouseY <= (ht * 0.99)));
}

// switches game mode from 9 to 12 and vice versa
// will restart the game
function switchGameMode() {
  switch (numTiles) {
    case 12:
      numTiles = 9;
      break;
    default:
      numTiles = 12;
  }
  restartGame();
}

// if the device is shaken and the game allows it, roll the dice
function deviceShaken() {
  if (status == 0) {
    rollDice();
  }
}

// handle mouse presses to roll dice, play a move, or restart the game
function mousePressed() {
  if (diceButtonSelected()) {
    rollDice();
  } else if (gameModeButtonSelected()) {
    switchGameMode();
  } else if (status == 1) {
    playMove();
  } else if (status == 2) {
    restartGame();
  }
}

// restarts the game
function restartGame() {
  status = 0;
  diceRoll = [];
  dice = [];
  availablePlays = [];
  game = new Game(numTiles, 2, 2);
  if (onMobile) {
    draw();
  }
  soundPlayed = false;
}

// plays the given move
function playMove() {
  var movePlayed = false;
  for (var i = 0; i < game.tiles.length; i++) {
    if (tileIsSelected(game.tiles[i])) {
      game.tiles[i].dropTile();
      soundClick.play();
      movePlayed = true;
    }
  }
  if (movePlayed) {
    status = 0;
  }
  if (onMobile) {
    draw();
  }
}

// rolls dice
function rollDice() {
  status = 1;
  diceRoll = game.getDiceRoll();
  initiateDice();
  availablePlays = game.getAvailablePlays(diceRoll);
  if (onMobile) {
    draw();
  }
  soundRoll.play();
}

// initiates dice objects for drawing later
function initiateDice() {
  dice = [];
  for (var i = 0; i < diceRoll.length; i++) {
    dice.push(new Die(diceRoll[i], wt, ht, dice));
  }
}

// draw the current dice objects
function drawDice() {
  for (var i = 0; i < dice.length; i++) {
    drawOneDie(dice[i]);
  }
}

// draw the given die object
function drawOneDie(die) {
  fill(255, 255, 255);
  rectMode(CENTER);
  rect(die.xpos, die.ypos, die.w, die.w, die.r);
  drawDieFace(die);
  rectMode(CORNER);
}

// draws the die face of the given die object
function drawDieFace(die) {
  fill(0, 0, 0);
  var r = wt * 0.012;
  switch (die.number) {
    case 1:
      ellipse(die.xpos, die.ypos, r, r);
      break;
    case 2:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      break;
    case 3:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 5), r, r);
      ellipse(die.xpos, die.ypos, r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 5), r, r);
      break;
    case 4:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos - (die.w / 4), r, r);
      break;
    case 5:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos, die.ypos, r, r);
      break;
    case 6:
      ellipse(die.xpos - (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos + (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos - (die.w / 4), r, r);
      ellipse(die.xpos + (die.w / 4), die.ypos, r, r);
      ellipse(die.xpos - (die.w / 4), die.ypos, r, r);
      break;
  }
}
