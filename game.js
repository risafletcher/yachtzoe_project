'use strict';

// global variables
var diceImages = ['images/dice_one.png', 'images/dice_two.png', 'images/dice_three.png', 'images/dice_four.png', 'images/dice_five.png', 'images/dice_six.png'];

var scoreOptions = ['Ones', 'Twos', 'Threes', 'Fours' , 'Fives', 'Sixes', '3 of a Kind', '4 of a Kind', 'Full House', 'Small Straight', 'Large Straight', 'YachtZoe', 'Chance'];

var thePlayers;
var dice = [];          // array of rolled dice.
var numberOfRolls = 0;  // current number of rolls
var maxNbrRolls = 3;    // maximum number of times a player can roll the dice.
var potentialScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


// global variables used as local storage keys
var savedGameDataKey = 'SavedGameInfo';
var storedPlayerKey = 'players';
var oldScoresKey = 'oldScores';
//creating score objects for players and storing them in an array
var gameScores = [];

getPlayerInfo();

function getPlayerInfo () {
  //retrieving stored player names and parsing back into array
  var retrievedPlayers = localStorage.getItem(storedPlayerKey);
  thePlayers = JSON.parse(retrievedPlayers);
}

//this variable keeps track of whose turn it is (0 means first player, 1 means seccond).
var playerTurn = 0;
//used to keep track of how many turns have passed(may be usefull in determining when to end the game)
var turnCounter = 0;

function Scores (name) {
  this.name = name,
  this.score = [['Ones'], ['Twos'], ['Threes'], ['Fours'], ['Fives'], ['Sixes'], ['3 of a Kind'], ['4 of a Kind'], ['Full House'], ['Small Straight'], ['Large Straight'], ['YachtZoe'], ['Chance']];
}

function SaveGame() {
  this.name = '',
  this.playerData = [];
}

SaveGame.prototype.loadData = function (passedPlayerData) {
  for (var p = 0; p < passedPlayerData.length; p++) {
    if (this.name.length > 0) this.name += ' and ';
    this.name += passedPlayerData[p].name;
    this.playerData.push(passedPlayerData[p]);
  };
};


for(var i = 0; i < thePlayers.length; i++) {
  var user = new Scores(thePlayers[i]);
  gameScores.push(user);
}

//check if there are saved games got the same users

//put thePlayers array in the form of SavedGameInfo name
var currentPlayerCheck;

if(thePlayers.length === 1){
  currentPlayerCheck = gameScores[0].name;
} else {
  currentPlayerCheck = gameScores[0].name + ' and ' + gameScores[1].name;
}

var savedGamesString = localStorage.getItem(savedGameDataKey);

var savedGamesArray = JSON.parse(savedGamesString);


//check to see if annything is in saved games array

function checkForSavedGames() {
  if(savedGamesArray === null) {
  } else {
    for(i = 0; i < savedGamesArray.length; i++) {
      if(currentPlayerCheck === savedGamesArray[i].name) {
        var loadGameAnswer = prompt('You have a saved game. Would you like to resume it (answer "yes" or "no")?');
        loadGameAnswer = loadGameAnswer.toLowerCase();


        var newScoreString;
        if(loadGameAnswer === 'yes' || loadGameAnswer === 'y'){
          gameScores = [];
          for(var j = 0; j < savedGamesArray[i].playerData.length; j++) {
            gameScores.push(savedGamesArray[i].playerData[j]);
          }
          whoseTurnIsIt();
          showAlreadyScored();
          // delete the saved game so they cannot start there again, over and over
          // remove an old saved game.
          checkForOldSavedGame(savedGamesArray, currentPlayerCheck, true);
          // saved game removed from array, now put any remaining game data back
          newScoreString = JSON.stringify(savedGamesArray);
          localStorage.setItem(savedGameDataKey, newScoreString);
          break;
        } else if (loadGameAnswer === 'no' || loadGameAnswer === 'n') {
          alert('Warning your old game will be overwritten when you make another save');
          // remove an old saved game.
          checkForOldSavedGame(savedGamesArray, currentPlayerCheck, true);
          // saved game removed from array, now put any remaining game data back
          newScoreString = JSON.stringify(savedGamesArray);
          localStorage.setItem(savedGameDataKey, newScoreString);

          break;
        } else {
          alert('Sorry I don\'t understand your answer, I will just begin a new game for you.');
        }
      }
    }
  }
}


//function to change class of already saved scores.
function showAlreadyScored() {
  var columnOne = document.getElementsByClassName('player_one');
  var columnTwo = document.getElementsByClassName('player_two');

  //renders the already chosen scores for the first column
  for(var i = 0; i < scoreOptions.length; i++){
    if(gameScores[0].score[i].length > 1) {
      columnOne[i].textContent = gameScores[0].score[i][1];
      columnOne[i].setAttribute('class', 'player_one already_scored');
    } else {
      // columnOne[i].textContent = 0;
    }
  }
  if(thePlayers.length === 2) {
    //renders already chosen score for the seccond column
    for(i = 0; i < scoreOptions.length; i++) {
      if(gameScores[1].score[i].length > 1) {
        columnTwo[i].textContent = gameScores[1].score[i][1];
        columnTwo[i].setAttribute('class', 'player_two already_scored');
      } else {
        // columnOne[i].textContent = 0;
      }
    }
  }
}

function whoseTurnIsIt () {
  // starting from a set of players  playerTurn turnCounter
  var turnsCompleted = [];
  var simpleCount = 0;
  for (var idx = 0; idx < gameScores.length; idx++) {
    simpleCount = 0;
    for (var idx2 = 0; idx2 < gameScores[idx].score.length; idx2++) {
      if (gameScores[idx].score[idx2].length > 1){
        simpleCount += 1;  // these are the scores that already exist.
      }
    }
    turnsCompleted.push(simpleCount);
  }

  // now set the currentplayer based on what we found
  if(gameScores.length > 1 ) {
    if (turnsCompleted[0] > turnsCompleted[1]) {
      playerTurn = 1;
    } else {
      playerTurn = 0;
    };
    // also reset the turn counter
    turnCounter = turnsCompleted[0] + turnsCompleted[1];
  } else {
    playerTurn = 0;
    turnCounter = turnsCompleted[0];
  }
};



// generate the initial score table
createScoreTable();

//check for saved games with same player and load there game data
checkForSavedGames();

//calling turn function to begin first turn
turn();

//this function determines whos turn it is. It renders a message at the top of the dice area and returns an integer that corresponds to the player in thePlayers array;
function turn() {
  //ensures that the player cannot hold any of the duce from the previous turn

  //reactivates roll button
  var rollButton = document.getElementById('roll_dice');
  rollButton.disabled = false;

  var tempDice = [];
  var heldDice = document.getElementsByClassName('fade');
  console.log(heldDice, heldDice.length);

  for (var tD = 0; tD < heldDice.length; tD++) {
    tempDice.push(heldDice[tD]);
  };

  for (var h = 0; h < tempDice.length; h++) {
    tempDice[h].setAttribute('class', '');
  };

  //decides which player to display at the top of screen
  playerTurn = turnCounter % thePlayers.length;
  var turnAlert = document.getElementById('turn');
  turnAlert.textContent = thePlayers[playerTurn] + '\'s turn';

}

var saveButton = document.getElementById('save_progress');

saveButton.addEventListener('click', saveGameProgress);

function saveGameProgress () {
  var oldGames = [];
  var retrievedScores = localStorage.getItem(savedGameDataKey);
  if (retrievedScores === null) {
    // no data was retrieved...
    oldGames = [];
  } else {
    oldGames = JSON.parse(retrievedScores);
  };

  // create Game object to store
  var newGameToSave = createGameObjectToStore();

  // check for an old saved game and remove it.
  checkForOldSavedGame(oldGames, newGameToSave.name, true);

  oldGames.push(newGameToSave);
  // put the new data back
  var newScoreString = JSON.stringify(oldGames);
  localStorage.setItem(savedGameDataKey, newScoreString);
  alert('Your game was saved!');
};

function createGameObjectToStore () {
  var newGame = new SaveGame();
  newGame.loadData(gameScores);
  return newGame;
};

// checks saved game array for a specific game name (first two arguments).
// 'flag' argument (boolean) will control whether to delete the saved game or not.
function checkForOldSavedGame(priorGames, newGameName, flag) {
  var returnArray = priorGames;
  for (var k = 0; k < priorGames.length; k++) {
    if (priorGames[k].name === newGameName) {
      // there is a saved game
      if (flag) {
        // remove the existing game
        priorGames.splice(k, 1);
        returnArray = priorGames;
      };
    };
  };
  return returnArray;
}


// this is where a set of dice is rolled to get random values.
// Initial roll for a turn, gets all 5 dice.
var rollButton = document.getElementById('roll_dice');

rollButton.addEventListener('click', rollDiceHandler);

var LIdice = document.getElementsByClassName('the_dice');
for (var g = 0; g < LIdice.length; g++) {
  LIdice[g].addEventListener('click', holdDiceAction);
}

function holdDiceAction() {
  var diceName = event.target.getAttribute('id');
  console.log(event.target, diceName);
  var diceId = document.getElementById(diceName);
  diceId.classList.toggle('fade');
}

function rollDiceHandler() {
  // handle the clicks of the roll dice button.

  var diceLI = document.getElementsByClassName('the_dice');

  for (var d = 0; d < diceLI.length; d++) {
    var diceImg = document.getElementById('dice' + (d + 1));
    if (!diceImg.classList.contains('fade')) {
      var randomDie = randomNbrGen();
      diceLI[d].textContent = '';
      var img = document.createElement('img');
      img.setAttribute('src', diceImages[randomDie - 1]);
      img.setAttribute('id', 'dice' + (d + 1));
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
    playerHdr.textContent = thePlayers[p].substring(0, 7);
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
      playerOneColumn[i].setAttribute('id', i);
      if(gameScores[playerTurn].score[i].length === 1) {
        playerOneColumn[i].textContent = potentialScores[i];
        playerOneColumn[i].setAttribute('class', 'player_one clickable');
        playerOneColumn[i].addEventListener('click', chooseScore);
      } else {
        playerOneColumn[i].textContent = gameScores[playerTurn].score[i][1];
      }
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
    for(i = 0; i < scoreOptions.length; i++) {
      var scoreCell = currentColumn[i];
      scoreCell.setAttribute('id', i);

      if(gameScores[playerTurn].score[i].length === 1){
      //turns cursor into a pointer when hovering over clickable cell
        if(playerTurn === 0) {
          scoreCell.setAttribute('class', 'player_one clickable');
        } else {
          scoreCell.setAttribute('class', 'player_two clickable');
        }

        scoreCell.textContent = potentialScores[i];
        scoreCell.addEventListener('click', chooseScore);
        //this determines if the other player column displays zero or not
        if((gameScores[(playerTurn + 1) % 2].score[i].length === 1)){
          otherColumn[i].textContent = 0;
        } else {
          otherColumn[i].textContent = gameScores[(playerTurn + 1) % 2].score[i][1];
        }
      } else {
        scoreCell.textContent = gameScores[playerTurn].score[i][1];
      }
    }
  }
}


function chooseScore(e) {
  var click = e.target.textContent;
  var roundScore = parseInt(click);
  var rowNumber = e.target.getAttribute('id');
  var scoreIndex = parseInt(rowNumber);

  gameScores[playerTurn].score[scoreIndex].push(roundScore);

  //makes sure that the other players cells are not clickable and do not look clickable
  for(var i = 0; i < scoreOptions.length; i++){
    var disableElt = document.getElementById(i);
    disableElt.removeEventListener('click', chooseScore);

    if(playerTurn === 0) {
      if(gameScores[0].score[i].length === 1) {
        disableElt.setAttribute('class', 'player_one not_clickable');
      } else {
        disableElt.setAttribute('class', 'player_one not_clickable already_scored');
      }
    } else {
      if(gameScores[1].score[i].length === 1) {
        disableElt.setAttribute('class', 'player_two not_clickable');
      } else {
        disableElt.setAttribute('class', 'player_two not_clickable already_scored');
      }
    }

    disableElt.removeAttribute('id');
  }

  //this causes the turn to end when the user selects their score
  turnCounter += 1;
  turn();
  numberOfRolls = 0;

  // the end of the game happens when each player has completed 13 turns
  if (turnCounter / gameScores.length === 13) {
    // the game is over.
    endOfGame();
  };

}

function endOfGame () {
  // do end of game actions here.....
  var winners = totalPlayersScores();
  var winnerName = gameScores[0].name;

  if (winners.length > 1) {
    for (var f = 0; f < winners.length - 1; f++) {
      if (winners[f] > winners[f + 1]) {
        winnerName = gameScores[f].name;
      } else {
        winnerName = gameScores[f + 1].name;
      }
    }
  }
  alert( winnerName + ' wins!');
}

function totalPlayersScores() {
  // loop through the players array, then for each, loop through scores to total.
  // update the td element.
  var idForPlayer = 'player_one_total';
  var playerTotal = 0;
  var footTotal;
  var winner = [];

  for (var i = 0; i < gameScores.length; i++) {
    playerTotal = 0;  // start each player with a zero total.
    if (i > 0) idForPlayer = 'player_two_total';
    footTotal = document.getElementById(idForPlayer);
    for (var s = 0; s < gameScores[i].score.length; s++) {
      playerTotal += gameScores[i].score[s][1];
    };
    footTotal.textContent = playerTotal;

    // also put that data into local storage.
    addScoreToHistory(gameScores[i].name, playerTotal);
    winner.push(playerTotal);
  };
  return winner;
}

// store completed game data for use by leaderboard...
// in order for high score to be calulated we must access local storage
// and pull score objects with name and score attribute. We may add timestamp later
function OldScores (name, score) {
  this.playerName = name;
  this.gameScore = score;
  this.gameTime;
}

function addScoreToHistory (playerName, playerScore) {
  // get the existing data, then append the new items to it.

  //retrieving stored scores and parsing back into array of objects
  var oldScores = [];
  var retrievedHistory = localStorage.getItem(oldScoresKey);
  if (!(!retrievedHistory)) {
    oldScores = JSON.parse(retrievedHistory);
  }

  var latestScore = new OldScores(playerName, playerScore);
  oldScores.push(latestScore);

  //putting newly updated data array into local storage
  var newScoresString = JSON.stringify(oldScores);
  localStorage.setItem(oldScoresKey, newScoresString);
};
