var util = require('util');
var component = require('../core/module');

var Dial = module.exports = function(target) {

  component.call(this,target)

  //this.id = target

  //this.width = ....

  this.widgets = {
    dial: mt.createWidget("dial",{parent: target}),
    number: mt.createWidget("number",{parent: target, w: 35, h: 20})
  }
  this.widgets.number.canvas.style.margin = "5px auto 0px"

  //  this.events = []

}
util.inherits(Dial,component)

Dial.prototype.init = function() {
  this.widgets.dial.event(function(v) {
    this.emit(v.value)
    this.widgets.number.set({value: v.value})
  }.bind(this))
  this.widgets.number.event(function(v) {
    this.emit(v.value)
    this.widgets.dial.set({value: v.value})
  }.bind(this))
}
