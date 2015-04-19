C4.UI = function(_game, _options) {

	function init() {

	}


	function updateControls() {
	}


	function showLastMove() {

		if (!_game.moves.length) {
			return;
		}
		var move = _game.moves[_game.moves.length - 1];
		var player = move.player;
		var col = move.col_index;
		var row = move.row_index;
		console.log("Player: " + player.toString() + " Col: " + col + " Row: " + row)

		var a = [];
		for (var r = 0; r < _game.rack.length; r++) {
			a.push('\n');
			for (var c = 0; c < _game.rack[0].length; c++) {
				a.push(getCellChar(c, r, player));
			}
		}
		console.log(a.join('') + '\n');
	}

	function getCellChar(c, r, player) {
		var cell = _game.rack[c][r];
		if (cell) {
			return cell;
		}
		return '_';

	}



	_game.on('waitingForDrop', updateControls);


	_game.on('waitingForDrop', showLastMove);


	_game.on('done', function(data) {
		var message = 'Draw';

		showLastMove();

		if (data && data.connected) {
			for (var i = 0; i < data.connected.length; i++) {
				var c = data.connected[i][0];
				var r = data.connected[i][1];
				console.log("Col: " + c + " Row: " + r)
			}
			message = data.winner.color + ' wins';
		}

		console.log(message);
	});


	init();

};
