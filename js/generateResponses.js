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
    rack = [];
    for (var i=0; i<cols; i++) {
        row = [];
        for (var j=0; j<rows; j++) {
            row[j] = dataLine[i * cols + j];
        }
        rack.push(row);
    }
    console.log(rack);
});