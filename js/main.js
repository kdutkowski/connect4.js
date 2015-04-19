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


function startGame(ai_1_strength, ai_2_strength) {
    var game = new C4({
        ai_1_strength: ai_1_strength,
        ai_2_strength: ai_2_strength,
        container: '#board'
    });
}


startGame(5, 5);

