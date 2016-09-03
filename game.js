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

  var diceLI = document.getElementsByClassName('the_dice');
  var holdCBox = document.getElementsByClassName('hold_dice');

  for (var d = 0; d < diceLI.length; d++) {
    if (!holdCBox[d].checked) {
      var randomDie = randomNbrGen();
      diceLI[d].textContent = randomDie;
      dice[d] = randomDie;
    }
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
