"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

/*
We need to allow for the website to support older versions of browsers, like Internet
Explorer. So we use this to dect what browser is used. A version that supports
Internet Explorer is in the works, however, this code can be found here:
https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
*/
var navbar_id = "navbar";
var sBrowser,
  sUsrAg = navigator.userAgent;

if (sUsrAg.indexOf("Firefox") > -1) {
  sBrowser = "Mozilla Firefox"; // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
  sBrowser = "Samsung Internet"; // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
} else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
  sBrowser = "Opera"; // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
} else if (sUsrAg.indexOf("Trident") > -1) {
  sBrowser = "Microsoft Internet Explorer"; // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
} else if (sUsrAg.indexOf("Edge") > -1) {
  sBrowser = "Microsoft Edge"; // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
} else if (sUsrAg.indexOf("Chrome") > -1) {
  sBrowser = "Google Chrome or Chromium"; // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
} else if (sUsrAg.indexOf("Safari") > -1) {
  sBrowser = "Apple Safari"; // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
} else {
  sBrowser = "unknown";
} // Put all our elements to hide in an object to make it much cleaner.

var Elements_to_hide = {
  about_section_header: document.querySelector("#about_section h2"),
  about_section_left: document.querySelector("#left"),
  about_section_middle: document.querySelector("#middle"),
  about_section_right: document.querySelector("#right"),
  project_section_header: document.querySelector("#projects h3"),
  panel_1: document.querySelector("#panel_1"),
  panel_2: document.querySelector("#panel_2"),
  panel_3: document.querySelector("#panel_3")
}; // This object keeps track of visible elements on the page, as these will
// be true. We assigned a method to this object to check that they are visible.

var Visible_elements = {
  about_section_header: false,
  about_section_left: false,
  about_section_middle: false,
  about_section_right: false,
  project_section_header: false,
  panel_1: false,
  panel_2: false,
  panel_3: false,
  all_visible: function all_visible() {
    return (
      this.about_section_header &&
      this.about_section_left &&
      this.about_section_middle &&
      this.about_section_right &&
      this.project_section_header &&
      this.panel_1 &&
      this.panel_2 &&
      this.panel_3
    );
  }
}; //  Keep track of our dimensions.

var Dimensions = {
  window_height: window.innerHeight,
  scroll_Y: window.scrollY
}; // Update the dimensions on the resizing of the browser.

function update_window_dimensions(event) {
  Dimensions.window_height = window.innerHeight;
  Dimensions.scroll_Y = window.scrollY;
}

window.addEventListener("resize", update_window_dimensions); //https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window

function update_animations() {
  for (
    var _i = 0, _Object$keys = Object.keys(Elements_to_hide);
    _i < _Object$keys.length;
    _i++
  ) {
    var animation_element = _Object$keys[_i];

    // getBoundingClientRect gives the bottom relative to the distance
    // from what part of the page is visible at the top of the screen. So
    // as you scroll down an element's bottom property of getBoundingClientRect
    // goes down, eventually becoming 0 as it gets to the top. Offset this
    // by adding the scroll_Y property in the Dimensions object. I found out
    // about getBoundingClientRect from the link above.
    if (
      Dimensions.scroll_Y + Dimensions.window_height >
      Elements_to_hide[animation_element].getBoundingClientRect().bottom +
        Dimensions.scroll_Y
    ) {
      // Our first special case, with our middle panel in the about section. It's
      // height is shorter, and as the user scrolls down, it will show first otherwise
      if (Elements_to_hide[animation_element].getAttribute("id") == "right") {
        if (
          document.querySelector("#left").style.animationPlayState == "running"
        ) {
          // console.log("left element running");
          Elements_to_hide[animation_element].style.animationPlayState =
            "running";
        } // Second special case here, with the last section header. I want it to run
        // after the content panels in the previous section have started animating
      } else if (
        Elements_to_hide[animation_element].getAttribute("id") ==
        "projects_header"
      ) {
        if (
          document.querySelector("#middle").style.animationPlayState ==
          "running"
        ) {
          Elements_to_hide[animation_element].style.animationPlayState =
            "running";
        }
      } else if (
        Elements_to_hide[animation_element].getAttribute("id") == "panel_3"
      ) {
        if (
          document.querySelector("#panel_2").style.animationPlayState ==
          "running"
        ) {
          Elements_to_hide[animation_element].style.animationPlayState =
            "running";
        }
      } else {
        Elements_to_hide[animation_element].style.animationPlayState =
          "running";
      }

      Visible_elements[animation_element] = true;
    }
  }
} // This is the scroll event handler function that brings elements to the screen.

function scroll_function(scroll_event) {
  Dimensions.scroll_Y = window.scrollY;
  update_animations();

  if (Visible_elements.all_visible()) {
    console.log("all visible");
    window.removeEventListener("scroll", scroll_function);
  }
} // This function toggles the class of the navbar on and off, giving us
//  different looking navigation bars if the scrollY property is 0.

function toggle_class() {
  var navbar = document.querySelector(".navigator");

  if (window.scrollY == 0) {
    navbar.removeAttribute("id");
    navbar.setAttribute("class", "navbar navigator");
  } else {
    navbar.setAttribute("class", "navigator");
    navbar.id = "navbar";
  }
}
/*
The animations here don't work in Internet Explorer, which is why we
do this only in the event of the browser not being so
*/

if (!(sBrowser == "Microsoft Internet Explorer")) {
  if (sBrowser == "Mozilla Firefox") {
    // Firefox renders differently than Edge, so I fixed the
    // navbar to have appropriate padding in Firefox.
    Navbar_class_elems = document.querySelectorAll(".navbar li a");

    var _iterator = _createForOfIteratorHelper(Navbar_class_elems),
      _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var Elem = _step.value;
        Elem.style.paddingBottom = "6px";
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  window.addEventListener("load", function (event) {
    // Bring the right class onto the navbar depending on the location on the
    // page.
    // Bring the right elements to the screen depending on where we are.
    update_animations();
    window.addEventListener("scroll", scroll_function);
    window.addEventListener("scroll", toggle_class);
  });
} // This function turns the modal off once the pop up has gone.

var timestart = null;
var animation_id = null;

function Turn_modal_off() {
  if (Date.now() - timestart >= 320) {
    document.querySelector("#Modal").style.visibility = "hidden";
    window.cancelAnimationFrame(animation_id);
  } else {
    animation_id = requestAnimationFrame(Turn_modal_off);
  }
} // This is how we access the the appropriate buttons to add event listeners
// onto. querySelectorAll and querySelector are very convenient.

var Panel_buttons = document.querySelectorAll(".panel button");
var Elements_in_modal = document.querySelectorAll(".panel_pop_up");
var X_buttons = document.querySelectorAll(".panel_pop_up h4"); // if the nodelist does not have a forEach method, then assign it  to
// the array's forEach method

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

Panel_buttons.forEach(function (currentValue, currentIndex) {
  // Add appropriate event listeners to the appropriate
  // buttons asking for more info in the panels, as well as adding the
  // appropriate event listeners to the x buttons on the pop ups.
  currentValue.addEventListener("click", function () {
    document.querySelector("#Modal").style.visibility = "visible";
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
  document
    .querySelector("#" + ID + " h4")
    .addEventListener("click", function () {
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
toggle_class();
