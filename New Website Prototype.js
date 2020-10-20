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
    console.log("all visible");
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
          // Our special case, with our middle panel in the about section. It's
          // height is shorter, and as the user scrolls down, it will show first otherwise
          if (Elements_to_hide[animation_element].getAttribute("id") == "right") {
            if (document.querySelector("#left").style.animationPlayState == "running") {
              console.log("left element running");
              Elements_to_hide[animation_element].style.animationPlayState = "running";
              Visible_elements[animation_element] = true;
            }
          }
          else {
            Elements_to_hide[animation_element].style.animationPlayState = "running";
            Visible_elements[animation_element] = true;
          }
    }
  }
}

/*
The animations here don't work in Internet Explorer, which is why we
do this only in the event of the browser not being so
*/
if (!(sBrowser == "Microsoft Internet Explorer")) {
  window.addEventListener("load", function(event) {
    //console.log("Hi")
    Header = document.querySelector("#Header");
    Header.addEventListener("animationend", function() {
      update_animations();
      window.addEventListener("scroll", scroll_function);
    });
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

var panel_1_button = document.querySelector("#panel_1 button");
var left_pop_up = document.querySelector("#panel_1_pop_up");
var x_button_1 = document.querySelector("#panel_1_pop_up h4");

var Panel_buttons = document.querySelectorAll(".panel button");
var Elements_in_modal = document.querySelectorAll(".panel_pop_up");
var X_buttons = document.querySelectorAll(".panel_pop_up h4");

if (window.NodeList && !NodeList.prototype.forEach) {
   NodeList.prototype.forEach = Array.prototype.forEach;
}

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
