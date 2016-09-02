'use strict';

//in order for high score to be calulated we must access local storage and pull score objects with name and score attribute. We may add time later

//this array of score objects is being used a placeholder for the time being
var pastScores = [{name: 'cat', score: 5000}, {name:'Will', score: 10}, {name: 'John', score: 300}, {name: 'Risa', score: 200}, {name: 'Bill', score: 400}];

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

//calculates top 3 scores and puts them in leaderBoard array in the right order. We can change i to accomdoate any number of top scores
function calcTopScores() {
  for(var i = 0; i < 3; i++) {
    var topScore = scores[0].score;
    var leader = scores[0];
    for(var j = 0; j < scores.length; j++) {
      if(topScore < scores[j].score){
        topScore = scores[j].score;
        leader = scores[j];
      }
      // when and if the score object gets a time variable if the scores are equal we will use time to dtermine who gets the higher spot on the leaderboard
    }
    leaderBoard.push(leader);
    scores.splice(scores.indexOf(leader), 1);
  }
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
    leaderName.textContent = place + '. ' + leaderBoard[i].name;
    leaderScore.textContent = leaderBoard[i].score;

    //appending data to table
    tableRow.appendChild(leaderName);
    tableRow.appendChild(leaderScore);
    tableBody.appendChild(tableRow);
  }
}
