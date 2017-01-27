var util = require('util');
var component = require('../core/module');

var Slider = module.exports = function(target) {

  component.call(this,target)

  //this.id = target

  this.widgets = {
    slider: mt.createWidget("slider",{parent: target}),
    number: mt.createWidget("number",{parent: target, w: 35, h: 20})
  }
  this.widgets.number.canvas.style.marginTop = "3px"

//  this.events = []


}
util.inherits(Slider,component)

Slider.prototype.init = function() {
  this.widgets.slider.event(function(v) {
  this.emit(v.value)
    this.widgets.number.set({value: v.value})
  }.bind(this))
  this.widgets.number.event(function(v) {
    this.emit(v.value)
    this.widgets.slider.set({value: v.value})
  }.bind(this))
}
/*
Slider.prototype.event = function(cb) {
  this.events.push(cb)
}
Slider.prototype.emit = function(val) {
  for (var i=0;i<this.events.length;i++) {
    this.events[i](val)
  }
}

Slider.prototype.map = function(vin,vout,scale) {

}
*/
