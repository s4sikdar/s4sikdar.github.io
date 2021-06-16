import { MovingObjects } from "./Moving Objects.js";


/*
This class is used for representing the Pebbles that slide across the sand floor
at the bottom. It is a moving object and hence inherits a lot from the MovingObjects
class. The difference here is that images are not in play here, and instead I
am using canvas to manually draw the pebbles and erase them. Documentation on
the canvas element is found here:
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
*/
class Pebble extends MovingObjects {
  constructor(x_val, y_val, duration) {
    super(x_val, y_val, duration);
  }
}


/*
We want these properties and methods in prototypes for Pebbles only, and
not in all moving objects, hence why we manually put them in the prototype, Since
we can't have a class extend multiple classes. These are all used in the draw function.
*/
Pebble.prototype.width = 20;
Pebble.prototype.height = 12;
Pebble.prototype.fill_colour = "#708090";


/*
This is the method for drawing the Pebble. We use methods of the Canvas API
to create the path for the outline, draw it, and then fill it with
a grayish fill colour shown above. This is used in tandem with the "clear" method below
and the "move" method of the MovingObjects class to give the illusion of Pebbles
sliding across a sand floor. All instances of the Pebble class should have a draw
method, so I decided to put it in the prototype to make up for it. Due to arrow
functions not protecting scope, we will use an anonymous function here instead
of an arrow function. Information about this scoping difference is found here:
https://www.youtube.com/watch?v=mrYMzpbFz18&list=PLRqwX-V7Uu6YgpA3Oht-7B4NBQwFVe3pr&index=3
*/
Pebble.prototype.draw = function(background_context) {
  // Draw the path first with a series of quadratic curves.
	background_context.beginPath();
	background_context.moveTo(this.x_val, this.y_val);
	background_context.quadraticCurveTo((this.x_val + (this.width / 2)),
                                      (this.y_val - (this.height * 1.5)),
											                (this.x_val + this.width),
											                (this.y_val));
	background_context.quadraticCurveTo((this.x_val + (this.width * 1.05)),
											                (this.y_val + (this.height * 0.1)),
											                (this.x_val + this.width),
                                      (this.y_val + (this.height * 0.2)));
	background_context.quadraticCurveTo((this.x_val + (this.width / 2)),
											                (this.y_val + (this.height * 0.4)),
											                 this.x_val,
											                (this.y_val + (this.height * 0.2)));
	background_context.quadraticCurveTo((this.x_val - (this.width * 0.05)),
											                (this.y_val + (this.height * 0.1)),
											                 this.x_val, this.y_val);

	// Outline the path in black and then fill it with a grayish colour.
	background_context.lineWidth = 2;
	background_context.strokeStyle = "black";
	background_context.stroke();
	background_context.fillStyle = "#708090"
	background_context.fill();
	// Set the fillStyles and lineWidths back to default.
	background_context.fillStyle = this.fill_colour;
	background_context.lineWidth = 1;
	background_context.closePath();
}


/*
The method that is used for clearing the area where we drew the pebble. Due to the
way the width and height were used to draw our quadratic curves, we need a custom
function to erase the pebble. I also put this in the prototype because all instances
of the Pebble class will have a clear method.
*/
Pebble.prototype.clear = function(background_context) {
  /*
  The arguments put into the clearRect function ensure that nothing is still
  visible.
  */
	background_context.beginPath();
	background_context.clearRect((this.x_val - (this.width * 0.05) - 1),
                               (this.y_val - (this.height * 2) - 1),
									             ((this.width * 1.1) + 2),
                               ((this.height * 2.4) + 2));
	background_context.closePath();
}


export { Pebble };
