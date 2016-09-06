'use strict';

//in order for high score to be calulated we must access local storage and pull score objects with name and score attribute. We may add time later

function OldScores (name, score) {
  this.playerName = name;
  this.gameScore = score;
  this.gameTime;
}

//this array of score objects is being used a placeholder for the time being
var pastScores = [];
pastScores.push(new OldScores('Jane', 100));
pastScores.push(new OldScores('cat', 5000));
pastScores.push(new OldScores('Will', 100));
pastScores.push(new OldScores('John', 300));
pastScores.push(new OldScores('Risa', 1000));
pastScores.push(new OldScores('Bill', 400));
pastScores.push(new OldScores('Will', 1200));

//
// pastScores = [{name: 'cat', score: 5000}, {name:'Will', score: 10}, {name: 'John', score: 300}, {name: 'Risa', score: 200}, {name: 'Bill', score: 400}];

//putting dummy array into local storage
var scoresString = JSON.stringify(pastScores);
localStorage.setItem('scores', scoresString);

//retrieving stored scores and parsing back into array of objects
var retrievedScores = localStorage.getItem('scores');
var scores = JSON.parse(retrievedScores);

//this var stores the top score objects
var leaderBoard = [];

calcTopScores();
renderTable();

//sorts scores and puts them in leaderBoard array in the right order.
function calcTopScores() {
  leaderBoard = scores;

  // sort high scores to beginning of the array.
  leaderBoard.sort(function(a,b) {
    if (a.gameScore > b.gameScore) return -1;
    if (a.gameScore < b.gameScore) return 1;
    return 0;
  });
}

//renders score data to table
function renderTable() {
  //creating main table elements
  var scoreBoard = document.getElementById('score_board');
  var table = document.createElement('table');
  var tableHead = document.createElement('thead');
  var tableBody = document.createElement('tbody');
  var headRow = document.createElement('tr');
  var nameHeader = document.createElement('th');
  var scoreHeader = document.createElement('th');

  //setting text content of table heads
  nameHeader.textContent = 'NAME';
  scoreHeader.textContent = 'SCORE';

  //appending main table elements to page
  headRow.appendChild(nameHeader);
  headRow.appendChild(scoreHeader);
  tableHead.appendChild(headRow);
  table.appendChild(tableHead);
  table.appendChild(tableBody);
  scoreBoard.appendChild(table);

  //using data from leaderBoard to create table rows
  for(var i = 0; i < 3; i++){
    //creating the row elements
    var tableRow = document.createElement('tr');
    var leaderName = document.createElement('td');
    var leaderScore = document.createElement('td');

    //setting the content for each row
    var place = i + 1;
    leaderName.textContent = place + '. ' + leaderBoard[i].playerName;
    leaderScore.textContent = leaderBoard[i].gameScore;

    //appending data to table
    tableRow.appendChild(leaderName);
    tableRow.appendChild(leaderScore);
    tableBody.appendChild(tableRow);
  }
}
