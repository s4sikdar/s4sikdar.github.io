// All buttons each bar of the accordion.
var collapsing_buttons = document.querySelectorAll(".card-header button");
// Elements to be observed.
var collapsing_elements = document.querySelectorAll(".folding_element");
// This stores the threshold for which the text blocks in the timeline are visible.
// So once half of the height of the space taken up by the block is shown, run the
// callback function.
var inside_accordion_options = {
  threshold: 0.5
}
// The attributes for which we want to monitor changes in the element being observed.
var mutation_observer_options = {
  attributeFilter: ["class"]
};
// The object that tracks all mutation observer objects, and stores the options we're
// using for them.
var mutations = {
  mutation_observers: [],
  mutation_observer_options: mutation_observer_options
};

// Represents the element we want to observe, and the height to offset it so that
// the observer is called when the document is scrolled up to the top. Then only
// do you switch the classes. It's more efficient than scroll event handlers.
var items_for_observation = {
  main_header: document.querySelector("#container_fluid"),
  height: (-1) * document.querySelector("#container_fluid").offsetHeight + 2
};
// Options for the intersection observer that observes the navbar
var intersection_observer_options = {
  rootMargin: items_for_observation.height.toString() + "px 0px 0px 0px"
};




/*
This function is used to toggle the class and change the header based on whether
the pageYOffset property of the window is 0 (if the page is scrolled to the top).
*/
function toggle_class() {
  // we add the navigator class to get the navbar itself.
  var navbar = document.querySelector(".navigator");

  if (window.pageYOffset == 0) {
    // navigator class gives the transparent navbar, we remove the id that has its
    // own styling
    navbar.removeAttribute("id");
    navbar.setAttribute("class", "navigation navigator d-flex m-0");
  } else {
    navbar.setAttribute("class", "navigator d-flex m-0");
    navbar.id = "navbar";
  }
}



/*
This function tries to find the optimal dimensions to draw the chart and returns
an object literal that has these settings. This function is a helper function for
drawChart.
*/
function optimal_chart_area() {
  var chart_div = document.querySelector('#chart_div');
  // Settings for how to draw the chart and avoid having the labels cut off.
  var chart_area = {
    left: (chart_div.offsetWidth * 0.1),
    top: (document.body.offsetHeight * 0.015),
    bottom: (document.body.offsetHeight * 0.015),
    width: (chart_div.offsetWidth * 0.8),
    height: Math.min((document.body.offsetHeight * 0.8),
                     (chart_div.offsetWidth * 0.8))
  };

  // Some extra work to make sure the chart is the right size so that the chart is not
  // cutting off the labels.
  if ((document.body.offsetWidth < 1100)) {
    if (document.body.offsetWidth < 1000) {
      chart_area.top = 40;
      chart_area.bottom = Math.min((chart_div.offsetWidth * 0.01),
                                          (document.body.offsetHeight * 0.01));
    }
    chart_area.left = 0;
    chart_area.width = chart_div.offsetWidth;
  }

  return chart_area;
}



/*
This function is responsible for drawing the chart in the element with the id
"#chart_div".
*/
function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Skill');
  data.addColumn('number', 'Slices');
  data.addColumn({type: 'string', role: 'tooltip'});
  // All the skills/slices of the pie.
  data.addRows([
    [
      'Python', 3.5,
      'My \"mother tongue\" of programming languages. ' +
      'Python was the first practical language I ' +
      'learned to code in, the one I made my first project in, ' +
      'and the one I\'d answer technical interviews with.'
    ],
    [
      'HTML, CSS, JavaScript', 3,
      'With the advice of a friend, I started to learn the basics ' +
      'of web development around mid April. I\'d say I\'ve gotten ' +
      'to be passable in HTML and CSS at the least, and I\'ve covered ' +
      'JavaScript up till ES6. I\'m on my way to learning React JS over the winter break.'
    ],
    [
      'jQuery', 0.25,
      'When I created my first website, I dabbled in jQuery a little. ' +
      'I could brush up on it if need be, but it\'s not high on my priority list. ' +
      'I\'ve been mainly focusing on making sure I have the prerequisites for React JS.'
    ],
    ['Flask', 0.75,
     'Over the holidays I picked up the the Python framework Flask. I am familiar with ' +
     'some basic routing, can do a little with Jinja Templates but that\'s about it for now.'
    ],
    [
      'Bootstrap', 1,
      'I started learning this around early November, learning the basics ' +
      'of various Bootstrap classes, as well as Bootstrap components. This site ' +
      'was made possible with it.'
    ],
    [
      'SQL/SQLite3', 0.75,
      'I took a Relational Databases course in school - Google \"CS338\". ' +
      'I learned the basics of SQL queries using the SQLite3 DBMS. I covered ' +
      'some basics on normal forms, relational models, the E.R. model, but this ' +
      'was back in the spring term of 2020.'
    ],
    [
      'Git', 0.5,
      'I learned Git at the advice of a friend, starting out by tracking ' +
      'my projects with it to save myself from having 10 copies of ' +
      'the same code in different file directories.'
    ]
  ]);

  var chart_div = document.querySelector('#chart_div');

  var options = {
    // No title
    title: '',
    // Background color on the chart
    backgroundColor: '#F1F0EA',
    // We are trying to dynamically size the chart to take enough space
    // so that it's big enough, but the labels on the side are not cut off (mixed results right now)
    chartArea: optimal_chart_area(),
    // Labels on the side
    legend: {
      position: 'labeled'
    },
    width: (chart_div.offsetWidth),
    // Want to take enough space up for the chart to fit, but not for the spacing to
    // be off
    height: Math.min(((chart_div.offsetWidth * 0.8) + (document.body.offsetHeight * 0.03)),
                     ((document.body.offsetHeight * 0.8) + (document.body.offsetHeight * 0.03))),
    pieSliceText: 'none',
    // Color for different slices
    slices: [
      {color: '#ffe4c4'},
      {color: '#e9d4b7'},
      {color: '#dfc197'},
      {color: '#d8b27e'},
      {color: '#d0a465'},
      {color: '#c69146'},
      // {color: '#c2893a'},
      {color: '#a97833'}
      // {color: '#835d27'}
      // {color: '#443014'}
      // {color: '#96856f'}
    ],
    // activated on click of the slice, and is html (can be styled with css)
    tooltip: {
      ignoreBounds: false,
      isHtml: true,
      trigger: 'selection'
    }
  };

  // Played with the chart appearance at various sizes, found that these settings
  // when the window is less than 1000px is ideal
  if (document.body.offsetWidth < 1000) {
    options.legend.position = 'top';
    options.legend.alignment = 'center';
    options.height = Math.min((chart_div.offsetWidth * 0.8),
                              (document.body.offsetHeight * 0.8));
  }

  var chart = new google.visualization.PieChart(chart_div);
  chart.draw(data, options);
}



/*
This function is responsible for checking the elements are intersecting, and if
so the right class is toggled to slide the text blocks in.
*/
function inside_intersection(entries, observer) {
  for (var i = 0; i < (entries.length); i++) {
    target_class = entries[i].target.getAttribute("class");
    header_class = entries[i].target.children[0].getAttribute("class");

    if (entries[i].isIntersecting) {
      if ((entries[i].intersectionRatio >= 0.5) && (header_class == "opaque")) {
        if (target_class.includes("right_side")) {
          entries[i].target.children[0].setAttribute("class", "slide_in");
          entries[i].target.children[1].setAttribute("class", "slide_in");
        } else {
          entries[i].target.children[0].setAttribute("class", "slide_left");
          entries[i].target.children[1].setAttribute("class", "slide_left");
        }
        // If the entry is intersecting, then toggle the right class on and
        // unobserve the entry
        observer.unobserve(entries[i].target);
      }
    }
  }
}



/*
This function adds event listeners to each button on the right in the accordion
that is in the About section.
*/
function accordion_button_event_listners() {
  for (var i = 0; i < collapsing_buttons.length; i++) {
    /*
    Add event listeners to change the text content of the buttons and
    the styling of it when it is pressed. This is how you see the
    '+' and '-' signs on the buttons
    */
    collapsing_buttons[i].addEventListener("click", function() {
      parent_id = this.parentNode.parentNode.getAttribute("id");
      card_headers = document.querySelectorAll(".card-header");
      inner_divs = document.querySelectorAll(".inner_divs");

      // Change the classes of the buttons based on the classes that are there currently.
      // Change the text content as well.
      if (this.parentNode.parentNode.getAttribute("class") == "card-header border_off") {
        this.parentNode.parentNode.setAttribute("class", "card-header border_on");
        this.textContent = '-';
        // Add transformations so that the buttons all line up correctly. The
        // same applies for the else condition.
        if (window.innerWidth <= 420) {
          this.style.transform = "scale(1.3) translateX(-25%) translateY(20%)";
        } else {
          this.style.transform = "scale(1.3) translateX(-25%)";
        }

        /*
        If we are not in I.E., do this.
        document.documentMode information can be found here and here:
        https://www.geeksforgeeks.org/html-dom-documentmode-property/
        https://coderwall.com/p/browgq/target-ie-with-javascript
        Set children elements with class "inner_divs" to opaque, as next
        time they will be brought in by the sliding animations.
        */
        if (!(document.documentMode)) {
          for (var i = 0; i < (inner_divs.length); i++) {
            inner_divs[i].children[0].setAttribute("class", "opaque");
            inner_divs[i].children[1].setAttribute("class", "opaque");
          }
        }
      } else {
        this.parentNode.parentNode.setAttribute("class", "card-header border_off");
        this.textContent = '+';
        if (window.innerWidth <= 420) {
          this.style.transform = "scale(1.0) translateY(20%)";
        } else {
          this.style.transform = "scale(1.0)";
        }

        try {
          /*
          Create a dummy intersection observer and Mutation Observer to test the
          validity of the intersection observer and Mutation Observer, and then
          only set the headings and paragraphs to be opaque, but only if
          we are not in Internet Explorer.
          */
          var dummy_observer = new IntersectionObserver(inside_intersection,
                                                        inside_accordion_options);
          dummy_observer = null;

          var dummy_mutation_observer = new MutationObserver(function() {
            console.log('dummy callback function');
          });

          var dummy_mutation_observer = null;

          if (!(document.documentMode)) {
            if (parent_id == "headingTHREE") {
              for (var i = 0; i < (inner_divs.length); i++) {
                inner_divs[i].children[0].setAttribute("class", "opaque");
                inner_divs[i].children[1].setAttribute("class", "opaque");
              }
            }
          }
        } catch(err) {
          console.log(err);
        }
      }

      // Check if any of the other cards do not have the border_off classes
      // to get rid of the light brown line. If they do, then add this class
      for (var i = 0; i < card_headers.length; i++) {
        if (card_headers[i].getAttribute("id") !== parent_id) {
          elem_class = card_headers[i].getAttribute("class");
          button = card_headers[i].querySelector("button");
          // Add the border_off class where applicable and set the style
          // transform properties back to default.
          if (!(elem_class.includes("border_off"))) {
            card_headers[i].setAttribute("class", "card-header border_off");
            button.textContent = '+'
            button.style.transform = "scale(1.0)";
          }
        }
      }
    });
  }
}



/*
The callback function for our intersection observer. In summary, check if we have
not scrolled down past 0 or around 0, which the isIntersecting property to true.
From there set the right classes accordingly/remove the id attribute accordingly.
*/
function intersection_callback(entries) {

  for (var i = 0; i < (entries.length); i++) {
    navbar = document.querySelector(".navigator");
    if (entries[i].isIntersecting) {
      navbar.removeAttribute("id");
      navbar.setAttribute("class", "navigation navigator");
    } else {
      navbar.setAttribute("class", "navigator");
      navbar.id = "navbar";
    }
  }
}



/*
This function is responsible for making the header change its style based on how far
down the window is scrolled. We try to add this by using IntersectionObserver first,
and if the browser doesn't support it then a scroll event listener (less efficient).
*/
function alter_header_event_listener() {
  try {
    var intersection = new IntersectionObserver(intersection_callback,
                                                intersection_observer_options);
    intersection.observe(items_for_observation.main_header);
  } catch(error) {
    window.addEventListener("scroll", toggle_class);
  }
}



/*
Try to re-issue the intersection observer for the navbar, as for some reason when
you resize the window, and don't reassign the observer, the navbar does not toggle
its classes when the page is scrolled to the top. So we have to re-do this.
*/
function re_issue_observer() {
  try {
    // If in a browser with a version that does not support the following, put it
    // in a try-catch block
    items_for_observation.height = (-1) * document.querySelector("#container_fluid").offsetHeight + 2;
    intersection_observer_options.rootMargin = items_for_observation.height.toString() +
                                               "px 0px 0px 0px";
    new_observer = new IntersectionObserver(intersection_callback,
                                            intersection_observer_options);
    new_observer.observe(items_for_observation.main_header);
  } catch(err) {
    console.log(error);
  }
}



/*
Callback function for the mutation. Basically set the appropriate buttons to
disabled if they're collapsing, and have the intersection observer observe
the divs in the timeline, if that button in the accordion is pushed. I.e. if
the user clicks the heading titled "The Saga So Far", observe the divs only then.
*/
function mutation_callback(mutations_list, observer) {
  try {
    var target_elem = mutations_list[0].target;
    if (mutations_list[0].target.className.includes("collapsing")) {
      target_elem.previousElementSibling.querySelector("button").disabled = true;
    } else {
      target_elem.previousElementSibling.querySelector("button").disabled = false;
    }

    var animate_divs = target_elem.querySelectorAll(".inner_divs");
    // If the target element is the last section of the accordion
    if (target_elem.id == "collapseTHREE") {
      // Then check the classname, and accordingly observe all the tags with the
      // class inner_divs.
      if (target_elem.className.includes("show")) {
        for (var index = 0; index < animate_divs.length; index++) {
          timeline_observer.observe(animate_divs[index]);
        }
      } else {
        // Some bugs stem in terms of what gets slid in first the next time around
        // if we don't unobserve when this section slides back up.
        for (var index = 0; index < animate_divs.length; index++) {
          timeline_observer.unobserve(animate_divs[index]);
        }
      }
    } else {
      // If the button being pressed opens that section of the accordion instead of
      // closing it, set the elements with class "inner_divs" to be opaque.
      if (target_elem.className.includes("show")) {
        // Bugs happen when we don't unboserve when a new accordion box is opened.
        for (var index = 0; index < animate_divs.length; index++) {
          animate_divs[index].children[0].setAttribute("class", "opaque");
          animate_divs[index].children[1].setAttribute("class", "opaque");
          timeline_observer.unobserve(animate_divs[index]);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}



/*
This function adds mutation observers to an array, and has the observer observe
an assigned element from the collapsing_elements node list
(elements with the folding_element class).
*/
function add_mutation_observers() {
  try {
    // Try applying mutation observers to monitor the state of classes in buttons for
    // our accordion, otherwise don't bother
    for (var i = 0; i < collapsing_buttons.length; i++) {
      mutations.mutation_observers.push(new MutationObserver(mutation_callback));
      mutations.mutation_observers[i].observe(collapsing_elements[i],
                                              mutation_observer_options);
    }
  } catch(error) {
    // If the mutation observer is not supported in the browser, then set the
    // classes of children of any elements with class "inner_divs" to "", as
    // MutationObserver must be supported in the browser.
    var divs_to_animate = document.querySelectorAll(".inner_divs");
    for (var i = 0; i < (divs_to_animate.length); i++) {
      divs_to_animate[i].children[0].setAttribute("class", "");
      divs_to_animate[i].children[1].setAttribute("class", "");
    }
  }
}



/*
Add the tooltip with Tippy.js instead of Bootstrap, as there was an error when
setting up the tooltip with Bootstrap.
*/
function add_tooltip() {
  try {
    tippy(document.querySelectorAll("#container_fluid a i"), {
      duration: 500,
      placement: 'bottom',
    });
  } catch(error) {
    console.log(error);
  }
}



/*
This function sets up the page, using all the helper functions above.
*/
function setup() {
  toggle_class();
  alter_header_event_listener();
  add_tooltip();
  accordion_button_event_listners();
  add_mutation_observers();
  // The chart requires a resize event handler to resize when the window resizes
  window.addEventListener("resize", function() {
    try {
      width = this.innerWidth;
      // Check if thw width is enough for the chart to be redrawn, and if so then
      // redraw it.
      if (width >= 768) {
        drawChart();
      }
    } catch(error) {
      console.log(error);
    }
  });
  // We have to reissue the IntersectionObserver on the navbar when the browser
  // resizes, otherwise the navbar doesn't switch styles when scrolled to the top.
  window.addEventListener("resize", function() {
    re_issue_observer();
  });
  google.charts.load('current', {packages: ['corechart']}).then(drawChart);
}



/*
This checks for the support of IntersectionObserver, and if there is no
support then it does set the appropriate classes for the text sections inside the
"The Saga So Far" section.
*/
try {
  var timeline_observer = new IntersectionObserver(inside_intersection,
                                                  inside_accordion_options);
} catch(error) {
  /*
  Set the class attributes of elements with inner_divs to null,
  because there is no point chaging the classes later on if IntersectionObserver
  is not observed here.
  */
  var timeline_sections = document.querySelectorAll(".inner_divs");
  for (var i = 0; i < timeline_sections.length; i++) {
    timeline_sections[i].setAttribute("class", "");
  }
  timeline_sections = null;
}
setup();
