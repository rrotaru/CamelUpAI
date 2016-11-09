/* Camel Up JavaScript Canvas UI Engine
 * Author: Robert Rotaru
 *
 *
 *
 */
function CamelUpUI() {

    var canvas = document.getElementById("camel-canvas");
    var context = canvas.getContext("2d");
    
    /* Sprites */
    var board;

    var colors = {
        "blue" : { },
        "yellow": { },
        "green": { },
        "orange": { },
        "white": { },
    }

    /* x and y canvas coordinates for track squares */
    var coords = [ 
        [565, 290 ], [565, 410], [565, 515], [440, 515], [310, 515], 
        [185, 515], [50, 515], [50, 410], [50, 290], [50, 185], 
        [50, 70], [185, 70], [310, 70], [440, 70], [565, 70], [565, 185]
    ];

    var diecoords = [ [270, 250] ];

    var ui = {
        canvas: canvas,
        context: context,
        drawBoard: drawBoard,
        drawCamel: drawCamel,
        drawDie: drawDie,
        clearCanvas: clearCanvas,
        getCoords: getCoords,
        getDiceCoords: getDiceCoords,
    };

    function drawBoard() {
        ui.context.drawImage(board, 0, 0, 658, 548, 0, 0, ui.canvas.width, ui.canvas.height);
    }

    function drawCamel(color, x, y) {
        ui.context.drawImage(colors[color].camel, 0, 0, 129, 91, x, y, 43, 30);
    }

    function drawDie(color, x, y, text) {
        ui.context.drawImage(colors[color].die, 0, 0, 89, 87, x, y, 41, 40);
        ui.context.fillText(text, x+9, y+27);
    }
    
    function clearCanvas() {
        ui.context.clearRect(0, 0, ui.canvas.width, ui.canvas.height);
    }

    function getCoords(position, stack) {
        var x = coords[position][0];
        var y = coords[position][1]-(15*stack);
        return {x: x, y: y};
    }

    function getDiceCoords(numdice) {
        var coordArray = [];

        switch(numdice) {
            case 1:
                coordArray.push({x:275, y:250});
                break;
            case 2:
                coordArray.push({x:255, y:250});
                coordArray.push({x:295, y:250});
                break;
            case 3:
                coordArray.push({x:235, y:250});                
                coordArray.push({x:275, y:250});
                coordArray.push({x:315, y:250});
                break;
            case 4:
                coordArray.push({x:215, y:250});
                coordArray.push({x:255, y:250});
                coordArray.push({x:295, y:250});
                coordArray.push({x:335, y:250});
                break;
            case 5:
                coordArray.push({x:195, y:250});
                coordArray.push({x:235, y:250});                
                coordArray.push({x:275, y:250});
                coordArray.push({x:315, y:250});
                coordArray.push({x:355, y:250});
                break;
            default:
        }        
        return coordArray; 
    }

    function init() {
        ui.context.font = "24px sans-serif";

        board = new Image(658, 548);
        board.src = "img/board.png";

        for (color in colors) {
            colors[color].camel = new Image(129, 91);
            colors[color].camel.src = "img/camel-" + color + ".png";

            colors[color].die = new Image(89, 87);
            colors[color].die.src = "img/die-" + color + ".png";
        }
        board.onload = function() {
            ui.drawBoard();
        }
    }

    init();

    return ui;
}
