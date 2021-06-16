import { MovingObjects } from "./Moving Objects.js";


/*
This object is used in the main game file, however, it's included here to avoid
causing any errors in the Cactus init method.
*/
let Cactus_object = {
	Cacti: [],
	Popped_object: null,
	Lengths: [200,300,400],
	Cactus_of_Choice: null,
	Available_cacti: null
};


/*
Our constructor for the Cactus object. It represents any cactus on the screen.
It will have x and y values as to where to draw it, a duration for how long it
should take to move across the screen, an img property for the image of the
cactus (not all cacti are the same size), a collision property to check if the
cactus collided with the dinosaur, and a checked property to see if it's already
been checked for collision.
*/
class Cactus extends MovingObjects {
  constructor(image, x_val, y_val, duration) {
    super(x_val, y_val, duration);
		// the Image represents the cactus image
    this.img = image;
		// the collision property represents whether the dino collided with the Cactus
    this.collision = null;
		// represents if the cactus has been checked for collision
    this.checked = false;
  }

	/*
	We initialize the timestart, needed in tandem with the duration property for
	our algorithm to move objects across the screen. We also alter the y_val
	property depending on if our image is a large cactus or a small cactus.
	*/
  init() {
    super.init();
		// In the event that we have the large cactus's image, we offset the y value
    if (this.img == Cactus_object.Available_cacti[1]) {
  		this.y_val += 3;
  	}
  }
}


export { Cactus_object, Cactus };
