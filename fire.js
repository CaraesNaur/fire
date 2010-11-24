// oldschool fire effect, oem Wed Nov 24 06:45:44 2010
// Algorithm:
// -- create random line at the bottom
// -- interpolate every pixel with the 8 surrouding pixels
// -- move everything up a line

function get_random ( number ) {
    return( parseInt( Math.random() * number ));
}

function palette (index) {
    return("rgb(" +index+ ", 0, 0)");
}


window.onload = function () {
}
