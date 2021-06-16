// Included so as not to get a runtime error.
let Canvas = document.getElementById("Dino");
Canvas.width = 800;


/*
The MovingObjects class has common properties that all items moving across the
screen will have. These items will be from classes, with each item being an instance
of the class. All these classes will inherit from the MovingObjects class.
*/
class MovingObjects {
  constructor(x_val, y_val, duration) {
    /*
    "x_val" and "y_val" represent the 2d coordinates of where to draw the image on
    canvas. "timestart" when initialized stores the current time when the object
    is brought onto the screen, representing the starting point in time for the
    progress in movement to be recorded. "duration" refers to how long it should
    take for the object to move across the screen. Refer to the "move" method's
    documentation for further context of "timestart" and "duration".
    */
    this.x_val = x_val;
    this.y_val = y_val;
    this.timestart = null;
    this.duration = duration;
  }

  /*
  Used to initialize the timing mechanism for movement, explained in the documentation
  for the move method below.
  */
  init() {
    this.timestart = Date.now();
  }

  /*
  We want that our items move across the screen in a given amount of time. This amount
  of time is referred to in "duration". The problem here is that not all browsers
  animate at the same frequency. Some browsers render at a rate of 60 frames per
  second, while others render at a rate of 30 frames per second (FPS). Regardless
  of the FPS rate, we want to ensure that the the items go across in the same
  duration. So what we do here is that we have a timestamp for when they first
  came on the screen, and another for the current time. Take the difference and
  divide by duration - which represents the number of milliseconds the item should
  take to move across the screen. This ratio represents how far along the canvas
  the item should have moved. Multiply 1 - this ratio times the width of the canvas
  to assign the new "x_val" for where to draw the cactus. This is because we are
  moving from right to left, meaning that our "x-coordinate values" start at the
  width of th canvas and go to 0. Stop moving when this ratio is over 1, meanning
  that the item should be at the other end of the screen, with a corresponding
  x value of 0. The x coordinates on the left edge of the canvas are 0, and on
  the right edge they are the width of the canvas, which is why we multiply 1
  minus the  progress ratio. For a better, more detailed explation, refer to this
  article: https://medium.com/jspoint/javascript-raf-requestanimationframe-456f8a0d04b0
  */
  move() {
    let progressRatio = Math.min((((Date.now()) - this.timestart) / this.duration), 1);
    /*
    Use Math.round to round the values to integers. Do this because drawing images
    with coordinates that are decimals is more taxing on the canvas.
    */
  	this.x_val = Math.round(Canvas.width * (1 - progressRatio));
  }
}

export { MovingObjects };
