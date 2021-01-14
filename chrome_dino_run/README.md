<h1 align = "center">Chrome Dino Run</h1>
<p>
  This is my replica of T-Rex Run. I created a colored variant of the original. The game can be found <a href = "https://s4sikdar.github.io/chrome_dino_run/Dino_game.html" target = "_blank">here</a>. It was created with the canvas element, and coded manuually (i.e. without a game engine). 
</p>
<img src = "Dinosaur Game Image.png" align = "center">
  <h2 align = "center">Design</h2>
  <ul>
      <li>
        Why was a game engine not used?
      </li>
      &ensp; 
      <p>
        I wanted to be comfortable with Vanilla JavaScript and ES6 before learning Front-End JavaScript frameworks, as learning JavaScript up till ES6 is required before being 
        able to dive into REACTjs. Thus I wanted to create a project that was more code-heavy, which would give me more practice using features of ES6 such as higher order 
        functions, Promises, Object Oriented Design in JavaScript (Prototypes and Classes), ES6 modules, and more. As a result, you will often see the JavaScript code making use 
        of map functions in place of for loops at times. 
      </p>
      <li>
        The game is created manually using the Canvas Element. Various moving objects are represented by instances of various classes that inherit from a base 
        <code>MovingObjects</code> class. This allows for less properties in each instance of any moving object (such as a cloud, or a cactus). The main character is represented 
        by its own object. The separate modules have these objects, the code broken up and imported as necessary.
      </li>
      <li> 
        The game uses multiple layers of Canvas, with different layers responsible for drawing and redrawing different moving objects on the screen (i.e. one layer draws clouds 
        that are moving across the screen, another has the dinosaur that will jump - and needs to be erased and redrawn). This allows for increased performance, but the tradeoff 
        is more RAM usage. As a result this game does not support Tablets and Phones right now. As Internet Explorer does not appear to fully support Canvas, the game does not 
        support I.E. 
      </li>
      <li>
        For smooth animations, you have about 16 milliseconds to perform any necessary calculations as <code>requestAnimationFrame</code> tries to render the browser at a rate 
        of 60 frames per second if it can. Thus for image collision, the algorithm used must be run on a separate thread, to then have the result messaged back to the main 
        file/thread. Thus the code makes the use of a Web Worker for running this algorithm. 
      </li>
      <li>
        The collision algorithm mentioned above checks for the collision between two images. This collision 
        is represented with a rectangular box. This area is compared with an image map - representing what pixels belong to the character and what pixels are opaque - and this 
        is done on both images. Overlap is calculated based on this, and if it matches a threshold, then we have a collision. This is because there is no Canvas method to check 
        for this.
      </li>
      <li>
        Lastly, the idea of using JavaScript to create a game from scratch was inspired by <a href = "https://eloquentjavascript.net/16_game.html">Eloquent JavaScript.</a>
      </li>
    </ul>    
<p> 
  I have downloaded the Phaser game engine and will be working on an upgrade time willing. Thank you for your time.
</p>
    
