'use strict';

//in order for high score to be calulated we must access local storage and pull score objects with name and score attribute. We may add time later
var scores = [{name: 'cat', score: 5000}, {name:'Will', score: 10}, {name: 'John', score: 300}, {name: 'Risa', score: 200}, {name: 'Bill', score: 400}];

console.log(scores);

var leaderBoard = [];

//calculates tope 3 scores and puts them in leaderBoard array in the right order. We can change i to accomdoate any number of top scores
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

var scoreBoard = document.getElementById('score_board');

var table = document.createElement('table');

var tableHead = document.createElement('thead');
var tableBody = document.createElement('tbody');
var headRow = document.createElement('tr');

var nameHeader = document.createElement('th');
var scoreHeader = document.createElement('th');

nameHeader.textContent = 'NAME';

scoreHeader.textContent = 'SCORE';

headRow.appendChild(nameHeader);
headRow.appendChild(scoreHeader);
tableHead.appendChild(headRow);
table.appendChild(tableHead);
table.appendChild(tableBody);
scoreBoard.appendChild(table);

for(i = 0; i < 3; i++){
  var tableRow = document.createElement('tr');
  var leaderName = document.createElement('td');
  var leaderScore = document.createElement('td');

  var place = i + 1;
  leaderName.textContent = place + '. ' + leaderBoard[i].name;
  leaderScore.textContent = leaderBoard[i].score;

  tableRow.appendChild(leaderName);
  tableRow.appendChild(leaderScore);
  tableBody.appendChild(tableRow);
}
