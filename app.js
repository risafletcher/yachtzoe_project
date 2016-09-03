'use strict';

var player1Name = document.getElementById('player1Name');
var player2Name = document.getElementById('player2Name');



function twoPlayersYesNo() {
  document.getElementById('onePlayerForm').setAttribute('class', 'player_info show_me');
  if (document.getElementById('onePlayer').checked) {
    document.getElementById('twoPlayerForm').setAttribute('class', 'player_info hide_me');
  } else if (document.getElementById('twoPlayers').checked) {
    document.getElementById('twoPlayerForm').setAttribute('class', 'player_info show_me');
  } else {
    document.getElementById('twoPlayerForm').setAttribute('class', 'player_info hide_me');
  }
}
