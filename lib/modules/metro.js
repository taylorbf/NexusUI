var util = require('util');
var component = require('../core/module');

var Metronome = module.exports = function(target) {

  component.call(this,target)

  this.widgets = {
    toggle: mt.createWidget("toggle",{parent: target, w: 25, h: 25}),
    button: mt.createWidget("button",{parent: target, w: 25, h: 25}),
    number: mt.createWidget("number",{parent: target, w: 50, h: 25})
  }
  this.widgets.toggle.canvas.style.float = "left"
  this.widgets.button.canvas.style.float = "left"
  this.widgets.number.canvas.style.float = "left"
  this.widgets.button.canvas.style.marginLeft = "2px"
  this.widgets.number.canvas.style.marginLeft = "2px"

}
util.inherits(Metronome,component)

Metronome.prototype.init = function() {

  this.interval = mt.interval(100, function() {
    this.emit(true)
    this.widgets.button.set({press:true})
    setTimeout(this.widgets.button.set.bind(this.widgets.button,{press:false}),20)
  }.bind(this))
  this.interval.stop()

  this.widgets.toggle.event(function(v) {
    if (v.value) {
      this.interval.start()
    } else {
      this.interval.stop()
    }
  }.bind(this))
  this.widgets.button.event(function(v) {

  }.bind(this))
  this.widgets.number.event(function(v) {
    this.interval.ms(v.value)
  }.bind(this))
}


/* API */

Metronome.prototype.ms = function(ms) {
  this.widgets.number.set({value: ms},false)
  this.interval.ms(ms)
}
