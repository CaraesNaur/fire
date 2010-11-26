// oldschool fire effect, oem Wed Nov 24 06:45:44 2010
// Algorithm:
// -- create random line at the bottom
// -- interpolate every pixel with the 8 surrouding pixels
// -- move everything up a line
// -- loop

function get_random ( number ) {
    return( parseInt( Math.random() * number ));
}

function palette (index) {
    return("rgb(" +index+ ", 0, 0)");
}

// x and y will be swapped, since it makes manipulating the fieldrows much easier
function init_canvas (x, y) {
    canvas = new Array(y);
    for (var i = 0; i < y; i++) {
        canvas[i] = new Array(x);
    }
    return(canvas);
}

function random_heatspots () {
    for (var i = 0; i < this.canvas[0].length; i++) {
        this.canvas[this.canvas.length - 1][i] = get_random(256);
    }
}

function Fire (context, max_x, max_y) {
    this.max_x = max_x;
    this.max_y = max_y;
    this.context = context;
    this.canvas = init_canvas(max_x, max_y);
    //methods
    this.random_heatspots = random_heatspots;
}

window.onload = function () {
    var canvas = document.getElementById('my_canvas');
    var ctx = canvas.getContext("2d");
}

