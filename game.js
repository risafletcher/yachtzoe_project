'use strict';

// global variables
var diceImages = ['images/dice_one.png', 'images/dice_two.png', 'images/dice_three.png', 'images/dice_four.png', 'images/dice_five.png', 'images/dice_six.png'];

var scoreOptions = ['Ones', 'Twos', 'Threes', 'Fours' , 'Fives', 'Sixes', '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YachtZoe', 'Chance'];

var thePlayers = ['Will', 'Risa'];

function Scores (name, score) {
  this.name = name,
  this.score = score,

  score = [['Ones'], ['Twos'], ['Threes'], ['Fours'], ['Fives'], ['Sixes'], ['3 of a Kind'], ['4 of a Kind'], ['Full House'], ['Small Straight'], ['Large Straight'], ['YachtZoe'], ['Chance']];
}

var savedScores = [];
savedScores.push(new Scores('Will', 5));

var scoresDataString = JSON.stringify(savedScores);
localStorage.setItem('pastScores', scoresDataString);

function addScoreLocal (name, score) {
  var retrievedScores = localStorage.getItem('pastScores');
  var lastScore = JSON.parse(retrievedScores);

  var newScore = new Scores(name, score);
  lastScore.push(newScore);

  var newScoreString = JSON.stringify(lastScore);
  localStorage.setItem('pastScores', newScoreString);
};

var saveButton = document.getElementById('save_progress');

saveButton.addEventListener('click', addScoreLocal());


// this is where a set of dice is rolled to get random values.
var dice = [];          // array of rolled dice.
var numberOfRolls = 0;  // current number of rolls
var maxNbrRolls = 3;    // maximum number of times a player can roll the dice.
var scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];  // eslint-disable-line
var potentialScores = [0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50];

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

  //Hide button before click

  var rollFirstClick = document.getElementById('hold_dice_array');
  rollFirstClick.addEventListener('click', showHolds());

  function showHolds() {
    document.getElementById('hold_dice_array').setAttribute('class', 'hideFirst show_me');
  }

  //End hide button before click


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
}

function randomNbrGen() {
  // generates a random number from 1 to 6, to simulate the roll of a die.
  var random = Math.floor((Math.random() * 6) + 1);
  return random;
}

function calcScoreChoices () {
  // logic to calculate the possible scores to apply
  // zero out the array before starting.
  potentialScores = [0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50];

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
  for(var i = 0; i < scoreOptions.length; i++) {
    playerOneColumn[i].textContent = potentialScores[i];
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
