'use strict';

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
