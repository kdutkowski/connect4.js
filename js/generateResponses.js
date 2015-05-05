var fs = require("fs"),
    readline = require('readline');;

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

var args = process.argv.slice(2);

var cols = args[0]
var rows = args[1]
var filename = args[2]

console.log('cols ', cols, 'rows ', rows);

var rd = readline.createInterface({
    input: fs.createReadStream(filename),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
    var dataLine = line.split(',').map(function(x) {
        return Number(x)
    });
    console.log(dataLine);
    rack = createRack();
    for (var i=0; i<cols; i++) {
        for (var j=0; j<rows; j++) {
            rack[i][j] = dataLine[i + j * cols];
        }
    }

    console.log('rack', rack);

    var game = new C4({
        ai_1_strength: 2,
        ai_2_strength: 2,
        container: '#board',
        rack: rack
    });


});

function startGame(ai_1_strength, ai_2_strength, rack) {
    var game = new C4({
        ai_1_strength: ai_1_strength,
        ai_2_strength: ai_2_strength,
        container: '#board',
        rack: rack
    });
}

function createRack() {

    var rack = new Array(cols);
    for (var c = 0; c < cols; c++) {
        rack[c] = new Array(rows);
    }
    return rack;
}