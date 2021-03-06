/**
  @title NexusUI API
  @overview NexusUI is a JavaScript toolkit for easily creating musical interfaces in web browsers. Interfaces are rendered on HTML5 canvases and are ideal for web audio projects, mobile apps, or for sending OSC to external audio applications like Max.
  @author Ben Taylor, Jesse Allison, Yemin Oh, Sébastien Piquemal
  @copyright &copy; 2011-2014
  @license MIT
 */

var timingUtils = require('../utils/timing');
var drawingUtils = require('../utils/drawing');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


var manager = module.exports = function() {

/**

  @class mt
  @description Central nexusUI manager with shared utility functions for all nexusUI objects

*/

  EventEmitter.apply(this)

  /**@property {object} widgets Contains all interface widgets (e.g. mt.widgets.dial1, mt.widgets.toggle1) */
  this.widgets = new Object();
  this.ui = new Object();

  this.elemTypeArr = new Array();
  this.aniItems = new Array();
  /*  @property {boolean} showLabels Whether or not to draw an automatic text label on each interface component. */
  this.showLabels = false;
  this.starttime = new Date().getTime();

  /** @property {boolean} isTouchDevice Returns true if page is loaded on a touch device. */
  this.isTouchDevice = ('ontouchstart' in document.documentElement)? true:false;
  this.metas = document.getElementsByTagName('meta');

  this.font = "'open sans'";
  this.fontSize = 14;
  this.fontWeight = "normal";

  this.context = new(window.AudioContext || window.webkitAudioContext)()

  this.sys = navigator.userAgent.toLowerCase();
  this.isAndroid = this.sys.indexOf("android") > -1;
  this.isMobile = this.sys.indexOf("mobile") > -1;

  /* extra colors */
  this.colors.borderhl = drawingUtils.shadeBlendConvert(-0.5,this.colors.border); // colors.border + [20% Darker] => colors.darkborder
  this.colors.accenthl = drawingUtils.shadeBlendConvert(0.15,this.colors.accent);

}

util.inherits(manager, EventEmitter)


/**
  @method add
  Adds a NexusUI element to the webpage. This will create an HTML5 canvas and draw the interface on it.
  @param {string} [type] NexusUI widget type (i.e. "dial").
  @param {object} [settings] (Optional.) Extra settings for the new widget. This settings object may have any of the following properties: x (integer in px), y, w (width), h (height), name (widget's OSC name and canvas ID), parent (the ID of the element you wish to add the canvas into). If no settings are provided, the element will be at default size and appended to the body of the HTML document.
  */
manager.prototype.add = function(type, args) {
  //args may have optional properties: x, y, w, h, name, parent

  if(type) {
      var canv = document.createElement("canvas");
      canv.setAttribute('mt', type);
      if (args) {
        if (args.x || args.y) {
           canv.style.position = "absolute";
        }
        if (args.x) {
           canv.style.left = args.x + "px";
        }
        if (args.y) {
           canv.style.top = args.y + "px";
        }
        if (args.w) {
           canv.style.width = args.w;
           if (typeof args.w != "string")
             canv.width = args.w;
        }
        if (args.h) {
           canv.style.height = args.h;
           if (typeof args.h != "string")
             canv.height = args.h;
        }
        if (args.parent) {
          var parent;
          if (typeof args.parent === "string") {
            parent = document.getElementById(args.parent);
          } else if (args.parent instanceof HTMLElement){
            parent = args.parent;
          } else if (args.parent instanceof jQuery){
            parent = args.parent[0];
          }
        }
        if (args.name) {
           canv.id = args.name
        }
      }
      if (!parent) {
        var parent = document.body
      }
      parent.appendChild(canv);
      return this.transform(canv);
  }
}
/** @method transform
Transform an existing canvas into a NexusUI widget.
@param {string} [canvasID] The ID of the canvas to be transformed.
@param {string} [type] (Optional.) Specify which type of widget the canvas will become. If no type is given, the canvas must have an mt attribute with a valid widget type.
*/
manager.prototype.transform = function(div, type) {
  for (var key in mt.ui) {
    if (mt.ui[key].id == div.id) {
      return;
    }
  }
  if (type) {
    var mtType = type;
  } else {
    var mtType = div.getAttribute("mt");
  }

  if (!mtType) {
    return;
  }
  var elemCount = 0;
  var newObj;

  /* find out how many of the same elem type have come before
    i.e. mt.elemTypeArr will look like [ dial, dial, toggle, toggle ]
    allowing you to count how many dials already exist on the page
    and give your new dial the appropriate index and id: dial3 */

  for (j=0;j<this.elemTypeArr.length;j++) {
    if (this.elemTypeArr[j] === mtType) {
      elemCount++;
    }
  }

  // add your new nexus element type to the element list
  this.elemTypeArr.push(mtType);

  // check to see if it has a pre-given ID
  // and use that as its id if so
  if (!div.id) {
    var idNum = elemCount + 1;
    div.id = mtType + idNum;
  }

  if(mtType) {
    try {
      var newObj = new (require('../modules')[mtType])(div.id);
    } catch (err) {
      console.log("creation of " + mtType + " module failed");
      return;
    }
  }

  newObj.type = mtType;

  this.ui[newObj.id] = newObj;

  newObj.init();
  return newObj;
}

/**
  @method add
  Adds a NexusUI element to the webpage. This will create an HTML5 canvas and draw the interface on it.
  @param {string} [type] NexusUI widget type (i.e. "dial").
  @param {object} [settings] (Optional.) Extra settings for the new widget. This settings object may have any of the following properties: x (integer in px), y, w (width), h (height), name (widget's OSC name and canvas ID), parent (the ID of the element you wish to add the canvas into). If no settings are provided, the element will be at default size and appended to the body of the HTML document.
  */
manager.prototype.createWidget = function(type, args) {
  //args may have optional properties: x, y, w, h, name, parent

  if(type) {
      var canv = document.createElement("canvas");
      canv.setAttribute('nx', type);
      if (args) {
        if (args.x || args.y) {
           canv.style.position = "absolute";
        }
        if (args.x) {
           canv.style.left = args.x + "px";
        }
        if (args.y) {
           canv.style.top = args.y + "px";
        }
        if (args.w) {
           canv.style.width = args.w;
           if (typeof args.w != "string")
             canv.width = args.w;
        }
        if (args.h) {
           canv.style.height = args.h;
           if (typeof args.h != "string")
             canv.height = args.h;
        }
        if (args.parent) {
          var parent;
          if (typeof args.parent === "string") {
            parent = document.getElementById(args.parent);
          } else if (args.parent instanceof HTMLElement){
            parent = args.parent;
          } else if (args.parent instanceof jQuery){
            parent = args.parent[0];
          }
        }
        if (args.name) {
           canv.id = args.name
        }
      }
      if (!parent) {
        var parent = document.body
      }
      parent.appendChild(canv);
      return this.transformWidget(canv);
  }
}

/** @method transform
Transform an existing canvas into a NexusUI widget.
@param {string} [canvasID] The ID of the canvas to be transformed.
@param {string} [type] (Optional.) Specify which type of widget the canvas will become. If no type is given, the canvas must have an mt attribute with a valid widget type.
*/
manager.prototype.transformWidget = function(canvas, type) {
  for (var key in mt.widgets) {
    if (mt.widgets[key].canvasID == canvas.id) {
      return;
    }
  }
  if (type) {
    var mtType = type;
  } else {
    var mtType = canvas.getAttribute("nx");
  }

  if (!mtType) {
    return;
  }
  var elemCount = 0;
  var newObj;

  /* find out how many of the same elem type have come before
    i.e. mt.elemTypeArr will look like [ dial, dial, toggle, toggle ]
    allowing you to count how many dials already exist on the page
    and give your new dial the appropriate index and id: dial3 */

  for (j=0;j<this.elemTypeArr.length;j++) {
    if (this.elemTypeArr[j] === mtType) {
      elemCount++;
    }
  }

  console.log(1)
  // add your new nexus element type to the element list
  this.elemTypeArr.push(mtType);

  // check to see if it has a pre-given ID
  // and use that as its id if so
  if (!canvas.id) {
    var idNum = elemCount + 1;
    canvas.id = mtType + idNum;
  }

  console.log(mtType)
  console.log(canvas.id)

  if(mtType) {
    try {
      var newObj = new (require('../widgets')[mtType])(canvas.id);
    } catch (err) {
      console.log("creation of " + mtType + " failed");
      return;
    }
  }

  newObj.type = mtType;
  console.log(newObj)

  this.widgets[newObj.canvasID] = newObj;
  //if (this.globalWidgets) {
  //  window[newObj.canvasID] = this.widgets[newObj.canvasID]
  //}

  newObj.init();
  return newObj;
}


/**
  @method colorize
  @param {string} [aspect] Which part of ui to change, i.e. "accent" "fill", "border"
  @param {string} [color] Hex or rgb color code
  Change the color of all nexus objects, by aspect ([fill, accent, border, accentborder]

  ```js
  mt.colorize("#00ff00") // changes the accent color by default
  mt.colorize("border", "#000000") // changes the border color
  ```

**/
manager.prototype.colorize = function(aspect, newCol) {

  if (!newCol) {
    // just sending in a color value colorizes the accent
    newCol = aspect;
    aspect = "accent";
  }

  this.colors[aspect] = newCol;

  this.colors.borderhl = drawingUtils.shadeBlendConvert(0.1,this.colors.border,this.colors.black); // colors.border + [20% Darker] => colors.darkborder
  this.colors.accenthl = drawingUtils.shadeBlendConvert(0.3,this.colors.accent);

  for (var key in this.widgets) {
    this.widgets[key].colors[aspect] = newCol;
    this.widgets[key].colors["borderhl"] = this.colors.borderhl;
    this.widgets[key].colors["accenthl"] = this.colors.accenthl;

    this.widgets[key].draw();
  }

}


  /*
   *    GUI
   */

/**  @property {object} colors The interface's color settings. Set with mt.colorize(). */
manager.prototype.colors = {
  "accent": "#ff5500",
  "fill": "#eeeeee",
  "border": "#e3e3e3",
  "mid": "#1af",
  "black": "#000000",
  "white": "#FFFFFF"
};


manager.prototype.addStylesheet = function() {
  var htmlstr = '<style>'
    + 'select {'
    + 'width: 150px;'
    + 'padding: 5px 5px;'
    + 'font-size: 16px;'
    + 'color:#666666;'
    + 'border: solid 2px #e4e4e4;'
    + 'border-radius: 0;'
    + '-webkit-appearance: none;'
    + 'outline: none;'
    + 'background-color:#EEE;'
    + 'font-family:"open sans";'
    + '}'
    + ''
    + 'input[type=text]::-moz-selection { background: transparent; }'
    + 'input[type=text]::selection { background: transparent; }'
    + 'input[type=text]::-webkit-selection { background: transparent; }'
    + ''
    + 'canvas { '
    + 'border-radius:0px;'
    + 'moz-border-radius:0px;'
    + 'webkit-border-radius:0px;'
    + 'box-sizing:border-box;'
    + '-moz-box-sizing:border-box;'
    + '-webkit-box-sizing:border-box;'
    + '}'
    + ''
    + 'input[type=text] { '
    + 'border-radius:5px;'
    + 'moz-border-radius:5px;'
    + 'webkit-border-radius:5px;'
    + 'box-sizing:border-box;'
    + '-moz-box-sizing:border-box;'
    + '-webkit-box-sizing:border-box;'
    + '}'
    + '</style>';

  document.head.innerHTML = document.head.innerHTML + htmlstr
}

/**  @method setViewport
    Set mobile viewport scale (similar to a zoom)
    @param {integer} [scale] Zoom ratio (i.e. 0.5, 1, 2) */
manager.prototype.setViewport = function(scale) {
  for (i=0; i<this.metas.length; i++) {
    if (this.metas[i].name == "viewport") {
      this.metas[i].content = "minimum-scale="+scale+", maximum-scale="+scale;
    }
  }
}

manager.prototype.setProp = function(prop,val) {
  if (prop && val) {
    mt[prop] = val;
    for (var key in this.widgets) {
      this.widgets[key][prop] = val;
      this.widgets[key].draw()
    }
  }
}

manager.prototype.blockMove = function(e) {
  if (e.target.attributes["mt"]) {
     e.preventDefault();
     if (this.isAndroid) {
       e.stopPropagation ? e.stopPropagation() : false;
     }
  }
}

manager.prototype.calculateDigits = function(value) {
  var nondecimals = this.max ? Math.floor(this.max).toString().length : 1
  if (nondecimals < this.maxdigits) {
    var decimals = 3-nondecimals
  } else {
    var decimals = 0
  }
  var valdigits = nondecimals + decimals
  return {
    wholes: nondecimals,
    decimals: decimals,
    total: nondecimals + decimals,
  }
}

manager.prototype.themes = {
  "light": {
    "fill": "#DDDDDD",
    "border": "#DADADA",
    "black": "#000000",
    "white": "#FFFFFF",
    "body": "#F3F3F3"
  },
  "dark": {
    "fill": "#222",
    "border": "#292929",
    "black": "#FFFFFF",
    "white": "#000000",
    "body": "#111"
  },
  "red": "#f24",
  "orange": "#f50",
  "yellow": "#ec1",
  "green": "#1c9",
  "blue": "#09d",
  "purple": "#40a",
}

manager.prototype.skin = function(name) {

  var names = name.split("-")

  mt.colorize("fill", mt.themes[names[0]].fill)
  mt.colorize("border", mt.themes[names[0]].border)
  mt.colorize("black", mt.themes[names[0]].black)
  mt.colorize("white", mt.themes[names[0]].white)

  mt.colorize("accent", mt.themes[names[1]])

  document.body.style.backgroundColor = mt.themes[names[0]].body
}


manager.prototype.labelSize = function(size) {
  for (var key in this.widgets) {
    var widget = this.widgets[key]

    if (widget.label) {
      var newheight = widget.GUI.h + size
      widget.labelSize = size
      if (["select","number","text"].indexOf(widget.type)<0) {
        widget.resize(false,newheight)
      }
    }
  }
  var textLabels = document.querySelectorAll(".mtlabel")

  for (var i = 0; i < textLabels.length; i++) {
      textLabels[i].style.fontSize = size/2.8+"px"
  }
}

manager.prototype.module = function(params) {
  /*{
      parent: "synth1volume",
      type: "slider",
      number: "right",
      label: "Volume",
      labelOrientation: "bottom",
      labelAlign: "left",
      response: function(v) {
        console.log(v)
      }
    } */


}
