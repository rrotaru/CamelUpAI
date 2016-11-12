/* Camel Up JavaScript Game Engine
 * Author: Robert Rotaru
 *
 *
 */

function CamelUpGame() {

    /* Properties of the game */
    var track = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
    var colors = ["blue", "yellow", "green", "orange", "white"];
    var camels = [];
    var dice = [];
    var cards = [];
    var pyramid = [];
    var rolled = [];
    var ui = CamelUpUI();

    /* Public object/module exposed to users */
    var game = {
        track: track,
        camels: camels,
        dice: dice,
        cards: cards,
        pyramid: pyramid,
        rolled: rolled,
        startGame: rollAllAndPlace,
        playRound: rollSingleRandom,
        input: inputState,
        fill: fillPyramid,
        get: getDieFromPyramid,
        move: moveCamels,
        board: prettyPrintBoard,
        ui: ui,
    };

    /* Private functions of this module */

    function createCamel(color) {
        return {
            color: color,
            position: undefined,
            stack: undefined,
            standing: undefined,
        };
    }

    function createDie(color) {
        return {
            color: color,
            value: undefined,
            roll: rollFunc,
        }
    }

    function fillPyramid() {
        game.pyramid = [].concat(game.dice);
    }

    function getDieFromPyramid() {
        return game.pyramid.splice(rand(0, game.pyramid.length-1), 1)[0];
    }

    function clearRolled() {
        game.rolled = [];
    }

    function addRolled(dieRolled) {
        game.rolled = game.rolled.concat(dieRolled);
    }

    /* returns a random integer between n and m*/
    function rand(n, m) {
        return Math.floor(Math.random()*m)+n;
    }

    /* rolls the associated die and sets its value */
    function rollFunc() {
        var value = rand(1,3);
        this.value = value;
        return value;
    }

    function pickRandomColor() {
        return colors[Math.floor(Math.random()*5)+1];
    }

    function getCamel(color) {
        for (var i = 0; i < game.camels.length; i++) {
            if (game.camels[i].color === color) {
                return game.camels[i];
            }
        }
    }

    function getCamelIndex(color) {
        var camel = getCamel(color);
        for (var i=0; i < game.track[camel.position].length; i++) {
            if (game.track[camel.position][i].color === color) {
                return i;
            }
        }
    }

    function moveCamels(color, numspaces) {
        var camel = getCamel(color);
        if (camel.position === undefined) {
            var position = numspaces - 1;
            camel.position = position;
            camel.stack = game.track[position].length;
            game.track[position].push(camel);
        } else {
            var camelIndex = getCamelIndex(color);
            var moveCamels = game.track[camel.position].splice(camelIndex, 5);
            var newposition = camel.position + numspaces;

            /* Check for win condition */
            if (newposition > 15) {
                console.log("WINNER!");
                console.log(moveCamels[moveCamels.length - 1]);
            } else {
                for (var i=0; i < moveCamels.length; i++) {
                    moveCamels[i].position = newposition;
                    moveCamels[i].stack = game.track[newposition].length + i;
                }

                game.track[newposition] = game.track[newposition].concat(moveCamels);
            }
        }
    }

    function calculateStandings() {
        var standing = 1;
        console.log("STANDINGS:");
        for (var i=game.track.length-1; i >= 0; i--) {
            for (var j=game.track[i].length-1; j >=0; j--) {
                game.track[i][j].standing = standing;
                console.log(game.track[i][j].color, standing);
                standing++;
            }
        }
        console.log("----------");
    }

    function updateCamelsUI() {
        for (var i=0; i < game.camels.length; i++) {
            var coords = ui.getCoords(game.camels[i].position, game.camels[i].stack);
            ui.drawCamel(game.camels[i].color, coords.x, coords.y);
        }
    }

    /* Private initialization function */

    function init() {
        for (var i=0; i < colors.length; i++) {
            var color = colors[i];
            game.camels.push(createCamel(color));
            game.dice.push(createDie(color));
        }
    }

    /* Public/exposed functions */
    
    function prettyPrintBoard() {
        var board = ""
        for (var i=0; i < game.track.length; i++) {
            board += "["
            for (var j=0; j < game.track[i].length; j++) {
                board += game.track[i][j].color[0].toUpperCase();
            }
            board += "]"
        }
        console.log("BOARD:");
        console.log(board);
    }

    function rollAllAndPlace() {
        console.log("START!");
        
        ui.clearCanvas();
        ui.drawBoard();
        var coords = ui.getDiceCoords(game.dice.length);        

        for (var i=0; i < game.dice.length; i++) {
            game.dice[i].roll();
            ui.drawDie(game.dice[i].color, coords[i].x, coords[i].y, game.dice[i].value);
            moveCamels(game.dice[i].color, game.dice[i].value);
            console.log("ROLL", game.dice[i].color, game.dice[i].value);
        }

        calculateStandings();
        updateCamelsUI();

        prettyPrintBoard();
    }

    function rollSingleRandom() {
        ui.clearCanvas();
        ui.drawBoard();

        if (game.pyramid.length < 1) {
            fillPyramid();
            clearRolled();
        } 
        var die = getDieFromPyramid();
        die.roll();
        moveCamels(die.color, die.value);
        console.log("ROLL", die.color, die.value);

        calculateStandings(); 
        updateCamelsUI();
        
        //var coords = ui.getDiceCoords(1)[0];
        var coords = ui.getDiceCoords(game.dice.length);
        addRolled(die);
        //console.log("Rolled Die:" + game.rolled);

        for (var i=0; i < game.rolled.length; i++) {
        //ui.drawDie(die.color, coords.x, coords.y, die.value);
        ui.drawDie(game.rolled[i].color, coords[i].x, coords[i].y, game.rolled[i].value);
        }
        prettyPrintBoard();

        
    }

    function inputState(newcamels, newdice, newtrack, newcards) {
        game.camels = newcamels;
        game.dice = newdice;
        game.track = newtrack;
        game.cards = newcards;
    }

    init();
    return game;
}
