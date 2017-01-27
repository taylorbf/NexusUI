
var Module = module.exports = function(target) {

  this.id = target
  this.parent = document.getElementById(target)
  this.parent.style.overflow = "auto"
  this.events = []

}
Module.prototype.event = function(cb) {
  this.events.push(cb)
}
Module.prototype.emit = function(val) {
  for (var i=0;i<this.events.length;i++) {
    this.events[i](val)
  }
}
Module.prototype.map = function(vin,vout,scale) {
  this.event(function(v) {
    vout = vin
  })
}
