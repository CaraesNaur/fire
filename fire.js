// oldschool fire effect by oem
// Algorithm:
// -- move everything up a line
// -- create random line at the bottom
// -- interpolate every pixel with the 8 surrouding pixels
// -- loop

function get_random (number) {
    return (parseInt( Math.random() * number, 10));
}

function palette (index) {
    // even better than this would be a precreated palette of course
    return ("rgb(" + index + "," + parseInt(index / 3, 10) + "," + parseInt(index / 5) + ")");
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
    var heatspots = 0;
    var x = 0;
    while (heatspots < this.heat) {
        x = get_random(this.canvas[0].length);
        if (this.canvas[this.canvas.length - 1][x] != 255) {
            this.canvas[this.canvas.length - 1][x] = 255;
            heatspots += 1;
        }
    }
}

function move_up () {
    this.canvas.push(new Array(this.max_x));
    this.canvas.shift();
}

function interpolate_point (x, y) {
    var coords = [[x-1, y], [x+1, y], [x, y-1], [x, y+1]];
    var color = 0;
    var neighbours = 0;
    for (var i = 0; i < coords.length; i++) {
        if ((coords[i][0] >= 0) && (coords[i][0] < this.max_x) && (coords[i][1] >= 0) && (coords[i][1] < this.max_y)) {
            color += this.canvas[coords[i][1]][coords[i][0]] || 0;
            neighbours += 1;
        }
    }
    color -= this.cooldown;
    return (parseInt(color / neighbours, 10));
}

function interpolate_all () {
    for (var x = 0; x < this.max_x; x++) {
        for (var y = 0; y < this.max_y; y++) {
            this.canvas[y][x] = this.interpolate_point(x, y);
        }
    }
}

function draw_fire () {
    for (var x = 0; x < this.max_x; x++) {
        for (var y = 0; y < this.max_y - this.hotspots; y++) {
            this.context.fillStyle = palette(this.canvas[y][x]);
            this.context.fillRect(x*this.scale, y*this.scale, this.scale, this.scale);
        }
    }
}

function loop () {
    this.move_up();
    this.random_heatspots();
    this.interpolate_all();
    this.draw_fire();
}

function Fire (context, max_x, max_y, scale, heat) {
    this.max_x             = max_x || 320;
    this.max_y             = max_y || 200;
    this.heat              = heat || 50;
    this.scale             = scale || 1;
    this.context           = context;
    this.canvas            = init_canvas(this.max_x, this.max_y);
    this.hotspots          = 1; // skip drawing the last x lines
    this.cooldown          = 6;
    //methods
    this.random_heatspots  = random_heatspots;
    this.move_up           = move_up;
    this.interpolate_point = interpolate_point;
    this.interpolate_all   = interpolate_all;
    this.draw_fire         = draw_fire;
    this.loop              = loop;
    this.palette           = palette;
}

window.onload = function () {
    var canvas = document.getElementById('my_canvas');
    var ctx = canvas.getContext("2d");
    var fire = new Fire(ctx, 60, 40, 10, 30);
    fire.draw_fire();
    fire_interval = setInterval(function () {
            fire.loop();
            }, 25);
};
