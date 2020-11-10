// I got this keyword when I used a Babel compiler. I got the error message of 'Script 1006: Expected ')''.
// After browsing on Stack Overflow, I found out that certain features of Javascript are not supported by older versions
// of Internet Explorer. So I used a Babel compiler to translate the code into code that should be compatible with older
// versions of Internet Explorer/Microsoft Edge.
//"use strict";//commented this out because it appears to have problems with jQuery

/*
So basically we have to figure out what browser we're in, so this helps with that. This is since there are differences in terms
of how HTML, CSS, and JavaScript are rendered in various browsers. So check and return the string according to what browser we're in.
This gets used later when we have to run statements for certain browsers only. Fair warning, my site doesn't run in IE so that's something
I have to work on. Source here:
https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
*/

function Set_color(Background_color, Main_color, Error_message) {
	document.getElementById("modal_content").style.boxShadow = "0 0 0 4px " + Background_color;
	document.getElementById("modal_content").style.backgroundColor = Background_color;
	document.getElementById("modal_content").style.borderColor = Main_color;
	document.getElementById("modal_content").style.color = Main_color;
	document.getElementById("X_button").style.color = Main_color;
	for (let Element of document.getElementsByClassName("Background")) {
		Element.style.backgroundColor = Main_color;
		Element.style.borderColor = Background_color;
	}
	document.getElementById("Heading_Tag").style.color = Background_color;
	document.getElementById("Error_msg").style.color = Background_color;
	document.getElementById("Error_msg").innerHTML = Error_message;
}
function Open_modal(Background_color, Main_color, Inner_text) {
	Set_color(Background_color, Main_color, Inner_text);
	document.getElementsByClassName("modal")[0].style.display = "flex";
}
function Close_modal() {
	document.getElementsByClassName("modal")[0].style.display = "none";
}

// This is necessary to determine if we need to change the appearance of the site.
// In firefox the site renders differently.
function Browser_type() {
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
        return 'opera';
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
        return 'chrome';
    }
    else if(navigator.userAgent.indexOf("Safari") != -1) {
        return 'safari';
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
        return 'firefox';
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) { //IF IE > 10
		return 'ie';
    }
    else {
		return 'unknown';
    }
}

/* helper fn for our rgb to hex converter. I found this on stack overflow and
it works.
*/
function rgbToHex(num) {
	var hex = num.toString(16);
	if (hex.length < 2) {
		hex = "0" + hex;
	}
	return hex;
}

//we get valid input and turn rgb into hex values
function Rgb_to_hex(r, g, b) {
	var red = rgbToHex(r);
	var green = rgbToHex(g);
	var blue = rgbToHex(b);
	return "#" + red + green + blue;
}

/* this gives us the right kind of string to put into our rgb to hex converter
Basically start with an index for a space. When posn is -1, then there is no space.
In the while loop, replace the next space character with an empty string. Then get the
next position of the next string. The replace method of string replaces only the next
instance of a string. So this ends up removing all the strings.
*/
function Str_without_spaces(Input_string) {
	posn = Input_string.indexOf(' ');
	while (posn != -1) {
		Input_string = Input_string.replace(' ', '');
		posn = Input_string.indexOf(' ');
	}
	return Input_string;
}

/* The function checks to make sure that the color is valid. Basically, we
set the color equal to the background color of the body element, and then we
get the backgroundColor property of the style property of the body element
through the Document Object Model(DOM). If the color is valid, then the background color
property of the body element would be our new color, and color2 would not be an
empty string. If it is, then the color is not valid. So after we change the background color
we set it back to an empty string, because we don't actually want the background color to change
here. We return true and false accordingly.
*/
function GoodColor(color) {
	var color2 = "";
	var e = document.getElementsByTagName('body')[0];
	e.style.backgroundColor = "";
	e.style.backgroundColor = color;
	color2 = e.style.backgroundColor;
	//alert("Color is " + color2);
	if (color2.length == 0) {
		//alert("Color invalid");
		return false;
	}
	//color = Str_without_spaces(color); // Test code. Nothing to see here.
	e.style.backgroundColor = "";
	return true;
}

// the entry is an rgb code (helper fn)
// Basically, if we don't see the text rgb then -1 is returned by the indexOf method, and
// we return false. Otherwise return true.
function is_rgb(Color_code) {
	if (Color_code.indexOf('rgb') == -1) {
		return false;
	}
	return true;
}

// valid hex color code (helper fn)
// Basically we check if it meets the bare minimum requirement of a hex_code.
// It works out to where we don't need to worry about anything else because of where
// this function is placed in the code.
function is_hex(Color_code) {
	if (Color_code.indexOf('#') == -1) {
		return false;
	}
	return true;
}
// We check if a color code is in shorthand notation
function is_shorthand(Color_code) {
	Hex = is_hex(Color_code);
	if (Hex) {
		if (Color_code.length == 4) {
			return true;
		}
	}
	return false;
}
// We convert it to a regular hex code from shorthand
function shorthand_to_regular(Color_code) {
	First_char = Color_code.charAt(1);
	Second_char = Color_code.charAt(2);
	Third_char = Color_code.charAt(3);
	Regular_hex = "#" + First_char + First_char + Second_char + Second_char + Third_char + Third_char;
	return Regular_hex;
}

// We convert our colour inputs into hex values using this function, by parsing through the string
/* We do a long drawn out game of finding the brackets, then finding the numbers based on the places
of the commas involved, and finding the last number based on the location of the bracket.
We don't have to worry about spaces in the string because of where this function is placed in our main Valid_inputs
function.
*/
function Convert_to_hex(Input_string) {
	Input_string = Str_without_spaces(Input_string);
	var First_stop = Input_string.indexOf('(');
	var Second_stop = Input_string.indexOf(',', First_stop);
	var First_num = Input_string.slice(First_stop + 1, Second_stop);
	First_stop = Second_stop;
	Second_stop = Input_string.indexOf(',', First_stop + 1);
	var Second_num = Input_string.slice(First_stop + 1, Second_stop);
	First_stop = Second_stop;
	Second_stop = Input_string.indexOf(')', First_stop);
	var Third_num = Input_string.slice(First_stop + 1, Second_stop);
	//console.log(`First_num = '${First_num}'\nSecond_num = '${Second_num}'\nThird_num = '${Third_num}'`);
	return Rgb_to_hex(Number(First_num), Number(Second_num), Number(Third_num));
}

// both inputs are colours and not equal, and are entered in a way such that they can be compared. This is a helper function for
// the overall program
function Valid_inputs(Color_1, Color_2) {
	// We use these in our error messages.
	var Original_input_1 = Color_1;
	var Original_input_2 = Color_2;
	// This is what we do to validate that both inputs are colors
	// So make sure that both colors have no spaces. This makes sure that our strings used later on don't crash our program
	// since we removed any potential problems with the string in theory.
	Color_1 = Color_1.toLowerCase();
	//console.log("Color_1 after lowercase: ", Color_1);//Test code
	Color_1 = Str_without_spaces(Color_1);
	Color_2 = Color_2.toLowerCase();
	//console.log("Color_2 after lowercase: ", Color_2);//Test code
	Color_2 = Str_without_spaces(Color_2);
	/* This line here is to extract colors from our onclick attribute. So what happened for a while was that if
	you entered invalid inputs, the background color of the body element would go to null for whatever reason, even though
	the form did not go through since this function would return false to the onsubmit attribute.I see no reason why it should have changed, and I have no idea why.
	So after testing for a while, I tried to reverse the color scheme when we hit each of our problematic cases in an attempt to avoid this odd side effect.
	However, when I reversed the color scheme once before returning false from our cases, the side effect would no longer show.
	So there should be no problems now. The line at the bottom gets the colors
	so we can use the array of colors later in the Reverse_colors cases we call after each case of invalid inputs.
	*/
	var Our_colors = Extract_colors(document.getElementById("Reverse_colors").getAttribute("onclick"),"'","'");
	// We validate that the colors are valid, and just get that out of the way here
	Color_1_good = GoodColor(Color_1);
	Color_2_good = GoodColor(Color_2);
	if (!(Color_1_good && Color_2_good)) {
		Reverse_colors(Our_colors[1],Our_colors[0]);
		if ((!(Color_1_good)) && (!(Color_2_good))) {
			Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				       document.getElementsByClassName("Inside")[0].style.backgroundColor,
					   "Color 1 and Color 2 both have invalid entries. Please try again using either valid RGB or hex codes, or using words such as \"white\"\
 or \"black\". Enter either RGB or hex codes for both, or words for both.");
		} else if (!(Color_1_good)) {
			Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				       document.getElementsByClassName("Inside")[0].style.backgroundColor,
					   "Color 1 has an invalid entry. Please try again using either valid RGB or hex codes, or using words such as \"white\"\
 or \"black\". Make sure both are either RGB or hex codes, or both are words.");
		} else {
			Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				       document.getElementsByClassName("Inside")[0].style.backgroundColor,
					   "Color 2 has an invalid entry. Please try again using either valid RGB or hex codes, or using words such as \"white\"\
 or \"black\". Make sure both are either RGB or hex codes, or both are words.");
		}
		return false;
	}
	// Before we had a glitch where users could enter hex color codes in shorthand notation and it would pass. Now that is accounted for.
	if (is_shorthand(Color_1)) {
		Color_1 = shorthand_to_regular(Color_1);
	}
	if (is_shorthand(Color_2)) {
		Color_2 = shorthand_to_regular(Color_2);
	}
	// Now we check if the colors are equal in their values
	Rgb_1 = is_rgb(Color_1);
	Hex_1 = is_hex(Color_1);
	// So Color_1 is either hex or rgb color code, same for Color_2 and Either_2 respectively
	Either_1 = Rgb_1 || Hex_1;
	Rgb_2 = is_rgb(Color_2);
	Hex_2 = is_hex(Color_2);
	Either_2 = Rgb_2 || Hex_2;
	// So if both colors are either rgb or hex color codes
	if (Either_1 && Either_2) {
		// If both colors are rgb color codeds
		if (Rgb_1 && Rgb_2) {
			if (Color_1 == Color_2) {// If they're equal then false
				//console.log("1A"); // Test code
				Reverse_colors(Our_colors[1],Our_colors[0]);
				Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				           document.getElementsByClassName("Inside")[0].style.backgroundColor,
						   "Invalid inputs. The color codes cannot represent the same color. " + Original_input_1 + " and " + Original_input_2 + " \
represent the same color.");
				return false;
			}
		} else if (Hex_1 && Hex_2) {// both are hex color codes
			if (Color_1 == Color_2) {
				//console.log("1B"); // Test code
				Reverse_colors(Our_colors[1],Our_colors[0]);
				Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				           document.getElementsByClassName("Inside")[0].style.backgroundColor,
						   "Invalid inputs. The color codes cannot represent the same color. " + Original_input_1 + " and " + Original_input_2 + " \
represent the same color.");
				return false;
			}
		} else {//So they are both hex or rgb, but we need to convert one to the other
			if (Rgb_1) {//So if the first color is an rgb code, convert it to hex and check if they're equal
				Color_1 = Convert_to_hex(Color_1);
				if (Color_1 == Color_2) {
					//console.log("1C"); // Test code
					Reverse_colors(Our_colors[1],Our_colors[0]);
					Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				               document.getElementsByClassName("Inside")[0].style.backgroundColor,
						       "Invalid inputs. The color codes cannot represent the same color. " + Original_input_1 + " and " + Original_input_2 + " \
represent the same color.");
					return false;
				}
			} else {//otherwise convert the second color to hex and compare them
				Color_2 = Convert_to_hex(Color_2);
				if (Color_1 == Color_2) {
					//console.log("1D"); // Test code
					Reverse_colors(Our_colors[1],Our_colors[0]);
					Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				               document.getElementsByClassName("Inside")[0].style.backgroundColor,
						       "Invalid inputs. The color codes cannot represent the same color. " + Original_input_1 + " and " + Original_input_2 + " \
represent the same color.");
					return false;
				}
			}
		}
	} else if (Either_1 || Either_2) {// so one of them is hex or rgb but the other is not. We only get here if both are not hex or rgb codes
		//console.log("1E"); // Test code
		Reverse_colors(Our_colors[1],Our_colors[0]);
		Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				   document.getElementsByClassName("Inside")[0].style.backgroundColor,
				   "Invalid combination of color code entries. You cannot enter hex or RGB codes for one entry and a word for the other.");
		return false;
	} else {// both are words
		if (Color_1 == Color_2) {
			//console.log("1F"); // Test code
			Reverse_colors(Our_colors[1],Our_colors[0]);
			Open_modal(document.getElementsByTagName("body")[0].style.backgroundColor,
				       document.getElementsByClassName("Inside")[0].style.backgroundColor,
				       "Both entries represent the same color. Please enter distinct color entries.");
			return false;
		}
	}
	// We make sure that our color inputs in our form fields have no spaces. Otherwise the colors don't change.
	document.getElementById("Color_1").value = Color_1;
	document.getElementById("Color_2").value = Color_2;
	return true;
}


/*
All the above functions are part of the function that will be attached to the onsubmit attribute of our form.
The way it's supposed to work is that we have a second button in the footer that opens up
a form we hid using the hidden attribute in html. This form will have 2 input fields for 2 distinct colors, which
will be used to change the color scheme of the entire page, with both a "Submit" button and a "Cancel" button in the form. On
creation of the form, the onclick attributes of the buttons in the footer will be disabled until the form is submitted or the cancel
button is clicked. When submitting, the function will first validate the input, to make sure that codes are either rgb or hex color
codes, or both colors are entered as words such as "white", "green", "black", "blue", etc., and that they are distinct and entered
correctly. Once the input is validated, the surrounding website's colors are changed, and the buttons' onclick attributes are adjusted
according to the new colors submitted in the form. The onclick attributes of the buttons in the footer will then be enabled again.
There's a "cancel" button on the form which closes the form and the current color scheme stays. There is one problem where clicking the
buttons in the header for the same page nullify the changes of the form's color scheme. I will have to fix that next.
*/

// These our functions to reverse the color scheme.
// this bold text fn gives us the bold look when we hover over the "Reverse the Color Scheme" button in the footer
// We use this as a helper function, where depending on the input the text is bold or normal. The same goes for the other
// function below.
function Bold_text(On_or_off) {
	var Bold = document.getElementById("Reverse_colors");
	if (On_or_off == "on") {
		Bold.style.fontWeight = "bold";
	} else {
		Bold.style.fontWeight = "normal";
	}
}

// Turns the other button bold in the footer
function First_button_bold_text(on_or_off) {
	var Bold = document.getElementById("Create_form");
	if (on_or_off == "on") {
		Bold.style.fontWeight = "bold";
	} else {
		Bold.style.fontWeight = "normal";
	}
}

// we change the main page - helper function
// We change the main page through the DOM.
function Change_main_page(Main_color, Second_color) {
	document.getElementsByClassName("Inside")[0].style.backgroundColor = Main_color;
	document.getElementsByClassName("Inside")[0].style.color = Second_color;
	document.getElementsByClassName("Inside")[0].style.borderColor = Second_color;
	document.getElementsByClassName("Inside")[0].style.borderStyle = "double";
	document.getElementsByClassName("Inside")[0].style.borderWidths = "10px";
	document.getElementsByClassName("Inside")[1].style.borderColor = Second_color;
	document.getElementsByClassName("Inside")[1].style.borderStyle = "double";
	document.getElementsByClassName("Inside")[1].style.borderWidths = "7px";
	document.getElementsByClassName("Inside")[1].style.backgroundColor = Main_color;
	document.getElementsByClassName("Inside")[1].style.color = Second_color;
}

// change the second page - helper fn
// Same as above, through the DOM.
function Change_second_page(Main_color, Second_color) {
	document.getElementsByClassName("Inside")[0].style.backgroundColor = Main_color; //white
	document.getElementsByClassName("Inside")[0].style.color = Second_color; //black
	document.getElementsByClassName("Inside")[0].style.borderColor = Second_color;
	document.getElementsByClassName("Inside")[0].style.borderWidths = "7px";
	document.getElementsByClassName("Inside")[0].style.borderStyle = "double";
	document.getElementsByClassName("Second")[0].style.backgroundColor = Main_color;
	document.getElementsByClassName("Second")[0].style.color = Second_color;
	document.getElementsByClassName("Second")[0].style.borderColor = Second_color;
	document.getElementsByClassName("Second")[0].style.borderWidths = "10px";
	document.getElementsByClassName("Second")[0].style.borderStyle = "double";
}

// a helper function that changes the background overall
// Basically change the overall page and background using our helper functions above.
// Depending on which page we are on, we call the appropriate functions and run the appropriate
// actions. This is found by if DOM returns null when trying to get an element with a specified class
// name or ID. It means it's not there.
function Change_background(Main_color, Second_color) {
	var Second_element = document.getElementsByClassName("Inside")[1];
	document.getElementsByTagName("Body")[0].style.backgroundColor = Second_color;
	console.log(document.getElementsByTagName("Body")[0].style.backgroundColor);
	document.getElementsByTagName("Body")[0].style.color = Main_color;
	if (document.getElementsByClassName("Highlight")[0] != null) {
			document.getElementsByClassName("Highlight")[0].style.backgroundColor = Second_color;
			document.getElementsByClassName("Highlight")[0].style.color = Main_color;
		}
	if (document.getElementsByClassName("GitHub_Sentence") != null) {
		for (let Elements of (document.getElementsByClassName("GitHub_Sentence"))) {
			Elements.style.backgroundColor = Main_color;
			Elements.style.color = Second_color;
		}
	}
	if (Second_element == null) {
		//console.log('Second_element is null');// Test code
		Change_second_page(Main_color, Second_color);
	} else {
		Change_main_page(Main_color, Second_color);
		document.getElementsByTagName("a")[3].style.backgroundColor = Main_color;
		document.getElementsByTagName("a")[3].style.color = Second_color;
	}

	document.getElementsByTagName("a")[2].style.backgroundColor = Main_color;
	document.getElementsByTagName("a")[2].style.color = Second_color;
}

// change the footer style
function Change_footer(Main_color, Second_color) {
	document.getElementById("Footer").style.backgroundColor = Main_color;
	document.getElementById("Footer").style.color = Second_color;
	document.getElementById("Footer").style.borderColor = Main_color;
}

// change the unordered list in the footer style
function Change_ul(Main_color, Second_color) {
	document.getElementsByTagName("ul")[1].style.backgroundColor = Main_color;
	document.getElementsByTagName("ul")[1].style.color = Second_color;
}

//the button is designed so that it can be reversed when the overall function is called.
function Reverse_button(Main_color, Second_color) {
	var elementB = document.getElementById("Reverse_colors");
	var elementA = document.getElementById("Create_form");
	elementB.setAttribute("onclick", "Reverse_colors('" + Second_color + "','" + Main_color + "')");
	elementB.style.backgroundColor = Main_color;
	elementB.style.color = Second_color;
	elementB.style.border = "none";
	elementA.style.backgroundColor = Main_color;
	elementA.style.border = "none";
	elementA.style.color = Second_color;
}

// change the list elements' colors in the footer
function Change_ul_li(Main_color, Second_color) {
	document.getElementsByTagName("ul")[1].style.backgroundColor = Main_color;
	document.getElementsByTagName("li")[2].style.backgroundColor = Main_color;
}

//reverse the header elements' colors
function Reverse_header(Main_color, Second_color) {
	document.getElementById("Navbar").style.backgroundColor = Main_color;
	document.getElementsByTagName("ul")[0].style.backgroundColor = Main_color;
	document.getElementsByTagName("li")[0].style.backgroundColor = Main_color;
	document.getElementsByTagName("li")[1].style.backgroundColor = Main_color;
	document.getElementsByTagName("a")[0].style.color = Second_color;
	document.getElementsByTagName("a")[1].style.color = Second_color;
}

// basically we reverse the color scheme of the whole existing page using the above helper functions.
// This is a key helper function that gets used all over the code.
function Reverse_colors(Main_color, Second_color) {
	Change_background(Main_color, Second_color);
	Change_footer(Main_color, Second_color);
	Reverse_button(Main_color, Second_color);
	Change_ul_li(Main_color, Second_color);
	Reverse_header(Main_color, Second_color);
}

// This is what we use to get the color values from the link so as to avoid usig php (I don't know php)
function Page_start() {
	let params = (new URL(document.location)).searchParams;
	let Color_1 = params.get("Color_1");
	let Color_2 = params.get("Color_2");
	//console.log("Color 1 is " + Color_1); // Test code.
	//console.log("Color 2 is "+ Color_2);
	if (!( (Color_1 == null) || (Color_2 == null) )) {
		if (!((Color_1.length == 0) || (Color_2.length == 0))) {
			// Though we did this in the function to check the inputs, we do it again for insurance.
			Color_1 = Str_without_spaces(Color_1);
			Color_2 = Str_without_spaces(Color_2);
			// For consistency, we want to avoid shorthand notation when it is a color property on our page
			if (is_shorthand(Color_1)) {
				Color_1 = shorthand_to_regular(Color_1);
			}
			if (is_shorthand(Color_2)) {
				Color_2 = shorthand_to_regular(Color_2);
			}
			Reverse_colors(Color_2,Color_1);
		}
	}
}

/* A helper function to extract colors in our Extract_colors function. We look
at the onclick attribute of the buttons in the footer, and use this function
to take out the appropriate color strings.
*/
function Substring(start_index,start_char,end_char,our_string) {
	var Start_index = our_string.indexOf(start_char,start_index);
	var End_index = our_string.indexOf(end_char, (Start_index + 1));
	var Our_substring = our_string.substring((Start_index + 1), End_index);
	//console.log(Start_index);
	console.log(Our_substring);
	return  [Our_substring, End_index + 1];
}

/* We extract the colors from the onclick attribute in the bottom buttons
using this function. */
function Extract_colors(Main_string,start_char,end_char) {
	var Color_1_posn = Substring(0,start_char,end_char,Main_string);
	var Color_1 = Color_1_posn[0];
	var Color_2_posn = Substring(Color_1_posn[1],start_char,end_char,Main_string);
	var Color_2 = Color_2_posn[0];
	return [Color_1, Color_2];
}

/* This checks if our footer collides with our div that wraps the form. To be honest, I pulled this one
off StackOverflow, so if I make it to an interview, I probably won't know what it does. All's I know is
 it works. I had to include this because there could be various browsers, and the existing code that I had
 before would glue the footer about 50 or so pixels below the bottom of the form that opens up. This is great
 if your laptop has a smaller screen to prevent overlap, but if you are on a monitor with a gigantic screen like
 the ones in my school computer lab, then the footer gets taken off the bottom, and moves partway up the page
 when it shouldn't. So this is a helper function to test whether we actually have overlap, and need to move it.
 It will be triggered depending on the size of your browser.
*/
function doElsCollide(el1, el2) {
    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    return !((el1.offsetBottom < el2.offsetTop) ||
             (el1.offsetTop > el2.offsetBottom) ||
             (el1.offsetRight < el2.offsetLeft) ||
             (el1.offsetLeft > el2.offsetRight));
}


$(document).ready(function() {
	Page_start();
	var Browser = Browser_type();
	$("#X_button").mouseover(function () {
		$("#X_button").css("font-weight", "bold");
	});
	$("#X_button").mouseout(function () {
		$("#X_button").css("font-weight", "normal");
	});
	// This removes the hidden attribute to the form and allows for us to enter new colors.
	function Change_colors() {
		var Form_background = document.getElementsByTagName("body")[0].style.backgroundColor;
		var Form_text_color = document.getElementsByClassName("Inside")[0].style.backgroundColor;
		$("#Create_form").css("font-weight", "normal");
		/*
		var Valid = null;
		var Input_1 = null;
		var Input_2 = null;
		*/ // Test code
		$("#wrapper_div").show();
		document.getElementById("Navbar").style.width = window.innerWidth;
		var Collision = doElsCollide(document.getElementById("Footer"), document.getElementById("Another_wrapper"));

		if (Collision) {
			/*
			So if the browsers collide, then we change the style of the footer to have a relative position instead.
		    We have a 0px margin bottom to get the footer to stick to the bottom.
			This is because browsers can be various sizes. People with smaller browsers had the problem with the
			footer getting in the way.
			*/
			$("Footer").css("position", "relative");
			if (Browser == "firefox") {
				// because firefox acts differently with respect to HTML and CSS, I did this to keep the ul tag inside the footer.
				$("#Footer_ul").css("position", "relative");
				$("#Push").css("height", "25px");
			}
		}

		// These are all things we do to make sure the form is colored appropriately.
		$("#Form").css({"background-color" : Form_text_color, "color" : Form_background, "border-color" : Form_background});
		$("#Cancel").css({"background-color" : Form_text_color, "color" : Form_background});
		$("#Submit").css({"background-color" : Form_text_color, "color" : Form_background});
		$("#Create_form").attr('disabled', true);
		$("#Reverse_colors").attr('disabled', true);
		$("#Cancel").mouseover(function() {
			$("#Cancel").css("font-weight", "bold");
		});
		$("#Submit").mouseover(function() {
			$("#Submit").css("font-weight", "bold");
		});
		$("#Cancel").mouseout(function() {
			$("#Cancel").css("font-weight", "normal");
		});
		$("#Submit").mouseout(function() {
			$("#Submit").css("font-weight", "normal");
		});

		$("#Cancel").click(function() {
			// If they click cancel we fill the fields with default color values for the page.
			//$("#Cancel").attr("type", "reset");
			$('#wrapper_div').hide();
			$("#Create_form").attr('disabled', false);
			$("#Reverse_colors").attr('disabled', false);
			$("Footer").css("position", "fixed");
			if ((Browser.toLowerCase()) == "firefox") {
				// Now return it back to normal, but only in Firefox where it's necessary
				$("#Footer_ul").css("position", "static");
			}
		});
	}
	// If we click the button to change the color scheme, the function shown above executes below.
	$("#Create_form").click(function() {
		Change_colors();
	});
});
