<h1 align = "center">
  Portfolio Website
</h1>
<hr>
<p>
  This repositiory has my portfolio website, which can be found <a href = "https://s4sikdar.github.io/">here</a>. It also hosts my remake of the Chrome Dinosaur Game, found <a href = "https://s4sikdar.github.io/chrome_dino_run/Dino_game.html">here</a>. Platforms supported (that I know of) are:
  <ul>
    <li>Mobile Phones</li>
    <li>Internet Explorer (only I.E. 11). The accordion in the About section does not have text blocks slide in for the "The Saga So Far" section. This is as I have yet to find a polyfill for Mutation Observer, that can be implemented via CDN. The text blocks appear as does any other text section.</li>
    <li>Microsoft Edge</li>
    <li>Firefox</li>
    <li>Google Chrome</li>
    <li>Tablets</li>
    <li>The Google Chart feature <strong>DOES NOT</strong> work on Laptops with HiDPI screen.</li>
  </ul>
</p>
<br>
<h2 align = "center">Design</h2>
<hr>
<p>
  The website was made with HTML, CSS, JavaScript, Bootstrap, the Intersection Observer API, the Mutation Observer API, and the Google Charts API. Details follow for specific technologies:
  <ul>
    <li> The Google Charts API was used to create the Pie Chart visual, representing my skillset, and the proportion of each skillset.</li>
    <li> The Mutation Observer API was used to monitor changes in the classes of the Bootstrap Accordion. Accordingly, the <code>textContent</code> property of the button changed the text content from a "+" to a "-". The Mutation Observer API is built for monitoring changes in DOM elements, which you can then use to have actions run when changes occur. Documentation on the Mutation Observer can be found <a href = "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver">here</a>.</li>
    <li> The Intersection Observer API was used to change the styling of the header. Classes were toggled based on whether the page was scrolled to the top or not. This is because scroll event listeners are inefficient, as they will be called whenever the user scrolls, taxing the browser quite a lot (due to excess traffic on the event queue). Also, the Intersection Observe was used to detect when the text sections in the last section of the accordion were visible on screen. They are transparent by default, and if the section is visible on screen, then a class is added for them to slide in. Monitoring these changes were also done using Intersection Observer, as it was the only method that worked.</li>
    <li> Bootstrap was used to make the site responsive across phones and tablets. The alternative for the Pie Chart was a star rating out of 5 for each of my skills, which was implemented partly using Bootstrap. The accordion used was a Bootstrap component. I also used a lot of Bootstrap's classes on margins, display styles, etc. to avoid writing as much custom CSS as possible.</li>
    <li> The JavaScript code for the website was all in ES5 to support older browsers, as I do not yet have working knowledge of NPM or Webpack.</li>
  </ul>
</p>
<p> 
  If you are here, you are most likely a hiring manager or a recruiter. Thank you for your time. 
</p>
