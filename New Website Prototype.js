var header = document.getElementById("Header");
var projects = document.getElementById("projects");
var about_section = document.getElementById("about_section");
var navbar = document.querySelector("#navbar");
var home_header = document.getElementById("home_header")
var about_header = document.getElementById("about_header")
var projects_header = document.getElementById("projects_header")

function Scroll_fn(event) {
  event.preventDefault();

  var ID = this.getAttribute("href")
  var offsetBottom = document.querySelector(ID).offsetTop; //+
                  // document.querySelector(ID).offsetHeight;

  console.log("Hello from inside the event listener.")
  window.scroll({
    left: 0,
    top: offsetBottom,
    behavior: "smooth"
  });
}

var Navbar_links = document.querySelectorAll("#navbar li a");

for (let HTMLelement of Navbar_links) {
  HTMLelement.addEventListener("click", Scroll_fn);
}
