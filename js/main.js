var fs = require("fs");

function read(f) {
    return fs.readFileSync(f).toString();
}
function include(f) {
    eval.apply(global, [read(f)]);
}

include('c4.js');
include('c4.ai.js');
include('c4.ui.js');
include('c4.util.js');


function startGame(ai_1_strength, ai_2_strength, rack) {
    var game = new C4({
        ai_1_strength: ai_1_strength,
        ai_2_strength: ai_2_strength,
        container: '#board',
        rack: rack
    });
}

var _columns = 4;
var _rows = 4;

function createRack() {

    var rack = new Array(_columns);
    for (var c = 0; c < _columns; c++) {
        rack[c] = new Array(_rows);
    }
    return rack;
}

function getDropRow(rack, col_index) {
    var column = rack[col_index];
    var row = _rows - 1;
    while (column[row] != null) {
        row--;
    }
    return row;
}

var players = [-1, 1];
var rack = createRack();


var generate_rack = function _generate_rack(_rack, depth) {
    if (depth == _rows*_columns) {
        return;
    }
    var old_rack = JSON.parse(JSON.stringify(_rack));
    for (var c = 0; c < _columns;c++) {
        _rack = JSON.parse(JSON.stringify(old_rack));

        if (_rack[c][0] != null) {
            continue;
        }

        var r = getDropRow(_rack, c);
        _rack[c][r] = players[depth % 2];

        if (_rack.every(function(row) {
                return row[0] != null;
            })) {
            continue;
        }
        if (depth % 2 === 0) {
            startGame(5, 5, JSON.parse(JSON.stringify(_rack)));
        }
        _generate_rack(JSON.parse(JSON.stringify(_rack)), depth + 1);
    }
};

generate_rack(rack, 0);