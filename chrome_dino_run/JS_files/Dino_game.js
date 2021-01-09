import { MovingObjects } from "./Moving Objects.js";
import { Pebble } from "./Pebble.js";
import { Cactus_object, Cactus } from "./Cactus.js";
import { Cloud } from "./Cloud.js";


/*
We avoid having too many variables in the global namespace by having them in
Object literals instead.
*/
let Canvas_layers = {
	jumping_layer: document.getElementById('Dino'),
	jumping_layer_context: document.getElementById('Dino').getContext('2d'),
	dino_walking_pt_1: document.getElementById('Dino_walking_pt_1'),
	dino_walking_pt_1_context: document.getElementById('Dino_walking_pt_1').getContext('2d'),
	dino_walking_pt_2: document.getElementById('Dino_walking_pt_2'),
	dino_walking_pt_2_context: document.getElementById('Dino_walking_pt_2').getContext('2d'),
	moving_background: document.getElementById('Moving_background'),
	moving_background_context: document.getElementById('Moving_background').getContext('2d'),
	sky: document.getElementById('Sky'),
	sky_context: document.getElementById('Sky').getContext('2d')
}


let Blue_Sky = document.getElementById("Blue_Sky");
let Walking_dino_pt_1, Walking_dino_pt_2, Jumping_Dino,
	 	 Medium_Cactus, Large_Cactus, Cloud_image;
let Popped_cloud = null;
let Baseline_height = null;
let Current_main_char_layer = null;
let Main_char_walking_part_1 = null;
let Main_char_walking_part_2 = null;
let Main_char_jumping = null;


// Images that have to be loaded
let Img_src_arr = [
	"./Images/Dino_walking_part_1.png",
	"./Images/Dino_walking_part_2.png",
	"./Images/Resized_dino.png",
	"./Images/Medium_Cactus.png",
	"./Images/Large_Cactus.png",
	"./Images/Moving_cloud.png"
];

// Game over modal and the start over button once the game ends
let Modal = document.getElementById("Modal");
let Start_over_button = document.getElementById("Start_over_button");


/*
All our variables which we assign the ids from requestAnimationFrame calls. I decided to put
all variables in object literals to reduce the amount of variables in the global namespace.
*/
let Animation_frames = {
	Animation_ID: null,
	Run_ID: null,
	Jump_ID: null,
	Pebble_ID: null,
	Cloud_ID: null
};


let Cacti_object = {
	Cacti: [],
	Popped_object: null,
	Lengths: [200,300,400],
	Cactus_of_Choice: null,
	Available_cacti: null
};


/*
The game status at the start of the game. This stores all default values that
certain properties should have at the start of the game. When the game is over,
we reset Current_Game_status to this.
*/
let Default_Game_status = {
	duration: 4000,
	// How many cacti we passed in comparison to the amount to pass the level,
	// referred to by pass_level_amt
	counter: 0,
	Scale_factor: 0.95,
	// Amount counter has to reach to pass one level, starts at 4
	pass_level_amt: 4,
	Levels_passed: 0,
	Limit: 4,
	Current_index: null,
	Pebbles: [],
	Clouds: [],
	is_jumping: false,
	// milliseconds between change in image of the main character steppping
	// (right foot up vs left foot up, giving impression of running)
	Footspeed: 100,
	// Whether or not to continue the running animation. Set to true and false based
	// on whether we're jumping.
	continue_running: null,
	game_has_started: false,
	// level_factor refers to the number of levels that must be passed before
	// we increase the distances between cacti. Triggers every 4 levels at first,
	// then every 2 levels after level 10
	level_factor: 4,
	past_level_20: false,
	past_level_30: false,
	cacti_passed: 0,
	score: 0,
	// used to set current time to, to then measure time elapsed, so that we can then
	// change the image of the running dinosaur in the Run function
	timestart: null
};


/*
Represents the current state of various properties of the game. This gets
mutated, and at the end of the game we reset it to Default_Game_status
*/
let Current_Game_status = {...Default_Game_status};


// Our object consisting of proper data used to check for collision.
let Collision_Region = {
	x_val: null,
	width: null,
	y_val: null,
	height: null,
	Actor_1: null,
	Actor_2: null
};


// The magnitudes used for jumping.
let MainCharJumpVariabes = {
	dy: -11,
	Jump_power: -11,
	Factor: 0.5
};
/*
Use the copy of MainCharJumpVariabes, and make changes to it.
When the game is over, and you play again, reset MainCharJumpVariabesCopy
back to MainCharJumpVariabes.
*/
let MainCharJumpVariabesCopy = { ... MainCharJumpVariabes};

// The web worker we will use for our image collision algorithm.
let Web_worker = new Worker("JS_files/Worker.js");

/*
This constructor is used for our main dinosaur walking on screen. We do this to
help keep track of which image is visible currently, the image associated with
each image and its x and y values. This is mainly used for our collision function.
*/
class MainChar {
	constructor(Img, x_val, y_val, top_index = false) {
		this.img = Img;
		this.x_val = x_val;
		this.y_val = y_val;
		this.top_index = top_index;
	}
}


/*
This function moves the clouds across the screen. I will refrain from detailed
explanation here, since the structure is the very similar as that of our Move_pebbles
function and the Move_cacti function
*/
function Move_clouds() {
	if (Current_Game_status.Clouds.length == 0) {
		// We want clouds to have random y values in a certain range of the screen vertically.
		Current_Game_status.Clouds.unshift(new Cloud((Canvas_layers.jumping_layer.width),
																								 (Math.floor(((Math.random()) * 75) + 40))));
		Current_Game_status.Clouds[0].init();
	} else {
		/*
		Criteria for when to add a cloud - is it far enough into the screen, and
		do we not have enough clouds in the screen? Then only add another.
		*/
		if ((Current_Game_status.Clouds[0].x_val <= (Canvas_layers.jumping_layer.width * 0.3)) &&
				(Current_Game_status.Clouds.length < 2)) {
			Current_Game_status.Clouds.unshift(new Cloud((Canvas_layers.jumping_layer.width),
																									((Math.floor((Math.random()) * 75)) + 40)));
			Current_Game_status.Clouds[0].init();
		}
		/*
		Get rid of clouds that have left the screen. I made use of higher order
		array functions mainly to be comfortable using them. The filter statement
		could have easily been done with an if statement.
		*/
		Current_Game_status.Clouds = Current_Game_status.Clouds.filter(
			(Cloud, index, cloud_arr) => ((index != (cloud_arr.length - 1)) ||
																		(Cloud.x_val > (0 - Cloud.img.width))));
		Current_Game_status.Clouds = Current_Game_status.Clouds.map((Single_cloud) => {
			Canvas_layers.sky_context.beginPath();
			Canvas_layers.sky_context.clearRect((Single_cloud.x_val - 1),
																					(Single_cloud.y_val - 1),
																					(Single_cloud.img.width + 2),
																					(Single_cloud.img.height + 2));
			Single_cloud.move();
			Canvas_layers.sky_context.drawImage(Single_cloud.img,
																					Single_cloud.x_val,
																					Single_cloud.y_val,
																					Single_cloud.img.width,
																					Single_cloud.img.height);
			Canvas_layers.sky_context.closePath();

			return Single_cloud;
		});
	}
	Animation_frames.Cloud_ID = requestAnimationFrame(Move_clouds);
}


/*
This function allows the dino to run. Essentially every 100 milliseconds we
switch the z-index of the two layers that have pictures of the dinosaurs running,
and then call requestAnimationFrame again. setInterval is avoided here because
you don't want to clog up the event loop with functions from setInterval being
added to the event loop every 100 milliseconds. This gets in the way of timely
browser rendering.
*/
function Run() {
	if (Current_Game_status.continue_running) {
		if ((((Date.now()) - Current_Game_status.timestart) / Current_Game_status.Footspeed) >= 1) {
			if ((parseInt(Canvas_layers.dino_walking_pt_1.style.zIndex)) == 0) {
				Canvas_layers.dino_walking_pt_1.style.zIndex = "5";
				Canvas_layers.dino_walking_pt_2.style.zIndex = "0";
			} else {
				Canvas_layers.dino_walking_pt_1.style.zIndex = "0";
				Canvas_layers.dino_walking_pt_2.style.zIndex = "5";
			}
			Main_char_walking_part_1.top_index = (!Main_char_walking_part_1.top_index);
			Main_char_walking_part_2.top_index = (!Main_char_walking_part_2.top_index);

			Current_main_char_layer = Main_char_walking_part_2;
			if (Main_char_walking_part_1.top_index) Current_main_char_layer = Main_char_walking_part_1;
			Current_Game_status.timestart = Date.now();
			Animation_frames.Run_ID = requestAnimationFrame(Run);
		} else {
			Animation_frames.Run_ID = requestAnimationFrame(Run);
		}
	}
}


/*
Jumping function. Resource for simulating gravity can be found here:
https://www.youtube.com/watch?v=3b7FyIxWW94
*/
function Jump() {
	/*
	Clear the image from the screen. Clear some extra space to make sure that bits
	of the image are not still on the screen.
	*/
	Canvas_layers.jumping_layer_context.beginPath();
	Canvas_layers.jumping_layer_context.clearRect(99,
												 											 (Main_char_jumping.y_val - 1),
												 										  ((Main_char_jumping.img.width) + 2),
												 										  ((Main_char_jumping.img.height) + 5));
	Canvas_layers.jumping_layer_context.closePath();
	/*
	dy is our rate of increase in the y direction. It is negative, to which we
	add 0.5 everytime to start with, to simulate decreased motion upward, thus
	mimicking gravity.
	*/
	MainCharJumpVariabesCopy.dy += MainCharJumpVariabesCopy.Factor;
	Main_char_jumping.y_val += MainCharJumpVariabesCopy.dy;
	Main_char_jumping.y_val = Math.round(Main_char_jumping.y_val);

	if ((Main_char_jumping.y_val >= (Baseline_height)) || (Main_char_jumping.y_val <= 0)) {
		/*
		When we go down, we don't want to go off the screen. So we set the y_val back
		to the original position. The second conditional is there to make sure we don't
		fly off the screen, though realistically it will never hit true.
		*/
		Main_char_jumping.y_val = ((Canvas_layers.jumping_layer.height) - (Jumping_Dino.height) - 150);
		// Draw the img at the regular spot.
		Canvas_layers.jumping_layer_context.beginPath();
		Canvas_layers.jumping_layer_context.drawImage(Main_char_jumping.img,
														 											Main_char_jumping.x_val,
														 											Main_char_jumping.y_val,
														 											Main_char_jumping.img.width,
														 											Main_char_jumping.img.height);
		Canvas_layers.jumping_layer_context.closePath();
		/*
		To help the player in the later levels, we shortened the duration of the jump
		with higher jumping power and higher gravity, somewhat offsetting the increased
		speed. We do this at level 21 and 31 or so.
		*/
		if (Current_Game_status.past_level_20) {
			MainCharJumpVariabesCopy.Jump_power = -16;
			MainCharJumpVariabesCopy.Factor = 0.9;
			Current_Game_status.past_level_20 = false;
		}
		if (Current_Game_status.past_level_30) {
			MainCharJumpVariabesCopy.Jump_power = -18;
			MainCharJumpVariabesCopy.Factor = 1.25;
			Current_Game_status.past_level_30 = false;
		}
		// Reset our dy so we can jump again.
		MainCharJumpVariabesCopy.dy = MainCharJumpVariabesCopy.Jump_power;
		window.cancelAnimationFrame(Animation_frames.Jump_ID);
		/*
		Reset all the z-index values of the layers, so that the jumping dino layer
		is at the back, and it looks like the dino is again running
		*/
		Canvas_layers.jumping_layer.style.zIndex = "0";
		Canvas_layers.dino_walking_pt_1.style.zIndex = "1";
		Blue_Sky.style.zIndex = "2";
		Canvas_layers.sky.style.zIndex = "3";
		Canvas_layers.moving_background.style.zIndex = "4"
		Canvas_layers.dino_walking_pt_2.style.zIndex = "5";
		Current_Game_status.timestart = Date.now();
		Current_Game_status.continue_running = true;
		Current_Game_status.is_jumping = false;
		// change the index of which layer of dinosaur is at the top (collision checking purposes)
		Main_char_walking_part_2.top_index = true;
		Main_char_walking_part_1.top_index = false;
		Main_char_jumping.top_index = false;
		Current_main_char_layer = Main_char_walking_part_2;
		Run();
	} else {
		// Draw the image in the new spot.
		Canvas_layers.jumping_layer_context.beginPath();
		Canvas_layers.jumping_layer_context.drawImage(Main_char_jumping.img,
														 											Main_char_jumping.x_val,
														 											Main_char_jumping.y_val,
														 											Main_char_jumping.img.width,
														 											Main_char_jumping.img.height);
		Canvas_layers.jumping_layer_context.closePath();
		Animation_frames.Jump_ID = window.requestAnimationFrame(Jump);
	}
}


/*
Generates a random index that we use as the index in the Cacti_object.Lengths array.
We can't call 0 twice in a row, as this is two short distances right next to each other
(it was like this in the original chrome dino game, I wanted to replicate this).
*/
function Random_Distance_Generator() {
	var Size_index = Math.floor(Math.random() * 3);
	if (Current_Game_status.Current_index != Size_index) {
		Current_Game_status.Current_index = Size_index;
	} else {
		if (Current_Game_status.Current_index == 0) {
			while (Size_index == Current_Game_status.Current_index) {
				Size_index = Math.floor(Math.random() * 3);
			}
			Current_Game_status.Current_index = Size_index;
		}
	}
}


/*
Box model detection, return true on collision. Code originally found here:
https://benjaminhorn.io/code/pixel-accurate-collision-detection-with-javascript-and-canvas/
*/
function hitBox(source, target) {
	// Source and target objects contain x, y and width, height
	return (!(
		((source.y_val + source.img.height) < (target.y_val)) ||
		(source.y_val > (target.y_val + target.img.height)) ||
		((source.x_val + source.img.width) < target.x_val) ||
		(source.x_val > (target.x_val + target.img.width))
	));
}


/*
This is the function to move cacti across the screen, as well as change the level
of the game, based on how many Cacti have passed the screen.
*/
function Move_cacti() {
	if ((Cactus_object.Cacti.length) == 0) {
		/*
		This conditional is reached only if there are no Cacti on the screen. In this case,
		bring one onto the screen by adding one cactus object in our array of Cacti objects.
		Randomly choose an index between 0 and 1, and use this to create the cactus with
		the according image from Cacti_object.Available_cacti, and push it to the array
		of Cacti. Initialize the timestart property with "init", increase the number
		of cacti that the game has gone through with cacti_passed, and lastly randomly
		choose the distance between the cacti for the next cacti coming out, out of the
		array of distances with Random_Distance_Generator.
		*/
		Cactus_object.Cactus_of_Choice = Math.floor((Math.random()) * 2);
		Cactus_object.Cacti.unshift(new Cactus(Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice],
											 										(Canvas_layers.jumping_layer.width),
											 									  (Canvas_layers.jumping_layer.height - Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice].height - 150),
											  									 Current_Game_status.duration));
		Cactus_object.Cacti[0].init();
		Current_Game_status.cacti_passed++;
		Random_Distance_Generator();
	} else {
		if (Cactus_object.Cacti[((Cactus_object.Cacti.length) - 1)].x_val <= 0) {
			// If the cactus is at the end of the screen, clear it from the screen and the array
			Canvas_layers.moving_background_context.beginPath();
			Canvas_layers.moving_background_context.clearRect(Cactus_object.Cacti[((Cactus_object.Cacti.length) - 1)].x_val,
																												Cactus_object.Cacti[((Cactus_object.Cacti.length) - 1)].y_val,
											   								 							 (Cactus_object.Cacti[((Cactus_object.Cacti.length) - 1)].img.width
																				  					 		+ 3),
											   						 	   							 (Cactus_object.Cacti[((Cactus_object.Cacti.length) - 1)].img.height));
			Canvas_layers.moving_background_context.closePath();
			// Remove the cactus that has reached the end of the screen from the array.
			Cactus_object.Popped_object = Cactus_object.Cacti.pop();
			// Try to remove this object from memory.
			Cactus_object.Popped_object = null;
			Current_Game_status.counter++;
			// If we passed the amount to pass the level, then we do many things to
			// increase the speed and level amount.
			if (Current_Game_status.counter == Current_Game_status.pass_level_amt) {
				// increase levels passed, for the purpose of drawing levels_passed + 1 to the scoreboard
				Current_Game_status.Levels_passed += 1;
				// Add 1 to the amount of cacti required to pass a level every 2 levels,
				// somewhat offsetting the speed increasee of the cactus.
				Current_Game_status.pass_level_amt += (Current_Game_status.Levels_passed % 2);
				Current_Game_status.counter = 0;
				// The fastest Cacti will move across the screen is 1100 milliseconds for the journey
				Current_Game_status.duration = Math.max(1100, (Current_Game_status.duration - 150));
				// Add pixels to each distance, to make it a little easier, every level_factor number of levels.
				if (((Current_Game_status.Levels_passed % Current_Game_status.level_factor) == 0) &&
						 (Current_Game_status.duration > 1200)) {
					Cactus_object.Lengths = Cactus_object.Lengths.map(x => (Math.floor(x + 2)));
				}
				// If we have passed the appropriate levels, then we have the appropriate
				// booleans be true, allowing for the jump speed to increase in our jump
				// function. It's one less because the scoreboard displays levels_passed + 1.
				if ((Current_Game_status.Levels_passed / 9) == 1) {
					Current_Game_status.past_level_20 = true;
				}
				if ((Current_Game_status.Levels_passed / 19) == 1) {
					Current_Game_status.past_level_30 = true;
				}
				if ((Current_Game_status.Levels_passed % 10) == 0) {
					// Reduce the limit of cacti on screen. This makes it easier for the player
					// and the browser (less to render)
					Current_Game_status.Limit = Math.max(3, (Current_Game_status.Limit - 1));
					/*
					level_factor (the number of levels to be passed before increasing the
					distances between Cacti in pixels) gets decreased every 10 levels, to a
					minimum of 1. Essentially, at that point every level the distances are
					increased, though realistically the level_factor will be 2 every time after
					level 10 because this conditional is called at level 10 only, hence being
					called once going from 4 to 2. But we've left it as is as it doesn't do
					harm to the program.
					*/
					if ((Current_Game_status.Levels_passed / 10) == 1) {
						Current_Game_status.level_factor = Math.max(1, (Current_Game_status.level_factor * 0.5));
					}
				}
			}
		}
		/*
		The if statement wrapping around was there to fix a bug that would appear
		late in the game where the distances were so far away that nothing would
		be on the screen, the cacti array would be empty, and we would try to get
		the first element of it.
		*/
		if (!(Cactus_object.Cacti.length == 0)) {
			/*
			If the length between the cactus and the right side of the canvas is greater
			than or equal to the random length (realistically what comes out of that
			Math.max statement, that I'll just leave as is because it works), we add
			a new cactus onto the array. It is either a large or small one chosen randomly.
			*/
			if (Cactus_object.Cacti[0].x_val <=
				  Math.max(((Canvas_layers.jumping_layer.width -
										 Cactus_object.Lengths[Current_Game_status.Current_index])),
										(Medium_Cactus.width))) {
				if (Cactus_object.Cacti[0].duration != Current_Game_status.duration) {
					/*
					If the game duration has changed (i.e. the next cactus moves faster),
					then we wait for the rightmost cactus to be at least 60% of the way
					through the surface. This is our attempt to make sure that the next
					cactus doesn't overtake the previous one. Also, if there are less
					cacti than the limit, then only add this one.
					*/
					if ((Cactus_object.Cacti[0].x_val <= (0.4 * Canvas_layers.jumping_layer.width)) &&
							(Cactus_object.Cacti.length < Current_Game_status.Limit)) {
						Cactus_object.Cactus_of_Choice = Math.floor((Math.random()) * 2);
						Cactus_object.Cacti.unshift(
							new Cactus(Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice],
												(Canvas_layers.jumping_layer.width),
												(Canvas_layers.jumping_layer.height - Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice].height - 150),
												 Current_Game_status.duration));
						Current_Game_status.cacti_passed++;
						Cactus_object.Cacti[0].init();
					}
				} else {
					// If there are less cacti than the limit, then only add another one.
					if (Cactus_object.Cacti.length < Current_Game_status.Limit) {
						Cactus_object.Cactus_of_Choice = Math.floor((Math.random()) * 2);
						Cactus_object.Cacti.unshift(new Cactus(Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice],
																									(Canvas_layers.jumping_layer.width - Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice].width),
																									(Canvas_layers.jumping_layer.height - Cactus_object.Available_cacti[Cactus_object.Cactus_of_Choice].height - 150),
															 									 	 Current_Game_status.duration));
						Current_Game_status.cacti_passed++;
						Cactus_object.Cacti[0].init();
					}
				}
				// Random index for the next distance.
				Random_Distance_Generator();
			}
		}
		Cactus_object.Cacti = Cactus_object.Cacti.map(cactus => {
			// console.log(cactus.Image)
			Canvas_layers.moving_background_context.beginPath();
			Canvas_layers.moving_background_context.clearRect(cactus.x_val, cactus.y_val,
																				 							 (cactus.img.width + 15),
																				 						 	 (cactus.img.height));
			cactus.move();
			Canvas_layers.moving_background_context.drawImage(cactus.img, cactus.x_val, cactus.y_val,
																				 							 (cactus.img.width), (cactus.img.height));
			Canvas_layers.moving_background_context.closePath();

			return cactus;
		});
	}
	Animation_frames.Animation_ID = window.requestAnimationFrame(Move_cacti);
}

var Popped_pebbble = null;
// Level is used to check whether the level has changed. If it has, then we change
// it accordingly, reducing how often we have to repaint more of the scoreboard.
// We're trying to be efficient essentially.
var Level = 0;


/*
Our function to change the scoreboard.
*/
function Change_scoreboard() {
	var String_to_measure = null;
	// What we use to check the number of digits in the level. We use this to re-render the scoreboard to avoid
	// overlap between the level and the "Score" text.
	var Digits = (Current_Game_status.Levels_passed).toString().length;
	var New_Digits = (Current_Game_status.Levels_passed + 1).toString().length;
	// Assign String_to_measure based on whether the level has changed. This string
	// will be measured in terms of width on canvas.
	if (Level == Current_Game_status.Levels_passed) {
		String_to_measure = "Level: " + (Level.toString()) + " score: ";
	} else {
		String_to_measure = "Level: " + ((Current_Game_status.Levels_passed + 1).toString()) + " score: ";
	}
	Canvas_layers.sky_context.beginPath();
	if (Level != Current_Game_status.Levels_passed) {
		Canvas_layers.sky_context.fillStyle = "black";
		// Essentially redraw parts of the scoreboard so as to make it look the
		// similar to before, but with more spaces.
		if (New_Digits > Digits) {
			// First draw the larger black rectangle, based on the length the text takes up inside
			Canvas_layers.sky_context.fillRect((10 + (Canvas_layers.sky_context.measureText("Level: ").width)),5,
								 (Math.max((256 - (10 + (Canvas_layers.sky_context.measureText("Level: ").width))),
										  		 (Canvas_layers.sky_context.measureText(((Current_Game_status.Levels_passed + 1).toString()) + " score: " +
										   		 (Current_Game_status.score.toString())).width + 2 + Canvas_layers.sky_context.measureText(" ").width))),
								  			 	 30);
			// Draw the inner white rectangle after to resemble a white rectangle with an outline.
			// I thought this would be faster than drawing lines to be a rectangle and filling them.
			Canvas_layers.sky_context.fillStyle = "white";
			Canvas_layers.sky_context.fillRect((9 + (Canvas_layers.sky_context.measureText("Level: ").width)),7,
																			   (Math.max((254 - (9 + (Canvas_layers.sky_context.measureText("Level: ").width))),
																									 (Canvas_layers.sky_context.measureText(((Current_Game_status.Levels_passed + 1).toString()) + " score: " +
																									 (Current_Game_status.score.toString())).width + Canvas_layers.sky_context.measureText(" ").width))),
																			    26);
			Canvas_layers.sky_context.fillStyle = "black";
			Canvas_layers.sky_context.fillText(((Current_Game_status.Levels_passed + 1).toString() + " score: " +
																				  (Current_Game_status.score.toString())),
								 												 (10 + Canvas_layers.sky_context.measureText("Level: ").width), 28);
		} else {
			// In the case that the level has same number of digits, just paint over
			// the parts where the numbers are, and refill the place with new text
			Canvas_layers.sky_context.fillStyle = "white";
			Canvas_layers.sky_context.fillRect((10 + (Canvas_layers.sky_context.measureText("Level: ").width)),7,
								 												 (Canvas_layers.sky_context.measureText((Current_Game_status.Levels_passed + 1).toString()).width),
								  										 		26);
			Canvas_layers.sky_context.fillStyle = "black";
			Canvas_layers.sky_context.fillText(((Current_Game_status.Levels_passed + 1).toString()),
								 												 (10 + Canvas_layers.sky_context.measureText("Level: ").width), 28);
			Canvas_layers.sky_context.fillStyle = "white";
			Canvas_layers.sky_context.fillRect((10 + (Canvas_layers.sky_context.measureText(String_to_measure).width)),7,
								  											 (Math.max(66, (Canvas_layers.sky_context.measureText(Current_Game_status.score.toString()).width))),
																				 26);
			Canvas_layers.sky_context.fillStyle = "black";
			Canvas_layers.sky_context.fillText((Current_Game_status.score.toString()),
																				 (10 + Canvas_layers.sky_context.measureText(String_to_measure).width),
																				 28);
		}
		Level = Current_Game_status.Levels_passed;
	} else {
		// this conditional was used to account for a bug when we went from level 9 to 10 on the scoreboard.
		if (New_Digits > Digits) {
			String_to_measure = ("Level: " + (Current_Game_status.Levels_passed + 1).toString() + " score: ");
		}
		// redraw parts of the screen to re-render the score.
		if ((10 + (Canvas_layers.sky_context.measureText(String_to_measure).width) +
		     (Canvas_layers.sky_context.measureText(Current_Game_status.score.toString()).width)) > 240) {
			// If the whole string is wider than the container, redraw the container.
			Canvas_layers.sky_context.fillStyle = "black";
			Canvas_layers.sky_context.fillRect((10 + (Canvas_layers.sky_context.measureText(String_to_measure).width)),5,
								 (Canvas_layers.sky_context.measureText(Current_Game_status.score.toString()).width + 10),30);
			Canvas_layers.sky_context.fillStyle = "white";
			Canvas_layers.sky_context.fillRect((9 + (Canvas_layers.sky_context.measureText(String_to_measure).width)), 7,
								 												 (Canvas_layers.sky_context.measureText(Current_Game_status.score.toString()).width + 9),
																				 26);
		} else {
			// If it is not wider than the container, than redraw the part where the score is placed.
			Canvas_layers.sky_context.fillStyle = "white";
			Canvas_layers.sky_context.fillRect((10 + (Canvas_layers.sky_context.measureText(String_to_measure).width)),7,
								 												 (243 - (Canvas_layers.sky_context.measureText(String_to_measure).width)),
																				 26);
		}
		// Draw the current score.
		Canvas_layers.sky_context.fillStyle = "black";
		Canvas_layers.sky_context.fillText((Current_Game_status.score.toString()),
																			 (10 + Canvas_layers.sky_context.measureText(String_to_measure).width),
																			 28);
	}
	Canvas_layers.sky_context.closePath();

	// If the score is less than 0 (changed in Move_pebbles), reset everything in the game, remove the event handler on the spacebar,
	// and display the game over modal.
	if (Current_Game_status.score < 0) {
		Object.keys(Animation_frames).map(key => window.cancelAnimationFrame(Animation_frames[key]));
		Modal.style.display = "block";
		Cactus_object.Cacti = [];
		Default_Game_status.Clouds = [];
		Default_Game_status.Pebbles = [];
		Cactus_object.Lengths = [200,300,400];
		Current_Game_status = {...Default_Game_status};
		MainCharJumpVariabesCopy = { ... MainCharJumpVariabes};
		window.removeEventListener("keydown", Spacebar_Event_Handler);
	}
}


/*
This function is responsible for moving the pebbles, as well as checking for
collisions and updating the scoreboard.
*/
function Move_pebbles() {
	var random_length = null;
	var within_range = null;
	// If we have no pebbles, then let's add pebbles to the array to display on screen.
	if (Current_Game_status.Pebbles.length == 0) {
		Current_Game_status.Pebbles.unshift(new Pebble((Canvas_layers.jumping_layer.width - 9),
																									 ((Math.floor((Math.random() * 100))) +
																									 	(Canvas_layers.jumping_layer.height - 130)),
																									 Current_Game_status.duration));
		Current_Game_status.Pebbles[0].init();
	} else {
		// We want random lengths between pebbles.
		random_length = Math.min(((Math.floor(Math.random() * Canvas_layers.jumping_layer.width)) + 200), 700);
		let Pebbles_length = Current_Game_status.Pebbles.length;
		// Remove the pebbles from our array if they reach the end of the screen.
		try {
			if ( Current_Game_status.Pebbles[(Current_Game_status.Pebbles.length - 1)].x_val <= 0) {
				Current_Game_status.Pebbles[(Current_Game_status.Pebbles.length - 1)].clear(
				Canvas_layers.moving_background_context);
				Current_Game_status.Pebbles.pop();
			}

		} catch(err) {
			// alert(err, "in filter of pebbles fn.");
			console.log(err, "in filter fn");
		}
		try {
			// If there are less than 2 pebbles on screen and our pebbles are the random_length length apart, add a new pebble.
			if ((Current_Game_status.Pebbles[0].x_val < (Canvas_layers.jumping_layer.width - random_length)) &&
					(Current_Game_status.Pebbles.length < 2)) {
				Current_Game_status.Pebbles.unshift(new Pebble((Canvas_layers.jumping_layer.width - 9),
																											 ((Math.floor((Math.random() * 100))) +
																											 	(Canvas_layers.jumping_layer.height - 130)),
																											 Current_Game_status.duration));
				Current_Game_status.Pebbles[0].init();
			}
		} catch(err) {
			console.log(err);
		}
		// Clear all our pebbles from the screen, then move them, then draw them again.
		try {
			Current_Game_status.Pebbles = Current_Game_status.Pebbles.map(stone => {
				stone.clear(Canvas_layers.moving_background_context);
				stone.move();
				stone.draw(Canvas_layers.moving_background_context);
				return stone;
			});
		} catch(err) {
			console.log(err, "in move stone");
		}
		// We put this in a different function to avoid having it in our main function that moves the cacti, as we want to reduce the time between when the
		// cacti moves and renders itself.
		for (var i = (Math.max((Cactus_object.Cacti.length - 2), 0)); i < (Cactus_object.Cacti.length); i++) {
			// This checks whether there is any overlap between the cactus and the dinosaur in the x direction.
			within_range = (((Current_main_char_layer.x_val - Cactus_object.Cacti[i].img.width) < Cactus_object.Cacti[i].x_val) &&
											 (Cactus_object.Cacti[i].x_val < (Current_main_char_layer.x_val + Current_main_char_layer.img.width)) &&
											 (Cactus_object.Cacti[i].collision != true));
			if (within_range) {
				// Check if we actually have a collision region between the two image "boxes"
				if (hitBox(Current_main_char_layer, Cactus_object.Cacti[i])) {
					/*
					Description of what's going on here:
					The x_val of the collision region of which box has the larger collision region. The width is the length of overlap between these boxes.
					The same goes for the y_val.
					 __________
					|		   		|
					|	2      	|
					|    _____|_____
					|   |     |	   |
					|___|_____|    |
							|	1    		 |
							|__________|


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
																  Current_main_char_layer.img.width -
																  Cactus_object.Cacti[i].x_val),
																  Cactus_object.Cacti[i].img.width));

					if (Cactus_object.Cacti[i].x_val < Current_main_char_layer.x_val) {
						// If the boxes are in the opposite case where the box labelled "1" in our analogy is actually box "2", then we do the
						// same thing as above but for the opposite boxes. So we take the measurements where "1" is "2" and vice versa
						Collision_Region.x_val = Current_main_char_layer.x_val;
						Collision_Region.width = Math.floor(Math.min((Cactus_object.Cacti[i].x_val +
																	  Cactus_object.Cacti[i].img.width -
																	  Current_main_char_layer.x_val),
																	  Current_main_char_layer.img.width));
					}
					// You can refer to the above diagram for the explanation, but it's basically the same thing.
					Collision_Region.y_val = Math.round(Cactus_object.Cacti[i].y_val);
					Collision_Region.height = Math.floor(Math.min((Current_main_char_layer.y_val +
																   Current_main_char_layer.img.height -
																   Cactus_object.Cacti[i].y_val),
																   Cactus_object.Cacti[i].img.height));

					if (Cactus_object.Cacti[i].y_val < Current_main_char_layer.y_val) {
						Collision_Region.y_val = Math.round(Current_main_char_layer.y_val);
						Collision_Region.height = Math.floor(Math.min((Cactus_object.Cacti[i].y_val +
																	   											 Cactus_object.Cacti[i].img.height -
																	   									 		 Current_main_char_layer.y_val),
																	   									 		 Current_main_char_layer.img.height));
					}
					/*
					Since you can't pass the original object to the web worker without giving
					up control of the original object (problematic since we have to draw
					cacti to the screen), we create makeshift "copies" that send the important
					data attributes required for our web worker function to process it.
					*/
					Collision_Region.Actor_1 = {
						Img_src: Current_main_char_layer.img.src,
						x_val: Current_main_char_layer.x_val,
						y_val: Math.round(Current_main_char_layer.y_val),
						width: Current_main_char_layer.img.width,
						height: Current_main_char_layer.img.height
					};
					Collision_Region.Actor_2 = {
						Img_src: Cactus_object.Cacti[i].img.src,
						x_val: Math.floor(Math.ceil(Cactus_object.Cacti[i].x_val)),
						y_val: Cactus_object.Cacti[i].y_val,
						width: Cactus_object.Cacti[i].img.width,
						height: Cactus_object.Cacti[i].img.height
					};
					/*
					Send the object with the right data to the web worker, and the index i as well.
					When it returns assign the according boolean result to the appropriate
					cactus's collision property (true if collision, false otherwise)
					*/
					Web_worker.postMessage([Collision_Region,i]);
					Web_worker.onmessage = function(Result) {
						Cactus_object.Cacti[Result.data[1]].collision = Result.data[0];
					};
				}
			}
			/*
			If the cactus is out of collision range, and has not been checked yet,
			then add or subtract score. Then set its collision property to null,
			and its checked property to true so we don't keep checking it. Change
			the scoreboard accordingly.
			*/
			if ((Cactus_object.Cacti[i].x_val < (Current_main_char_layer.x_val - (Cactus_object.Cacti[i].img.width))) && (!Cactus_object.Cacti[i].checked)) {
				if (Cactus_object.Cacti[i].collision) Current_Game_status.score -= 5;
				else Current_Game_status.score++;
				Cactus_object.Cacti[i].collision = null;
				Cactus_object.Cacti[i].checked = true;
				// A wierd bug somewhere causes the pebbles to still move, hence why
				// we need to return null when the score is less then 0 as well
				if (Current_Game_status.score < 0) {
					Change_scoreboard();
					return null;
				}
				Change_scoreboard();
			}
		}
	}
	Animation_frames.Pebble_ID = requestAnimationFrame(Move_pebbles);
}


/*
Our function to clear the screen when starting the game again. This is the
click event handler function to the makeshift button on our game over modal
(shows when the game's over).
*/
function Start_over() {
	Canvas_layers.sky_context.beginPath();
	Canvas_layers.sky_context.clearRect(0, 40, (Canvas_layers.sky.width), (Canvas_layers.sky.height - 190));
	Canvas_layers.sky_context.closePath();
	Canvas_layers.sky_context.beginPath() ;
	Canvas_layers.sky_context.fillStyle = "black";
	Canvas_layers.sky_context.fillRect(5, 5, 250, 30);
	Canvas_layers.sky_context.fillStyle = "white";
	Canvas_layers.sky_context.fillRect(7, 7, 246, 26);
	Canvas_layers.sky_context.fillStyle = "black";
	Canvas_layers.sky_context.font = "20px Verdana";
	Canvas_layers.sky_context.fillText("Level: 1 score: 0", 10, 28);
	Canvas_layers.sky_context.closePath();

	Canvas_layers.moving_background_context.beginPath();
	Canvas_layers.moving_background_context.clearRect(0,0,(Canvas_layers.jumping_layer.width), (Canvas_layers.jumping_layer.height));
	Canvas_layers.moving_background_context.closePath();

	Modal.style.display = "none";
	Current_Game_status.game_has_started = true;
	Current_Game_status.continue_running = true;
	Current_Game_status.timestart = Date.now()
	Move_pebbles();
	Move_cacti();
	Move_clouds();
	Run();
	window.addEventListener("keydown",Spacebar_Event_Handler);
}


/*
Event handler when the user presses the spacebar for the dinosaur to jump.
It also starts the game if it hasn't been started already.
*/
function Spacebar_Event_Handler(event) {
	if (event.keyCode == 32) {
		event.preventDefault();
		if (!Current_Game_status.is_jumping) {
			Current_Game_status.is_jumping = true;
			Canvas_layers.dino_walking_pt_1.style.zIndex = "0";
			Canvas_layers.dino_walking_pt_2.style.zIndex = "1";
			Blue_Sky.style.zIndex = "2";
			Canvas_layers.sky.style.zIndex = "3";
			Canvas_layers.moving_background.style.zIndex = "4";
			Canvas_layers.jumping_layer.style.zIndex = "5";

			Main_char_walking_part_1.top_index = false;
			Main_char_walking_part_2.top_index = false;
			Main_char_jumping.top_index = true;
			Current_main_char_layer = Main_char_jumping;
			Current_Game_status.continue_running = false;
			Jump();
			if (!Current_Game_status.game_has_started) {
				Current_Game_status.game_has_started = true;
				Move_pebbles();
				Move_cacti();
				Move_clouds();
			}
		}
	}
}



/*
Pre rendering done before we load images and start the game.
*/
const pre_game_rendering = () => {
	// Mandatory to set widths and heights before you start using the canvases.
	Array.from(document.querySelectorAll("canvas"), element => {
		element.width = 800;
		element.height = 600;
	});
	// Draw the sand colored floor
	Canvas_layers.sky_context.beginPath();
	Canvas_layers.sky_context.fillStyle = "#ECE2C6";
	Canvas_layers.sky_context.fillRect(0, (Canvas_layers.sky.height - 150),
																		(Canvas_layers.sky.width), 150);
	Canvas_layers.sky_context.closePath();
	Canvas_layers.sky_context.beginPath();
	Canvas_layers.sky_context.strokeStyle = "black";
	Canvas_layers.sky_context.lineWidth = 2;
	Canvas_layers.sky_context.moveTo(0, (Canvas_layers.jumping_layer.height - 150));
	Canvas_layers.sky_context.lineTo((Canvas_layers.jumping_layer.width),
																	 (Canvas_layers.jumping_layer.height - 150));
	Canvas_layers.sky_context.stroke();
	Canvas_layers.sky_context.closePath();

	// Draw the scoreboard, and add the event listener to start the game over
	// on the start over button (shown when the game-over modal shows)
	Canvas_layers.sky_context.beginPath() ;
	Canvas_layers.sky_context.fillStyle = "black";
	Canvas_layers.sky_context.fillRect(5,5, 250, 30);
	Canvas_layers.sky_context.fillStyle = "white";
	Canvas_layers.sky_context.fillRect(7,7,246,26);
	Canvas_layers.sky_context.fillStyle = "black";
	Canvas_layers.sky_context.font = "20px Verdana";
	Canvas_layers.sky_context.fillText("Level: 1 score: 0",10,28);
	Canvas_layers.sky_context.closePath();
	Start_over_button.addEventListener("click", Start_over);
}


/*
Earlier, I used load event listners and chained them one on top of each other so
that all images are available, and then only can you start the game. There was a
bug where if the image was already loaded you wouldn't be able to start the game.
This was because the spacebar event handler would be added after the last
or second last image was loaded as part of its event listener. This means that even
if the image was loaded, the spacebar event handler would not be enabled. Now we
only enable the spacebar event handler once all images load, or if they have already
been laoded. The idea came from this article and this video:
Article: https://web.dev/promises/#promisifying_xmlhttprequest
Video: https://www.youtube.com/watch?v=g-FpDQ8Eqw8&list=PLS8HfBXv9ZWWe8zXrViYbIM2Hhylx8DZx
Essentially this function returns a promise that resolves only when the image is
available.
*/
function load_img(url) {
	return new Promise((resolve, reject) => {
		let new_img = new Image();
		new_img.src = url;

		if (new_img.complete) {
			resolve(new_img);
		} else {
			new_img.addEventListener("load", () => {
				resolve(new_img);
			});
		}

		new_img.addEventListener("error", () => {
			reject(new Error(`Image with sourcce ${new_img.src} failed to load`));
		});
	});
}


/*
Basically load all images through promises, that resolve when the images have completed
loading, and reject when the image fails to load. When all the images load, thus
all promises are resolved, use the Promise.all method and the .then method to
accordingly draw the loaded images where they should all go. After we do this,
add the spacebar event handler that allows us to start the game.
*/
const load_images = url_array => {
	var Img_arr = url_array.map(url => load_img(url));
	Promise.all(Img_arr)
		.then(values => {
			[Walking_dino_pt_1, Walking_dino_pt_2, Jumping_Dino,
			 Medium_Cactus, Large_Cactus, Cloud_image]  = values;
			/*
			All clouds have the same image, and thus it is best to keep the image in the
			prototype. This may cause errors in the Cloud.js file, so I'm doing this here.
			*/
			Cloud.prototype.img = new Image();
			Cloud.prototype.img.src = "./Images/Moving_cloud.png";
			Canvas_layers.dino_walking_pt_1_context.drawImage(Walking_dino_pt_1, 100,
	 																										 ((Canvas_layers.jumping_layer.height) -
																											  (Walking_dino_pt_1.height) - 150),
	 																			 							 (Walking_dino_pt_1.width),
	 																			 					 		 (Walking_dino_pt_1.height));
	 		Main_char_walking_part_1 = new MainChar(Walking_dino_pt_1, 100,
	 																					 ((Canvas_layers.jumping_layer.height) -
																						 	(Walking_dino_pt_1.height) - 150));
	 		Canvas_layers.dino_walking_pt_2_context.drawImage(Walking_dino_pt_2, 100,
	 																										 ((Canvas_layers.jumping_layer.height) -
																											  (Walking_dino_pt_2.height) - 150),
	 																			 							 (Walking_dino_pt_2.width),
	 																			 					 		 (Walking_dino_pt_2.height));
	 		Main_char_walking_part_2 = new MainChar(Walking_dino_pt_2, 100,
	 																					 ((Canvas_layers.jumping_layer.height) -
																						  (Walking_dino_pt_2.height) - 150));
	 		Canvas_layers.jumping_layer_context.drawImage(Jumping_Dino, 100,
	 													 											 ((Canvas_layers.jumping_layer.height) -
																									  (Jumping_Dino.height) - 150),
	 	 											 												 (Jumping_Dino.width),
	 																							 	 (Jumping_Dino.height));
	 	  Main_char_jumping = new MainChar(Jumping_Dino, 100,
	 																		((Canvas_layers.jumping_layer.height) -
																			 (Jumping_Dino.height) - 150));
	 	  Baseline_height = Main_char_jumping.y_val;
	 		Cactus_object.Available_cacti = [Medium_Cactus, Large_Cactus];
	 		var Sample_cactus = new Cactus(Medium_Cactus,
	 																	(Canvas_layers.jumping_layer.width - Medium_Cactus.width),
	 																	(Canvas_layers.jumping_layer.height - Medium_Cactus.height - 150),
	 																	 Current_Game_status.duration);
	 		window.addEventListener("keydown", Spacebar_Event_Handler);
		}).catch(error => console.log(error));
}


pre_game_rendering();
load_images(Img_src_arr);
