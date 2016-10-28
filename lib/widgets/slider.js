var math = require('../utils/math')
var util = require('util');
var widget = require('../core/widget');

/**
	@class slider
	Slider (vertical or horizontal)
	```html
	<canvas nx="slider"></canvas>
	```
	<canvas nx="slider" style="margin-left:25px"></canvas>
*/

var slider = module.exports = function (target) {
	console.log(1)
	this.defaultSize = { width: 35, height: 110 };
	console.log(2)
	widget.call(this, target);
	console.log(3)

  if (this.canvas.getAttribute("min")!=null) {
    this.min = parseFloat(this.canvas.getAttribute("min"));
  } else {
  	this.min = 0
  }
  if (this.canvas.getAttribute("max")!=null) {
    this.max = parseFloat(this.canvas.getAttribute("max"));
  } else {
  	this.max = 1
  }
  if (this.canvas.getAttribute("step")!=null) {
    this.step = parseFloat(this.canvas.getAttribute("step"));
  } else {
  	this.step = 0.001
  }


	console.log(2)

	/** @property {object}  val
		| &nbsp; | data
		| --- | ---
		| *value* | Slider value (float 0-1)
	*/
	this.val.value = nx.scale(0.7,0,1,this.min,this.max)


	/** @property {string}  mode   Set "absolute" or "relative" mode. In absolute mode, slider will jump to click/touch position. In relative mode, it will not.
	```js
	nx.onload = function() {
	&nbsp; // Slider will not jump to touch position.
	&nbsp; slider1.mode = "relative"
	}
	```
	*/
	this.mode = "absolute";

	/** @property {boolean}  hslider   Whether or not the slider should be horizontal. This is set to true automatically if the canvas is wider than it is tall. To override the default decision, set this property to true to create a horizontal slider, or false to create a vertical slider.

	```js
	nx.onload = function() {
	&nbsp; //forces horizontal slider
	&nbsp; slider1.hslider = true
	&nbsp; slider1.draw();
	&nbsp; //forces vertical slider
	&nbsp; slider2.hslider = false
	&nbsp; slider2.draw();
	}
	```
	*/
	this.hslider = false;
	this.handle;
	this.relhandle;
	this.cap;

	this.maxdigits = 3

	this.calculateDigits = nx.calculateDigits;

	this.init();
}
util.inherits(slider, widget);

slider.prototype.init = function() {

	console.log("init called")

	//decide if hslider or vslider
	if (this.height>=this.width) {
		this.hslider = false;
	} else {
		this.hslider = true;
	}


	this.draw();
}


slider.prototype.draw = function() {

	var normalval = this.normalize(this.val.value)

	//figure out text size
	this.digits = this.calculateDigits()

	this.erase();

	with (this.context) {
		fillStyle = this.colors.fill;
		fillRect(0,0,this.width,this.height);

		if (!this.hslider) {

			var x1 = 0;
			var y1 = this.height-normalval*this.height;
			var x2 = this.width;
			var y2 = this.height;

			fillStyle = this.colors.accent;
			fillRect(x1,y1,x2-x1,y2-y1);

			//text
			var valtextsize = (this.width / this.digits.total) * 1.2
			if (valtextsize > 6) {

				// figure out val text location
		    if (y1 < this.height - valtextsize/2-5) {
					fillStyle = this.colors.white
		    	var texty = this.height-valtextsize/2-5
		    } else {
					fillStyle = this.colors.accent
		    	var texty = y1 - valtextsize/2-5
		    }
		    var textx = this.width/2
		    var valtextAlign = "center"
		    var valtextBaseline = "middle"
			}

		} else {

			var x1 = 0;
			var y1 = 0;
			var x2 = normalval*this.width;
			var y2 = this.height;

			fillStyle = this.colors.accent
			fillRect(x1,y1,x2-x1,y2-y1)

			//text
			var valtextsize = this.height/2
			if (valtextsize > 6) {

				// figure out val text location
		    if (x2 > this.digits.total*valtextsize/2) {
					fillStyle = this.colors.white
		    	var textx = 5
		    } else {
					fillStyle = this.colors.accent
		    	var textx = x2 + 5
		    }
		    var texty = this.height/2
		    var valtextAlign = "left"
		    var valtextBaseline = "middle"
			}

		}


    var valtext = this.val.value.toFixed(this.digits.decimals)
    textBaseline = valtextBaseline
		textAlign = valtextAlign
    font = valtextsize+"px 'Open Sans'"
    fillText(valtext,textx,texty);


		if (this.label) {
			this.drawLabel()
		}
	}
}

slider.prototype.click = function() {
	this.move();
}

slider.prototype.move = function() {

	var normalval = this.normalize(this.val.value)

	if (this.hslider) {
		this.handle = this.clickPos.x;
		this.relhandle = this.deltaMove.x;
		this.cap = this.width;
	} else {
		this.handle = this.clickPos.y;
		this.relhandle = this.deltaMove.y*-1;
		this.cap = this.height
	}

	if (this.mode=="absolute") {
		if (this.clicked) {
			if (!this.hslider) {
				normalval = Math.abs((math.clip(this.clickPos.y/this.height, 0, 1) - 1));
			} else {
				normalval = math.clip(this.clickPos.x/this.width, 0, 1);
			}
			this.draw();
		}
	} else if (this.mode=="relative") {
		if (this.clicked) {
			if (!this.hslider) {
				normalval = math.clip(normalval + ((this.deltaMove.y*-1)/this.height),0,1);
			} else {
				normalval = math.clip(normalval + ((this.deltaMove.x)/this.width),0,1);
			}
			this.draw();
		}
	}

	this.val.value = math.prune(this.rangify(normalval),3)
	this.transmit(this.val);
}
