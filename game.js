'use strict';

// global variables
var diceImages = ['images/dice_one.png', 'images/dice_two.png', 'images/dice_three.png', 'images/dice_four.png', 'images/dice_five.png', 'images/dice_six.png'];

var scoreOptions = ['Ones', 'Twos', 'Threes', 'Fours' , 'Fives', 'Sixes', '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YachtZoe', 'Chance'];

var thePlayers;
var dice = [];          // array of rolled dice.
var numberOfRolls = 0;  // current number of rolls
var maxNbrRolls = 3;    // maximum number of times a player can roll the dice.
var potentialScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// dummied data for totalling.
var dummyScores = [];

// global variables used as local storage keys
var savedGameDataKey = 'SavedGameInfo';
var storedPlayerKey = 'players';
var pastScoresKey = 'pastScores';
var oldScoresKey = 'oldScores';

getPlayerInfo();

function getPlayerInfo () {
  //retrieving stored player names and parsing back into array
  var retrievedPlayers = localStorage.getItem(storedPlayerKey);
  thePlayers = JSON.parse(retrievedPlayers);
}

//this variable keeps track of whose turn it is (0 means first player, 1 means seccond).
var playerTurn = 0;

function Scores (name) {
  this.name = name,
  this.score = [['Ones'], ['Twos'], ['Threes'], ['Fours'], ['Fives'], ['Sixes'], ['3 of a Kind'], ['4 of a Kind'], ['Full House'], ['Small Straight'], ['Large Straight'], ['YachtZoe'], ['Chance']];
}

//used to keep track of how many turns have passed(may be usefull in determining when to end the game)
var turnCounter = 0;

//calling turn function to begin first turn
turn();

//this function determines whos turn it is. It renders a message at the top of the dice area and returns an integer that corresponds to the player in thePlayers array;
function turn() {
  //insures that the player cannot hold any of the duce from the previous turn
  var holds = document.getElementById('hold_dice_array');
  holds.setAttribute('class', 'hide_me');

  //uncheck the previous players boxes
  uncheckBoxes();

  //reactivates roll button
  var rollButton = document.getElementById('roll_dice');
  rollButton.disabled = false;

  //decides which player to display at the top of screen
  playerTurn = turnCounter % thePlayers.length;
  var turnAlert = document.getElementById('turn');
  turnAlert.textContent = thePlayers[playerTurn] + '\'s turn';

}

//this function unchecks the previously selected boxes between turns
function uncheckBoxes() {
  var boxes = document.getElementsByClassName('hold_dice');
  for(var i = 0; i < boxes.length; i++){
    if (boxes[i].checked == true){
      boxes[i].checked = false;
    }
  }
}


var savedScores = [];
savedScores.push(new Scores('Will'));

var scoresDataString = JSON.stringify(savedScores);
localStorage.setItem(pastScoresKey, scoresDataString);

function addScoreLocal (name) {
  var retrievedScores = localStorage.getItem('pastScores');
  var lastScore = JSON.parse(retrievedScores);

  var newScore = new Scores(name);
  lastScore.push(newScore);

  var newScoreString = JSON.stringify(lastScore);
  localStorage.setItem(pastScoresKey, newScoreString);
};

var saveButton = document.getElementById('save_progress');

saveButton.addEventListener('click', addScoreLocal());


// this is where a set of dice is rolled to get random values.

// generate the initial score table
createScoreTable();

// Initial roll for a turn, gets all 5 dice.
var rollButton = document.getElementById('roll_dice');

rollButton.addEventListener('click', rollDiceHandler);

function rollDiceHandler() {
  // handle the clicks of the roll dice button.

  var holds = document.getElementById('hold_dice_array');
  holds.setAttribute('class', 'show_me');
  var diceLI = document.getElementsByClassName('the_dice');
  var holdCBox = document.getElementsByClassName('hold_dice');

  for (var d = 0; d < diceLI.length; d++) {
    if (!holdCBox[d].checked) {
      var randomDie = randomNbrGen();
      diceLI[d].textContent = '';
      var img = document.createElement('img');
      img.setAttribute('src', diceImages[randomDie - 1]);
      diceLI[d].appendChild(img);
      dice[d] = randomDie;
    } else {
      // nothing?? Is there anything to do in this case?
    }
  }

  calcScoreChoices();
  updateScoreTable();

  numberOfRolls += 1;
  if (numberOfRolls >= maxNbrRolls) {
    rollButton.disabled = true;
  }
  console.log(numberOfRolls);
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
  var countOfDice = [0, 0, 0, 0, 0, 0];

  for (var i = 0; i < dice.length; i++) {
    if (dice[i] === 1) {
      potentialScores[0] += 1;
      countOfDice[0] += 1;
    } else if (dice[i] === 2) {
      potentialScores[1] += 2;
      countOfDice[1] += 1;
    } else if (dice[i] === 3) {
      potentialScores[2] += 3;
      countOfDice[2] += 1;
    } else if (dice[i] === 4) {
      potentialScores[3] += 4;
      countOfDice[3] += 1;
    } else if (dice[i] === 5) {
      potentialScores[4] += 5;
      countOfDice[4] += 1;
    } else if (dice[i] === 6) {
      potentialScores[5] += 6;
      countOfDice[5] += 1;
    };
  };

  // 3 of a Kind - at least 3 of the same, total all dice
  if (countOfDice.some(is3Count) || countOfDice.some(is4Count) || countOfDice.some(is5Count)) {
    // we have a 3-of-a-kind, 4-of-a-kind or a YachtZoe
    // all count for 3-of-a-kind.
    for (i = 0; i < countOfDice.length; i++) {
      // total all the dice, put into the 4-of-a-kind bucket.
      potentialScores[6] += potentialScores[i];
    };
  };

  // 4 of a Kind - at least 4 of the same, total all dice
  if (countOfDice.some(is4Count) || countOfDice.some(is5Count)) {
    // we have a 4-of-a-kind or a YachtZoe
    // both count as 4-of-a-kind.
    for (i = 0; i < countOfDice.length; i++) {
      // total all the dice, put into the 4-of-a-kind bucket.
      potentialScores[7] += potentialScores[i];
    };
  };

  // Full House - at least 3 of the same and a pair, 25 pts
  if ((countOfDice.some(is3Count) && countOfDice.some(is2Count)) || countOfDice.some(is5Count)) {
    potentialScores[8] = 25;
  };

  // Small Straight - four consecutive dice, 30 pts
  if ( ((countOfDice[0] === 1 || countOfDice[0] === 2) && (countOfDice[1] === 1 || countOfDice[1] === 2) && (countOfDice[2] === 1 || countOfDice[2] === 2) && (countOfDice[3] === 1 || countOfDice[3] === 2)) || ((countOfDice[1] === 1 || countOfDice[1] === 2) && (countOfDice[2] === 1 || countOfDice[2] === 2) && (countOfDice[3] === 1 || countOfDice[3] === 2) && (countOfDice[4] === 1 || countOfDice[4] === 2)) || ((countOfDice[2] === 1 || countOfDice[2] === 2) && (countOfDice[3] === 1 || countOfDice[3] === 2) && (countOfDice[4] === 1 || countOfDice[4] === 2) && (countOfDice[5] === 1 || countOfDice[5] === 2)) || countOfDice.some(is5Count) ){
    potentialScores[9] = 30;
  };

  // Large Straight - five consecutive dice, 40 pts
  if ((countOfDice[0] === 1 && countOfDice[1] === 1 && countOfDice[2] === 1 && countOfDice[3] === 1 && countOfDice[4] === 1) || (countOfDice[1] === 1 && countOfDice[2] === 1 && countOfDice[3] === 1 && countOfDice[4] === 1 && countOfDice[5] === 1) || (countOfDice.some(is5Count))) {
    // we have a straight!
    potentialScores[10] = 40;
  };

  // YachtZoe - all 5 dice the same, 50 pts
  if (countOfDice.some(is5Count)) {
    // we have a YachtZoe!
    potentialScores[11] = 50;
  };

  // Chance - total all dice.
  for (i = 0; i < countOfDice.length; i++) {
    // total all the dice, put into the 4-of-a-kind bucket.
    potentialScores[12] += potentialScores[i];
  };
}

function is2Count (element) {
  return element === 2;
}

function is3Count (element) {
  return element === 3;
}

function is4Count (element) {
  return element === 4;
}

function is5Count (element) {
  return element === 5;
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
      if(p === 0) {
        td.setAttribute('class', 'player_one');
      } else {
        td.setAttribute('class', 'player_two');
      }
      td.textContent = potentialScores[s];
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

  var idName = '';
  for (p = 0; p < thePlayers.length; p++) {
    // create a column entry for each player's total.
    var tdFoot = document.createElement('td');
    tdFoot.textContent = 0;
    if (p === 0) {
      idName = 'player_one_total';
    } else {
      idName = 'player_two_total';
    };
    tdFoot.setAttribute('id', idName);
    footRow.appendChild(tdFoot);
  };

  // put the footer in the table.
  scoreFooter.appendChild(footRow);
  scoreTable.appendChild(scoreFooter);

  // now put the table into the document.
  var scoreTableMain = document.getElementById('the_scores');
  scoreTableMain.appendChild(scoreTable);
}

//this function will update the table with potential scoring options every time the dice are rolled.
function updateScoreTable() {

  var playerOneColumn = document.getElementsByClassName('player_one');
  var playerTwoColumn = document.getElementsByClassName('player_two');
  var currentColumn;
  var otherColumn;

  if(thePlayers.length === 1){
    for(var i = 0; i < scoreOptions.length; i++) {
      playerOneColumn[i].textContent = potentialScores[i];
      playerOneColumn[i].setAttribute('class', 'player_one clickable');
      playerOneColumn[i].addEventListener('click', chooseScore);
    }
  } else {
    //this uses the turnCounter var to determine which players column to display the potential scores on
    if (playerTurn === 0){
      currentColumn = playerOneColumn;
      otherColumn = playerTwoColumn;
    } else {
      currentColumn = playerTwoColumn;
      otherColumn = playerOneColumn;
    }
    for( i = 0; i < scoreOptions.length; i++) {
      var scoreCell = currentColumn[i];
      var playerClass = scoreCell.getAttribute('class');

      scoreCell.textContent = potentialScores[i];
      scoreCell.setAttribute('class', playerClass + ' clickable');
      scoreCell.addEventListener('click', chooseScore);
      otherColumn[i].textContent = 0;
      console.log(scoreCell);
    }
  }
}


function chooseScore(e) {
  var click = e.target.textContent;
  var roundScore = parseInt(click);
  console.log(roundScore);

  //this causes the turn to end when the user selects their score
  turnCounter += 1;
  turn();
  numberOfRolls = 0;

  // the end of the game happens when each player has completed 13 turns
  if (turnCounter / thePlayers.length === 13) {
    // the game is over.
    endOfGame();
  };

}

function endOfGame () {
  // do end of game actions here.....

  // dummy the data...
  dummyScores.push(new Scores('Jane'));
  dummyScores.push(new Scores('WTF'));
  for (var idx = 0; idx < dummyScores.length; idx++) {
    for (var scIdx = 0; scIdx < 13; scIdx++) {
      dummyScores[idx].score[scIdx] = scIdx + 5;
    };
  };

  totalPlayersScores();
}

function totalPlayersScores() {
  // loop through the players array, then for each, loop through scores to total.
  // update the td element.
  var idForPlayer = 'player_one_total';
  var playerTotal = 0;
  var footTotal;
  for (var i = 0; i < thePlayers.length; i++) {
    playerTotal = 0;  // start each player with a zero total.
    if (i > 0) idForPlayer = 'player_two_total';
    footTotal = document.getElementById(idForPlayer);
    for (var s = 0; s < dummyScores[i].score.length; s++) {
      playerTotal += dummyScores[i].score[s];
    };
    footTotal.textContent = playerTotal;

    // also put that data into local storage.
    addScoreToHistory(dummyScores[i].name, playerTotal);
  };

}

// store completed game data for use by leaderboard...
//in order for high score to be calulated we must access local storage and pull score objects with name and score attribute. We may add time later
function OldScores (name, score) {
  this.playerName = name;
  this.gameScore = score;
  this.gameTime;
}
//  =============> from here to noted comment below, delete when dummy data no longer needed.
//this array of score objects is being used a placeholder for the time being
var pastScores = [];
pastScores.push(new OldScores('Jane', 100));
pastScores.push(new OldScores('cat', 5000));
pastScores.push(new OldScores('Will', 100));
pastScores.push(new OldScores('John', 300));
pastScores.push(new OldScores('Risa', 1000));
pastScores.push(new OldScores('Bill', 400));
pastScores.push(new OldScores('Will', 1200));

//putting dummied data array into local storage
var scoresString = JSON.stringify(pastScores);
localStorage.setItem(oldScoresKey, scoresString);
// ===============> here to above noted comment should be deleted when ready.

function addScoreToHistory (playerName, playerScore) {
  // get the existing data, then append the new items to it.

  //retrieving stored scores and parsing back into array of objects
  var oldScores = [];
  var retrievedHistory = localStorage.getItem(oldScoresKey);
  oldScores = JSON.parse(retrievedHistory);

  var latestScore = new OldScores(playerName, playerScore);
  oldScores.push(latestScore);

  //putting newly updated data array into local storage
  var newScoresString = JSON.stringify(oldScores);
  localStorage.setItem(oldScoresKey, newScoresString);
};
