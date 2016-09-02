'use strict';

// global variables
var diceImages = ['', '', '', '', '', ''];

// this is where a set of dice is rolled to get random values.
var dice = [];
var numberOfRolls = 0;
var maxNbrRolls = 3;

// Initial roll for a turn, gets all 5 dice.
var rollButton = document.getElementById('roll_dice');

rollButton.addEventListener('click', rollDiceHandler);


function rollDiceHandler() {
  // handle the clicks of the roll dice button.
  // Clear out the array...
  dice = [];
  for (var d = 0; d < 5; d++) {
    var randomDie = randomNbrGen();
    dice.push(randomDie);
  }
  console.log('the dice array: ', dice);

  var diceLI = document.getElementsByClassName('the_dice');

  for (d = 0; d < diceLI.length; d++) {
    diceLI[d].textContent = dice[d];
  }
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
