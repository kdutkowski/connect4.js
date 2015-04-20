var C4 = function (_options) {
    var _game = this;
    var _columns = 4;
    var _rows = 4;
    var _counter = 0;
    var _event_handlers = {};

    this.current = null;
    this.rack = [];
    this.moves = [];


    function Player(color) {
        this.color = color;
        this.toString = function () {
            return this === _game.current ? 'X' : 'O';
        };
    }

    this.init = function () {

        _columns = _options.rack.length;
        _rows = _options.rack[0].length;

        var activePlayer = new Player('yellow');
        var passivePlayer = new Player('red');

        activePlayer.opponent = passivePlayer;
        passivePlayer.opponent = activePlayer;
        this.current = activePlayer;

        for (var c = 0; c < _columns; c++) {
            for (var r = 0; r < _rows; r++) {
                var _cell = _options.rack[c][r];
                if (_cell === 1) {
                    _options.rack[c][r] = activePlayer;
                } else if (_cell === -1) {
                    _options.rack[c][r] = passivePlayer;
                } else {
                    _options.rack[c][r] = null;
                }
            }
        }
        this.rack = _options.rack;

        C4.Util(this);
        C4.UI(this, _options);

        if (_options.ai_1_strength) {
            C4.AI(this, this.current, _options.ai_1_strength);
        }

        if (_options.ai_2_strength) {
            C4.AI(this, this.current.opponent, _options.ai_2_strength);
        }

        this.trigger('waitingForDrop');
        var input = [];
        for (c = 0; c < _columns; c++) {
            for (r = 0; r < _rows; r++) {
                _cell = this.rack[c][r];
                if (_cell === activePlayer) {
                    input.push(1);
                } else if (_cell === passivePlayer) {
                    input.push(-1);
                } else {
                    input.push(0);
                }

            }
        }
        var _moves = this.moves;
        if (_moves.length === 0) {
            console.error("Already Ended", input);
        } else {
            console.log(input.join(",") + ',' + _moves[0].col_index);
        }
    };


    this.on = function (event, handler) {
        if (!(event in _event_handlers)) {
            _event_handlers[event] = [];
        }

        _event_handlers[event].push(handler);
    };


    this.trigger = function (event, data) {
        if (!(event in _event_handlers)) return;

        var handlers = _event_handlers[event];
        handlers.forEach(function (handler) {
            handler(data);
        });
    };


    this.on('drop', function (data) {
        if (!data) return;

        var row_index = _game.util.getDropRow(data.col_index);
        if (row_index > -1) {
            _counter++;
            _game.rack[data.col_index][row_index] = _game.current;
            _game.moves.push({
                player: _game.current,
                col_index: data.col_index,
                row_index: row_index
            });
            _game.trigger('done');
        }
    });

    this.init();
};