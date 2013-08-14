# Oldschool fire effect with javascript + html5 canvas

Forked from https://github.com/oem/fire.

Refactored the Fire JS object to use prototype functions.

Added a default palette of 100 RGB triplets.  Pass in another array as the 6th
argument to the Fire constructor.

Ensured that the canvas[y][x] values remain within the range 0 to the number of
colors.

Added burn() and out() functions to start/stop the fire.  The timeout is now a
property of the Fire object.

Added 7th Fire constructor argument, speed, used as the delay argument for the
animation timeout.

Changed a lot of what happens inside interpolate_point().  Cooling is no longer
linear, but based on a sine curve: cold colors cool faster.  Three new fire
properties (cf1, cf2, focus) affect how much a color cools.  The cf1 and cf2
properties determine the random cooling range, focus sets how much influence
the original color has in determining the cooled color.

Moved the instantiation into the html file; fire.js is now just the object code.

Put a new look and feel into the HTML/CSS.  Add a click handler to the canvas to
allow the fire to be paused.