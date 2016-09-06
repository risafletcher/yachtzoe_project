'use strict';

// global variables
var diceImages = ['images/dice_one.png', 'images/dice_two.png', 'images/dice_three.png', 'images/dice_four.png', 'images/dice_five.png', 'images/dice_six.png'];

var scoreOptions = ['Ones', 'Twos', 'Threes', 'Fours' , 'Fives', 'Sixes', '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YachtZoe', 'Chance'];

var thePlayers = ['Player 1', 'Player 2'];

var savedGameDataKey = 'SavedGameInfo';   // eslint-disable-line

//used to keep track of whose turn it is
var turnCounter = 0;

turn();

//this function determines whos turn it is. It renders a message at the top of the dice area and returns an ineger that corresponds to the player in thePlayers array;
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
  var playerTurn = turnCounter % thePlayers.length;
  var turnAlert = document.getElementById('turn');
  turnAlert.textContent = thePlayers[playerTurn] + '\'s turn';

  return playerTurn;
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
    //these will be moved to the point where the user selects the score but for the time being they will live here
    turnCounter += 1;
    turn();
    numberOfRolls = 0;
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
  // 3 of a Kind

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
      td.textContent = potentialScores[s];   // TODO put the associated players score here!!!
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

//this function will update the table with potential scoring options every time the dice are rolled.
function updateScoreTable() {
  //TODO we will need to put in a control flow about who's column to update once we have the turns logic worked out.
  var playerOneColumn = document.getElementsByClassName('player_one');
  var playerTwoColumn = document.getElementsByClassName('player_two');
  var currentColumn;
  var otherColumn;
  if (turn() === 0){
    currentColumn = playerOneColumn;
    otherColumn = playerTwoColumn;
  } else {
    currentColumn = playerTwoColumn;
    otherColumn = playerOneColumn;
  }
  for(var i = 0; i < scoreOptions.length; i++) {
    currentColumn[i].textContent = potentialScores[i];
    otherColumn[i].textContent = 0;
  }
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
localStorage.setItem('scores', scoresString);
// ===============> here to above noted comment should be deleted when ready.

function addScoreToHistory (playerName, playerScore) {  // eslint-disable-line
 // get the existing data, then append the new items to it.

 //retrieving stored scores and parsing back into array of objects
  var retrievedHistory = localStorage.getItem('scores');
  var oldScores = JSON.parse(retrievedHistory);

  var latestScore = new OldScores(playerName, playerScore);
  oldScores.push(latestScore);

  //putting newly updated data array into local storage
  var newScoresString = JSON.stringify(oldScores);
  localStorage.setItem('scores', newScoresString);
};
