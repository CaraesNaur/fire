// oldschool fire effect, oem Wed Nov 24 06:45:44 2010
// Algorithm:
// -- create random line at the bottom
// -- interpolate every pixel with the 8 surrouding pixels
// -- move everything up a line
// -- loop

function get_random (number) {
    return (parseInt( Math.random() * number, 10));
}

function palette (index) {
    return ("rgb(" + index + ", 0, 0)");
}

// x and y will be swapped, since it makes manipulating the fieldrows much easier
function init_canvas (x, y) {
    var canvas = new Array(y);
    for (var i = 0; i < y; i++) {
        canvas[i] = new Array(x);
    }
    return (canvas);
}

function random_heatspots () {
    for (var i = 0; i < this.canvas[0].length; i++) {
        this.canvas[this.canvas.length - 1][i] = get_random(256);
    }
}

function move_up () {
    this.canvas.push(new Array(this.max_x));
    this.canvas.shift();
}

function interpolate_point (x, y) {
    var coords = [[x-1, y], [x+1, y], [x, y-1], [x, y+1], [x-1, y-1], [x-1, y+1], [x+1, y-1], [x+1, y+1]];
    var color = 0;
    var neighbours = 0;
    for (var i = 0; i < coords.length; i++) {
        if ((coords[i][0] >= 0) && (coords[i][0] < this.max_x) && (coords[i][1] >= 0) && (coords[i][1] < this.max_y)) {
            color += this.canvas[coords[i][1]][coords[i][0]] || 0;
            neighbours += 1;
        }
    }
    return (parseInt(color / neighbours, 10));
}

function Fire (context, max_x, max_y) {
    this.max_x             = max_x;
    this.max_y             = max_y;
    this.context           = context;
    this.canvas            = init_canvas(max_x, max_y);
    //methods
    this.random_heatspots  = random_heatspots;
    this.move_up           = move_up;
    this.interpolate_point = interpolate_point;
}

window.onload = function () {
    var canvas = document.getElementById('my_canvas');
    var ctx = canvas.getContext("2d");
};

