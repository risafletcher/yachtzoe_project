'use strict';

// global variables
var diceImages = ['images/dice_one.png', 'images/dice_two.png', 'images/dice_three.png', 'images/dice_four.png', 'images/dice_five.png', 'images/dice_six.png'];  // eslint-disable-line

var scoreOptions = ['Ones', 'Twos', 'Threes', 'Fours' , 'Fives', 'Sixes', '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YachtZoe', 'Garbage'];

var thePlayers = ['Will', 'Risa'];

var savedGameDataKey = 'SavedGameInfo';   // eslint-disable-line

// create the savedGameObject here
function SavedGameData (player1, player2, p1Scores, p2Scores) {   // eslint-disable-line
  var playerName1 = player1;  // eslint-disable-line
  var playerName2 = player2;  // eslint-disable-line
  var p1ScoreArray = p1Scores;  // eslint-disable-line
  var p2ScoreArray = p2Scores;  // eslint-disable-line
}


// this is where a set of dice is rolled to get random values.
var dice = [];          // array of rolled dice.
var numberOfRolls = 0;  // current number of rolls
var maxNbrRolls = 3;    // maximum number of times a player can roll the dice.
var scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  // eslint-disable-line
var potentialScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// generate the initial score table
createScoreTable();


// Initial roll for a turn, gets all 5 dice.
var rollButton = document.getElementById('roll_dice');

rollButton.addEventListener('click', rollDiceHandler);


function rollDiceHandler() {
  // handle the clicks of the roll dice button.
  // Clear out the array...
  // dice = [];

  var diceLI = document.getElementsByClassName('the_dice');
  var holdCBox = document.getElementsByClassName('hold_dice');

  for (var d = 0; d < diceLI.length; d++) {
    if (!holdCBox[d].checked) {
      var randomDie = randomNbrGen();
      diceLI[d].textContent = randomDie;
      // diceLI[d].img.src = diceImages[randomDie];
      dice[d] = randomDie;
    } else {
      // nothing
    }
  }

  calcScoreChoices();

  numberOfRolls += 1;
  if (numberOfRolls >= maxNbrRolls) {
    rollButton.disabled = true;
  }
}

function randomNbrGen() {
  // generates a random number from 1 to 6, to simulate the roll of a die.
  var random = Math.floor((Math.random() * 6) + 1);
  return random;
}

function calcScoreChoices () {
  // logic to calculate the possible scores to apply
  // zero out the array before starting.
  potentialScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (var i = 0; i < dice.length; i++) {
    if (dice[i] === 1) {
      potentialScores[0] += 1;
    } else if (dice[i] === 2) {
      potentialScores[1] += 2;
    } else if (dice[i] === 3) {
      potentialScores[2] += 3;
    } else if (dice[i] === 4) {
      potentialScores[3] += 4;
    } else if (dice[i] === 5) {
      potentialScores[4] += 5;
    } else if (dice[i] === 6) {
      potentialScores[5] += 6;
    }
  }
}


function createScoreTable () {

  // create the table
  var scoreTable = document.createElement('table');


  var tableHeader = document.createElement('thead');
  var headerRow   = document.createElement('tr');
  var blankHdr    = document.createElement('th');

  // put the blank column header in first
  headerRow.appendChild(blankHdr);

  for (var p = 0; p < thePlayers.length; p++) {
    var playerHdr = document.createElement('th');
    playerHdr.textContent = thePlayers[p];
    headerRow.appendChild(playerHdr);
  }

  tableHeader.appendChild(headerRow);
  scoreTable.appendChild(tableHeader);

  var scoreBody = document.createElement('tbody');

  for (var s = 0; s < scoreOptions.length; s++) {
    // loop through all the score options and generate a row with label and player data
    // create the score row and it's header label.
    var tr = document.createElement('tr');
    var th = document.createElement('th');

    th.textContent = scoreOptions[s];
    tr.appendChild(th);

    for (p = 0; p < thePlayers.length; p++) {
      // create a column entry for each player.
      var td = document.createElement('td');
      td.textContent = 0;   // TODO put the associated players score here!!!
      tr.appendChild(td);
    }
    // put the row in the body.
    scoreBody.appendChild(tr);
  }

  scoreTable.appendChild(scoreBody);

  // create a foot with totals.
  var scoreFooter = document.createElement('tfoot');
  var footRow     = document.createElement('tr');
  var footHdr     = document.createElement('th');

  footHdr.textContent = 'Total:';
  footRow.appendChild(footHdr);

  for (p = 0; p < thePlayers.length; p++) {
    // create a column entry for each player's total.
    var tdFoot = document.createElement('td');
    tdFoot.textContent = 0;   // TODO put the associated players score here!!!
    footRow.appendChild(tdFoot);
  }

  // put the footer in the table.
  scoreFooter.appendChild(footRow);
  scoreTable.appendChild(scoreFooter);

  // now put the table into the document.
  var scoreTableMain = document.getElementById('the_scores');
  scoreTableMain.appendChild(scoreTable);
}
