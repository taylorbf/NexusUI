var WAAClock = require('waaclock');

var Time = module.exports = function() {

    this.clock = new WAAClock(mt.context)
    this.clock.start()

    this.pulse = function(rate,func,on) {
        return new VariableSpeedInterval(rate,func,on)
    }

}

var VariableSpeedInterval = function(rate,func,on) {

  this.rate = rate
  this.on = on;

  this.pattern = [1]
  this.index = 0

  this.event = func ? func : function() { };
  this._event = function() {
    if (this.pattern[this.index%this.pattern.length]) {
      this.event()
    }
    this.index++
  }
  this.stop = function() {
    this.on = false;
    this.interval.clear()
  }
  this.start = function() {
    this.on = true;
    this.interval = mt.time.clock.callbackAtTime(this._event.bind(this), mt.context.currentTime).repeat(this.rate/1000)
  }
  this.ms = function(newrate) {
    if (this.on) {
      var ratio = newrate/this.rate
      this.rate = newrate
      mt.time.clock.timeStretch(mt.context.currentTime, [this.interval], ratio)
    } else {
      this.rate = newrate
    }
  }

  if (this.on) {
    this.start()
  }
}

Time.prototype.interval = function() {
  var _int = new VariableSpeedInterval(rate,func)
	return _int;
}
