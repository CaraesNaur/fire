/*
 * oldschool fire effect by oem (modified by CaraesNaur)
 * Algorithm:
 * -- move everything up a line
 * -- create random line at the bottom
 * -- interpolate every pixel with the 4 surrounding edge-adjacent pixels
 * -- repeat
 *
 *
 *
 */

function Fire (context, max_x, max_y, scale, heat, pal, speed) {
	var s = parseInt(speed);

	this.max_x = max_x || 320;
	this.max_y = max_y || 200;
	this.heat = (heat <= max_x ? heat : max_x);
	this.intensity = 100; // 0 .. 100
	this.scale = scale || 1;
	this.context = context;
	this.canvas = this.init_canvas(this.max_x, this.max_y);
	this.hotspots = 0; // skip drawing the last x lines
	this.cooldown = 5;
	this.colors = (pal instanceof Array) ? pal : Fire.prototype._default_colors;
	this.timeout = null;
	this.speed = (s > 50) ? s : 50;

	// these three properties control the appearance of the fire
	// cf1 and cf2 affect the cooling rate
	// focus controls how sharp/blurry the flame is
	this.cf1 = .75;
	this.cf2 = 5;
	this.focus = 10;

	// highlight row: set this to an int in the range 0..[this.max_y - 1]
	// to have all other rows dimmed
	this.hl = null;
}

Fire.prototype.burn = function (d) {
	var f;

	d = (typeof d == 'number' ? Math.max(50, parseInt(d)) : this.speed);

	this.speed = d;

	if (this.timeout != null) {
		this.out();
	}

	f = this;

	this.timeout = setInterval(function () {
		f.loop();
	}, d);
}

Fire.prototype.out = function () {
	clearTimeout(this.timeout);
	this.timeout = null;
}

Fire.prototype.random_heatspots = function () {
	var heatspots = 0;
	var x = 0;

	while (heatspots < this.heat) {
		x = (parseInt(Math.random() * this.max_x, 10));

		if (this.canvas[this.canvas.length - 1][x] == 0) {
			this.canvas[this.canvas.length - 1][x] = parseInt((this.intensity * (this.colors.length - 1)) / 100);
			heatspots++;
		}
	}
}

Fire.prototype.move_up = function () {
	var n = new Array(this.max_x);

	for (var i = 0; i < this.max_x; i++) {
		n[i] = 0;
	}

	this.canvas.shift();
	this.canvas.push(n);
}

Fire.prototype.interpolate_point = function (x, y) {
	var coords = [
		[x - 1, y],
		[x + 1, y],
		[x, y - 1],
		[x, y + 1]
	];
	var oc = Math.min(this.canvas[y][x], this.colors.length - 1);
	var color = oc * this.focus;
	var neighbours = this.focus;

	for (var i = 0; i < coords.length; i++) {
		if ((coords[i][0] >= 0) && (coords[i][0] < this.max_x) && (coords[i][1] >= 0) && (coords[i][1] < this.max_y)) {
			color += this.canvas[ coords[i][1] ][ coords[i][0] ] || 0;
			neighbours++;
		}
	}

	if (color == 0) {
		return color;
	}

	color /= neighbours;
	cool = parseInt(Math.random() * (this.cf1 * this.cf2));

	if ((color - cool) <= 0) {
		return 0;
	}

	return (parseInt(Math.min(color, this.colors.length - 1), 10) - cool);
}

Fire.prototype.interpolate_all = function () {
	for (var x = 0; x < this.max_x; x++) {
		for (var y = 0; y < this.max_y; y++) {
			this.canvas[y][x] = this.interpolate_point(x, y);
		}
	}
}

Fire.prototype.draw_fire = function () {
	for (var x = 0; x < this.max_x; x++) {
		for (var y = 0; y < this.max_y - this.hotspots; y++) {
			this.context.fillStyle = this.palette(this.canvas[y][x], (typeof this.hl != 'number' || y === this.hl));
			this.context.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
		}
	}
}

Fire.prototype.loop = function () {
	this.move_up();
	this.random_heatspots();
	this.interpolate_all();
	this.draw_fire();
}

Fire.prototype.palette = function (index, b) {
	var a = [], i;
	if (typeof index != 'number') {
		index = 0;
	}

	//make sure index is within the range 0..[this.colors.length - 1]
	index = parseInt(Math.min(this.colors.length - 1, Math.max(index, 0)));

	if (b) {
		return ('rgb(' + this.colors[index].join(',') + ')');
	}
	else {
		for (i = 0; i < 3; i++) {
			a.push(parseInt(this.colors[Math.abs(index)][i] * .2));
		}
		return ('rgb(' + a.join(',') + ')');
	}
}

Fire.prototype.init_canvas = function (x, y) {
	// x and y will be swapped, since it makes manipulating the fieldrows much easier
	// therefore, a given coordinate is at this.canvas[y][x]
	var canvas = new Array(y);

	for (var i = 0; i < y; i++) {
		canvas[i] = new Array(x);

		for (var j = 0; j < x; j++) {
			canvas[i][j] = 0;
		}
	}

	return (canvas);
}

Fire.prototype._default_colors = [
	[0,0,0],
	[5,0,0],
	[10,0,0],
	[14,0,0],
	[19,0,0],
	[23,0,0],
	[27,0,0],
	[31,0,0],
	[35,0,0],
	[39,0,0],
	[43,0,0],
	[47,0,0],
	[51,0,0],
	[55,0,0],
	[59,0,0],
	[63,0,0],
	[67,0,0],
	[71,0,0],
	[75,0,0],
	[79,0,0],
	[83,0,0],
	[88,0,0],
	[92,0,0],
	[96,0,0],
	[100,0,0],
	[104,0,0],
	[108,0,0],
	[112,0,0],
	[116,0,0],
	[121,0,0],
	[125,0,0],
	[129,0,0],
	[133,0,0],
	[137,0,0],
	[141,0,0],
	[145,0,0],
	[149,0,0],
	[153,0,0],
	[157,0,0],
	[161,0,0],
	[165,0,0],
	[169,0,0],
	[173,0,0],
	[177,0,0],
	[181,0,0],
	[185,0,0],
	[190,0,0],
	[194,0,0],
	[198,0,0],
	[202,0,0],
	[205,2,0],
	[207,6,0],
	[209,10,0],
	[211,14,0],
	[213,18,0],
	[215,22,0],
	[217,26,0],
	[219,30,0],
	[221,35,0],
	[223,39,0],
	[225,43,0],
	[227,47,0],
	[229,51,0],
	[231,55,0],
	[233,59,0],
	[235,63,0],
	[237,67,0],
	[239,71,0],
	[241,75,0],
	[243,79,0],
	[245,83,0],
	[248,88,0],
	[250,92,0],
	[252,96,0],
	[254,100,0],
	[255,105,1],
	[255,111,3],
	[255,117,5],
	[255,123,7],
	[255,130,9],
	[255,136,11],
	[255,142,13],
	[255,148,15],
	[255,154,17],
	[255,160,19],
	[255,166,21],
	[255,172,23],
	[255,179,25],
	[255,185,27],
	[255,191,29],
	[255,197,31],
	[255,203,33],
	[255,209,35],
	[255,215,37],
	[255,221,39],
	[255,227,41],
	[255,234,44],
	[255,240,46],
	[255,246,48],
	[255,252,50]
];
