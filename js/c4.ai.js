C4.AI = function(game, player) {
	var _depth = 5; // Max search depth for minimax
	var _rack = game.rack;
	var _columns = _rack.length;
	var _rows = _rack[0].length;
	var _player = player;
	var _best_col = 0;
	player.human = false;


	function findAndPlayMove() {
		if (game.current === _player) {
			// Give the previous move's drop animation some time to finish
			setTimeout(function() {
				var best = alphabeta(_depth, -Infinity, Infinity, _player);
				var r = game.util.getDropRow(_best_col);
				game.trigger('drop', { col_index : _best_col });
				_best_col = 0;
			}, 500);
		}
	}
 
 
	function alphabeta(depth, alpha, beta, player) {
		var value = evaluateBoard(player);

		// If maximum search depth is reached or this board is a win/loss we
		// don't need to look further
		if (depth === 0 || value === Infinity || value === -Infinity) {
			return value;
		}

		// Calculate moves for this AI player
		if (player === _player) {
			var scores = [];

			// For each column calculate the max possible score
			for (var c = 0; c < _columns; c++) {
				var r = game.util.getDropRow(c);

				// This column is already full of coins
				if (r === -1) continue;

				// Temporarily store move
				_rack[c][r] = player;

				// Recursively calculate the best result this move could have
				// for this player
				alpha = Math.max(alpha, alphabeta(depth - 1, alpha, beta, player.opponent));

				// Undo the move
				delete _rack[c][r];
				scores[c] = alpha;

				if (beta <= alpha) break;
			}

			if (depth === _depth) {
				var max_score = -Infinity;
				var last_valid = null;
				for (var i = 0; i < scores.length; i++) {
					// TODO: find out why >= screws up AI
					var score = scores[i];
					if (score > max_score) {
						max_score = score;
						_best_col = i;
					}

					if (score) last_valid = i;
				}

				// All moves by AI will lead to loss
				// Just pick a valid column
				if (max_score === -Infinity) {
					_best_col = last_valid;
				}
			}

			return alpha;
		} else {
			for (var c = 0; c < _columns; c++) {
				var r = game.util.getDropRow(c);
				if (r === -1) continue;

				_rack[c][r] = player;
				beta = Math.min(beta, alphabeta(depth - 1, alpha, beta, player.opponent));
				delete _rack[c][r];

				if (beta <= alpha) {
					break;
				}
			}
			return beta;
		}
	}


	/* ################################################################################
	UTILITIES
	################################################################################ */


	function evaluateBoard(player) {
		var values = [
			[ 3,  4,   5,  5,  4,  3 ],
			[ 4,  6,   8,  8,  6,  4 ],
			[ 5,  8,  11, 11,  8,  5 ],
			[ 7,  10, 13, 13, 10,  7 ],
			[ 5,  8,  11, 11,  8,  5 ],
			[ 4,  6,   8,  8,  6,  4 ],
			[ 3,  4,   5,  5,  4,  3 ]
		];

		var patterns = {
			'2 connected, empty on the left': {
				rx: /__#{2}[^#_]/g,
				value: 10
			},
			'2 connected, empty on the right': {
				rx: /[^#_]#{2}__/g,
				value: 10
			},
			'2 connected, empty on both sides': {
				rx: /_#{2}_/g,
				value: 20
			},

			'3 connected, empty on the left': {
				rx: /_#{3}/g,
				value: 50
			},
			'3 connected, empty on the right': {
				rx: /#{3}_/g,
				value: 50
			},
			'3 connected, empty middle left': {
				rx: /#_#{2}/g,
				value: 50
			},
			'3 connected, empty middle right': {
				rx: /#{2}_#/g,
				value: 50
			},
			'3 connected, empty on both sides': {
				rx: /_#{3}_/g,
				value: 100
			}
		};

		var views = [
			getSouthView(player),
			getEastView(player),
			getSouthWestView(player),
			getSouthEastView(player)
		];

		var score = 0;
		$.each(views, function(i, view) {

			var player_view = view.replace(/X/g, '#');
			var opponent_view = view.replace(/O/g, '#');

			if (opponent_view.match(/#{4}/)) {
				score = -Infinity;
				return false;
			}

			if (player_view.match(/#{4}/)) {
				score = Infinity;
				return false;
			}

			$.each(patterns, function(name, pattern) {
				var matches = player_view.match(pattern.rx);
				if (matches) {
					score += matches.length * pattern.value;
				}

				matches = opponent_view.match(pattern.rx);
				if (matches) {
					score -= matches.length * pattern.value;
				}
			});
		});

		return score;
	}


	function isCell(c, r) {
		return 0 <= c && c < _columns && 0 <= r && r < _rows;
	}


	function getCellChar(c, r, player) {
		var cell = _rack[c][r];
		if (cell === _player) {
			return 'X';
		} else if (cell) {
			return 'O';
		}
		return '_';
	}


	/* ################################################################################
	VIEWS
	################################################################################ */

	function getEastView(player) {
		var a = [];
		for (var r = 0; r < _rows; r++) {
			a.push('\n');
			for (var c = 0; c < _columns; c++) {
				a.push(getCellChar(c, r, player));
			}
		}
		return a.join('') + '\n';
	}


	function getSouthView(player) {
		var a = [];
		for (var c = 0; c < _columns; c++) {
			a.push('\n');
			for (var r = 0; r < _rows; r++) {
				a.push(getCellChar(c, r, player));
			}
		}
		return a.join('') + '\n';
	}


	function getSouthWestView(player) {
		var c = 0;
		var r = 0;
		var max = _columns * _rows;
		var counter = 0;
		var a = [];
		a.push('\n');
		while (counter != max) {
			if (isCell(c, r)) {
				var cell = _rack[c][r];
				a.push(getCellChar(c, r, player));
				counter++;
				c++;
				r--;
			} else if (r < 0) {
				a.push('\n');
				r = c;
				c = 0;
			} else {
				c++;
				r--;
			}
		}
		return a.join('') + '\n';
	}


	function getSouthEastView(player) {
		var c = _columns - 1;
		var r = 0;
		var max = _columns * _rows;
		var counter = 0;
		var a = [];
		a.push('\n');
		while (counter != max) {
			if (isCell(c, r)) {
				var cell = _rack[c][r];
				a.push(getCellChar(c, r, player));
				counter++;
				c--;
				r--;
			} else if (r < 0) {
				a.push('\n');
				r = _columns - c - 1;
				c = _columns - 1;
			} else {
				c--;
				r--;
			}
		}
		return a.join('') + '\n';
	}


	game.on('waitingForDrop', findAndPlayMove);
};
