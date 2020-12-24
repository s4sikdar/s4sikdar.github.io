function toggle_class() {
  var navbar = document.querySelector(".navigator");

  if (window.pageYOffset == 0) {
    navbar.removeAttribute("id");
    navbar.setAttribute("class", "navigation navigator d-flex m-0");
  } else {
    navbar.setAttribute("class", "navigator d-flex m-0");
    navbar.id = "navbar";
  }
}

toggle_class();

function attach_class() {
  try {
    chart_sections = document.querySelectorAll('#chart_div svg g');
    chart_sections[0].setAttribute('class', 'parent');
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    button = document.querySelector("#headingOne button");
  } catch (err) {
    console.log(err);
  }
}


function drawChart () {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Skill');
  data.addColumn('number', 'Slices');
  data.addColumn({type: 'string', role: 'tooltip'});
  data.addRows([
    [
      'Python', 3.5,
      'My \"mother tongue\" of programming languages. ' +
      'Python was the first practical language I ' +
      'learned to code in, the one I made my first project in, ' +
      'and the one I\'d answer technical interviews with.'
    ],
    [
      'HTML, CSS, JavaScript', 2.5,
      'With the advice of a friend, I started to learn the basics ' +
      'of web development around mid April. I\'d say I\'ve gotten ' +
      'to be passable in HTML and CSS at the least, and I\'ve covered ' +
      'JavaScript up till ES6. I\'m on my way to learning React JS over the winter break.'
    ],
    [
      'jQuery', 0.5,
      'When I created my first website, I dabbled in jQuery a little. ' +
      'I could brush up on it if need be, but it\'s not high on my priority list. ' +
      'I\'ve been mainly focusing on making sure I have the prerequisites for React JS.'
    ],
    [
      'Bootstrap', 1,
      'I started learning this around early November, ' +
      'learning the basics of various Bootstrap classes, as well as their ' +
      'components. This site was made possible with it.'
    ],
    [
      'SQL/SQLite3', 1,
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

  chart_div = document.querySelector('#chart_div');
  var options = {
    title: '',
    backgroundColor: '#F1F0EA',
    chartArea: {
      left: (chart_div.offsetWidth * 0.1),
      top: (document.body.offsetHeight * 0.015),
      bottom: (document.body.offsetHeight * 0.015),
      width: (chart_div.offsetWidth * 0.8),
      height: Math.min((document.body.offsetHeight * 0.8),
                       (chart_div.offsetWidth * 0.8))
    },
    legend: {
      position: 'labeled'
    },
    width: (chart_div.offsetWidth),
    height: Math.min(((chart_div.offsetWidth * 0.8) + (document.body.offsetHeight * 0.03)),
                     ((document.body.offsetHeight * 0.8) + (document.body.offsetHeight * 0.03))),
    pieSliceText: 'none',
    slices: [
      {color: '#FFE4C4'},
      {color: '#FFDEAD'},
      {color: '#DEB887'},
      {color: '#D2B48C'},
      {color: '#d3a577'},
      {color: '#af7439'}
    ],
    tooltip: {
      ignoreBounds: false,
      isHtml: true,
      trigger: 'selection'
    }
  };
  chart_div = document.querySelector('#chart_div');
  if ((document.body.offsetWidth < 1100)) {
    if (document.body.offsetWidth < 1000) {
      options.chartArea.top = 40;
      options.chartArea.bottom = Math.min((chart_div.offsetWidth * 0.01),
                                          (document.body.offsetHeight * 0.01));
      options.legend.position = 'top';
      options.legend.alignment = 'center';
      options.height = Math.min((chart_div.offsetWidth * 0.8),
                                (document.body.offsetHeight * 0.8));
    }

    options.chartArea.left = 0;
    options.chartArea.width = document.querySelector('#chart_div').offsetWidth;
  }
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options)
}



last_class = null;
collapsing_elem = document.querySelector(".collapse");
collapsing_buttons = document.querySelectorAll(".card-header button");
collapsing_elements = document.querySelectorAll(".folding_element");
mobile_nav_height = document.querySelector("nav").offsetHeight * (-1);
margin = mobile_nav_height.toString() + "px 0px " + "0px";

inside_accordion_options = {
  threshold: 0.5
}


try {
  timeline_observer = new IntersectionObserver(inside_intersection,
                                               inside_accordion_options);
} catch(error) {
  var timeline_sections = document.querySelectorAll(".inner_divs");
  for (var i = 0; i < timeline_sections.length; i++) {
    timeline_sections[i].setAttribute("class", "");
  }
  timeline_sections = null;
}


function inside_intersection(entries, observer) {
  for (var i = 0; i < (entries.length); i++) {
    target_class = entries[i].target.getAttribute("class");
    header_class = entries[i].target.children[0].getAttribute("class");
    // console.log(entries[i].target);
    if (entries[i].isIntersecting) {
      if ((entries[i].intersectionRatio >= 0.5) && (header_class == "opaque")) {
        if (target_class.includes("right_side")) {
          entries[i].target.children[0].setAttribute("class", "slide_in");
          entries[i].target.children[1].setAttribute("class", "slide_in");
        } else {
          entries[i].target.children[0].setAttribute("class", "slide_left");
          entries[i].target.children[1].setAttribute("class", "slide_left");
        }
        // console.log(entries[i].target.id);
        observer.unobserve(entries[i].target);
      }
    }
  }
}


Children = document.querySelector(".right_side").children;

for (var i = 0; i < collapsing_buttons.length; i++) {
  // Add event listeners to change the text content of the buttons and
  // the styling of it when it is pressed. This is how you see the
  // '+' and '-' signs on the buttons
  collapsing_buttons[i].addEventListener("click", function() {
    parent_id = this.parentNode.parentNode.getAttribute("id");
    card_headers = document.querySelectorAll(".card-header");
    inner_divs = document.querySelectorAll(".inner_divs");

    if (this.parentNode.parentNode.getAttribute("class") == "card-header border_off") {
      this.parentNode.parentNode.setAttribute("class", "card-header border_on");
      this.textContent = '-';
      this.style.transform = "scale(1.3) translateX(-25%)";
    } else {
      this.parentNode.parentNode.setAttribute("class", "card-header border_off");
      this.textContent = '+';
      this.style.transform = "scale(1.0)";

      try {
        // Create a dummy intersection observer and Mutation Observer to test the
        // validity of the intersection observer and Mutation Observer, and then
        // only set the headings and paragraphs to be opaque, but only if
        // we are not in Internet Explorer.
        dummy_observer = new IntersectionObserver(inside_intersection,
                                                  inside_accordion_options);
        dummy_observer = null;

        dummy_mutation_observer = new MutationObserver(function() {
          console.log('dummy callback function');
        });

        dummy_mutation_observer = null;

        // If we are not in I.E., do this.
        // document.documentMode information can be found here and here:
        // https://www.geeksforgeeks.org/html-dom-documentmode-property/
        // https://coderwall.com/p/browgq/target-ie-with-javascript
        if (typeof document.documentMode === "undefined") {
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
        if (!(elem_class.includes("border_off"))) {
          card_headers[i].setAttribute("class", "card-header border_off");
          button.textContent = '+'
          button.style.transform = "scale(1.0)";
        }
      }
    }

  });
}

try {
  // Not all browsers support tippy.js, however, there was an error in the bootstrap
  // library with respect to tooltips
  tippy(document.querySelectorAll("#container_fluid a i"), {
    duration: 500,
    placement: 'bottom',
  });
} catch(error) {
  console.log(error);
}

function intersection_callback(entries) {
  // In summary, check if we have not scrolled down past 0 or around 0, and
  // then only change the navbar style
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

// Represents the element we want to observe, and the height to offset it so that
// the observer is called when the document is scrolled up to the top. Then only
// do you switch the classes. It's more efficient than scroll event handlers.
var items_for_observation = {
  main_header: document.querySelector("#container_fluid"),
  height: (-1) * document.querySelector("#container_fluid").offsetHeight + 2
};

var options = {
  rootMargin: items_for_observation.height.toString() + "px 0px 0px 0px"
};

try {
  // Let's try the efficient way of changing the navbars on scroll, before going
  // with the inefficient way
  intersection = new IntersectionObserver(intersection_callback, options);
  intersection.observe(items_for_observation.main_header);
} catch(error) {
  window.addEventListener("scroll", toggle_class);
}


function issue_observer() {
  try {
    // If in a browser with a version that does not support the following, put it
    // in a try-catch block
    items_for_observation.height = (-1) * document.querySelector("#container_fluid").offsetHeight + 2;
    options.rootMargin = items_for_observation.height.toString() + "px 0px 0px 0px";
    new_observer = new IntersectionObserver(intersection_callback, options);
    new_observer.observe(items_for_observation.main_header);
  } catch(err) {
    console.log(error);
  }
}


window.addEventListener("resize", function() {
  issue_observer();
});


function mutation_callback(mutations_list, observer) {
  /*
  Callback function for the mutation. Basically set the appropriate buttons to
  disabled if they're collapsing, and have the intersection observer observe
  the divs in the timeline, if that button in the accordion is pushed. I.e. if
  the user clicks the heading titled "The Saga So Far", observe the divs only then.
  */

  try {
    target_elem = mutations_list[0].target;
    if (mutations_list[0].target.className.includes("collapsing")) {
      target_elem.previousElementSibling.querySelector("button").disabled = true;
    } else {
      target_elem.previousElementSibling.querySelector("button").disabled = false;
    }

    if (target_elem.id == "collapseTHREE") {
      animate_divs = target_elem.querySelectorAll(".inner_divs");
      // console.log(target_elem.className);
      if (target_elem.className.includes("show")) {
        // console.log(animate_divs);
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
      // for (var i = 0; i < (animate_divs.length); i++) {
      //   animate_divs[i].children[0].setAttribute("class", "opaque");
      //   animate_divs[i].children[1].setAttribute("class", "opaque");
      // }

      if (target_elem.className.includes("show")) {
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

// else {
//  // Some bugs stem in terms of what gets slid in first the next time around
//  // if we don't unobserve when this section slides back up.
//  for (var index = 0; index < animate_divs.length; index++) {
//    timeline_observer.unobserve(animate_divs[index]);
//  }
// }

var mutation_observers = [];
var observer_options = {
  attributeFilter: ["class"]
};

var mutations = {
  mutation_observers: [],
  observer_options: {
    attributeFilter: ["class"]
  }
}

google.charts.load('current', {packages: ['corechart']}).then(drawChart).then(attach_class);

try {
  // Try applying mutation observers to monitor the state of classes in buttons for
  // our accordion, otherwise don't bother
  for (var i = 0; i < collapsing_buttons.length; i++) {
    mutations.mutation_observers.push(new MutationObserver(mutation_callback));
    mutations.mutation_observers[i].observe(collapsing_elements[i], observer_options);
  }
} catch(error) {
  var divs_to_animate = document.querySelectorAll(".inner_divs");
  for (var i = 0; i < (divs_to_animate.length); i++) {
    divs_to_animate[i].children[0].setAttribute("class", "");
    divs_to_animate[i].children[1].setAttribute("class", "");
  }
}


window.addEventListener("resize", function() {
  try {
    width = this.innerWidth;
    // console.log(window.innerWidth);
    if (width >= 768) {
      drawChart();
    }
  } catch(error) {
    console.log(error);
  }
});

// var obj_literal = {
//   total: 1,
//   scope: this,
//   scope_elem: this.document
// };
//
// console.log(obj_literal.scope);
// console.log(obj_literal.scope_elem);
