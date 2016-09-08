'use strict';

//in order for high score to be calulated we must access local storage and pull score objects with name and score attribute. We may add time later
var oldScoresKey = 'oldScores';

var oldScores = [];
//retrieving stored scores and parsing back into array of objects
var retrievedScores = localStorage.getItem(oldScoresKey);
if (!(!retrievedScores)) {
  oldScores = JSON.parse(retrievedScores);
};

//this var stores the top score objects
var leaderBoard = [];

calcTopScores();
renderTable();

//sorts scores and puts them in leaderBoard array in the right order.
function calcTopScores() {
  leaderBoard = oldScores;

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
  var maxEntries = 3;
  if (leaderBoard.length < maxEntries) maxEntries = leaderBoard.length;
  for(var i = 0; i < maxEntries; i++) {
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
