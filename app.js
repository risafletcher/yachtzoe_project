'use strict';

var playerInputForm = document.getElementById('players_form');

//add listener
playerInputForm.addEventListener('submit', handleSubmit);


function twoPlayersYesNo() {  // eslint-disable-line
  document.getElementById('player1Name').setAttribute('class', 'show_me');
  if (document.getElementById('onePlayer').checked) {
    document.getElementById('twoPlayerForm').setAttribute('class', 'hide_me');
    document.getElementById('player2Name').removeAttribute('required');
  } else if (document.getElementById('twoPlayers').checked) {
    document.getElementById('twoPlayerForm').setAttribute('class', 'show_me');
    document.getElementById('player2Name').setAttribute('required', 'required');
  } else {
    document.getElementById('twoPlayerForm').setAttribute('class', 'hide_me');
    document.getElementById('player2Name').removeAttribute('required');
  }
}



// and the handler function
function handleSubmit() {
  event.preventDefault();

  var isValid = validateInput(event.target);

  if (isValid) {
    // we have good input data, store it and go to the game.
    storePlayerData(event.target);
    location.assign('game.html');
  } else {
    // there was some validation error...
    // but this doesn't really execute because HTML5 is capturing the error.
    console.log('Found an error validating input!');
    alert('Input Data Error!! Please correct.');
  };
}

function validateInput (formInput) {
  console.log('validating inputs');
  var inputValid = true;

  // make sure we have the player names
  if (document.getElementById('onePlayer').checked) {
    // only one player.
    console.log('checking for one player.');
    if (formInput.player_1.length < 1) {
      // failed validation.
      inputValid = false;
      alert('No Player 1 Name was provided. Please type the name.');
      console.log('Player 1 name not entered.');
    } else {
      inputValid = true;
    };
  } else {
    // there are two players, so check both.
    console.log('checking for two players.');
    if (formInput.player_1.length < 1) {
      // failed validation.
      inputValid = false;
      alert('No Player 1 Name was provided. Please type the name.');
      console.log('Player 1 name not entered.');
    } else {
      inputValid = true;
    };
    if (formInput.player_2.length < 1) {
      // failed validation.
      inputValid = false;
      alert('No Player 2 Name was provided. Please type the name.');
      console.log('Player 2 name not entered.');
    } else {
      inputValid = true;
    };
  }
  console.log('validations resulted in:', inputValid);
  return inputValid;
};

function storePlayerData(nameData) {
  // store the player info to local storage...
  if (document.getElementById('onePlayer').checked) {
    // only one player...
    var player = [nameData.player_1.value];
    storePlayer(player);
  } else {
    // we have two players...
    var players = [nameData.player_1.value, nameData.player_2.value];
    storePlayer(players);
  }
}

function storePlayer (playerInfo) {
  //putting dummy array into local storage
  var playerString = JSON.stringify(playerInfo);
  localStorage.setItem('players', playerString);
};
