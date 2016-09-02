'use strict';

var player1Name = document.getElementById('player1Name');
var player2Name = document.getElementById('player2Name');


function twoPlayersYes() {
  if (document.getElementById('onePlayer').checked) {
    document.getElementById('onePlayerForm').style.visibility = 'visible';
    document.getElementById('twoPlayerForm').style.visibility = hidden;
  } else if (document.getElementById('twoPlayers').checked) {
    document.getElementById('twoPlayerForm').style.visibility = 'visible';
    document.getElementById('onePlayerForm').style.visibility = 'visible';
  } else {
    document.getElementById('twoPlayerForm').style.visibility = 'hidden';
  }
}

var dice = [];
for (var d = 0; d < 5; d++) {
  var randomDie = randomNbrGen();
  dice.push(randomDie);
  console.log('roll #' + d + ': ' + randomDie);
}
console.log('the dice array:', dice);


function randomNbrGen() {
  var random = Math.floor((Math.random() * 6) + 1);
  return random;
}
