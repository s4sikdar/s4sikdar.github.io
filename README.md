<h1 align = "center">
  Portfolio Website
</h1>
<p>
  This repositiory has the production build of my portfolio website, which can be found <a href = "https://s4sikdar.github.io/" target="_blank">here</a> 
  (press <code>ctrl</code> and click to open links in a new tab). The original code for it can be found 
  <a href = "https://github.com/s4sikdar/react-website" target = "_blank">here</a>. This repository also hosts my remake of the Chrome Dinosaur Game, found 
  <a href = "https://s4sikdar.github.io/new_old_website/chrome_dino_run/Dino_game.html" target="_blank">here</a>. Platforms supported for the portfolio site 
  (based on <code>npx browserslist</code>) are:
  <ul>
    <li>and_chr 90</li>
    <li>and_ff 87</li>
    <li>and_uc 12.12</li>
    <li>android 4.4.3-4.4.4</li>
    <li>chrome 91</li>
    <li>chrome 90</li>
    <li>chrome 89</li>
    <li>chrome 88</li>
    <li>chrome 87</li>
    <li>chrome 85</li>
    <li>chrome 49</li>
    <li>edge 91</li>
    <li>edge 90</li>
    <li>firefox 88</li>
    <li>ie 11</li>
    <li>ios_saf 14.5-14.6</li>
    <li>ios_saf 14.0-14.4</li>
    <li>ios_saf 13.4-13.7</li>
    <li>ios_saf 12.2-12.4</li>
    <li>opera 76</li>
    <li>opera 75</li>
    <li>safari 14.1</li>
    <li>safari 14</li>
    <li>safari 13.1</li>
    <li>safari 8</li>
    <li>samsung 14.0</li>
    <li>samsung 13.0</li>
  </ul>
</p>
<h2 align = "center">Design</h2>
<p>
  The website was made with HTML5, CSS3, JavaScript, Bootstrap, REACTjs, ChartJS and the Google Charts API, and the MutationObserver and Intersection Observer APIs. 
  Details follow for specific technologies:
  <ul>
    <li>
      REACTjs was the main framework used for design of the website. I made use of functional and class components, as I do not yet have working knowledge of hooks.
    </li>
    <li> 
      ChartJS was used for the chart representing my skillset on all browsers that support the canvas element. For I.E. 11, the Google Charts API was used.
    </li>
    <li> 
      The Mutation Observer API was used to monitor changes in the attributes of HTML tags in the bootstrap accordion. 
      Changes were made to the caret svg representing the button accordingly.
      The Mutation Observer API is built for monitoring attribute changes in DOM elements, which you can then use to have actions run when changes occur. 
      Documentation on the Mutation Observer can be found <a href = "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver" target="_blank">here</a>.
    </li>
    <li> 
      The Intersection Observer API was used to change the styling of the header. Classes were toggled based on whether the page was scrolled to the top or not. 
      This is because scroll event listeners are inefficient, as they will be called whenever the user scrolls, taxing the browser quite a lot 
      (due to excess traffic on the event queue). Also, the Intersection Observer was used to detect when the text sections in the last section of the accordion were visible 
      on screen. They are transparent by default, and if the section is visible on screen, then a class is added for them to slide in. Monitoring these changes was also done 
      using Intersection Observer, as it was the only method that worked.
    </li>
    <li> 
      Bootstrap was used to make the site responsive across phones and tablets. The mobile alternative for the Pie Chart was a star rating out of 5 for each of my skills, 
      which was implemented partly using Bootstrap. The accordion used was a Bootstrap component. I also used a lot of Bootstrap's classes on margins, display styles, etc. 
      to leverage the framework as much as possible (less custom CSS). The tooltips and were made using ReactStrap.
    </li>
    <li>
     The website has a reverse color theme throughout. To keep with this, I used Inkscape to both create a few of the image sprites, as well as edit image sprites found on 
     Google Images to fit the website's color theme better.
    </li>
  </ul>
</p>
<h2 align = "center">Inspiration</h2>
<p>
  Inspiration for various components was drawn from the following sites:
  <ul>
    <li><a href = "http://www.pascalvangemert.nl/" target="_blank">Pascal Van Germert</a></li>
    <li><a href = "http://www.garysheng.com/" target="_blank">Gary Sheng</a></li>
    <li><a href = "https://sjt00.github.io/" target="_blank">Saad Taj</a></li>
    <li><a href = "http://findmatthew.com/" target="_blank">Matthew Williams</a></li>
  </ul>
</p>
<p> 
  If you are here, you are most likely a hiring manager or a recruiter. Thank you for your time. 
</p>
