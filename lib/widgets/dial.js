var math = require('../utils/math');
var util = require('util');
var widget = require('../core/widget');

/**
	@class dial
	Circular dial
	```html
	<canvas nx="dial"></canvas>
	```
	<canvas nx="dial" style="margin-left:25px"></canvas>
*/

var dial = module.exports = function(target) {

	this.defaultSize = { width: 100, height: 100 };
	widget.call(this, target);

	//define unique attributes
	this.circleSize;
	this.handleLength;

	/** @property {object}  val
	    | &nbsp; | data
		| --- | ---
		| *value* | Current value of dial as float 0-1
	*/
	this.val = {
		value: 0
	}
	/** @property {float}  responsivity    How much the dial increments on drag. Default: 0.004<br>
	*/
	this.responsivity = 0.004;


	this.lockResize = true;

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

	this.maxdigits = 3
	this.calculateDigits = mt.calculateDigits

	this.lineWidth = 3

	this.init();

}

util.inherits(dial, widget);

dial.prototype.init = function() {

	this.circleSize = (Math.min(this.center.x, this.center.y)) - this.lineWidth;
	this.handleLength = this.circleSize;
	this.mindim = Math.min(this.width,this.height)

	if (this.mindim<101 || this.mindim<101) {
		this.accentWidth = this.lineWidth * 1;
	} else {
		this.accentWidth = this.lineWidth * 2;
	}

	this.draw();

}

dial.prototype.draw = function() {

	var normalval = this.normalize(this.val.value)

	var dial_angle = (((1.0 - this.val.value) * 2 * Math.PI) + (1.5 * Math.PI));
	var dial_position = (normalval + 0.25) * 2 * Math.PI
	var point = math.toCartesian(this.handleLength, dial_angle);

	this.erase();


	//dial_line
	//var dial_angle = (((1.0 - self.val) * 2 * Math.PI) + (1.5 * Math.PI));
	//var dial_position = (self.val + 0.25) * 2 * Math.PI
	//var point = self.toCartesian(self.dial_position_length, dial_angle);

	with (this.context) {
		strokeStyle = this.colors.border;
		fillStyle = this.colors.fill;
		lineWidth = this.lineWidth;

		//draw main circle
		beginPath();
			arc(this.center.x, this.center.y, this.circleSize, 0, Math.PI*2, true);
			fill();
			stroke();
		closePath();

		//draw color fill
		beginPath();
			lineWidth = this.accentWidth;
			arc(this.center.x, this.center.y, this.circleSize , Math.PI* 0.5, dial_position, false);
			lineTo(this.center.x,this.center.y);
			globalAlpha = 0.1;
			fillStyle = this.colors.accent;
			fill();
			globalAlpha = 1;
		closePath();


		//draw round accent
		beginPath();
			lineWidth = this.accentWidth;
			arc(this.center.x, this.center.y, this.circleSize , Math.PI* 0.5, dial_position, false);
			strokeStyle = this.colors.accent;
			stroke();
		closePath();


		//draw bar accent
		beginPath();
			lineWidth = this.accentWidth;
			strokeStyle = this.colors.accent;
			moveTo(this.center.x, this.center.y);
			lineTo(point.x + this.center.x, point.y + this.center.y);
			stroke();
		closePath();

		//draw circle in center
		beginPath();
			fillStyle = this.colors.accent;
			arc(this.center.x, this.center.y, this.circleSize/7, 0, Math.PI*2);
			fill();
		closePath();

	}






/*

	with (this.context) {

		lineCap = 'butt';
		beginPath();
			lineWidth = this.circleSize/2;
			arc(this.center.x, this.center.y, this.circleSize-lineWidth/2, Math.PI * 0, Math.PI * 2, false);
			strokeStyle = this.colors.fill;
			stroke();
		closePath();

		//draw round accent
		lineCap = 'butt';
		beginPath();
			lineWidth = this.circleSize/2;
			arc(this.center.x, this.center.y, this.circleSize-lineWidth/2, Math.PI * 0.5, dial_position, false);
			strokeStyle = this.colors.accent;
			stroke();
		closePath();

		clearRect(this.center.x-this.width/40,this.center.y,this.width/20,this.height/2)

		if (normalval > 0) {
			beginPath();
			lineWidth = 1.5;
			moveTo(this.center.x-this.width/40,this.center.y+this.circleSize/2) //this.radius-this.circleSize/4
			lineTo(this.center.x-this.width/40,this.center.y+this.circleSize) //this.radius+this.circleSize/4
			strokeStyle = this.colors.accent
			stroke();
			closePath();
		}

	}

	*/

}

dial.prototype.click = function(e) {
	var just_angle = math.toPolar(this.clickPos.x-this.center.x,this.clickPos.y-this.center.y).angle
	just_angle = ( just_angle + Math.PI*1.5) % (Math.PI*2)
	just_angle = just_angle / (Math.PI*2)
	this.val.value = just_angle
//	this.val.value = math.prune(this.val.value, 4)
	this.transmit(this.val);
	this.draw();
}

dial.prototype.move = function() {
	var just_angle = math.toPolar(this.clickPos.x-this.center.x,this.clickPos.y-this.center.y).angle
	just_angle = ( just_angle + Math.PI*1.5) % (Math.PI*2)
	just_angle = just_angle / (Math.PI*2)
	if (Math.abs(this.val.value - just_angle)<0.5) {
		this.val.value = just_angle
	} else {
		this.val.value = Math.round(this.val.value)
	}
	//var normalval = this.normalize(this.val.value)
	//normalval = math.clip((normalval - (this.deltaMove.y * this.responsivity)), 0, 1);
	//this.val.value = math.prune(this.rangify(normalval), 4)
	this.transmit(this.val);

	this.draw();
}

dial.prototype.release = function() {
}
