var drawing = require('../utils/drawing');
var util = require('util');
var widget = require('../core/widget');

/**
	@class toggle
	On/off toggle
	```html
	<canvas nx="toggle"></canvas>
	```
	<canvas nx="toggle" style="margin-left:25px"></canvas>
*/

var toggle = module.exports = function (target) {
	this.defaultSize = { width: 50, height: 50 };
	widget.call(this, target);

	/** @property {object}  val  Object containing the core interactive aspects of the widget, which are also its data output. Has the following properties:
		| &nbsp; | data
		| --- | ---
		| *value*| 1 if on, 0 if off
	*/
	this.val = {
		value: 0
	}
	this.init();
}
util.inherits(toggle, widget);

toggle.prototype.init = function() {
	this.draw();
}

toggle.prototype.draw = function() {

	this.erase()

	with (this.context) {
		if (this.val.value) {
			fillStyle = this.colors.accent;
			strokeStyle = this.colors.accenthl;
			strokeAlpha = 1
		} else {
			fillStyle = this.colors.fill;
			strokeStyle = this.colors.border;
			strokeAlpha = 1
		}
		lineWidth = Math.sqrt(this.width)/2;

		fillRect(0,0,this.width,this.height);
		globalAlpha = strokeAlpha
		strokeRect(lineWidth/2,lineWidth/2,this.width-lineWidth,this.height-lineWidth);
		globalAlpha = 1
	}

}

toggle.prototype.click = function() {
	if (!this.val.value) {
		this.val.value = 1;
	} else {
		this.val.value = 0;
	}
	this.draw();
	this.transmit(this.val);
}
