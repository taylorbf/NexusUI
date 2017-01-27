
/*  @method  clip
    @description Limits a number to within low and high values.
    @param {float} [input value]
    @param {float} [low limit]
    @param {float} [high limit]
*/
mt.clip = function(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

/*  @method prune
    @description Limits a float to within a certain number of decimal places
    @param {float} [input value]
    @param {integer} [max decimal places]
*/
mt.prune = function(data, scale) {
  if (typeof data === "number") {
    data = parseFloat(data.toFixed(scale));
  } else if (data instanceof Array) {
    for (var i=0;i<data.length;i++) {
      if (typeof data[i]=="number") {
        data[i] = parseFloat(data[i].toFixed(scale));
      }
    }
  }
  return data;
}


/** @method scale
    @description Scales an input number to a new range of numbers
    @param {float} [input value]
    @param {float} [low1]  input range (low)
    @param {float} [high1] input range (high)
    @param {float} [low2] output range (low)
    @param {float} [high2] output range (high)
    ```js
    nx.scale(5,0,10,0,100) // returns 50
    nx.scale(5,0,10,1,2) // returns 1.5
    ```
*/
mt.scale = function(inNum, inMin, inMax, outMin, outMax) {
  return (((inNum - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;
}

/** @method invert
    @description Equivalent to nx.scale(input,0,1,1,0). Inverts a normalized (0-1) number.
    @param {float} [input value]

*/
mt.invert = function (inNum) {
  return scale(inNum, 1, 0, 0, 1);
}


/** @method mtof
    @description MIDI to frequency conversion. Returns frequency in Hz.
    @param {float} [MIDI] MIDI value to convert

*/
mt.mtof = function(midi) {
  return Math.pow(2, ((midi-69)/12)) * 440;
}


/** @method interp
    @description Interpolate between two numbers, using 0-1 as input.
    @param {float} [lookup]  0-1 location between values
    @param {float} [point1]  value to interpolate from (0)
    @param {float} [point2]  value to interpolate to (1)
*/
mt.interp = function(loc,min,max) {
  return loc * (max - min) + min;
}

/* @method rcolor
  @description Get a random color value
*/
mt.rcolor = function() {
  return "rgb(" + mt.random(255) + "," + mt.random(255) + "," + mt.random(255) + ")";
}


/**
 * Returns a random entry from the arguments
 */
mt.pick = function() {

  return arguments[mt.ri(arguments.length)]

}

/**
 * A major scale in JI
 * @type {Array}
 */
mt.major = [1/1,9/8,5/4,4/3,3/2,5/3,15/8]

/**
 * returns an octave multiplier (i.e. octave(0) return 1, octave (-1) returns 0.5)
 * @param  {integer} num Octave
 */
mt.octave = function(num) {
  return Math.pow(2,num)
}



mt.getCol = function(index,limit) {
  return index%limit;
}

mt.getRow = function(index,limit) {
  return Math.floor(index/limit);
}

/*mt.pick = function(array) {
  return array[mt.random(array.length)];
} */


/** @method ri
    @description Returns a random integer between two given scale parameters. If only one argument, uses 0 as the minimum.
    @param {float} [min] Lower limit of random range.
    @param {float} [max] Upper limit of random range.
*/
mt.ri = mt.random = function(bound1,bound2) {
  if (!bound2) {
    bound2 = bound1
    bound1 = 0
  }
  var low = Math.min(bound1,bound2)
  var high = Math.max(bound1,bound2)
  return Math.floor(Math.random()*(high-low)+low)
}
/** @method rf
    @description Returns a random float between 0 and a given scale parameter. If only one argument, uses 0 as the minimum.
    @param {float} [min] Lower limit of random range.
    @param {float} [max] Upper limit of random range.
*/
mt.rf = function(bound1,bound2) {
  if (!bound2) {
    bound2 = bound1
    bound1 = 0
  }
  var low = Math.min(bound1,bound2)
  var high = Math.max(bound1,bound2)
  return Math.random()*(high-low)+low
}

/** @method cycle
    @description Count a number upwards until it reaches a maximum, then send it back to a minimum value.<br>
    I.e. cycle(x,0,5) will output 0,1,2,3,4,5,0,1,2... if called many times in succession
*/
mt.cycle = function(input,min,max) {
  input++;
  if (input >= max) {
    input = min;
  }
  return input;
}

/* Add mt.counter() returns new object... */
