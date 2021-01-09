import { MovingObjects } from "./Moving Objects.js";

// Included here to prevent an error when this file gets interpreted through import
// statements.
var Canvas = document.getElementById("Dino");

/*
Constructor for the cloud object, basically is the MovingObjects class except
that the move method works slightly differently, along with some specific properties
*/
class Cloud extends MovingObjects {
  constructor(x_val, y_val) {
    // All clouds move across the screen in 30 seconds.
    super(x_val, y_val, 30000);
  }
}

/*
Take the current timestamp and subtract from timestart to get a difference in milliseconds.
Then divide by duration, and this is our "progress ratio" for how far the cloud should
be across the screen. The x_val is computed according to this. We use Math.round to
have integer x values, which means less overhead for the browser when the canvas renders
shapes and images with integer x and y coordinates. This is similar to the
MovingObjects.move() method, except we let the cloud move even as parts of it are
moving off the screen. This makes it look more natural.
*/
Cloud.prototype.move = function() {
	var Progress_ratio = (((Date.now()) - this.timestart) / this.duration);
	this.x_val = Math.round((Canvas.width) * (1 - Progress_ratio));
}

export { Cloud };
