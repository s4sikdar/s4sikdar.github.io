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

	// try {
	// 	start_index = Dino_keys.find((key, index, arr) => {
	// 		return (((Number(key)) <= Dino.y_val) && (Dino.y_val < (Number(arr[index + 1]))));
	// 	});
	// 	end_index = Dino_keys.find((key, index, arr) => {
	// 		return (((Number(key)) <= (Dino.y_val + Dino.height)) &&
	// 						((Dino.y_val + Dino.height) < (Number(arr[index + 1]))));
	// 	});
	// 	if (start_index && end_index) {
	// 		Sliced_dino_keys = Dino_keys.slice((Dino_keys.indexOf(start_index)),
	// 																			 (Dino_keys.indexOf(end_index)));
	// 	}
	// } catch (err) {
	// 	alert(err, "in first try catch block");
	// }
	for (var i = 0; i < (Dino_keys.length - 1); i++) {
		if (((Number(Dino_keys[i])) <= Dino.y_val) && (Dino.y_val < (Number(Dino_keys[i+1])))) {
			start_index = Dino_keys[i];
		}
		if (((Number(Dino_keys[i])) <= (Dino.y_val + Dino.height)) &&
				((Dino.y_val + Dino.height) < (Number(Dino_keys[i+1])))) {
			end_index = Dino_keys[i + 1];
		}
		if ((start_index) && (end_index)) {
			Sliced_dino_keys = Dino_keys.slice((Dino_keys.indexOf(start_index)),
																				 (Dino_keys.indexOf(end_index)));
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

	// try {
	// 	start_index = Cactus_keys.find((key, index, arr) => {
	// 		return (((Number(key)) <= Cactus.y_val) && (Cactus.y_val < (Number(arr[index + 1]))));
	// 	});
	// 	end_index = Cactus_keys.find((key, index, arr) => {
	// 		return (((Number(key)) <= (Cactus.y_val + Cactus.height)) &&
	// 					  ((Cactus.y_val + Cactus.height) < (Number(arr[index + 1]))));
	// 	});
	// 	if (start_index && end_index) {
	// 		Sliced_Cactus_keys = Cactus_keys.slice((Cactus_keys.indexOf(start_index)), (Cactus_keys.indexOf(end_index)));
	// 		start_index = 0;
	// 	}
	// } catch(err) {
	// 	alert(err, "in second try catch block");
	// }


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
		// console.log(Dino_map);
		// console.log(Dino_map_index);
		// console.log(Sliced_dino_keys);
		// console.log(Sliced_dino_keys[Dino_map_index]);
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
