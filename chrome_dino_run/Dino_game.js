var Canvas = document.getElementById("Dino");
Canvas.width = 800;
Canvas.height = 600;
Canvas_context = Canvas.getContext('2d');
var Button = document.querySelector("button");

var Dino_walking_pt_1 = document.getElementById("Dino_walking_pt_1");
Dino_walking_pt_1.width = 800;
Dino_walking_pt_1.height = 600;
var Dino_walking_pt_1_context = Dino_walking_pt_1.getContext('2d');
var Dino_walking_pt_2 = document.getElementById("Dino_walking_pt_2");
Dino_walking_pt_2.width = 800;
Dino_walking_pt_2.height = 600;
var Dino_walking_pt_2_context = Dino_walking_pt_2.getContext('2d');

var Moving_background = document.getElementById("Moving_background");
var Moving_background_context = Moving_background.getContext('2d');
Moving_background.width = 800;
Moving_background.height = 600;
var Blue_Sky = document.getElementById("Blue_Sky");

var Sky = document.getElementById("Sky");
Sky.width = 800;
Sky.height = 600;
var Sky_context = Sky.getContext('2d');

var Walking_dino_pt_1 = new Image();
Walking_dino_pt_1.src = "Dino_walking_part_1.png";
var Walking_dino_pt_2 = new Image();
Walking_dino_pt_2.src = "Dino_walking_part_2.png";
var Jumping_Dino = new Image();
Jumping_Dino.src = "Resized_dino.png";
var Medium_Cactus = new Image();
Medium_Cactus.src = "Medium_Cactus.png";
var Large_Cactus = new Image();
Large_Cactus.src = "Large_Cactus.png";
var Cloud_image = new Image();
Cloud_image.src = "Moving_cloud.png";

var Modal = document.getElementById("Modal");
var Start_over_button = document.getElementById("Start_over_button");

var timestart = null;
/*
These are the objects that represent the Cacti moving across the screen. We need x and y values which correspond where to draw it to.
We need the image itself, the duration in terms of milliseconds that it has to take for the cactus to move across the screen.
*/
function Cactus(Cactus_image, x_val, y_val, duration, offset) {
	this.x_val = x_val;
	this.y_val = y_val;
	this.Image = Cactus_image;
	this.duration = duration;
	this.timestart = null;
	this.collision = null;
	this.checked = false;
}

/*
We initialize the timestart, needed in our algorithm with the duration to smoothly move objects across the screen. We also alter the y_val
property depending on if our image is a large cactus or a small cactus.
*/
Cactus.prototype.init = function() {
	this.timestart = Date.now();
	if (this.Image == Cacti_object.Available_cacti[1]) {
		this.y_val += 3;
	}
}

/*
There was a glitch when I built a "bare bone" prototype of this game and I moved the object by a certain number of pixels, in that when
my main character jumped, the rectangles (what I used at the time) would move by faster and faster. This along with the fact that some browsers may
render the screen more frequently than others (some render at 30 times per second while others normally do 60), is what led me to render the position
based on the fraction of how much time has passed since the cactus first came on screen to how long it should take to move across it.
*/
Cactus.prototype.move = function() {
	var Progress_ratio = Math.min((((Date.now()) - this.timestart) / this.duration), 1);
	this.x_val = Math.round((Canvas.width) * (1 - Progress_ratio));
}

/*
This is our pebble object representing the random pebbles that move across the ground. It's similar to our cacti object above. The difference is that
now we have a draw function to draw a pebble. It uses some drawing tools in canvas. Information on canvas and its methods can be found here:
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
*/
function Pebble (x_val,y_val,duration) {
	this.x_val = x_val;
	this.y_val = y_val;
	this.duration = duration;
	this.timestart = null;
}

/*
Used in our draw function.
*/
Pebble.prototype.width = 20;
Pebble.prototype.height = 12;
Pebble.prototype.fill_colour = "#708090";

// similar to our cactus init, except with an adjustment to positioning.
Pebble.prototype.init = function() {
	this.timestart = Date.now();
}

Pebble.prototype.move = Cactus.prototype.move;

// Drawing function, since there is no image use canvas's drawImage method
Pebble.prototype.draw = function() {
	// Draw the path first with a series of quadratic curves.
	Moving_background_context.beginPath();
	Moving_background_context.moveTo(this.x_val, this.y_val);
	Moving_background_context.quadraticCurveTo((this.x_val + (this.width / 2)),
											   (this.y_val - (this.height * 1.5)),
											   (this.x_val + this.width),
											   (this.y_val));
	Moving_background_context.quadraticCurveTo((this.x_val + (this.width * 1.05)),
											   (this.y_val + (this.height * 0.1)),
											   (this.x_val + this.width),
											   (this.y_val + (this.height * 0.2)));
	Moving_background_context.quadraticCurveTo((this.x_val + (this.width / 2)),
											   (this.y_val + (this.height * 0.4)),
											    this.x_val,
											   (this.y_val + (this.height * 0.2)));
	Moving_background_context.quadraticCurveTo((this.x_val - (this.width * 0.05)),
											   (this.y_val + (this.height * 0.1)),
											    this.x_val,
											    this.y_val);

	// Outline the path in black and then fill it with a grayish colour.
	Moving_background_context.lineWidth = 2;
	Moving_background_context.strokeStyle = "black";
	Moving_background_context.stroke();
	Moving_background_context.fillStyle = "#708090"
	Moving_background_context.fill();
	// Set the fillStyles and lineWidths back to default.
	Moving_background_context.fillStyle = "black";
	Moving_background_context.lineWidth = 1;
	Moving_background_context.closePath();
}

// Due to the way the width and height were used to draw our quadratic curves, we need
// a custom function to erase the pebble
Pebble.prototype.clear = function() {
	Moving_background_context.beginPath();
	Moving_background_context.clearRect((this.x_val - (this.width * 0.05) - 1), (this.y_val - (this.height * 2) - 1),
									   ((this.width * 1.1) + 2), ((this.height * 2.4) + 2));
	Moving_background_context.closePath();
}

// Our constructor for the cloud.
function Cloud(x_val,y_val) {
	this.x_val = x_val;
	this.y_val = y_val;
	this.timestart = null;
}

// This is our duration which we set our cloud to.
Cloud.prototype.duration = 30000;

// Initialize our timestart, same as the pebble
Cloud.prototype.init = Pebble.prototype.init;

// Take the current timestamp and subtract from timestart to get a difference in milliseconds. Then divide by duration,
// and this is our "progress ratio" across the screen. The x_val is computed according to this. We use Math.round to have integer x values,
// which means less overhead for the browser when the canvas renders shapes and images with integer x and y coordinates. Same as for the cactus
Cloud.prototype.move = Cactus.prototype.move = function() {
	var Progress_ratio = (((Date.now()) - this.timestart) / this.duration);
	this.x_val = Math.round((Canvas.width) * (1 - Progress_ratio));
}


// Whatever all Cloud objects share, we put in the prototype to avoid properties and methods with the same values being recreated.
Cloud.prototype.Image = Cloud_image;
var Popped_cloud = null;

/*
This function moves the clouds across the screen. I will refrain from detailed explanation here, since the structure is the very similar
as that of our Move_pebbles function and the Move_cacti function.
*/
function Move_clouds() {
	if (Game_status.Clouds.length == 0) {
		// We put want clouds to have random y values in a certain range of the screen vertically.
		Game_status.Clouds.unshift(new Cloud((Canvas.width), (Math.floor(((Math.random()) * 75) + 40))));
		Game_status.Clouds[0].init();
	} else {
		if ((Game_status.Clouds[0].x_val <= (Canvas.width * 0.3)) && (Game_status.Clouds.length < 2)) {
			Game_status.Clouds.unshift(new Cloud((Canvas.width), ((Math.floor((Math.random()) * 75)) + 40)));
			Game_status.Clouds[0].init();
		}
		if (Game_status.Clouds[(Game_status.Clouds.length) - 1].x_val <= (0 - Game_status.Clouds[0].Image.width)) {
			Popped_cloud = Game_status.Clouds.pop();
			Popped_cloud = null;
		}
		for (let Single_cloud of Game_status.Clouds) {
			Sky_context.beginPath();
			Sky_context.clearRect((Single_cloud.x_val - 1), (Single_cloud.y_val - 1), (Single_cloud.Image.width + 2), (Single_cloud.Image.height + 2));
			Single_cloud.move();
			Sky_context.drawImage(Cloud_image, Single_cloud.x_val, Single_cloud.y_val, Cloud_image.width, Cloud_image.height);
			Sky_context.closePath();
		}
	}
	Cloud_ID = requestAnimationFrame(Move_clouds);
}







// All our variables which we assign the ids from requestAnimationFrame calls. I decided to put
// all variables in object literals to reduce the amount of variables in the global namespace.
var Animation_frames = {
	Animation_ID: null,
	Run_ID: null,
	Jump_ID: null,
	Pebble_ID: null,
	Cloud_ID: null
};


var Game_status = {
	duration: 4000,
	counter: 0,
	Scale_factor: 0.95,
	pass_level_amt: 4,
	Levels_passed: 0,
	Limit: 4,
	Current_index: null,
	Pebbles: [],
	Clouds: [],
	is_jumping: false,
	Footspeed: 100,
	continue_running: null,
	game_has_started: false,
	level_factor: 4,
	past_20: false,
	past_30: false,
	cacti_passed: 0,
	score: 0
};

var Cacti_object = {
	Cacti: [],
	Popped_object: null,
	Lengths: [200,300,400],
	Cactus_of_Choice: null,
	Available_cacti: null
};

function Worker_fn() {
	/*
	Our algorithm to find collision is as follows. We find the "box of overlap" and postMessage the attributes of this "box" in
	the web worker, as well as the translation of these boxes on the images of the two actors involved. Think of it like the image below:
	   _________
	  |			|
	  |			|
	  |		  __|___
	  |		 |  |	|
	  |______|__|	|
			 | 		|
			 |		|
			 |______|

	The overlap is the main box represented in the object literal that we pass. This is the x and y values according to the canvas of the top
	left corner of the box, along with the width and height. The individual object literals in the onmessage event handler are translations of these x
	and y values onto that of each image. So for example, since the x and y values (according to canvas x and y values) of an image on our canvas are
	at the top left corner, this means that We have to subtract the x value for the collision box from the individual x values of the two image boxes
	as well, and the same for the y values. scales the axis so we can work with the image maps below. You can think of the image maps like the following:
	  _______________
	 |				 |
	 |				 |
	 |				 |
	 |				 |
	 |	 /--/________|_____
	 |	/--|------/  |     |
	 |	/--|--|&/----|---| |
	 |	/--|--|&/----|---| |
	 |_____|___|-----|--|  |
		   |_______________|

	One image map is bordered with slashes, while the other is bordered with these: |. The collision regions between the two regions is represented by & values.
	What we are doing is that with the collision box, we are taking the translated x and y values of both images and looking at their image maps to figure out
	what the intervals are where the image is not transparent. These intervals are then put into an object and compared, to check for overlap. If there is enough
	overlap (We set a threshold of >= 5 rows), then we return a true for whether or not the dino collided with the cactus. That is what the image maps are for
	below. Since it required me to manually hardcode them, this is why the dino and the cacti are not resizeable, and thus why the game does not support mobile.
	The manual hardcoding was done in a python script using the Pillow imaging library. I originally intended to use the .getImageData method of canvas, however,
	that didn't work out due to Cross Origin Resource Sharing Policy. I ran this code in a web worker because running requestAnimationFrame tries to render the
	browser 60 times per second. So you have about 16 milliseconds give or take for smooth animations. So to ensure that the main thread is not bogged down with
	long iterations, I used a web worker - essentially creating a separate thread/environment from your program that can run calculations in the background, and
	then send back the results to your main thread.
	*/

	/*
	This represents the image map of one of the walking dinosaur frames,
	as well as the frame of the dinosaur jumping. They are the same because they
	both have the same front leg position, which considering that the cacti are moving
	from right to left, and we only have to worry about the back of the dino when in mid-air,
	we can combine the two maps.
	*/
	var Jumping_dino_and_walking_dino_path_part_2 = {
		0: [0,0],
		2: [40,58],
		8: [38,63],
		24: [38,58],
		28: [5,58],
		31: [5,51],
		43: [5,46],
		46: [9,46],
		48: [9,41],
		50: [12,41],
		53: [15,43],
		56: [18,39],
		62: [21,36],
		69: [21,39],
		75: null
	};

	// The other frame of the dino walking. This is different because its front leg is up.
	var Dino_Walking_path_part_1 = {
		0: [0,0],
		2: [38,59],
		7: [38,60],
		9: [38,63],
		24: [38,58],
		28: [5,58],
		29: [5,53],
		30: [5,51],
		42: [5,46],
		46: [9,46],
		48: [9,41],
		50: [12,41],
		53: [15,41],
		56: [18,39],
		59: [18,43],
		62: [21,40],
		63: [19,24],
		70: [19,25],
		74: null
	};

	// The image map for the large cactus.
	var Large_Cactus = {
		0: [0,0],
		4: [16,21],
		6: [15,21],
		7: [7,23],
		12: [5,23],
		13: [4,23],
		17: [4,32],
		35: [6,32],
		36: [7,32],
		37: [8,32],
		38: [9,32],
		39: [10,32],
		40: [15,33],
		41: [15,31],
		42: [15,30],
		43: [15,28],
		45: [15,27],
		47: [15,23],
		67: [13,23],
		73: null
	};

	// The image map for the small cactus.
	var Medium_Cactus = {
		0: [0,0],
		4: [11,16],
		8: [5,16],
		9: [3,16],
		10: [3,24],
		28: [5,24],
		30: [6,24],
		32: [8,23],
		33: [11,22],
		34: [11,21],
		35: [11,20],
		36: [11,17],
		56: null
	};

	/*
	Checks whether the non-transparent parts of the image collided given pre-defined image maps.
	*/
	function Check_collision(Dino,Cactus,Collision_object) {
		var Cactus_keys = null;
		var Dino_keys = null;

		var Cactus_map = Large_Cactus;
		if (Cactus.Source.includes("Medium_Cactus.png")) {
			Cactus_map = Medium_Cactus;
		}
		var Dino_map = Dino_Walking_path_part_1;
		if (!(Dino.Source.includes("Dino_walking_part_1.png"))) {
			Dino_map = Jumping_dino_and_walking_dino_path_part_2;
		}

		Cactus_keys = Object.keys(Cactus_map);
		Dino_keys = Object.keys(Dino_map);
		var Sliced_dino_keys = null;
		var Sliced_Cactus_keys = null;
		var start_index = null;
		var end_index = null;

		/*
		We take our translated y values and the height values, and measure them up with the keys of the image maps for both the cactus and the object.
		Think of it like so:
					  1 3 5 8 10 12
		100			  _______________
		101:  	1:	 |				 |
					 |	1			 |
					 |				 |
					 |				 |
		107:	6:	 |	 /--/________|_____
		110:	9:	 |	/--|------/  |     | 1:
		116:	15:	 |	/--|--|&/----|---| | 7:
		122:	21:	 |	/--|--|&/----|---| | 13:
		125:	24:	 |_____|___|-----|--|  | 16:
						   |_________2_____|

		The numbers on the top are what the properties of those keys represent. Those numbers are used in the start and end values of the
		two element array, represent where the non-transparent pixels start and end for that row of pixels.
		The numbers on the side are what are represented by the keys on the image maps. These keys are what we are iterating through.
		What the numbers are listed as above are not necessarily going to coincide with the y values on in our objects that were sent to the
		web worker(this function block titled Worker_fn). You may have the y_val property being 12, when the number on the side is 9, but we take
		9 anyway because it's close enough (we're talking pixels here). Then we check if 8 + the attached width/height is greater than or equal
		to the current key but less than the next. So we may have 8 + width/height = 22 < 24, so 24 is what we select as our end key. The index
		values of these two keys are used to slice the array of the object keys for both the cactus and dino to then give us the right number
		of keys to iterate through. Otherwise we have to iterate through all the keys each time when running a for loop for all values between
		y_val and y_val + height. We do this for both the cactus and the dinosaur. The numbers on the far left will be explained further below.
		*/
		for (var i = 0; i < (Dino_keys.length - 1); i++) {
			if (((Number(Dino_keys[i])) <= Dino.y_val) && (Dino.y_val < (Number(Dino_keys[i+1])))) start_index = Dino_keys[i];
			if (((Number(Dino_keys[i])) <= (Dino.y_val + Dino.height)) &&
				((Dino.y_val + Dino.height) < (Number(Dino_keys[i+1])))) end_index = Dino_keys[i + 1];
			if ((start_index != null) && (end_index != null)) {
				Sliced_dino_keys = Dino_keys.slice((Dino_keys.indexOf(start_index)), (Dino_keys.indexOf(end_index)));
				break;
			}
		}

		for (var i = 0; i < (Cactus_keys.length - 1); i++) {
			if (((Number(Cactus_keys[i])) <= Cactus.y_val) && (Cactus.y_val < (Number(Cactus_keys[i+1])))) start_index = Cactus_keys[i];
			if (((Number(Cactus_keys[i])) <= (Cactus.y_val + Cactus.height)) &&
				((Cactus.y_val + Cactus.height) < (Number(Cactus_keys[i+1])))) end_index = Cactus_keys[i + 1];
			if ((start_index != null) && (end_index != null)) {
				Sliced_Cactus_keys = Cactus_keys.slice((Cactus_keys.indexOf(start_index)), (Cactus_keys.indexOf(end_index)));
				start_index = 0;
				break;
			}
		}


		var Dino_map_index = 0;
		var Cactus_map_index = 0;
		var overlap_counter = 0;
		var Overlap_region_1 = null;
		var Overlap_region_2 = null;
		var Overlap_of_both = null;
		var Next_index = null;

		var Dinosaur_overlap = {
		};
		var Cactus_overlap = {
		};

		var Start = null;
		/*
		Going back to the diagram above, we partly see this:
		107:	6:	 |	 /--/________|_____
		110:	9:	 |	/--|------/  |     | 1:
		116:	15:	 |	/--|--|&/----|---| | 7:
		122:	21:	 |	/--|--|&/----|---| | 13:
		125:	24:	 |_____|___|-----|--|  | 16:
						   |_________2_____|
		We essentially create our own copies of the image maps, and compare them using the existing image maps. For object 1, this starts where
		we see | for the border of the collision region and ends where we see / or | for the border of object 1. For object 2 it starts with | and
		ends with |. The numbers at the top that correspond to this are placed in the 2-element array. In abstract, that's what we're doing here.
		Another difference is that for the keys we now use the numbers on the far left. These correspond to the y-values that translate to the the
		y-values on the canvas. This allows us to compare the intervals on the two objects created: labelled Dinosaur_overlap and Cactus_overlap.
		Overlap of these intervals increments an overlap counter. When this overlap counter passes the threshold, we have a collision. Return true.
		*/
		for (y = Dino.y_val; y < (Dino.y_val + Dino.height); y++) {
			Next_index = ((y > (Number(Sliced_dino_keys[Dino_map_index]))) && (y >= (Number(Sliced_dino_keys[(Dino_map_index + 1)]))));
			if (Next_index) Dino_map_index++;
			// The maximum between the | for the collision border, and the starting / for opaque pixels.
			Start = Math.min(Math.max((Dino.x_val + Collision_object.Actor_1.x_val),
									  (Dino_map[Sliced_dino_keys[Dino_map_index]][0] + Collision_object.Actor_1.x_val)),
							 (Dino.x_val + Collision_object.Actor_1.x_val + Dino.width));
			/* The max value inside is the max between the Start value and the end value, ensuring that if we have this:
			  ________
			 |     ___|__
			 | /-/|	  |  |
			 | /-/|	  |	 |

			Then we get | as our minimum. That way we have the end value >= start always. So if there's nothing on this row, start value = end value.
			*/
			Dinosaur_overlap[(Collision_object.y_val + (y - Dino.y_val)).toString()] = [Start,
																						(Math.min((Dino.x_val + Dino.width + Collision_object.Actor_1.x_val),
																								  (Math.max(Start,
																											(Dino_map[Sliced_dino_keys[Dino_map_index]][1] +
																											 Collision_object.Actor_1.x_val)))))];
			// We have this to make sure that when y increments it goes to the next key-value pair in our array of keys for the image map.
			y = Math.min((Number(Sliced_dino_keys[Dino_map_index  +  1]) - 1), (Dino.y_val + Dino.height));
		}

		// Same thing as above.
		for (y = Cactus.y_val; y < (Cactus.y_val + Cactus.height); y++) {
			Next_index = ((y > (Number(Sliced_Cactus_keys[Cactus_map_index]))) && (y >= (Number(Sliced_Cactus_keys[(Cactus_map_index + 1)]))));
			if (Next_index) Cactus_map_index++;
			Start = Math.min(Math.max((Cactus.x_val + Collision_object.Actor_2.x_val),
									  (Cactus_map[Sliced_Cactus_keys[Cactus_map_index]][0] + Collision_object.Actor_2.x_val)),
							(Dino.x_val + Collision_object.Actor_1.x_val + Dino.width));
			Cactus_overlap[(Collision_object.y_val + (y - Cactus.y_val)).toString()] = [Start,
																						(Math.min((Cactus.x_val + Cactus.width +
																								   Collision_object.Actor_2.x_val),
																						          (Math.max(Start,
																											(Cactus_map[Sliced_Cactus_keys[Cactus_map_index]][1] +
																											 Collision_object.Actor_2.x_val)))))];
			y = Math.min((Number(Sliced_Cactus_keys[Cactus_map_index  +  1]) - 1), (Cactus.y_val + Cactus.height));
		}

		Dino_map_index = 0;
		Cactus_map_index = 0;
		var overlap_counter = 0;
		var Cactus_overlap_keys = Object.keys(Cactus_overlap);
		var Dino_overlap_keys = Object.keys(Dinosaur_overlap);
		var Interval_a = null;
		var Interval_b = null;

		// Check our overlap map objects we created from scratch, to see if there is enough overlap. Our threshold is 5.
		for (y = Collision_object.y_val; y < (Collision_object.y_val + Collision_object.height); y++) {
			Next_index = ((y > (Number(Cactus_overlap_keys[Cactus_map_index]))) && (y >= (Number(Cactus_overlap_keys[(Cactus_map_index + 1)]))));
			if (Next_index) Cactus_map_index++;
			Next_index = ((y > (Number(Dino_overlap_keys[Dino_map_index]))) && (y >= (Number(Dino_overlap_keys[(Dino_map_index + 1)]))));
			if (Next_index) Dino_map_index++;

			Interval_a = Dinosaur_overlap[Dino_overlap_keys[Dino_map_index]];
			Interval_b = Cactus_overlap[Cactus_overlap_keys[Cactus_map_index]];

			Overlap_of_both = ((((Interval_a[0] > Interval_b[0]) && (Interval_a[0] < Interval_b[1])) ||
							    ((Interval_a[1] > Interval_b[0]) && (Interval_a[1] < Interval_b[1])) ||
							    ((Interval_a[0] == Interval_b[0]) && (Interval_a[1] == Interval_b[1]))) &&
								(!(((Interval_a[1] - Interval_a[0]) == 0) || ((Interval_b[1] - Interval_b[0]) == 0))));
			if (Overlap_of_both) overlap_counter++;
			else overlap_counter = Math.max((overlap_counter - 1),0);
			if (overlap_counter >= 5) {
				return true;
			}
		}
		return false;
	}

	onmessage = function(Event) {
		/*
		Going back to the diagrams above, the x_val and y_val properties are translations so that we can use our image maps on the images drawn on the canvas.
		That square in the first drawing has its own x_val on the canvas, which we subtract from the x_val of the top left corner of each image to get where
		the x value is with respect to each image. The same goes for the y_val properties here.
		*/
		Overlap_actor_1 = {
			x_val: (Event.data[0].x_val - Event.data[0].Actor_1.x_val),
			y_val: (Event.data[0].y_val - Event.data[0].Actor_1.y_val),
			width: Event.data[0].width,
			height: Event.data[0].height,
			Source: Event.data[0].Actor_1.Img_src
		};
		Overlap_actor_2 = {
			x_val: (Event.data[0].x_val - Event.data[0].Actor_2.x_val),
			y_val: (Event.data[0].y_val - Event.data[0].Actor_2.y_val),
			width: Event.data[0].width,
			height: Event.data[0].height,
			Source: Event.data[0].Actor_2.Img_src
		};

		var Collision = Check_collision(Overlap_actor_1,Overlap_actor_2,Event.data[0]);
		postMessage([Collision,Event.data[1]]);
	};
}

var Baseline_height = null;
var Current_main_char_layer = null;

var Main_char_walking_part_1 = null;
var Main_char_walking_part_2 = null;
var Main_char_jumping = null;

var Web_worker = null;

// The magnitudes used for jumping.
var Main_Character_Jumping_variables = {
	dy: -11,
	Jump_power: -11,
	Factor: 0.5
};
// This is a workaround to still be able to run web workers not on a separate file (javascript doesn't automatically allow access to
// files on your computer). The code can be found here:
// https://stackoverflow.com/questions/37718656/why-does-not-chrome-allow-web-workers-to-be-run-in-javascript
// https://stackoverflow.com/questions/21408510/chrome-cant-load-web-worker/33432215#33432215
Web_worker = new Worker(URL.createObjectURL(new Blob(["("+ Worker_fn.toString() +")()"], {type: 'text/javascript'})));

// This function allows the dino to run. Essentially every 100 milliseconds we switch the z-index of the two layers that have pictures of the dinosaurs running,
// and then call requestAnimationFrame again.
function Run() {
	if (Game_status.continue_running) {
		if ((((Date.now()) - timestart) / Game_status.Footspeed) >= 1) {
			if ((parseInt(Dino_walking_pt_1.style.zIndex)) == 0) {
				Dino_walking_pt_1.style.zIndex = "5";
				Dino_walking_pt_2.style.zIndex = "0";
			} else {
				Dino_walking_pt_1.style.zIndex = "0";
				Dino_walking_pt_2.style.zIndex = "5";
			}
			Main_char_walking_part_1.top_index = (!Main_char_walking_part_1.top_index);
			Main_char_walking_part_2.top_index = (!Main_char_walking_part_2.top_index);

			Current_main_char_layer = Main_char_walking_part_2;
			if (Main_char_walking_part_1.top_index) Current_main_char_layer = Main_char_walking_part_1;
			timestart = Date.now();
			Animation_frames.Run_ID = requestAnimationFrame(Run);
		} else {
			Animation_frames.Run_ID = requestAnimationFrame(Run);
		}
	}
}

// This constructor is used for our main dinosaur walking on screen. We do this to help keep track of which image is visible currently,
// the image associated with each image and its x and y values. This is mainly used for our collision function.
function Main_char(Image, x_val, y_val, top_index = false) {
	this.Image = Image;
	this.x_val = x_val;
	this.y_val = y_val;
	this.top_index = top_index;
}


/*
Jumping function. Resource for simulating gravity can be found here: https://www.youtube.com/watch?v=3b7FyIxWW94
*/
function Jump() {
	// Clear the image from the screen. Clear some extra space to make sure that bits of the image are not still on the screen.
	Canvas_context.beginPath();
	Canvas_context.clearRect(99, (Main_char_jumping.y_val - 1), ((Main_char_jumping.Image.width) + 2), ((Main_char_jumping.Image.height) + 5));
	Canvas_context.closePath();

	// dy is our rate of increase in the y direction. It is negative, to which we add 0.5 everytime to start with, to simulate
	// decreased motion upward, thus mimicking gravity.
	Main_Character_Jumping_variables.dy += Main_Character_Jumping_variables.Factor;
	Main_char_jumping.y_val += Main_Character_Jumping_variables.dy;
	Main_char_jumping.y_val = Math.round(Main_char_jumping.y_val);

	if ((Main_char_jumping.y_val >= (Baseline_height)) || (Main_char_jumping.y_val <= 0)) {
		// When we go down, we don't want to go off the screen. So we set the y_val back to the original position.
		// The second conditional is there to make sure we don't fly off the screen, though realistically it will never hit true.
		Main_char_jumping.y_val = ((Canvas.height) - (Jumping_Dino.height) - 150);
		// Draw the image at the regular spot.
		Canvas_context.beginPath();
		Canvas_context.drawImage(Main_char_jumping.Image, Main_char_jumping.x_val, Main_char_jumping.y_val,
								(Main_char_jumping.Image.width), (Main_char_jumping.Image.height));
		Canvas_context.closePath();
		// To help the player in the later levels, we shortened the duration of the jump with higher jumping power and higher gravity,
		// somewhat offsetting the increased speed. We do this at level 21 and 31 or so.
		if (Game_status.past_20) {
			Main_Character_Jumping_variables.Jump_power = -16;
			Main_Character_Jumping_variables.Factor = 0.9;
			Game_status.past_20 = false;
		}
		if (Game_status.past_30) {
			Main_Character_Jumping_variables.Jump_power = -18;
			Main_Character_Jumping_variables.Factor = 1.25;
			Game_status.past_30 = false;
		}
		// Reset our dy so we can jump again.
		Main_Character_Jumping_variables.dy = Main_Character_Jumping_variables.Jump_power;
		window.cancelAnimationFrame(Animation_frames.Jump_ID);
		// Reset all the z-index values of the layers, so that the jumping dino layer is at the back, and it looks like
		// the dino is again running
		Canvas.style.zIndex = "0";
		Dino_walking_pt_1.style.zIndex = "1";
		Blue_Sky.style.zIndex = "2";
		Sky.style.zIndex = "3";
		Moving_background.style.zIndex = "4"
		Dino_walking_pt_2.style.zIndex = "5";
		timestart = Date.now();
		Game_status.continue_running = true;
		Game_status.is_jumping = false;
		// change the index of which layer of dinosaur is at the top (collision checking purposes)
		Main_char_walking_part_2.top_index = true;
		Main_char_walking_part_1.top_index = false;
		Main_char_jumping.top_index = false;
		Current_main_char_layer = Main_char_walking_part_2;
		Run();
	} else {
		// Draw the image in the new spot.
		Canvas_context.beginPath();
		Canvas_context.drawImage(Main_char_jumping.Image, Main_char_jumping.x_val, Main_char_jumping.y_val,
								(Main_char_jumping.Image.width), (Main_char_jumping.Image.height));
		Canvas_context.closePath();
		Animation_frames.Jump_ID = window.requestAnimationFrame(Jump);
	}
}

/*
Generates a random index that we use as the index in the Cacti_object.Lengths array. We can't call 0
twice in a row, as this is two short distances right next to each other (it was like this in the original
chrome dino game, I wanted to replicate this).
*/
function Random_Generator() {
	var Size_index = Math.floor(Math.random() * 3);
	if (Game_status.Current_index != Size_index) {
		Game_status.Current_index = Size_index;
	} else {
		if (Game_status.Current_index == 0) {
			while (Size_index == Game_status.Current_index) {
				Size_index = Math.floor(Math.random() * 3);
			}
			Game_status.Current_index = Size_index;
		}
	}
}

/*
Box model detection, return true on collision.
Code originally found here: https://benjaminhorn.io/code/pixel-accurate-collision-detection-with-javascript-and-canvas/
*/
function hitBox(source, target) {
	/* Source and target objects contain x, y and width, height */
	return (!(
		((source.y_val + source.Image.height) < (target.y_val)) ||
		(source.y_val > (target.y_val + target.Image.height)) ||
		((source.x_val + source.Image.width) < target.x_val) ||
		(source.x_val > (target.x_val + target.Image.width))
	));
}

// Our object consisting of proper data used to check for collision.
var Collision_Region = {
	x_val: null,
	width: null,
	y_val: null,
	height: null,
	Actor_1: null,
	Actor_2: null
};

// This is the function to move cacti across the screen
function Move_cacti() {
	if ((Cacti_object.Cacti.length) == 0) {
		// We create a new cactus object to put in the array.
		Cacti_object.Cactus_of_Choice = Math.floor((Math.random()) * 2);
		Cacti_object.Cacti.unshift(new Cactus(Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice],
											 (Canvas.width),
											 (Canvas.height - Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice].height - 150),
											  Game_status.duration));
		Cacti_object.Cacti[0].init();
		Game_status.cacti_passed++;
		Random_Generator();
	} else {
		if (Cacti_object.Cacti[((Cacti_object.Cacti.length) - 1)].x_val <= 0) {
			// If the cactus is at the end of the screen, clear it from the screen and the array
			Moving_background_context.beginPath();
			Moving_background_context.clearRect(Cacti_object.Cacti[((Cacti_object.Cacti.length) - 1)].x_val,
												Cacti_object.Cacti[((Cacti_object.Cacti.length) - 1)].y_val,
											   (Cacti_object.Cacti[((Cacti_object.Cacti.length) - 1)].Image.width + 3),
											   (Cacti_object.Cacti[((Cacti_object.Cacti.length) - 1)].Image.height));
			Moving_background_context.closePath();
			Cacti_object.Popped_object = Cacti_object.Cacti.pop();
			Cacti_object.Popped_object = null;
			Game_status.counter++;
			// If we passed the pass_level_amt, then we do many things to increase the speed and level amount.
			if (Game_status.counter == Game_status.pass_level_amt) {
				// increase levels passed, for the purpose of drawing levels_passed + 1 to the scoreboard and
				Game_status.Levels_passed += 1;
				// Add 1 to the pass_level_amt every 2 levels, somewhat offsetting the speed increasee of the cactus.
				Game_status.pass_level_amt += (Game_status.Levels_passed % 2);
				Game_status.counter = 0;
				// Cacti can take the minimum of 1100 milliseconds to move across the screen.
				Game_status.duration = Math.max(1100, (Game_status.duration - 150));
				// Add pixels to each distance, to make it a little easier, every level_factor number of levels.
				if (((Game_status.Levels_passed % Game_status.level_factor) == 0) && (Game_status.duration > 1200)) {
					Cacti_object.Lengths = Cacti_object.Lengths.map(x => (Math.floor(x + 2)));
				}
				// If we have passed the appropriate levels, then we have the appropriate booleans be true, allowing for the
				// jump speed to increase in our jump function. It's one less because the scoreboard displays levels_passed + 1.
				if ((Game_status.Levels_passed / 9) == 1) {
					Game_status.past_20 = true;
				}
				if ((Game_status.Levels_passed / 19) == 1) {
					Game_status.past_30 = true;
				}
				if ((Game_status.Levels_passed % 10) == 0) {
					// Reduce the limit of cacti on screen. This makes it easier for the player and the browser (less to render)
					Game_status.Limit = Math.max(3, (Game_status.Limit - 1));
					// level_factor (the number of levels to be passed before increasing the distance in pixels) gets decreased
					// every 10 levels, to a minimum of 1. Essentially, at that point every level the distances are increased, though
					// realistically the level_factor will be 2 every time because this conditional is called at level 10 only, hence
					// being called once going from 4 to 2. But we've left it as is as it doesn't do harm to the program.
					if ((Game_status.Levels_passed / 10) == 1) Game_status.level_factor = Math.max(1, (Game_status.level_factor * 0.5));
				}
			}
		}
		// The if statement wrapping around was there to fix a bug that would appear late in the game where the distances were so far away that
		// nothing would be on the screen, the cacti array would be empty, and we would try to get the first element of it.
		if (!(Cacti_object.Cacti.length == 0)) {
			// If the length between the cactus and the right side of the canvas is greater than or equal to the random length (realistically what comes
			// out of that Math.max statement, that I'll just leave as is because it works), we add a new cactus onto the array. It is either a large or
			// small one chosen randomly.
			if (Cacti_object.Cacti[0].x_val <= Math.max(((Canvas.width - Cacti_object.Lengths[Game_status.Current_index])), (Sample_cactus.Image.width))) {
				if (Cacti_object.Cacti[0].duration != Game_status.duration) {
					// If the game duration has changed (i.e. the next cactus moves faster), then we wait for the rightmost cactus to
					// be at least 60% of the way through the surface. This is our attempt to make sure that the next cactus doesn't overtake
					// the previous one. Also, if there are less cacti than the limit, then only add this one.
					if ((Cacti_object.Cacti[0].x_val <= (0.4 * Canvas.width)) && (Cacti_object.Cacti.length < Game_status.Limit)) {
						Cacti_object.Cactus_of_Choice = Math.floor((Math.random()) * 2);
						Cacti_object.Cacti.unshift(new Cactus(Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice],
															 (Canvas.width),
															 (Canvas.height - Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice].height - 150),
															  Game_status.duration));
						Game_status.cacti_passed++;
						Cacti_object.Cacti[0].init();
					}
				} else {
					// If there are less cacti than the limit, then only add another one.
					if (Cacti_object.Cacti.length < Game_status.Limit) {
						Cacti_object.Cactus_of_Choice = Math.floor((Math.random()) * 2);
						Cacti_object.Cacti.unshift(new Cactus(Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice],
															(Canvas.width - Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice].width),
															(Canvas.height - Cacti_object.Available_cacti[Cacti_object.Cactus_of_Choice].height - 150),
															 Game_status.duration));
						Game_status.cacti_passed++;
						Cacti_object.Cacti[0].init();
					}
				}
				// Random index for the next distance.
				Random_Generator();
			}
		}
		for (var i = 0; i < (Cacti_object.Cacti.length); i++) {
			// clear and move, then repaint all cacti across the screen.
			Moving_background_context.beginPath();
			Moving_background_context.clearRect(Cacti_object.Cacti[i].x_val,
												Cacti_object.Cacti[i].y_val,
											   (Cacti_object.Cacti[i].Image.width + 15),
											    Cacti_object.Cacti[i].Image.height);
			Cacti_object.Cacti[i].move();
			Moving_background_context.drawImage(Cacti_object.Cacti[i].Image,
												Cacti_object.Cacti[i].x_val,
												Cacti_object.Cacti[i].y_val,
											   (Cacti_object.Cacti[i].Image.width),
											   (Cacti_object.Cacti[i].Image.height));
			Moving_background_context.closePath();
		}
	}
	Animation_frames.Animation_ID = window.requestAnimationFrame(Move_cacti);
}

var Popped_pebbble = null;
// Level is used to check whether the level has changed. If it has, then we change it accordingly, reducing how often we have to repaint more
// of the scoreboard. We're trying to be efficient essentially.
var Level = 0;

/*
Our function to change the scoreboard.
*/
function Change_scoreboard() {
	var String_to_measure = null;
	// What we use to check the number of digits in the level. We use this to re-render the scoreboard to avoid
	// overlap between the level and the "Score" text.
	var Digits = (Game_status.Levels_passed).toString().length;
	var New_Digits = (Game_status.Levels_passed + 1).toString().length;
	// Assign String_to_measure based on whether the level has changed. This string will be measured in terms of width on canvas.
	if (Level == Game_status.Levels_passed) {
		String_to_measure = "Level: " + (Level.toString()) + " score: ";
	} else {
		String_to_measure = "Level: " + ((Game_status.Levels_passed + 1).toString()) + " score: ";
	}
	Sky_context.beginPath();
	if (Level != Game_status.Levels_passed) {
		Sky_context.fillStyle = "black";
		// Essentially redraw parts of the scoreboard so as to make it look the similar to before, but with more spaces.
		if (New_Digits > Digits) {
			// First draw the larger black rectangle
			Sky_context.fillRect((10 + (Sky_context.measureText("Level: ").width)),5,
								 (Math.max((256 - (10 + (Sky_context.measureText("Level: ").width))),
										  (Sky_context.measureText(((Game_status.Levels_passed + 1).toString()) + " score: " +
										   (Game_status.score.toString())).width + 2 + Sky_context.measureText(" ").width))),
								  30);
			// Draw the inner white rectangle after to resemble the outline. I thought this would be faster than drawing lines to be a rectangle and
			// filling them.
			Sky_context.fillStyle = "white";
			Sky_context.fillRect((9 + (Sky_context.measureText("Level: ").width)),7,
								  (Math.max((254 - (9 + (Sky_context.measureText("Level: ").width))),
											(Sky_context.measureText(((Game_status.Levels_passed + 1).toString()) + " score: " +
																	 (Game_status.score.toString())).width + Sky_context.measureText(" ").width))),
								  26);
			Sky_context.fillStyle = "black";
			Sky_context.fillText(((Game_status.Levels_passed + 1).toString() + " score: " + (Game_status.score.toString())),
								 (10 + Sky_context.measureText("Level: ").width), 28);
		} else {
			// In the case that the level has same number of digits, just paint over the parts where the numbers are, and refill the place with new text
			Sky_context.fillStyle = "white";
			Sky_context.fillRect((10 + (Sky_context.measureText("Level: ").width)),7,
								 (Sky_context.measureText((Game_status.Levels_passed + 1).toString()).width),
								  26);
			Sky_context.fillStyle = "black";
			Sky_context.fillText(((Game_status.Levels_passed + 1).toString()),
								 (10 + Sky_context.measureText("Level: ").width), 28);
			Sky_context.fillStyle = "white";
			Sky_context.fillRect((10 + (Sky_context.measureText(String_to_measure).width)),7,
								  (Math.max(66, (Sky_context.measureText(Game_status.score.toString()).width))),26);
			Sky_context.fillStyle = "black";
			Sky_context.fillText((Game_status.score.toString()), (10 + Sky_context.measureText(String_to_measure).width), 28);
		}
		Level = Game_status.Levels_passed;
	} else {
		// this conditional was used to account for a bug when we went from level 9 to 10 on the scoreboard.
		if (New_Digits > Digits) {
			String_to_measure = ("Level: " + (Game_status.Levels_passed + 1).toString() + " score: ");
		}
		// redraw parts of the screen to re-render the score.
		if ((10 + (Sky_context.measureText(String_to_measure).width) + (Sky_context.measureText(Game_status.score.toString()).width)) > 240) {
			// If the whole string is wider than the container, redraw the container.
			Sky_context.fillStyle = "black";
			Sky_context.fillRect((10 + (Sky_context.measureText(String_to_measure).width)),5,
								 (Sky_context.measureText(Game_status.score.toString()).width + 10),30);
			Sky_context.fillStyle = "white";
			Sky_context.fillRect((9 + (Sky_context.measureText(String_to_measure).width)), 7,
								 (Sky_context.measureText(Game_status.score.toString()).width + 9),26);
		} else {
			// If it is not wider than the container, than redraw the part where the score is placed.
			Sky_context.fillStyle = "white";
			Sky_context.fillRect((10 + (Sky_context.measureText(String_to_measure).width)),7,
								 (243 - (Sky_context.measureText(String_to_measure).width)),26);
		}
		Sky_context.fillStyle = "black";
		Sky_context.fillText((Game_status.score.toString()), (10 + Sky_context.measureText(String_to_measure).width), 28);
	}
	Sky_context.closePath();

	// If the score is less than 0 (changed in Move_pebbles), reset everything in the game, remove the event handler on the spacebar,
	// and display the game over modal.
	if (Game_status.score < 0) {
		window.cancelAnimationFrame(Animation_frames.Animation_ID);
		window.cancelAnimationFrame(Animation_frames.Jump_ID);
		window.cancelAnimationFrame(Animation_frames.Run_ID);
		window.cancelAnimationFrame(Animation_frames.Pebble_ID);
		window.cancelAnimationFrame(Cloud_ID);

		Modal.style.display = "block";
		Cacti_object.Cacti = [];
		Game_status.Clouds = [];
		Game_status.Pebbles = [];
		Game_status.duration = 4000;
		Cacti_object.Lengths = [200,300,400];
		Game_status.Levels_passed = 0;
		Game_status.counter = 0;
		Game_status.Current_index = null;
		Game_status.Limit = 4;
		Game_status.pass_level_amt = 4;
		Game_status.is_jumping = false;
		Game_status.continue_running = null;
		Game_status.game_has_started = false;
		Game_status.level_factor = 4;
		Game_status.past_20 = false;
		Game_status.past_30 = false;
		Game_status.cacti_passed = 0;
		Game_status.score = 0;

		window.removeEventListener("keydown", Spacebar_Event_Handler);
	}
}

/*
This function is responsible for moving the pebbles, as well as checking for collisions and updating the scoreboard.
*/
function Move_pebbles() {
	var random_length = null;
	var within_range = null;
	// If we have no pebbles, then let's add pebbles to the array to display on screen.
	if (Game_status.Pebbles.length == 0) {
		Game_status.Pebbles.unshift(new Pebble((Canvas.width - 9), ((Math.floor((Math.random() * 100))) + (Canvas.height - 130)), Game_status.duration));
		Game_status.Pebbles[0].init();
	} else {
		// We want random lengths between pebbles.
		random_length = Math.min(((Math.floor(Math.random() * Canvas.width)) + 200), 700);
		let Pebbles_length = Game_status.Pebbles.length;
		// Remove the pebbles from our array if they reach the end of the screen.
		if (Game_status.Pebbles[Pebbles_length - 1].x_val <= 0) {
			Game_status.Pebbles[Pebbles_length - 1].clear();
			Popped_pebbble = Game_status.Pebbles.pop();
			Popped_pebbble = null;
		}
		// If there are less than 2 pebbles on screen and our pebbles are the random_length length apart, add a new pebble.
		if ((Game_status.Pebbles[0].x_val < (Canvas.width - random_length)) && (Game_status.Pebbles.length < 2)){
			Game_status.Pebbles.unshift(new Pebble((Canvas.width - 9), ((Math.floor((Math.random() * 100))) + (Canvas.height - 130)), Game_status.duration));
			Game_status.Pebbles[0].init();
		}
		// Clear all our pebbles from the screen, then move them, then draw them again.
		for (let Stone of Game_status.Pebbles) {
			// if (Game_status.duration != Stone.duration) Stone.duration = Game_status.duration;
			Stone.clear();
			Stone.move();
			Stone.draw();
		}
		// We put this in a different function to avoid having it in our main function that moves the cacti, as we want to reduce the time between when the
		// cacti moves and renders itself.
		for (var i = (Math.max((Cacti_object.Cacti.length - 2), 0)); i < (Cacti_object.Cacti.length); i++) {
			// This checks whether there is any overlap between the cactus and the dinosaur in the x direction.
			within_range = (((Current_main_char_layer.x_val - Cacti_object.Cacti[i].Image.width) < Cacti_object.Cacti[i].x_val) &&
							(Cacti_object.Cacti[i].x_val < (Current_main_char_layer.x_val + Current_main_char_layer.Image.width)) &&
							(Cacti_object.Cacti[i].collision != true))
			if (within_range) {
				// Check if we actually have a collision region between the two image "boxes"
				if (hitBox(Current_main_char_layer, Cacti_object.Cacti[i])) {
					/*
					Description of what's going on here:
					The x_val of the collision region of which box has the larger collision region. The width is the length of overlap between these boxes.
					The same goes for the y_val.
					 __________
					|		   |
					|	2      |
					|    ______|_____
					|   |      |	 |
					|___|______|     |
						|		1    |
						|____________|

					*/
					Collision_Region.x_val = Math.floor(Math.ceil(Cacti_object.Cacti[i].x_val));
					/*
						Why we have Math.min for our width value: Normally we take the x_val of "2" and add width, to then subtract the x_val of "1".
						This is not necessarily the case always, so we have a min in front in case that the actual width of "1" is less than that calculation.
						The same goes for the y_val.
				     __________
					|		   |
					|	2      |
					|    ____  |
					|   |    | |
					|___|____|_|
						|  1 |
						|____|
					*/
					Collision_Region.width = Math.floor(Math.min((Current_main_char_layer.x_val +
																  Current_main_char_layer.Image.width -
																  Cacti_object.Cacti[i].x_val),
																  Cacti_object.Cacti[i].Image.width));

					if (Cacti_object.Cacti[i].x_val < Current_main_char_layer.x_val) {
						// If the boxes are in the opposite case where the box labelled "1" in our analogy is actually box "2", then we do the
						// same thing as above but for the opposite boxes. So we take the measurements where "1" is "2" and vice versa
						Collision_Region.x_val = Current_main_char_layer.x_val;
						Collision_Region.width = Math.floor(Math.min((Cacti_object.Cacti[i].x_val +
																	  Cacti_object.Cacti[i].Image.width -
																	  Current_main_char_layer.x_val),
																	  Current_main_char_layer.Image.width));
					}
					// You can refer to the above diagram for the explanation, but it's basically the same thing.
					Collision_Region.y_val = Math.round(Cacti_object.Cacti[i].y_val);
					Collision_Region.height = Math.floor(Math.min((Current_main_char_layer.y_val +
																   Current_main_char_layer.Image.height -
																   Cacti_object.Cacti[i].y_val),
																   Cacti_object.Cacti[i].Image.height));

					if (Cacti_object.Cacti[i].y_val < Current_main_char_layer.y_val) {
						Collision_Region.y_val = Math.round(Current_main_char_layer.y_val);
						Collision_Region.height = Math.floor(Math.min((Cacti_object.Cacti[i].y_val +
																	   Cacti_object.Cacti[i].Image.height -
																	   Current_main_char_layer.y_val),
																	   Current_main_char_layer.Image.height));
					}
					/*
					Since you can't pass the original object to the web worker without giving up control of the original object (problematic
					since we have to draw cacti to the screen), we create makeshift "copies" that send the important data attributes required for
					our web worker function to process it.
					*/
					Collision_Region.Actor_1 = {
						Img_src: Current_main_char_layer.Image.src,
						x_val: Current_main_char_layer.x_val,
						y_val: Math.round(Current_main_char_layer.y_val),
						width: Current_main_char_layer.Image.width,
						height: Current_main_char_layer.Image.height
					};
					Collision_Region.Actor_2 = {
						Img_src: Cacti_object.Cacti[i].Image.src,
						x_val: Math.floor(Math.ceil(Cacti_object.Cacti[i].x_val)),
						y_val: Cacti_object.Cacti[i].y_val,
						width: Cacti_object.Cacti[i].Image.width,
						height: Cacti_object.Cacti[i].Image.height
					};
					// Send the object with the right data to the web worker, and the index i as well.
					// When it returns assign the according boolean result to the appropriate cactus's collision property (true if collision, false otherwise)
					Web_worker.postMessage([Collision_Region,i]);
					Web_worker.onmessage = function(Result) {
						Cacti_object.Cacti[Result.data[1]].collision = Result.data[0];
					};
				}
			}
			// If the cactus is out of collision range, and has not been checked yet, then add or subtract score. Then set its collision property to null,
			// and its checked property to true so we don't keep checking it. Change the scoreboard accordingly.
			if ((Cacti_object.Cacti[i].x_val < (Current_main_char_layer.x_val - (Cacti_object.Cacti[i].Image.width))) && (!Cacti_object.Cacti[i].checked)) {
				if (Cacti_object.Cacti[i].collision) Game_status.score -= 5;
				else Game_status.score++;
				Cacti_object.Cacti[i].collision = null;
				Cacti_object.Cacti[i].checked = true;
				Change_scoreboard();
			}
		}
	}
	Animation_frames.Pebble_ID = requestAnimationFrame(Move_pebbles);
}

// Our function to clear the screen when starting the game again. This is the click event handler function to the makeshift button
// on our game over modal (shows when the game's over).
function Start_over() {
	Sky_context.beginPath();
	Sky_context.clearRect(0, 40, (Sky.width), (Sky.height - 190));
	Sky_context.closePath();
	Sky_context.beginPath() ;
	Sky_context.fillStyle = "black";
	Sky_context.fillRect(5, 5, 250, 30);
	Sky_context.fillStyle = "white";
	Sky_context.fillRect(7, 7, 246, 26);
	Sky_context.fillStyle = "black";
	Sky_context.font = "20px Verdana";
	Sky_context.fillText("Level: 1 score: 0", 10, 28);
	Sky_context.closePath();

	Moving_background_context.beginPath();
	Moving_background_context.clearRect(0,0,(Canvas.width), (Canvas.height));
	Moving_background_context.closePath();

	Modal.style.display = "none";
	Game_status.game_has_started = true;
	Game_status.continue_running = true;
	Move_pebbles();
	Move_cacti();
	Move_clouds();
	Run();
	window.addEventListener("keydown",Spacebar_Event_Handler);
}


// Event handler when the user presses the spacebar for the dinosaur to jump. It also starts the game if it hasn't been started already.
function Spacebar_Event_Handler(event) {
	if (event.keyCode == 32) {
		event.preventDefault();
		if (!Game_status.is_jumping) {
			Game_status.is_jumping = true;
			Dino_walking_pt_1.style.zIndex = "0";
			Dino_walking_pt_2.style.zIndex = "1";
			Blue_Sky.style.zIndex = "2";
			Sky.style.zIndex = "3";
			Moving_background.style.zIndex = "4";
			Canvas.style.zIndex = "5";

			Main_char_walking_part_1.top_index = false;
			Main_char_walking_part_2.top_index = false;
			Main_char_jumping.top_index = true;
			Current_main_char_layer = Main_char_jumping;
			//Sky.style.zIndex = "-1";
			Game_status.continue_running = false;
			//console.log("Jumped");
			Jump();
			if (!Game_status.game_has_started) {
				Game_status.game_has_started = true;
				Move_pebbles();
				Move_cacti();
				Move_clouds();
			}
		}
	}
}

// Some pre rendering stuff we do to start the game.
Sky_context.beginPath();
Sky_context.fillStyle = "#ECE2C6";
Sky_context.fillRect(0, (Sky.height - 150), (Sky.width), 150);
Sky_context.closePath();
Sky_context.beginPath();
Sky_context.strokeStyle = "black";
Sky_context.lineWidth = 2;
Sky_context.moveTo(0, (Canvas.height - 150));
Sky_context.lineTo((Canvas.width),(Canvas.height - 150));
Sky_context.stroke();
Sky_context.closePath();

Sky_context.beginPath() ;
Sky_context.fillStyle = "black";
Sky_context.fillRect(5,5, 250, 30);
Sky_context.fillStyle = "white";
Sky_context.fillRect(7,7,246,26);
Sky_context.fillStyle = "black";
Sky_context.font = "20px Verdana";
Sky_context.fillText("Level: 1 score: 0",10,28);
Sky_context.closePath();

Walking_dino_pt_1.addEventListener("load", () => {
	// We initialize the image with its width, so that it ends up being drawn on the canvas. Otherwise, the image doesn't draw because the code
	// runs before it's loaded. We add our event handlers that start the game in this nest of load event listeners for this reason.
	Walking_dino_pt_1 = new Image((Walking_dino_pt_1.width), (Walking_dino_pt_1.height));
	Walking_dino_pt_1.src = "Dino_walking_part_1.png";
	//console.log(Walking_dino_pt_1.width, Walking_dino_pt_1.height);
	Dino_walking_pt_1_context.drawImage(Walking_dino_pt_1, 100, ((Canvas.height) - (Walking_dino_pt_1.height) - 150),
										(Walking_dino_pt_1.width), (Walking_dino_pt_1.height));
	// We have objects for various states of the dinosaur walking and jumping, to keep track of them for our collision function.
	Main_char_walking_part_1 = new Main_char(Walking_dino_pt_1, 100, ((Canvas.height) - (Walking_dino_pt_1.height) - 150));

	Walking_dino_pt_2.addEventListener("load", () => {
		Walking_dino_pt_2 = new Image((Walking_dino_pt_2.width), (Walking_dino_pt_2.height));
		Walking_dino_pt_2.src = "Dino_walking_part_2.png";
		Dino_walking_pt_2_context.drawImage(Walking_dino_pt_2, 100, ((Canvas.height) - (Walking_dino_pt_2.height) - 150),
											(Walking_dino_pt_2.width), (Walking_dino_pt_2.height));
		Main_char_walking_part_2 = new Main_char(Walking_dino_pt_2, 100, ((Canvas.height) - (Walking_dino_pt_2.height) - 150));

		Jumping_Dino.addEventListener("load", () => {
			Jumping_Dino = new Image((Jumping_Dino.width), (Jumping_Dino.height));
			Jumping_Dino.src = "Resized_dino.png";
			Canvas_context.drawImage(Jumping_Dino, 100, ((Canvas.height) - (Jumping_Dino.height) - 150),
									(Jumping_Dino.width), (Jumping_Dino.height));

			Main_char_jumping = new Main_char(Jumping_Dino, 100, ((Canvas.height) - (Jumping_Dino.height) - 150));
			Baseline_height = Main_char_jumping.y_val;

			Medium_Cactus.addEventListener("load", () => {
				Medium_Cactus = new Image((Medium_Cactus.width), (Medium_Cactus.height));
				Medium_Cactus.src = "Medium_Cactus.png";
			});

			Large_Cactus.addEventListener("load", () => {
				Large_Cactus = new Image((Large_Cactus.width), (Large_Cactus.height));
				Large_Cactus.src = "Large_Cactus.png";
				Cacti_object.Available_cacti = [Medium_Cactus, Large_Cactus];
			});

			Cloud_image.addEventListener("load", () => {
				Cloud_image = new Image((Cloud_image.width), (Cloud_image.height));
				Cloud_image.src = "Moving_cloud.png";
			});

			window.addEventListener("keydown", Spacebar_Event_Handler);
 		});
	});
});

Start_over_button.addEventListener("click", Start_over);
var Sample_cactus = new Cactus(Medium_Cactus, (Canvas.width - Medium_Cactus.width), (Canvas.height - Medium_Cactus.height - 150), Game_status.duration);
