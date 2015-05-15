C4.UI = function(_game, _options) {

	function init() {

	}


	function updateControls() {
	}


	function showLastMove() {
        // TODO: think of something better !!!
		//if (!_game.moves.length) {
		//	return;
		//}
		//var move = _game.moves[_game.moves.length - 1];
		//var player = move.player;
		//var col = move.col_index;
		//var row = move.row_index;
		//console.error("Player: " + player.toString() + " Col: " + col + " Row: " + row)
        //
		//var a = [];
		//for (var r = 0; r < _game.rack.length; r++) {
		//	a.push('\n');
		//	for (var c = 0; c < _game.rack[0].length; c++) {
		//		a.push(getCellChar(c, r));
		//	}
		//}
		//console.error(a.join('') + '\n');
	}

	function getCellChar(c, r) {
		var cell = _game.rack[c][r];
		if (cell) {
			return cell;
		}
		return '_';

	}



	_game.on('waitingForDrop', updateControls);


	_game.on('waitingForDrop', showLastMove);


	_game.on('done', function(data) {
		showLastMove();
	});


	init();

};
