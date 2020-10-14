// var header = document.getElementById("Header");
// var projects = document.getElementById("projects");
// var about_section = document.getElementById("about_section");
// var navbar = document.querySelector("#navbar");
// var home_header = document.getElementById("home_header")
// var about_header = document.getElementById("about_header")
// var projects_header = document.getElementById("projects_header")


/*
We need to manually change the style of the :hover::after pseudo element
for the a tags, specifically the animation. This code is the way. The code can
be found here:
https://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454
*/
// var addRule = (function(style){
//     var sheet = document.head.appendChild(style).sheet;
//     return function(selector, css){
//         var propText = Object.keys(css).map(function(p){
//             return p+":"+css[p]
//         }).join(";");
//         sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
//     }
// })(document.createElement("style"));
//
// function mouse_off_event_handler(event) {
//   console.log("mouseoff event handler")
//   // this.style.animation = "underline 1s backwards";
//   ID = this.getAttribute("id");
//   addRule(("#" + ID + ":hover::after"), {animation: "underline 1s backwards"});
//   // addRule()
// }

// var Navbar_links = document.querySelectorAll("#navbar li a");


/*
We need to allow for the website to support older versions of browsers, like Internet
Explorer. So we use this to dect what browser is used. The code can
be found here:
https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
*/
var sBrowser, sUsrAg = navigator.userAgent;

if (sUsrAg.indexOf("Firefox") > -1) {
  sBrowser = "Mozilla Firefox";
  // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
  sBrowser = "Samsung Internet";
  // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
  sBrowser = "Opera";
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
} else if (sUsrAg.indexOf("Trident") > -1) {
  sBrowser = "Microsoft Internet Explorer";
  // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
} else if (sUsrAg.indexOf("Edge") > -1) {
  sBrowser = "Microsoft Edge";
  // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
} else if (sUsrAg.indexOf("Chrome") > -1) {
  sBrowser = "Google Chrome or Chromium";
  // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
} else if (sUsrAg.indexOf("Safari") > -1) {
  sBrowser = "Apple Safari";
  // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
} else {
  sBrowser = "unknown";
}
// // The order matters here, and this may report false positives for unlisted browsers.
//
var Elements_to_hide = {
  about_section_header: document.querySelector("#about_section h2"),
  about_section_left: document.querySelector("#left"),
  about_section_middle: document.querySelector("#middle"),
  about_section_right: document.querySelector("#right"),
  project_section_header: document.querySelector("#projects h3"),
  panel_1: document.querySelector("#panel_1"),
  panel_2: document.querySelector("#panel_2"),
  panel_3: document.querySelector("#panel_3")
};

var Visible_elements = {
  about_section_header: false,
  about_section_left: false,
  about_section_middle: false,
  about_section_right: false,
  project_section_header: false,
  panel_1: false,
  panel_2: false,
  panel_3: false,
  all_visible: function() {
    return (this.about_section_header && this.about_section_left &&
            this.about_section_middle && this.about_section_right &&
            this.project_section_header && this.panel_1 &&
            this.panel_2 && this.panel_3);
  }
}

// console.log(Visible_elements.all_visible());
//
var Dimensions = {
  window_height: window.innerHeight,
  scroll_Y: window.scrollY
};

function update_window_dimensions(event) {
  Dimensions.window_height = window.innerHeight;
  Dimensions.scroll_Y = window.scrollY;
}

window.addEventListener("resize", update_window_dimensions);


function scroll_function(scroll_event) {
  Dimensions.scroll_Y = window.scrollY;
  update_animations();

  if (Visible_elements.all_visible()) {
    console.log("all visible")
    window.removeEventListener("scroll", scroll_function);
  }
}

//https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window

function update_animations() {
  for (let animation_element of Object.keys(Elements_to_hide)) {
    // getBoundingClientRect gives the bottom relative to the distance
    // from what part of the page is visible at the top of the screen. So
    // as you scroll down an element's bottom property of getBoundingClientRect
    // goes down, eventually becoming 0 as it gets to the top. Offset this
    // by adding the scroll_Y property in the Dimensions object
    if ((Dimensions.scroll_Y + Dimensions.window_height) >
        ((Elements_to_hide[animation_element].getBoundingClientRect().bottom) +
         (Dimensions.scroll_Y))) {
          // console.log((Dimensions.scroll_Y + Dimensions.window_height), '\n',
          //              Elements_to_hide[animation_element].getAttribute("id"), '\n',
          //              Elements_to_hide[animation_element].getBoundingClientRect());
          Elements_to_hide[animation_element].style.animationPlayState = "running";
          Visible_elements[animation_element] = true;
    }
  }
}

/*
The animations here don't work in Internet Explorer, which is why we
do this only in the event of the browser not being so
*/
if (!(sBrowser == "Microsoft Internet Explorer")) {
  window.addEventListener("load", function(event) {
    update_animations();
    //console.log("Hi")
    window.addEventListener("scroll", scroll_function);
  });
}

var timestart = null;
var animation_id = null;
function Turn_modal_off() {
  if (((Date.now()) - this.timestart) >= 320) {
    modal.style.visibility = "hidden";
    window.cancelAnimationFrame(animation_id);
  } else {
    animation_id = requestAnimationFrame(Turn_modal_off)
  }
}

var counter = 0;

var modal_button = document.querySelector("#panel_2 button");
var modal = document.querySelector("#Modal");
var middle_pop_up = document.querySelector("#panel_3_pop_up");
var x_button = document.querySelector("#panel_3_pop_up h4");


// modal_button.addEventListener("click", middle_pop_up_event);

// x_button.addEventListener("click", function(event) {
  // console.log(modal.style.animationName, middle_pop_up.style.animationName);

  // var current_iter = Number(modal.style.animationIterationCount);
  // modal.style.animationIterationCount = (current_iter + 1).toString();

  // middle_pop_up.style.animationDirection = "reverse";
  // middle_pop_up.style.display = "block";
  // middle_pop_up.style.animationName = "middle_pop_down";
  // middle_pop_up.style.animationDelay = "0.1s";
  // middle_pop_up.style.animationDuration = "0.2s";
  // middle_pop_up.style.animationDirection = "normal";
  // middle_pop_up.style.animationFillMode = "both";
  // middle_pop_up.style.animationPlayState = "running";
  // middle_pop_up.style.animationIterationCount = "1";
  // current_iter = Number(middle_pop_up.style.animationIterationCount);
  // middle_pop_up.style.animationIterationCount = (current_iter + 1).toString();
  // console.log(middle_pop_up.style.animationPlayState,
  //             middle_pop_up.style.animationIterationCount);
  // modal.style.animationName = "modal_off";
  // modal.style.animationDuration = "0.3s";
  // modal.style.animationDelay = "0.4s";
  // modal.style.animationDirection = "normal";
  // modal.style.animationFillMode = "both";
  // modal.style.animationPlayState = "running";
  // modal.style.animationIterationCount = "1";
  // timestart = Date.now();
  // Turn_modal_off();
  // console.log(middle_pop_up.style.animationPlayState);
  // console.log(middle_pop_up.style.animationName);
  // console.log(middle_pop_up.style.animationDelay);
  // console.log(middle_pop_up.style.animationDuration);
  // console.log(middle_pop_up.style.animationDirection);
  // console.log(middle_pop_up.style.animationFillMode);
  // console.log("clicked");
  // counter++;
  // console.log(counter);
  // console.log(' ');
// });

// middle_pop_up.addEventListener("animationend", () => {
  // modal_button.removeEventListener("click", middle_pop_up_event);
  // console.log("one cycle ended");
  // middle_pop_up.style.display = "block";
  // var current_iter = Number(middle_pop_up.style.animationIterationCount);
  // middle_pop_up.style.animationPlayState = "paused";
  // middle_pop_up.style.animationIterationCount = (current_iter + 1).toString();
  // modal.style.animationPlayState = "paused";
  // middle_pop_up.style.animationName = "middle_pop_up";
  // middle_pop_up.style.animationDelay = "1000s";
  // middle_pop_up.style.animationDuration = "100s";
  // middle_pop_up.style.animationDirection = "backwards";
  // middle_pop_up.style.animationFillMode = "both";
  // console.log(middle_pop_up.style.animationPlayState);
  // console.log(middle_pop_up.style.animationName);
  // console.log(middle_pop_up.style.animationDelay);
  // console.log(middle_pop_up.style.animationDuration);
  // console.log(middle_pop_up.style.animationDirection);
  // console.log(middle_pop_up.style.animationFillMode);
  // counter++;
  // console.log(counter);
  // console.log(' ');
// });

var panel_1_button = document.querySelector("#panel_1 button");
// var modal = document.querySelector("#Modal");
var left_pop_up = document.querySelector("#panel_1_pop_up");
var x_button_1 = document.querySelector("#panel_1_pop_up h4");

// left_pop_up.addEventListener("animationend", () => {
  // modal_button.removeEventListener("click", middle_pop_up_event);
  // console.log("one cycle ended");
  // middle_pop_up.style.display = "block";
  // var current_iter = Number(middle_pop_up.style.animationIterationCount);
  // left_pop_up.style.animationPlayState = "paused";
  // middle_pop_up.style.animationIterationCount = (current_iter + 1).toString();
  // modal.style.animationPlayState = "paused";
  // middle_pop_up.style.animationName = "middle_pop_up";
  // middle_pop_up.style.animationDelay = "1000s";
  // middle_pop_up.style.animationDuration = "100s";
  // middle_pop_up.style.animationDirection = "backwards";
  // middle_pop_up.style.animationFillMode = "both";
//   console.log(left_pop_up.style.animationPlayState);
//   console.log(left_pop_up.style.animationName);
//   console.log(left_pop_up.style.animationDelay);
//   console.log(left_pop_up.style.animationDuration);
//   console.log(left_pop_up.style.animationDirection);
//   console.log(left_pop_up.style.animationFillMode);
//   counter++;
//   console.log(counter);
//   console.log(' ');
// });

// x_button_1.addEventListener("click", function(event) {
  // console.log(modal.style.animationName, middle_pop_up.style.animationName);

  // var current_iter = Number(modal.style.animationIterationCount);
  // modal.style.animationIterationCount = (current_iter + 1).toString();

  // middle_pop_up.style.animationDirection = "reverse";
  // left_pop_up.style.display = "block";
  // left_pop_up.style.animationName = "middle_pop_down";
  // left_pop_up.style.animationDelay = "0.1s";
  // left_pop_up.style.animationDuration = "0.2s";
  // left_pop_up.style.animationDirection = "normal";
  // left_pop_up.style.animationFillMode = "both";
  // left_pop_up.style.animationPlayState = "running";
  // left_pop_up.style.animationIterationCount = "1";
  // current_iter = Number(middle_pop_up.style.animationIterationCount);
  // middle_pop_up.style.animationIterationCount = (current_iter + 1).toString();
  // console.log(middle_pop_up.style.animationPlayState,
  //             middle_pop_up.style.animationIterationCount);
  // modal.style.animationName = "modal_off";
  // modal.style.animationDuration = "0.3s";
  // modal.style.animationDelay = "0.4s";
  // modal.style.animationDirection = "normal";
  // modal.style.animationFillMode = "both";
  // modal.style.animationPlayState = "running";
  // modal.style.animationIterationCount = "1";
  // timestart = Date.now();
  // Turn_modal_off();
  // console.log(left_pop_up.style.animationPlayState);
  // console.log(left_pop_up.style.animationName);
  // console.log(left_pop_up.style.animationDelay);
  // console.log(left_pop_up.style.animationDuration);
  // console.log(left_pop_up.style.animationDirection);
  // console.log(left_pop_up.style.animationFillMode);
  // console.log("clicked");
  // counter++;
  // console.log(counter);
  // console.log(' ');
// });

// function left_pop_up_event(event) {
  // modal.style.animationName = "modal";
  // modal.style.animationDuration = "0.3s";
  // modal.style.animationDelay = "0.2s";
  // modal.style.animationDirection = "normal";
  // modal.style.animationFillMode = "both";
  // modal.style.animationPlayState = "running";
  // modal.style.animationIterationCount = "1";
//   modal.style.visibility = "visible";
//
//   left_pop_up.style.display = "block";
//   left_pop_up.style.animationName = "middle_pop_up";
//   left_pop_up.style.animationDelay = "0.1s";
//   left_pop_up.style.animationDuration = "0.2s";
//   left_pop_up.style.animationDirection = "normal";
//   left_pop_up.style.animationFillMode = "both";
//   left_pop_up.style.animationPlayState = "running";
//   console.log(left_pop_up.style.animationPlayState);
//   left_pop_up.style.animationIterationCount = "1";
// }

// panel_1_button.addEventListener("click", left_pop_up_event);

var Panel_buttons = document.querySelectorAll(".panel button");
var Elements_in_modal = document.querySelectorAll(".panel_pop_up");
var X_buttons = document.querySelectorAll(".panel_pop_up h4");

if (window.NodeList && !NodeList.prototype.forEach) {
   NodeList.prototype.forEach = Array.prototype.forEach;
}

// function middle_pop_up_event(element) {
  // modal.style.animationName = "modal";
  // modal.style.animationDuration = "0.3s";
  // modal.style.animationDelay = "0.2s";
  // modal.style.animationDirection = "normal";
  // modal.style.animationFillMode = "both";
  // modal.style.animationPlayState = "running";
  // modal.style.animationIterationCount = "1";
//   modal.style.visibility = "visible";
//
//   middle_pop_up.style.display = "block";
//   middle_pop_up.style.animationName = "middle_pop_up";
//   middle_pop_up.style.animationDelay = "0.1s";
//   middle_pop_up.style.animationDuration = "0.2s";
//   middle_pop_up.style.animationDirection = "normal";
//   middle_pop_up.style.animationFillMode = "both";
//   middle_pop_up.style.animationPlayState = "running";
//   console.log(middle_pop_up.style.animationPlayState);
//   middle_pop_up.style.animationIterationCount = "1";
// }

Panel_buttons.forEach(
  function(currentValue, currentIndex) {
    currentValue.addEventListener("click", function() {
      modal.style.visibility = "visible";
      Elements_in_modal[currentIndex].style.display = "block";
      Elements_in_modal[currentIndex].style.animationName = "middle_pop_up";
      Elements_in_modal[currentIndex].style.animationDelay = "0.1s";
      Elements_in_modal[currentIndex].style.animationDuration = "0.2s";
      Elements_in_modal[currentIndex].style.animationDirection = "normal";
      Elements_in_modal[currentIndex].style.animationFillMode = "both";
      Elements_in_modal[currentIndex].style.animationPlayState = "running";
      Elements_in_modal[currentIndex].style.animationIterationCount = "1";
    });

    var ID = Elements_in_modal[currentIndex].getAttribute("id");

    document.querySelector("#" + ID + " h4").addEventListener("click", function() {
      Elements_in_modal[currentIndex].style.display = "block";
      Elements_in_modal[currentIndex].style.animationName = "middle_pop_down";
      Elements_in_modal[currentIndex].style.animationDelay = "0.1s";
      Elements_in_modal[currentIndex].style.animationDuration = "0.2s";
      Elements_in_modal[currentIndex].style.animationDirection = "normal";
      Elements_in_modal[currentIndex].style.animationFillMode = "both";
      Elements_in_modal[currentIndex].style.animationPlayState = "running";
      Elements_in_modal[currentIndex].style.animationIterationCount = "1";

      timestart = Date.now();
      Turn_modal_off();
    });
  });
