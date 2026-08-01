(function (thisObj) {// ----- EXTENDSCRIPT INCLUDES ------ //"object"!=typeof JSON&&(JSON={}),function(){"use strict";var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,u,f,a=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,f=[],"[object Array]"===Object.prototype.toString.apply(i)){for(u=i.length,r=0;r<u;r+=1)f[r]=str(r,i)||"null";return o=0===f.length?"[]":gap?"[\n"+gap+f.join(",\n"+gap)+"\n"+a+"]":"["+f.join(",")+"]",gap=a,o}if(rep&&"object"==typeof rep)for(u=rep.length,r=0;r<u;r+=1)"string"==typeof rep[r]&&(o=str(n=rep[r],i))&&f.push(quote(n)+(gap?": ":":")+o);else for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(o=str(n,i))&&f.push(quote(n)+(gap?": ":":")+o);return o=0===f.length?"{}":gap?"{\n"+gap+f.join(",\n"+gap)+"\n"+a+"}":"{"+f.join(",")+"}",gap=a,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;n<r;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(void 0!==(n=walk(o,r))?o[r]=n:delete o[r]);return reviver.call(t,e,o)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();// ---------------------------------- //// ----- EXTENDSCRIPT PONYFILLS -----function __objectFreeze(obj) { return obj; }function __isArray(arr) { try { return arr instanceof Array; } catch (e) { return false; } };// ---------------------------------- //var version = "0.5.0";

var config = {
  version: version,
  id: "com.aa-power.stock.cep",
  displayName: "aapower-stock",
  symlink: "local",
  port: 3003,
  servePort: 5003,
  startingDebugPort: 8863,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [{
    name: "AEFT",
    version: "[22.0,99.9]"
  },
  // Minimum: After Effects 2022 (22.0)
  {
    name: "PPRO",
    version: "[0.0,99.9]"
  }],
  type: "Panel",
  iconDarkNormal: "./src/assets/logo.png",
  iconNormal: "./src/assets/logo.png",
  iconDarkNormalRollOver: "./src/assets/logo.png",
  iconNormalRollOver: "./src/assets/logo.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context", "--allow-file-access"],
  width: 500,
  height: 550,
  panels: [{
    mainPath: "./main/index.html",
    name: "main",
    panelDisplayName: "aapower-stock",
    autoVisible: true,
    width: 600,
    height: 650
  }],
  build: {
    jsxBin: "off",
    sourceMap: false
  },
  zxp: {
    country: "IL",
    province: "JLM",
    org: "michaellevin",
    password: "6DoH21",
    tsa: "http://timestamp.digicert.com/",
    allowSkipTSA: true,
    sourceMap: false,
    jsxBin: "off"
  },
  installModules: [],
  copyAssets: ["assets"],
  copyZipAssets: []
};

var ns = config.id;

var getActiveComp = function getActiveComp() {
  if (app.project.activeItem instanceof CompItem === false) {
    var _app$activeViewer;
    (_app$activeViewer = app.activeViewer) === null || _app$activeViewer === void 0 || _app$activeViewer.setActive();
  }
  return app.project.activeItem;
};

/**
 * Ensures that the AA_POWER folder exists in the project and returns its item ID
 * @returns {number} The item ID of the AA_POWER folder
 */
function ensureAAPowerFolder() {
  // Check if AA_POWER folder already exists
  var project = app.project;
  var folderItem = null;
  $.writeln(project);
  // Search for existing AA_POWER folder
  for (var i = 1; i <= project.numItems; i++) {
    var item = project.item(i);
    if (item instanceof FolderItem && item.name === "AA_POWER") {
      folderItem = item;
      break;
    }
  }

  // Create the folder if it doesn't exist
  if (!folderItem) {
    folderItem = project.items.addFolder("AA_POWER");
  }
  $.writeln(folderItem);
  return folderItem.id;
}

/**
 * Imports a file and places it in the AA_POWER folder
 * @param {string} filePath - Path to the file to import
 * @returns {Item} The imported item
 */
function importToAAPowerFolder(filePath) {
  // First ensure the AA_POWER folder exists
  var folderId = ensureAAPowerFolder();
  var folderItem = app.project.itemByID(folderId);

  // Import the file
  var importOptions = new ImportOptions(File(filePath));
  var importedItem = app.project.importFile(importOptions);

  // Move the imported item to the AA_POWER folder
  if (importedItem) {
    importedItem.parentFolder = folderItem;
  }
  return importedItem;
}
function importTemplate(templatePath) {
  try {
    // Use the new function to import and place in AA_POWER folder
    var importedItem = importToAAPowerFolder(templatePath);
    return importedItem;
  } catch (error) {
    alert("Error importing template: " + error.toString());
    return null;
  }
}

var AE_LAYER_NAMES = {
  CONTROLLER: "Controller"
};
var AE_MARKER_TYPES = {
  CUT: "CUT"
};

// Effect property paths
var AE_PROPERTY_PATHS = {
  MARKER: "ADBE Marker",
  EFFECTS: "ADBE Effect Parade"
};

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (__isArray(r) || (t = _unsupportedIterableToArray$1(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray$1(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$1(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$1(r, a) : void 0; } }
function _arrayLikeToArray$1(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var selectDir$1 = function selectDir() {
  var folder = Folder(app.activeDocument.path).selectDlg("Package folder:");
  return JSON.stringify({
    folder: folder
  });
};

/**
 * Gets the After Effects version number
 * @returns JSON string with version info: { version: number, versionString: string, supported: boolean }
 */
var getAEVersion = function getAEVersion() {
  try {
    if (!app) {
      return JSON.stringify({
        error: "After Effects not available"
      });
    }

    // Get version from app.version (e.g., "25.0.0" or "24.2.1")
    var versionString = String(app.version);
    var versionNumber = parseFloat(versionString);

    // Minimum supported version: AE 2022 (22.0)
    // This ensures compatibility with modern features used in the plugin
    var MIN_VERSION = 22.0;
    var isSupported = versionNumber >= MIN_VERSION;
    return JSON.stringify({
      version: versionNumber,
      versionString: versionString,
      supported: isSupported,
      minVersion: MIN_VERSION,
      minVersionString: "22.0 (After Effects 2022)"
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString(),
      supported: false
    });
  }
};
var getControllerLayerInfo$1 = function getControllerLayerInfo(controllerLayer) {
  var layerName = "";
  var effects = {};
  var error_message = "";
  var id = "";
  var comment = "";
  if (controllerLayer.name !== AE_LAYER_NAMES.CONTROLLER) {
    error_message = "Not a controller layer";
  } else {
    layerName = controllerLayer.containingComp.name;
    var commentText = controllerLayer.comment;
    if (commentText && typeof commentText === "string") {
      var commentParts = commentText.split(";");
      if (commentParts.length > 0) {
        comment = commentParts[0];
        id = commentParts[1] || "";
      }
    }
    var effectsProperty = controllerLayer.property(AE_PROPERTY_PATHS.EFFECTS);
    if (effectsProperty && effectsProperty.numProperties > 0) {
      for (var i = 1; i <= effectsProperty.numProperties; i++) {
        var effect = effectsProperty.property(i);
        var effectData = {
          name: effect.name,
          matchName: effect.matchName,
          properties: {}
        };

        // Collect all properties of the effect
        for (var j = 1; j <= effect.numProperties; j++) {
          var prop = effect.property(j);
          if (prop.propertyType === PropertyType.PROPERTY) {
            var propData = {
              matchName: prop.matchName,
              value: prop.value,
              type: prop.propertyValueType
            };

            // Add min/max for numerical values
            if (prop.hasMin == true && prop.hasMax == true) {
              propData.min = prop.minValue;
              propData.max = prop.maxValue;
            }
            effectData.properties[prop.name] = propData;
          }
        }
        effects[effect.name] = effectData;
      }
    } else {
      error_message = "No effects found";
    }
  }
  return {
    name: layerName,
    comment: comment,
    id: id,
    effects: effects,
    error: error_message
  };
};
var getLayerInfo$1 = function getLayerInfo(layer) {
  var _controllerLayer;
  var controllerLayer = null;
  var error_message = "";
  var effects = {};
  if (layer.source && layer.source instanceof CompItem) {
    var comp = layer.source;
    if (comp.numLayers > 0) {
      var firstLayer = comp.layer(1);
      if (firstLayer.name === AE_LAYER_NAMES.CONTROLLER) {
        controllerLayer = firstLayer;
      } else {
        // Don't show error for bounce presets or text layers - they don't have Controller layer
        // Only show error if we're actually looking for a template with Controller layer
        error_message = "";
      }
    } else {
      error_message = "No layers in the comp";
    }
  }

  // If no Controller layer found, return basic info with empty controller
  if (controllerLayer) {
    var controllerLayerInfo = getControllerLayerInfo$1(controllerLayer);
    effects = controllerLayerInfo.effects;
    error_message = controllerLayerInfo.error;
  }
  var safeComment = (_controllerLayer = controllerLayer) !== null && _controllerLayer !== void 0 && _controllerLayer.comment && typeof controllerLayer.comment === "string" ? controllerLayer.comment : "";
  return JSON.stringify({
    name: layer.name,
    comment: safeComment,
    id: layer.id,
    effects: effects,
    error: error_message
  });
};

/**
 * Gets text animator properties from a text layer
 */
function getTextAnimatorLayerInfo(textLayer) {
  var layerName = textLayer.name;
  var error_message = "";
  var id = String(textLayer.id);
  var comment = "";
  var animators = {};
  var bounceEffects = {};
  var isBounce = false;

  // Get comment
  var commentText = textLayer.comment;
  if (commentText && typeof commentText === "string") {
    var commentParts = commentText.split(";");
    if (commentParts.length > 0) {
      comment = commentParts[0];
      id = commentParts[1] || String(textLayer.id);
    }
    // Check if comment contains "(B)" - bounce preset indicator
    if (commentText.toUpperCase().indexOf("(B)") !== -1) {
      isBounce = true;
    }
  }

  // Check if it's a text layer
  var textProps = textLayer.property("ADBE Text Properties");
  if (!textProps) {
    error_message = "Not a text layer";
    return {
      name: layerName,
      comment: comment,
      id: id,
      animators: animators,
      bounceEffects: {},
      isBounce: false,
      error: error_message
    };
  }

  // Get animators
  var animGroup = textProps.property("ADBE Text Animators");
  if (!animGroup || animGroup.numProperties === 0) {
    error_message = "No animators found";
    return {
      name: layerName,
      comment: comment,
      id: id,
      animators: animators,
      bounceEffects: {},
      isBounce: false,
      error: error_message
    };
  }

  // Read all animators
  for (var a = 1; a <= animGroup.numProperties; a++) {
    var animator = animGroup.property(a);
    if (!animator) continue;
    var animatorName = animator.name || "Animator " + a;
    var animatorData = {
      name: animatorName,
      index: a,
      properties: {}
    };

    // Get properties from ADBE Text Animator Properties group
    var animPropsGroup = animator.property("ADBE Text Animator Properties");
    if (animPropsGroup) {
      for (var p = 1; p <= animPropsGroup.numProperties; p++) {
        var prop = animPropsGroup.property(p);
        if (!prop) continue;
        try {
          var propName = prop.name;
          var propMatchName = prop.matchName;
          var propValue = prop.value;
          var propType = prop.propertyValueType;
          var propData = {
            name: propName,
            matchName: propMatchName,
            value: propValue,
            type: propType,
            animatorIndex: a
          };

          // Add min/max for numerical values
          if (prop.hasMin && prop.hasMax) {
            propData.min = prop.minValue;
            propData.max = prop.maxValue;
          }
          animatorData.properties[propName] = propData;
        } catch (e) {
          // Skip properties that can't be read
        }
      }
    }

    // Get Ease High/Low from Range Selector -> Advanced
    var selectors = animator.property("ADBE Text Selectors");
    if (selectors && selectors.numProperties > 0) {
      for (var s = 1; s <= selectors.numProperties; s++) {
        var selector = selectors.property(s);
        if (!selector) continue;

        // Check if it's a Range Selector
        if (selector.matchName === "ADBE Text Selector") {
          // Get Tracking Amount (Amount property in Range Selector)
          var amount = selector.property("ADBE Text Percent Amount");
          if (amount) {
            animatorData.properties["Tracking Amount"] = {
              name: "Tracking Amount",
              matchName: "ADBE Text Percent Amount",
              value: amount.value,
              type: amount.propertyValueType,
              animatorIndex: a,
              selectorIndex: s,
              min: -100,
              max: 100
            };
          }
          var advanced = selector.property("ADBE Text Range Advanced");
          if (advanced) {
            var maxAmount = advanced.property("ADBE Text Max Amount");
            var minAmount = advanced.property("ADBE Text Min Amount");
            var randomizeOrder = selector.property("ADBE Text Selector Randomize Order");
            if (maxAmount) {
              animatorData.properties["Ease High"] = {
                name: "Ease High",
                matchName: "ADBE Text Max Amount",
                value: maxAmount.value,
                type: maxAmount.propertyValueType,
                animatorIndex: a,
                selectorIndex: s,
                min: 0,
                max: 100
              };
            }
            if (minAmount) {
              animatorData.properties["Ease Low"] = {
                name: "Ease Low",
                matchName: "ADBE Text Min Amount",
                value: minAmount.value,
                type: minAmount.propertyValueType,
                animatorIndex: a,
                selectorIndex: s,
                min: 0,
                max: 100
              };
            }
            if (randomizeOrder) {
              animatorData.properties["Randomize Order"] = {
                name: "Randomize Order",
                matchName: "ADBE Text Selector Randomize Order",
                value: randomizeOrder.value > 0 ? true : false,
                type: "checkbox",
                animatorIndex: a,
                selectorIndex: s
              };
            }
          }
        }
      }
    }
    animators[animatorName] = animatorData;
  }

  // Detect bounce preset by checking for Slider Control effects with specific names
  // This is the most reliable way - if these effects exist, it's a bounce preset
  var effectsGroup = textLayer.property("ADBE Effect Parade");
  if (!effectsGroup) {
    effectsGroup = textLayer.property("Effects");
  }
  var hasBounceFreq = false;
  var hasBounceAmplitude = false;
  var hasBounceDecay = false;
  if (effectsGroup) {
    for (var e = 1; e <= effectsGroup.numProperties; e++) {
      var effect = effectsGroup.property(e);
      if (!effect) continue;
      var effectName = effect.name;
      if (effectName === "Bounce Freq") {
        hasBounceFreq = true;
        var sliderProp = effect.property("ADBE Slider Control-0001");
        if (sliderProp) {
          bounceEffects["Bounce Freq"] = {
            name: "Bounce Freq",
            matchName: effect.matchName,
            value: sliderProp.value,
            defaultValue: sliderProp.value,
            min: sliderProp.hasMin ? sliderProp.minValue : 0.1,
            max: sliderProp.hasMax ? sliderProp.maxValue : 10
          };
        }
      } else if (effectName === "Bounce Amplitude") {
        hasBounceAmplitude = true;
        var sliderProp = effect.property("ADBE Slider Control-0001");
        if (sliderProp) {
          bounceEffects["Bounce Amplitude"] = {
            name: "Bounce Amplitude",
            matchName: effect.matchName,
            value: sliderProp.value,
            defaultValue: sliderProp.value,
            min: sliderProp.hasMin ? sliderProp.minValue : 0,
            max: sliderProp.hasMax ? sliderProp.maxValue : 1000
          };
        }
      } else if (effectName === "Bounce Decay") {
        hasBounceDecay = true;
        var sliderProp = effect.property("ADBE Slider Control-0001");
        if (sliderProp) {
          bounceEffects["Bounce Decay"] = {
            name: "Bounce Decay",
            matchName: effect.matchName,
            value: sliderProp.value,
            defaultValue: sliderProp.value,
            min: sliderProp.hasMin ? sliderProp.minValue : 0.1,
            max: sliderProp.hasMax ? sliderProp.maxValue : 20
          };
        }
      }
    }
  }

  // If all three bounce effects exist, it's definitely a bounce preset
  if (hasBounceFreq && hasBounceAmplitude && hasBounceDecay) {
    isBounce = true;
  }
  return {
    name: layerName,
    comment: comment,
    id: id,
    animators: animators,
    bounceEffects: bounceEffects,
    isBounce: isBounce,
    error: error_message
  };
}
var getActiveLayerInfo = function getActiveLayerInfo() {
  var activeComp = getActiveComp();
  if (!activeComp) {
    return JSON.stringify({
      error: "No active composition"
    });
  }
  if (activeComp.layers.length === 0) {
    return JSON.stringify({
      error: "No layers in the composition"
    });
  }
  try {
    // Check if we are INSIDE a template
    var firstLayer = activeComp.layer(1);
    if (firstLayer.name === AE_LAYER_NAMES.CONTROLLER) {
      var controllerLayerInfo = getControllerLayerInfo$1(firstLayer);
      var layerInfo = JSON.stringify(controllerLayerInfo);
      // $.writeln(layerInfo);
      return layerInfo;
    }

    // If not..
    var layers = activeComp.selectedLayers;
    if (layers.length > 0) {
      var layer = layers[0];

      // NEW: Check if it's a text layer with animators
      var textProps = layer.property("ADBE Text Properties");
      if (textProps) {
        var textAnimatorInfo = getTextAnimatorLayerInfo(layer);
        return JSON.stringify(textAnimatorInfo);
      }
      if (layer.source && layer.source instanceof CompItem) {
        var _layerInfo = getLayerInfo$1(layer);
        // $.writeln(layerInfo);
        return _layerInfo;
      } else {
        return JSON.stringify({
          error: "Select AA template layer or text layer"
        });
      }
    } else {
      return JSON.stringify({
        error: "No layers selected"
      });
    }
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};
var setLayerEffectPropValue = function setLayerEffectPropValue(layerId, effectMatchName, propMatchName, value) {
  var useUndoGroup = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var undoGroupName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "Change Property";
  var controllerLayer = null;
  var layer = getLayerById(layerId);
  if (layer) {
    if (layer.source && layer.source instanceof CompItem) {
      var comp = layer.source;
      if (comp.numLayers > 0) {
        var firstLayer = comp.layer(1);
        if (firstLayer.name === AE_LAYER_NAMES.CONTROLLER) {
          controllerLayer = firstLayer;
        }
      }
    } else {
      return JSON.stringify({
        error: "No controller layer found"
      });
    }
    if (controllerLayer) {
      var effect = controllerLayer.effect(effectMatchName);
      if (effect) {
        var prop = effect(propMatchName);
        if (prop) {
          if (useUndoGroup) {
            app.beginUndoGroup(undoGroupName);
          }
          $.writeln("Setting property ".concat(propMatchName, " to ").concat(value));
          prop.setValue(value);
          if (useUndoGroup) {
            app.endUndoGroup();
          }
        } else {
          $.writeln("Property ".concat(propMatchName, " not found"));
        }
      } else {
        return JSON.stringify({
          error: "Effect not found"
        });
      }
    } else {
      return JSON.stringify({
        error: "No controller layer found"
      });
    }
  } else {
    return JSON.stringify({
      error: "No layer found"
    });
  }
};
var undoLastAction = function undoLastAction() {
  try {
    app.undo();
    return JSON.stringify({
      success: true
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};
var beginUndoGroup = function beginUndoGroup(undoGroupName) {
  try {
    app.beginUndoGroup(undoGroupName);
    return JSON.stringify({
      success: true
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};
var endUndoGroup = function endUndoGroup() {
  try {
    app.endUndoGroup();
    return JSON.stringify({
      success: true
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};
var setLayerEffectProperties = function setLayerEffectProperties(layerId, effects) {
  var controllerLayer = null;
  var layer = getLayerById(layerId);
  if (layer) {
    if (layer.source && layer.source instanceof CompItem) {
      var comp = layer.source;
      if (comp.numLayers > 0) {
        var firstLayer = comp.layer(1);
        if (firstLayer.name === AE_LAYER_NAMES.CONTROLLER) {
          controllerLayer = firstLayer;
        }
      }
    }
    if (controllerLayer) {
      var _iterator = _createForOfIteratorHelper(effects),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var eff = _step.value;
          var effect = controllerLayer.effect(eff.name);
          if (effect) {
            var prop = effect(eff.propMatchName);
            if (prop) {
              prop.setValue(eff.value);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      return JSON.stringify({
        error: "No controller layer found"
      });
    }
  } else {
    return JSON.stringify({
      error: "No layer found"
    });
  }
};
function getLayerById(layerId) {
  var layer = app.project.layerByID(Number(layerId));
  return layer;
}
function findFirstCompItem(folderItem) {
  for (var j = 1; j <= folderItem.numItems; j++) {
    var innerItem = folderItem.item(j);
    if (innerItem instanceof CompItem) {
      return innerItem; // Return the first CompItem found
    } else if (innerItem instanceof FolderItem) {
      var foundComp = findFirstCompItem(innerItem); // Recursively search in subfolders
      if (foundComp) return foundComp;
    }
  }
  return null; // Return null if no CompItem is found
}
function getHighestIndex(comp) {
  var selectedLayers = comp.selectedLayers;
  if (selectedLayers.length == 0) {
    return -1;
  }
  // Find the highest index among selected layers
  var highestIndex = Infinity;
  for (var i = 0; i < selectedLayers.length; i++) {
    $.writeln("Selected layer: " + selectedLayers[i].name + " " + selectedLayers[i].index);
    if (selectedLayers[i].index < highestIndex) {
      highestIndex = selectedLayers[i].index;
    }
  }
  return highestIndex;
}

/**
 * Applies an After Effects template file (.aet) to the active composition at current time
 * @param aetPath - Full path to the .aet file
 * @returns Layer
 */
var applyTemplateByPath$1 = function applyTemplateByPath(aeTemplatePath, templateId) {
  try {
    if (!app.project) return JSON.stringify({
      error: "No active project"
    });
    if (!app.project.activeItem) return JSON.stringify({
      error: "No active composition"
    });
    var activeComp = getActiveComp();
    var currentTime = activeComp.time;
    var importOptions = new ImportOptions();
    importOptions.file = new File(aeTemplatePath);
    // Check if the template file exists
    if (!importOptions.file.exists) return JSON.stringify({
      error: "Template file not found at the specified path"
    });
    var templateFileName = importOptions.file.name;
    // Check if the template is already in the project
    var templateItem = null;
    for (var i = 1; i <= app.project.numItems; i++) {
      var item = app.project.item(i);
      if (item instanceof FolderItem && item.name === templateFileName) {
        //$.writeln(item.name);
        templateItem = item;
        break;
      }
    }
    // Import the template if not already imported
    if (!templateItem) {
      app.beginSuppressDialogs(); // suppress dialogs
      // templateItem = app.project.importFile(importOptions);
      templateItem = importTemplate(aeTemplatePath);
      app.endSuppressDialogs(false);
    }
    var importedComp = null;
    if (templateItem instanceof FolderItem) {
      importedComp = findFirstCompItem(templateItem);
    } else if (templateItem instanceof CompItem) {
      importedComp = templateItem;
    }
    if (!importedComp) return JSON.stringify({
      error: "No compositions found in the imported template"
    });

    // Get start time from marker
    var startTime = 0; // Default start time is the beginning of the imported composition
    var markerComment = "";
    if (importedComp.markerProperty) {
      var marker = importedComp.markerProperty.value;
      markerComment = marker.comment;
      if (markerComment === AE_MARKER_TYPES.CUT) {
        startTime = importedComp.markerProperty.keyTime(markerComment);
      }
    }

    // Add the imported composition to the active composition
    var presetName = templateFileName.replace(".aep", "").replace(/%20/g, " ");
    app.beginUndoGroup("Apply Template: " + presetName);
    var highestIndex = getHighestIndex(activeComp);
    var layer = activeComp.layers.add(importedComp);
    if (highestIndex != -1) {
      layer.moveBefore(activeComp.layer(highestIndex + 1));
    }
    layer.startTime = currentTime - startTime;
    layer.comment = templateId + ";" + layer.id;

    // Match composition size
    importedComp.width = activeComp.width;
    importedComp.height = activeComp.height;

    // Add marker to the applied layer
    if (markerComment) {
      if (!layer.property("Marker")) {
        layer.property(AE_PROPERTY_PATHS.MARKER).addProperty(AE_PROPERTY_PATHS.MARKER);
      }
      var newMarker = new MarkerValue(markerComment);
      layer.property("Marker").setValueAtTime(currentTime, newMarker);
    }

    // Collapse Transformations
    layer.collapseTransformation = true;

    // Add comment to Controller layer
    var controllerLayer = importedComp.layer(1);
    if (controllerLayer.name === AE_LAYER_NAMES.CONTROLLER) {
      controllerLayer.comment = templateId + ";" + layer.id;
    }
    app.endUndoGroup();
    var layer_info = getLayerInfo$1(layer);
    return layer_info;
  } catch (error) {
    var errorText;
    switch (error === null || error === void 0 ? void 0 : error.number) {
      case 21:
        errorText = "No active composition";
      default:
        errorText = "Unknown error: " + error.toString();
    }
    return JSON.stringify({
      error: errorText
    });
  }
};
var applyFXTemplateByPath = function applyFXTemplateByPath(aeTemplatePath, templateId) {
  try {
    if (!app.project) return JSON.stringify({
      error: "No active project"
    });
    if (!app.project.activeItem) return JSON.stringify({
      error: "No active composition"
    });
    var activeComp = getActiveComp();
    var selectedLayers = activeComp.selectedLayers;
    var earliestStart = null;
    var longestDuration = 0;
    var topmostLayer = null;
    var hasSelectedLayers = selectedLayers && selectedLayers.length > 0;
    if (hasSelectedLayers) {
      // Process selected layers
      for (var i = 0; i < selectedLayers.length; i++) {
        var selectedLayer = selectedLayers[i];

        // Allow all layer types except null layers and adjustment layers
        
        if (selectedLayer.nullLayer || selectedLayer.adjustmentLayer) {
          return JSON.stringify({
            error: "FX cannot be applied to null layers or adjustment layers"
          });
        }

        // Get layer duration - use visible duration in composition (outPoint - inPoint)
        // This works correctly even for time-remapped layers
        var duration = selectedLayer.outPoint - selectedLayer.inPoint;
        if (duration <= 0) {
          return JSON.stringify({
            error: "Selected layers must have positive duration"
          });
        }
        if (duration > 60) {
          return JSON.stringify({
            error: "Max target layer duration for FX is 60 seconds"
          });
        }
        if (earliestStart === null || selectedLayer.inPoint < earliestStart) {
          earliestStart = selectedLayer.inPoint;
        }
        if (duration > longestDuration) {
          longestDuration = duration;
        }

        // Find the topmost (lowest index) selected layer
        if (topmostLayer === null || selectedLayer.index < topmostLayer.index) {
          topmostLayer = selectedLayer;
        }
      }
      if (earliestStart === null || longestDuration <= 0) {
        return JSON.stringify({
          error: "Could not determine selection timing"
        });
      }
    } else {
      // No layers selected - use default values
      earliestStart = 0;
      // Will be set to FX template duration after import (max 60 seconds)
    }
    var importOptions = new ImportOptions();
    importOptions.file = new File(aeTemplatePath);
    if (!importOptions.file.exists) return JSON.stringify({
      error: "Template file not found at the specified path"
    });
    var templateFileName = importOptions.file.name;
    var templateItem = null;
    for (var t = 1; t <= app.project.numItems; t++) {
      var item = app.project.item(t);
      if (item instanceof FolderItem && item.name === templateFileName) {
        templateItem = item;
        break;
      }
    }
    if (!templateItem) {
      app.beginSuppressDialogs();
      templateItem = importTemplate(aeTemplatePath);
      app.endSuppressDialogs(false);
    }
    var importedComp = null;
    if (templateItem instanceof FolderItem) {
      importedComp = findFirstCompItem(templateItem);
    } else if (templateItem instanceof CompItem) {
      importedComp = templateItem;
    }
    if (!importedComp) return JSON.stringify({
      error: "No compositions found in the imported template"
    });

    // If no layers selected, use FX template duration (but max 60 seconds)
    if (!hasSelectedLayers) {
      longestDuration = Math.min(importedComp.duration, 60);
    } else {
      // Check if selected layers are longer than FX template
      if (importedComp.duration < longestDuration) {
        return JSON.stringify({
          error: "Selected layers are longer than the FX template duration (max 60 seconds)"
        });
      }
    }

    // Match composition size
    importedComp.width = activeComp.width;
    importedComp.height = activeComp.height;
    var presetName = templateFileName.replace(".aep", "").replace(/%20/g, " ");
    app.beginUndoGroup("Apply FX Template: " + presetName);
    var fxLayer = activeComp.layers.add(importedComp);

    // Move FX layer directly above the topmost selected layer (if layers are selected)
    // If no layers selected, FX stays at the top (first layer)
    if (topmostLayer !== null) {
      // moveBefore with topmostLayer.index places the layer directly above the target layer
      fxLayer.moveBefore(activeComp.layer(topmostLayer.index));
    }
    fxLayer.startTime = earliestStart || 0;
    fxLayer.inPoint = earliestStart || 0;
    fxLayer.outPoint = (earliestStart || 0) + longestDuration;
    fxLayer.collapseTransformation = true;
    fxLayer.comment = templateId + ";" + fxLayer.id;
    var controllerLayer = importedComp.layer(1);
    if (controllerLayer && controllerLayer.name === AE_LAYER_NAMES.CONTROLLER) {
      controllerLayer.comment = templateId + ";" + fxLayer.id;
    }
    var layerInfo = getLayerInfo$1(fxLayer);
    app.endUndoGroup();
    return layerInfo;
  } catch (error) {
    return JSON.stringify({
      error: "Failed to apply FX template: " + error.toString()
    });
  }
};

/**
 * Gets the application name (for debugging and app detection)
 */
var getAppName$1 = function getAppName() {
  try {
    if (typeof BridgeTalk !== "undefined" && BridgeTalk.appName) {
      return BridgeTalk.appName;
    }
    
    if (app && app.appName) {
      
      return app.appName;
    }
    return "aftereffects";
  } catch (error) {
    return "aftereffects";
  }
};
var openFolderWithFileSelected = function openFolderWithFileSelected(filePath) {
  var os = $.os.toLowerCase();
  var file = new File(filePath);
  if (!file.exists) {
    alert("File does not exist: " + filePath);
    return;
  }
  if (os.indexOf("windows") !== -1) {
    var cmd = 'explorer /select,"' + file.fsName + '"';
    system.callSystem(cmd);
  } else if (os.indexOf("macintosh") !== -1) {
    var cmd = 'open -R "' + file.fsName + '"';
    system.callSystem(cmd);
  } else {
    alert("Unsupported OS: " + $.os);
  }
};
function createFreezeFrame(layer, freezeTime) {
  try {
    var comp = layer.containingComp;
    var minDuration = 1 / comp.frameRate;
    if (layer.outPoint - layer.inPoint < minDuration) {
      alert("Слой слишком короткий для freeze frame! Длительность должна быть хотя бы 1 кадр.");
      return;
    }
    if (!layer.canSetTimeRemapEnabled) {
      // Для изображений и статических файлов freeze не нужен
      return;
    }
    if (freezeTime < 0) freezeTime = 0;
    // (Ограничение freezeTime для прекомпозиций удалено)
    try {
      // Включаем Time Remap
      layer.timeRemapEnabled = true;
      var timeRemapProperty = layer.property("Time Remap");

      // After Effects автоматически создает keyframes при включении Time Remap
      // Изменяем значение всех keyframes на нужное время заморозки
      for (var i = 1; i <= timeRemapProperty.numKeys; i++) {
        timeRemapProperty.setValueAtKey(i, freezeTime);
        // Устанавливаем Hold interpolation для каждого keyframe
        timeRemapProperty.setInterpolationTypeAtKey(i, KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
      }

      // Если keyframes не создались автоматически, создаем вручную
      if (timeRemapProperty.numKeys === 0) {
        timeRemapProperty.setValueAtTime(0, freezeTime);
        timeRemapProperty.setValueAtTime(layer.outPoint - layer.inPoint, freezeTime);

        // Устанавливаем Hold для созданных keyframes
        for (var j = 1; j <= timeRemapProperty.numKeys; j++) {
          timeRemapProperty.setInterpolationTypeAtKey(j, KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);
        }
      }
    } catch (e) {
      // Ошибку при выходе за пределы игнорируем
    }
  } catch (e) {
    alert("Ошибка в createFreezeFrame: " + e.toString());
  }
}

// Вспомогательная функция поиска композиции по имени
function findCompByName(name) {
  for (var i = 1; i <= app.project.numItems; i++) {
    var item = app.project.item(i);
    if (item instanceof CompItem && item.name === name) {
      return item;
    }
  }
  return null;
}

// Вспомогательная функция поиска слоя по имени
function findLayerByName(comp, name) {
  for (var i = 1; i <= comp.numLayers; i++) {
    var layer = comp.layer(i);
    if (layer.name === name) {
      return layer;
    }
  }
  return null;
}

// Функция добавления смягчающих переходов IN и OUT
function addTransitionMarkers(comp, transitionLayer, templateId) {
  // Ищем композиции IN и OUT
  var inComp = findCompByName("IN");
  var outComp = findCompByName("OUT");
  if (inComp) {
    // Меняем разрешение оригинала IN
    inComp.width = comp.width;
    inComp.height = comp.height;
    // Ищем маркер IN внутри композиции IN
    var inMarkerTime = findMarkerTime(inComp, "IN");
    var inLayer = comp.layers.add(inComp);
    var controllerLayer = inComp.layer(1);
    if (controllerLayer.name === AE_LAYER_NAMES.CONTROLLER) {
      controllerLayer.comment = templateId + ";" + inComp.id;
    }
    // Позиционируем так чтобы маркер IN был в начале основного перехода
    inLayer.startTime = transitionLayer.startTime - inMarkerTime;
    inLayer.moveBefore(transitionLayer);
    // Включаем Collapse Transformations
    inLayer.collapseTransformation = true;
    // Копирование маркеров
    var inMarkers = inComp.markerProperty;
    for (var i = 1; i <= inMarkers.numKeys; i++) {
      var marker = inMarkers.keyValue(i);
      var markerTime = inMarkers.keyTime(i);
      inLayer.property("Marker").setValueAtTime(inLayer.startTime + markerTime, marker);
    }
  }
  if (outComp) {
    // Меняем разрешение оригинала OUT
    outComp.width = comp.width;
    outComp.height = comp.height;
    // Ищем маркер OUT внутри композиции OUT
    var outMarkerTime = findMarkerTime(outComp, "OUT");
    var outLayer = comp.layers.add(outComp);
    var _controllerLayer2 = outComp.layer(1);
    if (_controllerLayer2.name === AE_LAYER_NAMES.CONTROLLER) {
      _controllerLayer2.comment = templateId + ";" + outComp.id;
    }
    // Позиционируем так чтобы маркер OUT был в конце основного перехода
    var transitionEndTime = transitionLayer.startTime + (transitionLayer.outPoint - transitionLayer.inPoint);
    outLayer.startTime = transitionEndTime - outMarkerTime;
    outLayer.moveBefore(transitionLayer);
    // Включаем Collapse Transformations
    outLayer.collapseTransformation = true;
    // Копирование маркеров
    var outMarkers = outComp.markerProperty;
    for (var i = 1; i <= outMarkers.numKeys; i++) {
      var marker = outMarkers.keyValue(i);
      var markerTime = outMarkers.keyTime(i);
      outLayer.property("Marker").setValueAtTime(outLayer.startTime + markerTime, marker);
    }
  }
}

// Функция поиска времени маркера в композиции
function findMarkerTime(comp, markerName) {
  try {
    var markerProperty = comp.markerProperty;
    for (var i = 1; i <= markerProperty.numKeys; i++) {
      var markerValue = markerProperty.keyValue(i);
      if (markerValue.comment === markerName) {
        return markerProperty.keyTime(i);
      }
    }
    // Если маркер не найден, возвращаем 0
    return 0;
  } catch (e) {
    // Если ошибка с маркерами, возвращаем 0
    return 0;
  }
}

// --- ДОБАВЛЕНО: функция очистки всех слоёв в композиции ---
function clearAllLayersInComp(comp) {
  for (var i = comp.numLayers; i >= 1; i--) {
    comp.layer(i).remove();
  }
}
function isValidTransitionLayer(layer) {
  // Только AVLayer, не null, не adjustment
  return layer instanceof AVLayer && !layer.nullLayer && !layer.adjustmentLayer;
}
var apply3DTemplateByPath = function apply3DTemplateByPath(aeTemplatePath, templateId) {
  try {
    if (!app.project) return JSON.stringify({
      error: "No active project"
    });
    if (!app.project.activeItem) return JSON.stringify({
      error: "No active composition"
    });
    var activeComp = getActiveComp();
    var horizontalMin = 0.9;
    var horizontalMax = 2.2;
    var verticalMin = 0.3;
    var verticalMax = 1.1;
    var selectedLayers = activeComp.selectedLayers;
    if (selectedLayers.length !== 2) {
      return JSON.stringify({
        error: "Please select exactly 2 layers for the transition"
      });
    }
    var layer1 = selectedLayers[0]; // Первый слой
    var layer2 = selectedLayers[1]; // Второй слой

    if (!isValidTransitionLayer(layer1) || !isValidTransitionLayer(layer2)) {
      return JSON.stringify({
        error: "Transition can only be applied to video, images, or precompositions!"
      });
    }
    var currentTime = activeComp.time;

    // Add transition comp
    var importOptions = new ImportOptions();
    importOptions.file = new File(aeTemplatePath);
    // Check if the template file exists
    if (!importOptions.file.exists) return JSON.stringify({
      error: "Template file not found at the specified path"
    });
    var templateFileName = importOptions.file.name;
    // Check if the template is already in the project
    var templateItem = null;
    for (var i = 1; i <= app.project.numItems; i++) {
      var item = app.project.item(i);
      if (item instanceof FolderItem && item.name === templateFileName) {
        //$.writeln(item.name);
        templateItem = item;
        break;
      }
    }
    var presetName = templateFileName.replace(".aep", "").replace(/%20/g, " ");
    // Import the template if not already imported
    if (!templateItem) {
      app.beginSuppressDialogs(); // suppress dialogs
      // templateItem = app.project.importFile(importOptions);
      templateItem = importTemplate(aeTemplatePath);
      app.endSuppressDialogs(false);
    }
    var importedComp = null;
    if (templateItem instanceof FolderItem) {
      importedComp = findCompByName(presetName);
    } else if (templateItem instanceof CompItem) {
      importedComp = templateItem;
    }
    if (!importedComp) return JSON.stringify({
      error: "No compositions found in the imported template"
    });

    // Imported comp == Transition comp
    var comp_width = importedComp.width;
    var comp_height = importedComp.height;
    var isVerticalTransition = false;
    var isHorizontalTransition = false;
    var transitionAspect = comp_width / comp_height;
    if (transitionAspect < 1) {
      isVerticalTransition = true;
    } else {
      isHorizontalTransition = true;
    }
    var activeAspect = activeComp.width / activeComp.height;
    var isVerticalComposition = activeAspect < 1;
    var isHorizontalComposition = activeAspect >= 1;
    if (isVerticalTransition && isHorizontalComposition) {
      return JSON.stringify({
        error: "Vertical transition is not compatible with this aspect ratio!"
      });
    }
    if (isHorizontalTransition && isVerticalComposition) {
      return JSON.stringify({
        error: "Vertical transition is not compatible with this aspect ratio!"
      });
    }
    if (isHorizontalTransition && isHorizontalComposition) {
      if (activeAspect < horizontalMin || activeAspect > horizontalMax) {
        return JSON.stringify({
          error: "Horizontal transition is not compatible with this aspect ratio!"
        });
      }
    }
    if (isVerticalTransition && isVerticalComposition) {
      if (activeAspect < verticalMin || activeAspect > verticalMax) {
        return JSON.stringify({
          error: "Vertical transition is not compatible with this aspect ratio!"
        });
      }
    }
    app.beginUndoGroup("Apply 3D Template: " + presetName);
    importedComp.width = activeComp.width;
    importedComp.height = activeComp.height;
    var placeholder01 = findLayerByName(importedComp, "Placeholder_01") || findLayerByName(importedComp, "PlaceHolder_01");
    var placeholder02 = findLayerByName(importedComp, "Placeholder_02") || findLayerByName(importedComp, "PlaceHolder_02");
    if (!placeholder01 || !placeholder02) {
      return JSON.stringify({
        error: "Placeholder_01 or Placeholder_02 not found in the transition comp"
      });
    }

    // 7. Определяем первый и второй слой по inPoint (раньше/позже на таймлайне)
    var firstLayer, secondLayer;
    if (placeholder01.source === placeholder02.source) {
      var dupPH2 = placeholder02.source.duplicate();
      dupPH2.name = placeholder02.source.name + " (PH02)";
      placeholder02.replaceSource(dupPH2, false);
    }
    var epsilon = 1 / activeComp.frameRate;
    var playhead = currentTime;
    var l1OutAtPlayhead = Math.abs(layer1.outPoint - playhead) < epsilon;
    var l2OutAtPlayhead = Math.abs(layer2.outPoint - playhead) < epsilon;
    if (l1OutAtPlayhead && !l2OutAtPlayhead) {
      firstLayer = layer1; // уходит
      secondLayer = layer2; // приходит
    } else if (l2OutAtPlayhead && !l1OutAtPlayhead) {
      firstLayer = layer2;
      secondLayer = layer1;
    } else {
      // Фолбэк: по более раннему inPoint — старая логика
      if (layer1.inPoint <= layer2.inPoint) {
        firstLayer = layer1;
        secondLayer = layer2;
      } else {
        firstLayer = layer2;
        secondLayer = layer1;
      }
    }
    var inAtPlayhead = Math.abs(firstLayer.inPoint - playhead) < epsilon || Math.abs(secondLayer.inPoint - playhead) < epsilon;
    var outAtPlayhead = Math.abs(firstLayer.outPoint - playhead) < epsilon || Math.abs(secondLayer.outPoint - playhead) < epsilon;
    var bothCoverPlayhead = firstLayer.inPoint < playhead && firstLayer.outPoint > playhead && secondLayer.inPoint < playhead && secondLayer.outPoint > playhead;
    if (!(inAtPlayhead && outAtPlayhead) || bothCoverPlayhead) {
      return JSON.stringify({
        error: "Please crop both layers exactly at the playhead: inPoint of one layer and outPoint of the other must match the playhead, and both layers must not overlap the playhead simultaneously!"
      });
    }
    var firstLayerDuplicate = firstLayer.duplicate();
    createFreezeFrame(firstLayerDuplicate, currentTime);
    var secondLayerDuplicate = secondLayer.duplicate();
    createFreezeFrame(secondLayerDuplicate, currentTime);
    // Добавляем переход
    var transitionLayer = activeComp.layers.add(importedComp);
    transitionLayer.startTime = currentTime;
    // Копируем маркеры из transitionComp на transitionLayer
    var transitionMarkers = importedComp.markerProperty;
    for (var i = 1; i <= transitionMarkers.numKeys; i++) {
      var marker = transitionMarkers.keyValue(i);
      var markerTime = transitionMarkers.keyTime(i);
      transitionLayer.property("Marker").setValueAtTime(transitionLayer.startTime + markerTime, marker);
    }
    // Добавляем freeze-кадры в Placeholder_01 и Placeholder_02
    var placeholder01Comp = placeholder01.source;
    if (placeholder01Comp && placeholder01Comp instanceof CompItem) {
      clearAllLayersInComp(placeholder01Comp);
      var frozenLayer1 = placeholder01Comp.layers.add(firstLayerDuplicate.source);
      frozenLayer1.startTime = 0;
      frozenLayer1.inPoint = 0;
      frozenLayer1.outPoint = placeholder01Comp.duration;
      // --- Добавлено: растягивание прекомпозиции, если она короче Placeholder ---
      if (frozenLayer1.source instanceof CompItem) {
        var srcDur1 = frozenLayer1.source.duration;
        var phDur1 = placeholder01Comp.duration;
        if (srcDur1 > 0 && phDur1 > 0 && srcDur1 < phDur1) {
          frozenLayer1.stretch = phDur1 / srcDur1 * 100;
        }
      }
      // --- конец добавления ---
      // --- Новый блок: сохраняем scale и rotation пропорционально Placeholder ---
      var origTransform1 = firstLayerDuplicate.property("Transform");
      var origScale1 = origTransform1.property("Scale").value;
      var origRotation1 = origTransform1.property("Rotation").value;
      var srcCompWidth1 = activeComp.width;
      var srcCompHeight1 = activeComp.height;
      var phCompWidth1 = placeholder01Comp.width;
      var phCompHeight1 = placeholder01Comp.height;
      var scaleX1 = phCompWidth1 / srcCompWidth1;
      var scaleY1 = phCompHeight1 / srcCompHeight1;
      var uniformFactor1 = Math.max(scaleX1, scaleY1);
      var frozenTransform1 = frozenLayer1.property("Transform");
      frozenTransform1.property("Scale").setValue([origScale1[0] * uniformFactor1, origScale1[1] * uniformFactor1]);
      frozenTransform1.property("Scale").setValue([origScale1[0] * uniformFactor1, origScale1[1] * uniformFactor1]);
      frozenTransform1.property("Rotation").setValue(origRotation1);
      // --- конец нового блока ---
      var freezeTime1 = currentTime - firstLayer.startTime;
      var isPrecomp = firstLayer.source instanceof CompItem;
      var duration = firstLayer.outPoint - firstLayer.inPoint;
      if (isPrecomp && freezeTime1 >= duration) {
        freezeTime1 = duration - 1 / activeComp.frameRate;
        if (freezeTime1 < 0) freezeTime1 = 0;
      }
      createFreezeFrame(frozenLayer1, freezeTime1);
      // fitLayerToComp больше не вызываем для сохранения scale/rotation
    }
    var placeholder02Comp = placeholder02.source;
    if (placeholder02Comp && placeholder02Comp instanceof CompItem) {
      clearAllLayersInComp(placeholder02Comp);
      var frozenLayer2 = placeholder02Comp.layers.add(secondLayerDuplicate.source);
      frozenLayer2.startTime = 0;
      frozenLayer2.inPoint = 0;
      frozenLayer2.outPoint = placeholder02Comp.duration;
      // --- Добавлено: растягивание прекомпозиции, если она короче Placeholder ---
      if (frozenLayer2.source instanceof CompItem) {
        var srcDur2 = frozenLayer2.source.duration;
        var phDur2 = placeholder02Comp.duration;
        if (srcDur2 > 0 && phDur2 > 0 && srcDur2 < phDur2) {
          frozenLayer2.stretch = phDur2 / srcDur2 * 100;
        }
      }
      // --- конец добавления ---
      // --- Новый блок: сохраняем scale и rotation пропорционально Placeholder ---
      var origTransform2 = secondLayerDuplicate.property("Transform");
      var origScale2 = origTransform2.property("Scale").value;
      var origRotation2 = origTransform2.property("Rotation").value;
      var srcCompWidth2 = activeComp.width;
      var srcCompHeight2 = activeComp.height;
      var phCompWidth2 = placeholder02Comp.width;
      var phCompHeight2 = placeholder02Comp.height;
      var scaleX2 = phCompWidth2 / srcCompWidth2;
      var scaleY2 = phCompHeight2 / srcCompHeight2;
      var uniformFactor2 = Math.max(scaleX2, scaleY2);
      var frozenTransform2 = frozenLayer2.property("Transform");
      frozenTransform2.property("Scale").setValue([origScale2[0] * uniformFactor2, origScale2[1] * uniformFactor2]);
      frozenTransform2.property("Rotation").setValue(origRotation2);
      // --- конец нового блока ---
      var freezeTime2 = currentTime - secondLayer.startTime;
      createFreezeFrame(frozenLayer2, freezeTime2);
      // fitLayerToComp больше не вызываем для сохранения scale/rotation
    }
    // Удаляем дубликаты из основной композиции
    firstLayerDuplicate.remove();
    secondLayerDuplicate.remove();
    // Теперь сдвигаем второй слой к концу перехода
    secondLayer.startTime = transitionLayer.outPoint - (secondLayer.inPoint - secondLayer.startTime);
    // (Проверка выхода за пределы композиции удалена)

    // 6. Добавляем композиции IN и OUT как смягчающие переходы
    addTransitionMarkers(activeComp, transitionLayer, templateId);
    var controllerLayer = importedComp.layer(1);
    if (controllerLayer.name === AE_LAYER_NAMES.CONTROLLER) {
      controllerLayer.comment = templateId + ";" + importedComp.id;
    }
    app.endUndoGroup();
    var layer_info = getLayerInfo$1(transitionLayer);
    return layer_info;
  } catch (error) {
    var errorText;
    switch (error === null || error === void 0 ? void 0 : error.number) {
      case 21:
        errorText = "No active composition";
      default:
        errorText = "Unknown error: " + error.toString();
    }
    return JSON.stringify({
      error: errorText
    });
  }
};

/**
 * Checks if preset is a bounce preset based on path or name containing "(B)"
 * Simple and reliable: if "(B)" appears anywhere in path or name, it's a bounce preset
 */
function isBouncePreset(presetPath, presetId, presetName) {
  // Combine all strings to check
  var allText = "";
  if (presetName) {
    allText += presetName.toUpperCase() + " ";
  }
  if (presetPath) {
    allText += presetPath.toUpperCase() + " ";
  }
  if (presetId) {
    allText += presetId.toUpperCase() + " ";
  }

  // Simple check: if "(B)" appears anywhere, it's a bounce preset
  return allText.indexOf("(B)") !== -1;
}

/**
 * Applies a Text Animator preset (.ffx) to selected text layers
 * Replaces keyframes with expressions controlled by markers
 * @param presetPath - Full path to the .ffx preset file
 * @param presetId - Unique identifier for the preset
 * @param mode - "inout" (default) or "inonly" for IN animation only
 * @returns JSON string with success/error status
 */
var applyTextAnimatorPreset = function applyTextAnimatorPreset(presetPath, presetId) {
  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "inout";
  var presetPathFromJson = arguments.length > 3 ? arguments[3] : undefined;
  var presetNameFromJson = arguments.length > 4 ? arguments[4] : undefined;
  // Check if this is a bounce preset
  // Use presetPathFromJson and presetNameFromJson if provided (more reliable)
  var pathToCheck = presetPathFromJson || presetPath;
  var nameToCheck = presetNameFromJson || "";
  var isBounce = isBouncePreset(pathToCheck, presetId, nameToCheck);

  // For bounce presets, always use "inonly" mode
  if (isBounce) {
    mode = "inonly";
  }
  // Declare at function scope so it's accessible in catch block
  var originalSelectedLayers = [];
  try {
    if (!app.project || !app.project.activeItem) {
      return JSON.stringify({
        error: "No active project"
      });
    }
    if (!(app.project.activeItem instanceof CompItem)) {
      return JSON.stringify({
        error: "No active composition"
      });
    }
    var comp = app.project.activeItem;
    var layers = comp.selectedLayers;
    if (!layers || layers.length === 0) {
      return JSON.stringify({
        error: "Please select text layer(s)"
      });
    }
    var presetFile = new File(presetPath);
    if (!presetFile.exists) {
      return JSON.stringify({
        error: "Preset file not found: " + presetPath
      });
    }
    app.beginUndoGroup("Apply Text Animator Preset: " + presetId);

    // Aggressively suppress dialogs to prevent panel switching
    // This is especially important when panels are docked together
    app.beginSuppressDialogs();
    var totalProcessedLayers = 0;
    var totalProcessedAnimProps = 0;
    var enableOutro = mode !== "inonly";

    // Store layer references and IDs before deselecting
    var textLayersToProcess = [];
    var layerIds = [];
    for (var li = 0; li < layers.length; li++) {
      var textLayer = layers[li];
      var textProps = textLayer.property("ADBE Text Properties");
      if (textProps) {
        textLayersToProcess.push(textLayer);
        layerIds.push(textLayer.id);
      }
    }
    if (textLayersToProcess.length === 0) {
      app.endSuppressDialogs(false);
      app.endUndoGroup();
      return JSON.stringify({
        error: "Please select text layer(s)"
      });
    }

    // CRITICAL: Temporarily deselect NON-TEXT layers to prevent Effect Controls from opening
    // We must keep text layers selected for applyPreset to work
    // Note: selectedLayers is read-only, so we must deselect each layer individually
    for (var selIdx = 0; selIdx < comp.selectedLayers.length; selIdx++) {
      var layerToCheck = comp.selectedLayers[selIdx];
      originalSelectedLayers.push(layerToCheck);

      // Only deselect if it's NOT a text layer we need to process
      var isTextLayerToProcess = false;
      for (var checkIdx = 0; checkIdx < textLayersToProcess.length; checkIdx++) {
        if (textLayersToProcess[checkIdx].id === layerToCheck.id) {
          isTextLayerToProcess = true;
          break;
        }
      }

      // Deselect non-text layers and other text layers (keep only the ones we're processing)
      // Actually, we need to keep text layers selected, but deselect their properties
      // Let's try a different approach: deselect all, then re-select only text layers we need
      try {
        layerToCheck.selected = false;
      } catch (e) {
        // Ignore errors
      }
    }

    // Re-select only the text layers we need to process
    for (var reSelIdx = 0; reSelIdx < textLayersToProcess.length; reSelIdx++) {
      try {
        textLayersToProcess[reSelIdx].selected = true;
      } catch (e) {
        // Ignore errors
      }
    }
    for (var li = 0; li < textLayersToProcess.length; li++) {
      var textLayer = textLayersToProcess[li];

      // Only TEXT layers
      var textProps = textLayer.property("ADBE Text Properties");
      if (!textProps) continue;

      // Deselect properties before applying preset
      try {
        textProps.selected = false;
        var animGroupBefore = textProps.property("ADBE Text Animators");
        if (animGroupBefore) {
          for (var collapseIdx = 1; collapseIdx <= animGroupBefore.numProperties; collapseIdx++) {
            try {
              var animToCollapse = animGroupBefore.property(collapseIdx);
              if (animToCollapse) {
                animToCollapse.selected = false;
              }
            } catch (e) {
              // Ignore errors
            }
          }
        }
      } catch (e) {
        // Ignore errors
      }
      var animGroupBefore = textProps.property("ADBE Text Animators");
      var beforeCount = animGroupBefore ? animGroupBefore.numProperties : 0;

      // Apply preset (with suppressed dialogs and no layer selected)
      // This prevents Effect Controls from opening
      textLayer.applyPreset(presetFile);

      // NEW: Aggressively collapse all properties immediately after applying preset
      // This must be done multiple times to prevent Effect Controls from opening
      try {
        // First collapse attempt - immediate
        textProps.selected = false;
        var animGroupAfterApply = textProps.property("ADBE Text Animators");
        if (animGroupAfterApply) {
          // Collapse all animators
          for (var collapseIdx2 = 1; collapseIdx2 <= animGroupAfterApply.numProperties; collapseIdx2++) {
            try {
              var animToCollapse2 = animGroupAfterApply.property(collapseIdx2);
              if (animToCollapse2) {
                animToCollapse2.selected = false;
                // Also try to collapse all properties within animator
                var animProps = animToCollapse2.property("ADBE Text Animator Properties");
                if (animProps) {
                  animProps.selected = false;
                }
              }
            } catch (e) {
              // Ignore errors
            }
          }
        }

        // Second collapse attempt - after small delay (using sleep)
        $.sleep(10);
        textProps.selected = false;
        if (animGroupAfterApply) {
          for (var collapseIdx3 = 1; collapseIdx3 <= animGroupAfterApply.numProperties; collapseIdx3++) {
            try {
              var animToCollapse3 = animGroupAfterApply.property(collapseIdx3);
              if (animToCollapse3) {
                animToCollapse3.selected = false;
              }
            } catch (e) {
              // Ignore errors
            }
          }
        }
      } catch (e) {
        // Ignore errors
      }
      var animGroup = textProps.property("ADBE Text Animators");
      if (!animGroup || animGroup.numProperties === 0) continue;
      var afterCount = animGroup.numProperties;

      // CHECK IF BOUNCE PRESET: For bounce presets, expressions already exist in preset
      // We only need to set IN marker at 20 frames for delay control
      // Use presetPathFromJson and presetNameFromJson if provided (more reliable)
      var pathToCheck2 = presetPathFromJson || presetPath;
      var nameToCheck2 = presetNameFromJson || "";
      var isBounce = isBouncePreset(pathToCheck2, presetId, nameToCheck2);
      if (isBounce) {
        // BOUNCE PRESET LOGIC:
        // Expressions and Slider Control effects already exist in the preset
        // We only need to set IN marker at 20 frames for delay control

        var comp = textLayer.containingComp;
        var frameRate = comp.frameRate;
        var frame20Time = textLayer.inPoint + 20 / frameRate;

        // Set or update IN marker at 20 frames
        var markerProp = textLayer.property("Marker");
        var markerAdded = false;
        if (markerProp && markerProp.numKeys > 0) {
          // Find existing IN marker and update it
          for (var mkIdx = markerProp.numKeys; mkIdx >= 1; mkIdx--) {
            var mkValue = markerProp.keyValue(mkIdx);
            if (mkValue && mkValue.comment) {
              var comment = mkValue.comment;
              var isInMarker = comment === "IN" || comment.length >= 3 && comment.substr(comment.length - 3, 3) === "_IN";
              if (isInMarker) {
                // Remove old marker and add new one at correct time
                var oldTime = markerProp.keyTime(mkIdx);
                markerProp.removeKey(mkIdx);
                markerProp.setValueAtTime(frame20Time, new MarkerValue(comment));
                markerAdded = true;
                break;
              }
            }
          }
        }

        // If no IN marker found, create a new one
        if (!markerAdded) {
          markerProp.setValueAtTime(frame20Time, new MarkerValue("IN"));
        }

        // IMPORTANT: Set comment for bounce presets to enable preset identification
        // This allows each preset to have its own default values
        textLayer.comment = presetId + ";" + textLayer.id;
        totalProcessedLayers++;
        continue; // Skip normal keyframe processing for bounce presets
      }

      // DETECT PRESET TYPE: Check if it's new logic (2 animators) or old logic (3+ animators or 1 animator with 4+ keys)
      var presetType = "new"; // "new" = Animator 1=IN, Animator 2=OUT; "old" = all animators have 4 keys (first 2=IN, last 2=OUT)

      // First, check key counts to determine preset type
      var maxKeysPerAnimator = 0;
      var animatorCount = afterCount - beforeCount;
      for (var checkA = beforeCount + 1; checkA <= afterCount; checkA++) {
        var checkAnimator = animGroup.property(checkA);
        if (!checkAnimator) continue;
        var checkSelectors = checkAnimator.property("ADBE Text Selectors");
        if (!checkSelectors || checkSelectors.numProperties === 0) continue;
        var checkRangeSel = null;
        for (var checkS = 1; checkS <= checkSelectors.numProperties; checkS++) {
          var checkSel = checkSelectors.property(checkS);
          if (checkSel && checkSel.matchName === "ADBE Text Selector") {
            checkRangeSel = checkSel;
            break;
          }
        }
        if (!checkRangeSel) continue;
        var checkCandidates = [checkRangeSel.property("ADBE Text Percent Offset"), checkRangeSel.property("ADBE Text Percent Start"), checkRangeSel.property("ADBE Text Percent End"), checkRangeSel.property("ADBE Text Index Offset"), checkRangeSel.property("ADBE Text Index Start"), checkRangeSel.property("ADBE Text Index End")];
        var checkPropWithKeys = null;
        var checkBestKeysCount = 0;
        for (var checkC = 0; checkC < checkCandidates.length; checkC++) {
          if (checkCandidates[checkC] && checkCandidates[checkC].numKeys > checkBestKeysCount) {
            checkBestKeysCount = checkCandidates[checkC].numKeys;
            checkPropWithKeys = checkCandidates[checkC];
          }
        }
        if (checkBestKeysCount > maxKeysPerAnimator) {
          maxKeysPerAnimator = checkBestKeysCount;
        }
      }

      // Determine preset type:
      // - If 2 animators and each has 2 keys -> new logic
      // - If 3+ animators OR 1 animator with 4+ keys -> old logic
      if (animatorCount === 2 && maxKeysPerAnimator === 2) {
        presetType = "new";
      } else if (animatorCount >= 3 || animatorCount === 1 && maxKeysPerAnimator >= 4) {
        presetType = "old";
      } else {
        // Default to new logic for compatibility
        presetType = "new";
      }

      // NEW LOGIC: Animator 1 = IN only, Animator 2 = OUT only
      var animator1Data = [];
      var animator2Data = [];
      // OLD LOGIC: All animators with 4 keys (first 2=IN, last 2=OUT)
      var oldLogicData = [];
      var introDurMax = 0;
      var outroDurMax = 0;
      for (var a = beforeCount + 1; a <= afterCount; a++) {
        var animator = animGroup.property(a);
        if (!animator) continue;
        var animatorIndex = a - beforeCount; // 1 = Animator 1, 2 = Animator 2, etc.

        // NEW: If mode is "inonly", skip Animator 2 and beyond (only for new logic)
        if (presetType === "new" && mode === "inonly" && animatorIndex > 1) continue;
        var selectors = animator.property("ADBE Text Selectors");
        if (!selectors || selectors.numProperties === 0) continue;

        // Find Range Selector
        var rangeSel = null;
        for (var s = 1; s <= selectors.numProperties; s++) {
          var sel = selectors.property(s);
          if (sel && sel.matchName === "ADBE Text Selector") {
            rangeSel = sel;
            break;
          }
        }
        if (!rangeSel) continue;

        // Pick property with MOST keys
        var candidates = [rangeSel.property("ADBE Text Percent Offset"), rangeSel.property("ADBE Text Percent Start"), rangeSel.property("ADBE Text Percent End"), rangeSel.property("ADBE Text Index Offset"), rangeSel.property("ADBE Text Index Start"), rangeSel.property("ADBE Text Index End")];
        var propWithKeys = null;
        var bestKeysCount = 0;
        for (var c = 0; c < candidates.length; c++) {
          if (candidates[c] && candidates[c].numKeys > bestKeysCount) {
            bestKeysCount = candidates[c].numKeys;
            propWithKeys = candidates[c];
          }
        }
        if (!propWithKeys || bestKeysCount < 2) continue;

        // Read keys (relative to first key)
        var keys = [];
        var firstAbsT = propWithKeys.keyTime(1);
        for (var k = 1; k <= propWithKeys.numKeys; k++) {
          keys.push({
            t: propWithKeys.keyTime(k) - firstAbsT,
            v: propWithKeys.keyValue(k)
          });
        }

        // Process based on preset type
        if (presetType === "new") {
          // NEW LOGIC: Animator 1 = IN, Animator 2 = OUT
          if (animatorIndex === 1) {
            // Animator 1: IN animation - duration between first 2 keys
            var introDur = 1;
            if (keys.length >= 2) {
              introDur = keys[1].t - keys[0].t;
              if (introDur < 0.0001) introDur = 1;
            }
            if (introDur > introDurMax) introDurMax = introDur;
            animator1Data.push({
              property: propWithKeys,
              keys: keys,
              animatorIndex: animatorIndex
            });
          } else if (animatorIndex === 2) {
            // Animator 2: OUT animation - duration between last 2 keys
            var outroDur = 1;
            if (keys.length >= 2) {
              var last = keys.length - 1;
              outroDur = keys[last].t - keys[last - 1].t;
              if (outroDur < 0.0001) outroDur = 1;
            }
            if (outroDur > outroDurMax) outroDurMax = outroDur;
            animator2Data.push({
              property: propWithKeys,
              keys: keys,
              animatorIndex: animatorIndex
            });
          }
        } else {
          // OLD LOGIC: All animators have 4 keys (first 2=IN, last 2=OUT)
          if (keys.length >= 4) {
            // First 2 keys for IN
            var introDur = keys[1].t - keys[0].t;
            if (introDur < 0.0001) introDur = 1;
            if (introDur > introDurMax) introDurMax = introDur;

            // Last 2 keys for OUT
            var last = keys.length - 1;
            var outroDur = keys[last].t - keys[last - 1].t;
            if (outroDur < 0.0001) outroDur = 1;
            if (outroDur > outroDurMax) outroDurMax = outroDur;
            oldLogicData.push({
              property: propWithKeys,
              keys: keys,
              animatorIndex: animatorIndex
            });
          }
        }
      }

      // NEW: Check if we have any animators to process
      if (animator1Data.length === 0 && animator2Data.length === 0 && oldLogicData.length === 0) continue;
      if (introDurMax < 0.0001) introDurMax = 1;
      if (outroDurMax < 0.0001) outroDurMax = 1;

      // Markers
      var markerProp = textLayer.property("ADBE Marker");
      if (!markerProp) {
        app.endUndoGroup();
        return JSON.stringify({
          error: "Could not access layer markers"
        });
      }
      var tStart = textLayer.inPoint;
      var tEnd = textLayer.outPoint;
      var tIn = tStart + introDurMax;
      var tOut = tEnd - outroDurMax;

      // Remove old markers "IN" and "OUT" that might be from previous application
      // We'll remove markers that are close to our calculated positions
      var tolerance = comp.frameDuration || 1 / 25;
      for (var mk = markerProp.numKeys; mk >= 1; mk--) {
        var mv = markerProp.keyValue(mk);
        var mkTime = markerProp.keyTime(mk);
        if (mv && mv.comment && (mv.comment === "IN" || mv.comment === "OUT")) {
          // Remove if marker is close to our calculated positions
          if (Math.abs(mkTime - tIn) < tolerance || Math.abs(mkTime - tOut) < tolerance) {
            markerProp.removeKey(mk);
          }
        }
      }

      // Prevent overwrite if too close
      var fd = comp.frameDuration || 1 / 25;
      if (Math.abs(tOut - tIn) < fd * 0.5) {
        if (tOut + fd <= tEnd) tOut += fd;else if (tIn - fd >= tStart) tIn -= fd;
      }

      // Create markers based on mode
      // Use simple "IN" and "OUT" comments, yellow color will be set by user
      var markerIn = new MarkerValue("IN");
      markerProp.setValueAtTime(tIn, markerIn);
      if (enableOutro) {
        var markerOut = new MarkerValue("OUT");
        markerProp.setValueAtTime(tOut, markerOut);
      }

      // Replace keys with expressions based on preset type
      if (presetType === "new") {
        // NEW LOGIC: Animator 1: IN animation (uses IN marker)
        for (var di1 = 0; di1 < animator1Data.length; di1++) {
          var d1 = animator1Data[di1];
          while (d1.property.numKeys > 0) {
            d1.property.removeKey(d1.property.numKeys);
          }
          if (d1.property.canSetExpression) {
            d1.property.expression = buildTextAnimatorExpression(presetId, d1.keys, introDurMax, 0,
            // No outro for Animator 1
            false,
            // Animator 1 is IN only
            true // isInAnimator = true
            );
            totalProcessedAnimProps++;
          }
        }

        // Animator 2: OUT animation (uses OUT marker, only if enableOutro)
        if (enableOutro) {
          for (var di2 = 0; di2 < animator2Data.length; di2++) {
            var d2 = animator2Data[di2];
            while (d2.property.numKeys > 0) {
              d2.property.removeKey(d2.property.numKeys);
            }
            if (d2.property.canSetExpression) {
              d2.property.expression = buildTextAnimatorExpression(presetId, d2.keys, 0,
              // No intro for Animator 2
              outroDurMax, true,
              // Animator 2 is OUT only
              false // isInAnimator = false
              );
              totalProcessedAnimProps++;
            }
          }
        }
      } else {
        // OLD LOGIC: All animators with 4 keys (first 2=IN, last 2=OUT)
        for (var diOld = 0; diOld < oldLogicData.length; diOld++) {
          var dOld = oldLogicData[diOld];
          while (dOld.property.numKeys > 0) {
            dOld.property.removeKey(dOld.property.numKeys);
          }
          if (dOld.property.canSetExpression) {
            dOld.property.expression = buildTextAnimatorExpressionOld(presetId, dOld.keys, introDurMax, outroDurMax, enableOutro);
            totalProcessedAnimProps++;
          }
        }
      }

      // NEW: If mode is "inonly", remove Animator 2 and beyond (only for new logic)
      if (presetType === "new" && mode === "inonly" && afterCount > beforeCount + 1) {
        // Remove all animators after Animator 1 (Animator 2, 3, etc.)
        for (var removeIdx = afterCount; removeIdx > beforeCount + 1; removeIdx--) {
          try {
            var animatorToRemove = animGroup.property(removeIdx);
            if (animatorToRemove) {
              animatorToRemove.remove();
            }
          } catch (e) {
            // Ignore errors when removing
          }
        }
      }

      // NEW: Final aggressive collapse of all properties to prevent opening Animator tabs
      // This is done after all expressions are set
      try {
        $.sleep(10); // Small delay before final collapse
        textProps.selected = false;
        // Collapse all animators
        var animGroupAfter = textProps.property("ADBE Text Animators");
        if (animGroupAfter) {
          for (var collapseIdx = 1; collapseIdx <= animGroupAfter.numProperties; collapseIdx++) {
            try {
              var animToCollapse = animGroupAfter.property(collapseIdx);
              if (animToCollapse) {
                animToCollapse.selected = false;
                // Also collapse properties within animator
                var animProps = animToCollapse.property("ADBE Text Animator Properties");
                if (animProps) {
                  animProps.selected = false;
                }
              }
            } catch (e) {
              // Ignore errors
            }
          }
        }
        // One more attempt after another small delay
        $.sleep(10);
        textProps.selected = false;
      } catch (e) {
        // Ignore errors when collapsing
      }
      textLayer.comment = presetId + ";" + textLayer.id;
      totalProcessedLayers++;
    }

    // End suppress dialogs
    app.endSuppressDialogs(false);

    // Restore original layer selection AFTER all processing is done
    // This ensures Effect Controls doesn't open during preset application
    try {
      if (originalSelectedLayers.length > 0) {
        // Restore selection by setting selected property
        for (var restoreIdx = 0; restoreIdx < originalSelectedLayers.length; restoreIdx++) {
          try {
            originalSelectedLayers[restoreIdx].selected = true;
          } catch (e) {
            // Ignore if layer was deleted
          }
        }
      }
    } catch (e) {
      // Ignore errors during restoration
    }
    if (totalProcessedLayers === 0) {
      app.endUndoGroup();
      return JSON.stringify({
        error: "No text layers processed. Make sure text layers are selected."
      });
    }
    app.endUndoGroup();
    return JSON.stringify({
      success: true,
      layersProcessed: totalProcessedLayers,
      propertiesAnimated: totalProcessedAnimProps,
      mode: mode
    });
  } catch (error) {
    // Make sure to end suppress dialogs even on error
    try {
      app.endSuppressDialogs(false);
    } catch (e) {
      // Ignore if already ended
    }
    // Try to restore layer selection even on error
    try {
      if (originalSelectedLayers.length > 0) {
        for (var restoreIdx = 0; restoreIdx < originalSelectedLayers.length; restoreIdx++) {
          try {
            originalSelectedLayers[restoreIdx].selected = true;
          } catch (e) {
            // Ignore if layer was deleted
          }
        }
      }
    } catch (e) {
      // Ignore errors during restoration
    }
    // Make sure to end undo group
    try {
      app.endUndoGroup();
    } catch (e) {
      // Ignore if already ended
    }
    // Check for version compatibility errors
    var errorMessage = error.toString();
    var errorString = String(errorMessage).toLowerCase();

    // Detect common version compatibility error messages
    if (errorString.indexOf("newer version") !== -1 || errorString.indexOf("created in a newer version") !== -1 || errorString.indexOf("incompatible version") !== -1 || errorString.indexOf("version compatibility") !== -1 || errorString.indexOf("requires a newer version") !== -1) {
      return JSON.stringify({
        error: "Version Compatibility Error:\n\n" + "This preset was created in a newer version of After Effects (likely AE 2025).\n" + "It cannot be used in After Effects 2022.\n\n" + "Solution: Re-create the preset in After Effects 2022 for compatibility.\n" + "Or use After Effects 2025 or later to apply this preset.",
        compatibilityError: true,
        originalError: errorMessage
      });
    }
    return JSON.stringify({
      error: "Failed to apply Text Animator preset: " + errorMessage
    });
  }
};

/**
 * Sets a bounce effect value (Bounce Freq, Bounce Amplitude, or Bounce Decay)
 * @param layerId - Layer ID
 * @param effectName - "Bounce Freq", "Bounce Amplitude", or "Bounce Decay"
 * @param value - Value to set
 * @param useUndoGroup - if true, creates undo group (default: true)
 */
var setBounceEffectValue = function setBounceEffectValue(layerId, effectName, value) {
  var useUndoGroup = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  try {
    var layer = app.project.layerByID(Number(layerId));
    if (!layer) {
      return JSON.stringify({
        error: "Layer not found"
      });
    }
    if (useUndoGroup) {
      app.beginUndoGroup("Set Bounce Effect: " + effectName);
    }
    var effectsGroup = layer.property("ADBE Effect Parade");
    if (!effectsGroup) {
      effectsGroup = layer.property("Effects");
    }
    if (!effectsGroup) {
      if (useUndoGroup) {
        app.endUndoGroup();
      }
      return JSON.stringify({
        error: "Effects property not found"
      });
    }

    // Find the effect by name
    var effect = null;
    for (var e = 1; e <= effectsGroup.numProperties; e++) {
      var eff = effectsGroup.property(e);
      if (eff && eff.name === effectName) {
        effect = eff;
        break;
      }
    }
    if (!effect) {
      if (useUndoGroup) {
        app.endUndoGroup();
      }
      return JSON.stringify({
        error: "Effect not found: " + effectName
      });
    }
    var sliderProp = effect.property("ADBE Slider Control-0001");
    if (!sliderProp) {
      if (useUndoGroup) {
        app.endUndoGroup();
      }
      return JSON.stringify({
        error: "Slider property not found in effect"
      });
    }
    sliderProp.setValue(value);
    if (useUndoGroup) {
      app.endUndoGroup();
    }
    return JSON.stringify({
      success: true
    });
  } catch (error) {
    if (useUndoGroup) {
      try {
        app.endUndoGroup();
      } catch (e) {
        // Ignore
      }
    }
    return JSON.stringify({
      error: "Failed to set bounce effect: " + error.toString()
    });
  }
};

/**
 * Builds expression for Text Animator property
 * @param isInAnimator - true for Animator 1 (IN), false for Animator 2 (OUT)
 */
function buildTextAnimatorExpression(presetId, keys, introFallbackDur, outroFallbackDur, enableOutro) {
  var isInAnimator = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  var keysStr = "[";
  for (var i = 0; i < keys.length; i++) {
    keysStr += "[" + keys[i].t + "," + keys[i].v + "]";
    if (i < keys.length - 1) keysStr += ",";
  }
  keysStr += "]";
  if (isInAnimator) {
    // Animator 1: IN animation only (from start to IN marker)
    return "// AAPower Text Animator 1 (IN)\n" + "var keys = " + keysStr + ";\n" + "var tStart = thisLayer.inPoint;\n" + "var tEnd = thisLayer.outPoint;\n" + "\n" + "var tIn = tStart + " + introFallbackDur + ";\n" + "\n" + "// Find IN marker\n" + "for (var i = 1; i <= thisLayer.marker.numKeys; i++) {\n" + "  var mk = thisLayer.marker.key(i);\n" + "  if (mk.comment === 'IN') tIn = mk.time;\n" + "}\n" + "\n" + "if (tIn <= tStart) tIn = tStart + " + introFallbackDur + ";\n" + "if (tIn >= tEnd) tIn = tEnd;\n" + "\n" + "var vStart = keys[0][1];\n" + "var vHold = (keys.length >= 2) ? keys[1][1] : vStart;\n" + "\n" + "if (time <= tStart) {\n" + "  vStart;\n" + "} else if (time < tIn) {\n" + "  var u = (tIn === tStart) ? 1 : (time - tStart) / (tIn - tStart);\n" + "  u = Math.max(0, Math.min(1, u));\n" + "  vStart + (vHold - vStart) * u;\n" + "} else {\n" + "  vHold;\n" + "}\n";
  } else {
    // Animator 2: OUT animation only (from OUT marker to end)
    return "// AAPower Text Animator 2 (OUT)\n" + "var keys = " + keysStr + ";\n" + "var tStart = thisLayer.inPoint;\n" + "var tEnd = thisLayer.outPoint;\n" + "\n" + "var tOut = tEnd - " + outroFallbackDur + ";\n" + "var hasOutro = false;\n" + "\n" + "// Find OUT marker\n" + "for (var i = 1; i <= thisLayer.marker.numKeys; i++) {\n" + "  var mk = thisLayer.marker.key(i);\n" + "  if (mk.comment === 'OUT') {\n" + "    tOut = mk.time;\n" + "    hasOutro = true;\n" + "  }\n" + "}\n" + "\n" + "if (tOut >= tEnd) tOut = tEnd - " + outroFallbackDur + ";\n" + "if (tOut < tStart) tOut = tStart;\n" + "\n" + "var vOutStart = (keys.length >= 2) ? keys[keys.length - 2][1] : keys[0][1];\n" + "var vEnd = keys[keys.length - 1][1];\n" + "\n" + "if (!hasOutro || time < tOut) {\n" + "  vOutStart;\n" + "} else if (time < tEnd) {\n" + "  var u = (tEnd === tOut) ? 1 : (time - tOut) / (tEnd - tOut);\n" + "  u = Math.max(0, Math.min(1, u));\n" + "  vOutStart + (vEnd - vOutStart) * u;\n" + "} else {\n" + "  vEnd;\n" + "}\n";
  }
}

/**
 * Sets a single text animator property value
 * @param useUndoGroup - if true, creates undo group (default: true)
 */
var setTextAnimatorProperty = function setTextAnimatorProperty(layerId, animatorIndex, propMatchName, value, selectorIndex) {
  var useUndoGroup = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  try {
    var layer = app.project.layerByID(Number(layerId));
    if (!layer) {
      return JSON.stringify({
        error: "Layer not found"
      });
    }
    var textProps = layer.property("ADBE Text Properties");
    if (!textProps) {
      return JSON.stringify({
        error: "Not a text layer"
      });
    }
    var animGroup = textProps.property("ADBE Text Animators");
    if (!animGroup || animGroup.numProperties < animatorIndex) {
      return JSON.stringify({
        error: "Animator not found"
      });
    }
    var animator = animGroup.property(animatorIndex);
    if (!animator) {
      return JSON.stringify({
        error: "Animator not found"
      });
    }
    if (useUndoGroup) {
      app.beginUndoGroup("Set Text Animator Property");
    }

    // Check if it's Tracking Amount, Ease High/Low or Randomize Order (in Range Selector)
    if (propMatchName === "ADBE Text Percent Amount" || propMatchName === "ADBE Text Max Amount" || propMatchName === "ADBE Text Min Amount" || propMatchName === "ADBE Text Selector Randomize Order") {
      var selectors = animator.property("ADBE Text Selectors");
      if (!selectors || selectors.numProperties === 0) {
        if (useUndoGroup) {
          app.endUndoGroup();
        }
        return JSON.stringify({
          error: "No selectors found"
        });
      }
      var selectorIndexToUse = selectorIndex || 1;
      if (selectorIndexToUse > selectors.numProperties) {
        selectorIndexToUse = 1;
      }
      var selector = selectors.property(selectorIndexToUse);
      if (!selector || selector.matchName !== "ADBE Text Selector") {
        if (useUndoGroup) {
          app.endUndoGroup();
        }
        return JSON.stringify({
          error: "Range selector not found"
        });
      }
      if (propMatchName === "ADBE Text Percent Amount") {
        // Tracking Amount is directly in Range Selector
        var prop = selector.property(propMatchName);
        if (prop) {
          prop.setValue(value);
        }
      } else if (propMatchName === "ADBE Text Percent Amount") {
        // Tracking Amount is directly in Range Selector
        var prop = selector.property(propMatchName);
        if (prop) {
          prop.setValue(value);
        }
      } else if (propMatchName === "ADBE Text Max Amount" || propMatchName === "ADBE Text Min Amount") {
        var advanced = selector.property("ADBE Text Range Advanced");
        if (!advanced) {
          if (useUndoGroup) {
            app.endUndoGroup();
          }
          return JSON.stringify({
            error: "Advanced property not found"
          });
        }
        var prop = advanced.property(propMatchName);
        if (prop) {
          prop.setValue(value);
        }
      } else if (propMatchName === "ADBE Text Selector Randomize Order") {
        var prop = selector.property(propMatchName);
        if (prop) {
          prop.setValue(value ? 1 : 0);
        }
      }
    } else {
      // Regular property in ADBE Text Animator Properties
      var animPropsGroup = animator.property("ADBE Text Animator Properties");
      if (!animPropsGroup) {
        if (useUndoGroup) {
          app.endUndoGroup();
        }
        return JSON.stringify({
          error: "Animator properties group not found"
        });
      }

      // Find property by matchName
      var prop = null;
      for (var p = 1; p <= animPropsGroup.numProperties; p++) {
        var checkProp = animPropsGroup.property(p);
        if (checkProp && checkProp.matchName === propMatchName) {
          prop = checkProp;
          break;
        }
      }
      if (!prop) {
        if (useUndoGroup) {
          app.endUndoGroup();
        }
        return JSON.stringify({
          error: "Property not found: " + propMatchName
        });
      }

      // Special handling for Blur (2D property - set both X and Y to same value)
      if (propMatchName === "ADBE Text Blur") {
        if (__isArray(value) && value.length >= 2) {
          prop.setValue(value);
        } else if (typeof value === "number") {
          prop.setValue([value, value]);
        } else {
          if (useUndoGroup) {
            app.endUndoGroup();
          }
          return JSON.stringify({
            error: "Invalid value for Blur"
          });
        }
      } else {
        prop.setValue(value);
      }
    }
    if (useUndoGroup) {
      app.endUndoGroup();
    }
    return JSON.stringify({
      success: true
    });
  } catch (error) {
    if (useUndoGroup) {
      try {
        app.endUndoGroup();
      } catch (e) {
        // Ignore
      }
    }
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Sets multiple text animator properties at once
 */
var setTextAnimatorProperties = function setTextAnimatorProperties(layerId, properties) {
  try {
    var layer = app.project.layerByID(Number(layerId));
    if (!layer) {
      return JSON.stringify({
        error: "Layer not found"
      });
    }
    app.beginUndoGroup("Set Text Animator Properties");
    for (var i = 0; i < properties.length; i++) {
      var propData = properties[i];
      // Don't create undo group for individual properties when called from setTextAnimatorProperties
      var result = setTextAnimatorProperty(layerId, propData.animatorIndex, propData.propMatchName, propData.value, propData.selectorIndex, false // useUndoGroup = false
      );
      var parsed = JSON.parse(result);
      if (parsed.error) {
        app.endUndoGroup();
        return JSON.stringify({
          error: parsed.error
        });
      }
    }
    app.endUndoGroup();
    return JSON.stringify({
      success: true
    });
  } catch (error) {
    try {
      app.endUndoGroup();
    } catch (e) {
      // Ignore
    }
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Builds expression for OLD LOGIC Text Animator property (4 keys: first 2=IN, last 2=OUT)
 */
function buildTextAnimatorExpressionOld(presetId, keys, introFallbackDur, outroFallbackDur, enableOutro) {
  var keysStr = "[";
  for (var i = 0; i < keys.length; i++) {
    keysStr += "[" + keys[i].t + "," + keys[i].v + "]";
    if (i < keys.length - 1) keysStr += ",";
  }
  keysStr += "]";
  return "// AAPower Text Animator (Old Logic: 4 keys)\n" + "var keys = " + keysStr + ";\n" + "var tStart = thisLayer.inPoint;\n" + "var tEnd = thisLayer.outPoint;\n" + "\n" + "var tIn = tStart + " + introFallbackDur + ";\n" + "var tOut = tEnd - " + outroFallbackDur + ";\n" + "var hasOutro = false;\n" + "\n" + "// Find IN and OUT markers (simple names)\n" + "for (var i = 1; i <= thisLayer.marker.numKeys; i++) {\n" + "  var mk = thisLayer.marker.key(i);\n" + "  if (mk.comment === 'IN')  tIn = mk.time;\n" + "  if (mk.comment === 'OUT') {\n" + "    tOut = mk.time;\n" + "    hasOutro = true;\n" + "  }\n" + "}\n" + "\n" + "if (tIn <= tStart) tIn = tStart + " + introFallbackDur + ";\n" + "if (tOut >= tEnd)  tOut = tEnd - " + outroFallbackDur + ";\n" + "if (tOut < tIn)    tOut = tIn;\n" + "\n" + "var vStart = keys[0][1];\n" + "var vHold  = (keys.length >= 2) ? keys[1][1] : vStart;\n" + "var vOutStart = vHold;\n" + "var vEnd = (keys.length >= 4) ? keys[3][1] : vStart;\n" + "\n" + "if (time <= tStart) {\n" + "  vStart;\n" + "} else if (time < tIn) {\n" + "  var u = (tIn === tStart) ? 1 : (time - tStart) / (tIn - tStart);\n" + "  u = Math.max(0, Math.min(1, u));\n" + "  vStart + (vHold - vStart) * u;\n" + "} else if (time < tOut) {\n" + "  vHold;\n" + "} else if (hasOutro && time < tEnd) {\n" + "  var u2 = (tEnd === tOut) ? 1 : (time - tOut) / (tEnd - tOut);\n" + "  u2 = Math.max(0, Math.min(1, u2));\n" + "  vOutStart + (vEnd - vOutStart) * u2;\n" + "} else {\n" + "  vHold;\n" + "}\n";
}

var aeft = /*#__PURE__*/__objectFreeze({
    __proto__: null,
    selectDir: selectDir$1,
    getAEVersion: getAEVersion,
    getLayerInfo: getLayerInfo$1,
    getActiveLayerInfo: getActiveLayerInfo,
    setLayerEffectPropValue: setLayerEffectPropValue,
    undoLastAction: undoLastAction,
    beginUndoGroup: beginUndoGroup,
    endUndoGroup: endUndoGroup,
    setLayerEffectProperties: setLayerEffectProperties,
    applyTemplateByPath: applyTemplateByPath$1,
    applyFXTemplateByPath: applyFXTemplateByPath,
    getAppName: getAppName$1,
    openFolderWithFileSelected: openFolderWithFileSelected,
    apply3DTemplateByPath: apply3DTemplateByPath,
    applyTextAnimatorPreset: applyTextAnimatorPreset,
    setBounceEffectValue: setBounceEffectValue,
    setTextAnimatorProperty: setTextAnimatorProperty,
    setTextAnimatorProperties: setTextAnimatorProperties
});

// Utility functions for Premiere Pro

/**
 * Gets the active project
 */
var getActiveProject = function getActiveProject() {
  if (!app.project) {
    throw new Error("No active project");
  }
  return app.project;
};

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (__isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }

// ============================================================================
// CANONICAL COLOR CONVERSION FUNCTIONS
// ============================================================================

// Color format constants
var ORDER_8BIT = "RGBA"; // 8-bit per channel: R(24-31), G(16-23), B(8-15), A(0-7)
var ORDER_16BIT = "A16R16G16B16"; // 16-bit per channel: A(48-63), R(32-47), G(16-31), B(0-15)
var ORDER_16BIT_SHIFT8 = "A16R16G16B16_SHIFT8"; // 16-bit, but values stored as 8-bit << 8

/**
 * Decode MOGRT color value to RGBA float array [R, G, B, A] (0-1 range)
 * Handles both 32-bit (8-bit per channel) and 64-bit (16-bit per channel) formats
 * Note: ExtendScript doesn't support BigInt, so we use Number with bitwise operations
 * @param value - Color value: number or string
 * @returns Object with { rgba: [r,g,b,a], format: string, diagnostics: object }
 */
function decodeMogrtColorToRGBA(value) {
  var diagnostics = {
    rawValue: String(value),
    rawType: _typeof(value),
    detectedFormat: "unknown"
  };

  // Convert to number (ExtendScript doesn't support BigInt)
  var numValue;
  if (typeof value === "string") {
    var parsed = parseFloat(value);
    if (isNaN(parsed)) {
      diagnostics.error = "Cannot parse string value";
      return {
        rgba: [0, 0, 0, 1],
        format: "unknown",
        diagnostics: diagnostics
      };
    }
    numValue = parsed;
  } else {
    numValue = Number(value);
  }

  // Check if it's a 64-bit value (16-bit per channel)
  // 32-bit max is 0xFFFFFFFF = 4294967295
  var is64Bit = numValue > 0xFFFFFFFF;
  if (is64Bit) {
    // 64-bit format: 16 bits per channel
    // Try different channel orders to find the correct one
    diagnostics.detectedFormat = "64-bit (16-bit per channel)";

    // Extract 16-bit channels using division and modulo
    // Extract 16-bit channels using proper bit manipulation
    // For 64-bit numbers, we need to work with the full precision
    // Format: A(48-63), R(32-47), G(16-31), B(0-15) for A16R16G16B16
    // Use modulo and division with proper masking
    var b16_1 = Math.floor(numValue) & 0xFFFF;
    var temp1 = Math.floor(numValue / 65536);
    var g16_1 = temp1 & 0xFFFF;
    var temp2 = Math.floor(numValue / 4294967296);
    var r16_1 = temp2 & 0xFFFF;
    var temp3 = Math.floor(numValue / 281474976710656);
    var a16_1 = temp3 & 0xFFFF;
    diagnostics.extractedChannels_ARGB = {
      a16: a16_1,
      r16: r16_1,
      g16: g16_1,
      b16: b16_1
    };

    // Validate extracted values are in 0-65535 range
    if (a16_1 > 65535 || r16_1 > 65535 || g16_1 > 65535 || b16_1 > 65535) {
      // Extraction failed, try alternative: maybe it's actually 32-bit with padding
      diagnostics.error = "Extracted channels exceed 16-bit range";
      // Fallback: treat as 32-bit
      var value32 = (numValue & 0xFFFFFFFF) >>> 0;
      var a8 = value32 >>> 24 & 0xFF;
      var r8 = value32 >>> 16 & 0xFF;
      var g8 = value32 >>> 8 & 0xFF;
      var b8 = value32 & 0xFF;
      return {
        rgba: [Math.max(0, Math.min(1, r8 / 255)), Math.max(0, Math.min(1, g8 / 255)), Math.max(0, Math.min(1, b8 / 255)), Math.max(0, Math.min(1, a8 / 255))],
        format: ORDER_8BIT,
        diagnostics: diagnostics
      };
    }

    // Detect "shifted 8-bit" encoding (values are multiples of 256)
    var isShifted8 = (a16_1 & 0xFF) === 0 && (r16_1 & 0xFF) === 0 && (g16_1 & 0xFF) === 0 && (b16_1 & 0xFF) === 0;
    diagnostics.shifted8Bit = isShifted8;
    if (isShifted8) {
      // Decode as 8-bit stored in high byte
      var _a = a16_1 >>> 8 & 0xFF;
      var _r = r16_1 >>> 8 & 0xFF;
      var _g = g16_1 >>> 8 & 0xFF;
      var _b = b16_1 >>> 8 & 0xFF;
      var rgbaShifted = [Math.max(0, Math.min(1, _r / 255)), Math.max(0, Math.min(1, _g / 255)), Math.max(0, Math.min(1, _b / 255)), Math.max(0, Math.min(1, _a / 255))];
      diagnostics.normalizedFloats = rgbaShifted;
      return {
        rgba: rgbaShifted,
        format: ORDER_16BIT_SHIFT8,
        diagnostics: diagnostics
      };
    }

    // Normalize to 0-1 range (divide by 65535)
    var rgba = [Math.max(0, Math.min(1, r16_1 / 65535)), Math.max(0, Math.min(1, g16_1 / 65535)), Math.max(0, Math.min(1, b16_1 / 65535)), Math.max(0, Math.min(1, a16_1 / 65535))];
    diagnostics.normalizedFloats = rgba;
    return {
      rgba: rgba,
      format: ORDER_16BIT,
      diagnostics: diagnostics
    };
  } else {
    // 32-bit format: 8 bits per channel
    diagnostics.detectedFormat = "32-bit (8-bit per channel)";
    var _value = (numValue & 0xFFFFFFFF) >>> 0;

    // AGRB format: A(24-31), G(16-23), R(8-15), B(0-7)
    // Premiere Pro uses G and R swapped compared to standard ARGB
    var _a2 = _value >>> 24 & 0xFF;
    var _g2 = _value >>> 16 & 0xFF;
    var _r2 = _value >>> 8 & 0xFF;
    var _b2 = _value & 0xFF;
    diagnostics.extractedChannels_AGRB = {
      a8: _a2,
      g8: _g2,
      r8: _r2,
      b8: _b2
    };

    // Heuristic: if alpha is 0/1 but RGB are non-zero, treat alpha as 255
    var a8_fixed = _a2;
    if ((_a2 === 0 || _a2 === 1) && (_r2 !== 0 || _g2 !== 0 || _b2 !== 0)) {
      a8_fixed = 255;
      diagnostics.alphaFixApplied = true;
    }

    // Return as RGBA array [R, G, B, A] for UI
    var _rgba = [Math.max(0, Math.min(1, _r2 / 255)), Math.max(0, Math.min(1, _g2 / 255)), Math.max(0, Math.min(1, _b2 / 255)), Math.max(0, Math.min(1, a8_fixed / 255))];
    diagnostics.normalizedFloats = _rgba;
    return {
      rgba: _rgba,
      format: "AGRB",
      diagnostics: diagnostics
    };
  }
}

/**
 * Encode RGBA float array [R, G, B, A] (0-1 range) to MOGRT color value
 * Note: ExtendScript doesn't support BigInt, so we use Number with multiplication
 * @param rgba - Array of [R, G, B, A] floats in 0-1 range
 * @param preferredFormat - Format to use: "8bit" (32-bit) or "16bit" (64-bit)
 * @param currentValue - Current value to match format (optional, for auto-detection)
 * @returns Color value (number)
 */
/**
 * Convert RGBA float (0-1) to uint8 (0-255)
 */
function rgbaFloatToUint8(v) {
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

/**
 * Convert RGBA float array [r, g, b, a] (0-1 range) to packed 32-bit ARGB integer
 * Premiere Pro MOGRT color parameters expect this format: (A << 24) | (R << 16) | (G << 8) | B
 * @param r - Red channel (0-1)
 * @param g - Green channel (0-1)
 * @param b - Blue channel (0-1)
 * @param a - Alpha channel (0-1), defaults to 1
 * @returns Packed 32-bit ARGB integer (unsigned)
 */
function rgbaToARGBInt(r, g, b) {
  var a = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var A = rgbaFloatToUint8(a);
  var R = rgbaFloatToUint8(r);
  var G = rgbaFloatToUint8(g);
  var B = rgbaFloatToUint8(b);
  // ensure unsigned
  return (A << 24 | R << 16 | G << 8 | B) >>> 0;
}

/**
 * Convert packed 32-bit ARGB integer to RGBA float array [r, g, b, a] (0-1 range)
 * @param intVal - Packed ARGB integer
 * @returns RGBA array [R, G, B, A] in 0-1 range
 */
function argbIntToRgba(intVal) {
  var v = Number(intVal) >>> 0;
  var A = v >>> 24 & 255;
  var R = v >>> 16 & 255;
  var G = v >>> 8 & 255;
  var B = v & 255;
  return [R / 255, G / 255, B / 255, A / 255];
}

/**
 * Convert a number to hex string, handling large values safely
 * For values > 2^32, extracts lower 32 bits
 */
function numberToHexString(num) {
  // If value is within safe 32-bit range, convert directly
  if (num >= 0 && num <= 0xFFFFFFFF) {
    var _v = num >>> 0;
    return "0x" + _v.toString(16).toUpperCase().padStart(8, "0");
  }
  // For larger values, extract lower 32 bits
  var v = (num & 0xFFFFFFFF) >>> 0;
  return "0x" + v.toString(16).toUpperCase().padStart(8, "0");
}

// Helpers for text JSON (TextDocument) handling
var extractTextFromJson = function extractTextFromJson(obj) {
  if (!obj || _typeof(obj) !== "object") {
    return null;
  }
  if (typeof obj.textEditValue === "string") {
    return obj.textEditValue;
  }
  if (typeof obj.plainText === "string") {
    return obj.plainText;
  }
  if (typeof obj.text === "string") {
    return obj.text;
  }
  if (obj.textDocument && _typeof(obj.textDocument) === "object" && typeof obj.textDocument.text === "string") {
    return obj.textDocument.text;
  }
  return null;
};
var setTextIntoJson = function setTextIntoJson(obj, newText) {
  if (!obj || _typeof(obj) !== "object") {
    return obj;
  }
  if ("textEditValue" in obj || typeof obj.textEditValue === "string") {
    obj.textEditValue = newText;
    return obj;
  }
  if ("plainText" in obj || typeof obj.plainText === "string") {
    obj.plainText = newText;
    return obj;
  }
  if ("text" in obj || typeof obj.text === "string") {
    obj.text = newText;
    return obj;
  }
  if (obj.textDocument && _typeof(obj.textDocument) === "object") {
    obj.textDocument.text = newText;
    return obj;
  }
  obj.textEditValue = newText;
  return obj;
};

/**
 * Selects a directory (placeholder for now)
 * Similar to AE version but adapted for PR
 */
var selectDir = function selectDir() {
  try {
    var project = getActiveProject();
    // TODO: Implement folder selection dialog for PR
    // For now, return empty result
    return JSON.stringify({
      folder: ""
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Internal helper: get currently selected MOGRT TrackItem context
 */
var getActiveMogrtTrackItem = function getActiveMogrtTrackItem() {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return null;
    }
    
    var sequence = app.project.activeSequence;
    if (!sequence || !sequence.getSelection) {
      return null;
    }
    
    var selection = sequence.getSelection();
    
    if (!selection || selection.length === 0) {
      return null;
    }
    
    var trackItem = selection[0];
    if (!trackItem || !trackItem.getMGTComponent) {
      return null;
    }
    
    var mgt = trackItem.getMGTComponent();
    if (!mgt) {
      return null;
    }
    return {
      sequence: sequence,
      trackItem: trackItem,
      mgt: mgt
    };
  } catch (e) {
    return null;
  }
};

/**
 * Gets layer info for Premiere Pro MOGRT clips using correct API
 * Uses TrackItem.getMGTComponent() and properties collection
 * @param templateId - Template ID (unused)
 * @returns JSON string with properties array and clipName
 */
var getLayerInfo = function getLayerInfo(templateId) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    // Get the first selected TrackItem
    
    var trackItem = selection[0];

    // Verify it's a MOGRT clip using getMGTComponent()
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }

    // Get sequence dimensions for point/scale conversion
    var compWidth = 1920; // Default to Full HD
    var compHeight = 1080;
    try {
      
      if (sequence && sequence.getSequenceSettings) {
        
        var settings = sequence.getSequenceSettings();
        
        if (settings && settings.videoFrameWidth && settings.videoFrameHeight) {
          
          compWidth = settings.videoFrameWidth;
          
          compHeight = settings.videoFrameHeight;
        }
      }
    } catch (e) {
      // Fallback to default if we can't get sequence settings
    }

    // Get all editable properties
    var paramsList = [];
    
    var numProps = properties.numItems || properties.length || 0;
    for (var i = 0; i < numProps; i++) {
      try {
        
        var param = properties[i] || properties.getItemAt(i);
        if (!param) continue;

        
        var displayName = param.displayName;
        if (!displayName) continue;

        
        var rawValue = param.getValue();

        // ALWAYS preserve original value as valueRaw
        var valueRaw = rawValue;
        var uiValue = rawValue;
        var valueType = _typeof(rawValue);
        var editable = true;
        var groupId = null;

        // Handle color as integer (32-bit or 64-bit) - decode to RGBA float array
        // ONLY process if it's clearly a color property by name AND is a number (not array)
        // This must happen BEFORE array normalization to avoid conflicts
        var isColorProperty = displayName && (displayName.toLowerCase().indexOf("color") !== -1 || displayName.toLowerCase().indexOf("colour") !== -1);

        // Store color format for later use in encoding
        var colorFormat = null;

        // CRITICAL: For COLOR params with valueType: number, use safe hex string reading
        // Premiere Pro MOGRT color parameters may be > 2^53, causing JS precision loss
        // We'll handle this in the panel using getMogrtPropertySafe
        if (isColorProperty && typeof rawValue === "number" && !__isArray(rawValue)) {
          try {
            // Store raw value and hex string for safe parsing in panel
            var numValue = Number(rawValue);
            var hexString = numberToHexString(numValue);
            valueRaw = rawValue; // Keep original integer
            // Note: Decoding will be done in panel using getMogrtPropertySafe with BigInt
            // For now, try to decode if value is within safe range
            if (numValue <= 0xFFFFFFFF) {
              var decodedRGBA = argbIntToRgba(numValue);
              uiValue = decodedRGBA;
              valueType = "array";
              colorFormat = "ARGB"; // Default, will be calibrated
            } else {
              // Large value - panel should use getMogrtPropertySafe
              // Store hex string in a special field for panel to use
              valueRaw = hexString; // Store as hex string for large values
            }
          } catch (e) {
            // If decoding fails, keep original value - don't break anything
          }
        }

        // CRITICAL FIX: If value is 64-bit but Premiere doesn't accept it,
        // try extracting lower 32 bits and decode as 32-bit color
        if (isColorProperty && typeof rawValue === "number" && rawValue > 0xFFFFFFFF && !__isArray(uiValue)) {
          try {
            // Extract lower 32 bits
            var value32 = (rawValue & 0xFFFFFFFF) >>> 0;
            var decoded32 = decodeMogrtColorToRGBA(value32);
            if (decoded32.format !== "unknown" && decoded32.rgba && decoded32.rgba.length === 4) {
              var allValid = decoded32.rgba.every(function (v) {
                return typeof v === "number" && v >= 0 && v <= 1;
              });
              if (allValid) {
                uiValue = decoded32.rgba;
                valueType = "array";
                valueRaw = rawValue; // Keep original 64-bit integer
              }
            }
          } catch (e) {
            // If decoding fails, keep original value
          }
        }

        // Normalize color arrays: ensure 0-1 range
        // Premiere Pro may return colors in 0-255 range, but we need 0-1 for UI
        if (__isArray(rawValue) && (rawValue.length === 3 || rawValue.length === 4)) {
          // Check if values are in 0-255 range (need normalization)
          var needsNormalization = rawValue.some(function (v, idx) {
            if (idx < 3) {
              // RGB: check if > 1
              return typeof v === "number" && v > 1;
            }
            return false;
          });
          if (needsNormalization) {
            // Normalize from 0-255 to 0-1
            uiValue = rawValue.map(function (v, idx) {
              if (idx < 3) {
                // RGB: normalize
                return typeof v === "number" ? Math.max(0, Math.min(1, v / 255)) : v;
              } else {
                // Alpha: keep as is (should already be 0-1)
                return typeof v === "number" ? Math.max(0, Math.min(1, v)) : v;
              }
            });
            // Keep original in valueRaw
            valueRaw = rawValue;
          }
        }

        // Определяем propertyType для UI (примерно как в AE)
        var propertyType = "slider";
        if (valueType === "textDocument") {
          propertyType = "textDocument";
        } else if (isColorProperty) {
          propertyType = "color";
        } else if (valueType === "array") {
          propertyType = "point";
        } else if (typeof uiValue === "boolean" || typeof rawValue === "boolean" || typeof rawValue === "number" && (rawValue === 0 || rawValue === 1) && matchName === "ADBE Checkbox Control") {
          propertyType = "checkbox";
        } else if (typeof uiValue === "string") {
          propertyType = "text";
        } else if (typeof uiValue === "number") {
          // Возможный Drop menu: небольшой диапазон целых значений
          if (minValue !== null && maxValue !== null && maxValue > minValue && maxValue - minValue <= 10 && Math.abs(minValue - Math.round(minValue)) < 1e-6 && Math.abs(maxValue - Math.round(maxValue)) < 1e-6) {
            propertyType = "menu";
          } else {
            propertyType = "slider";
          }
        }

        // Helper: Check if string is UUID or contains UUIDs (group identifier)
        // Group identifiers in MOGRT are strings like "uuid1;uuid2;uuid3;" or just "uuid"
        var isGroupIdentifier = function isGroupIdentifier(str) {
          var trimmed = str.replace(/^\s+|\s+$/g, "");
          // Check if it's a single UUID
          var singleUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (singleUuidRegex.test(trimmed)) {
            return true;
          }
          // Check if it contains UUIDs separated by semicolons (group identifier pattern)
          // Pattern: "uuid1;uuid2;uuid3;" or "uuid1;uuid2"
          var groupPattern = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12};?)+$/i;
          return groupPattern.test(trimmed);
        };

        // Detect TextDocument JSON and extract text for UI
        if (typeof rawValue === "string") {
          var s = rawValue.toString();
          var trimmed = s.replace(/^\s+|\s+$/g, "");

          // First check if it's JSON (TextDocument)
          if (trimmed.charAt(0) === "{") {
            try {
              var obj = JSON.parse(trimmed);
              var extractedText = extractTextFromJson(obj);
              if (extractedText !== null) {
                // This is a TextDocument
                valueType = "textDocument";
                uiValue = extractedText;
                editable = true;

                // Extract text style properties from TextDocument JSON for UI
                var textStyles = {};

                // Font family (array of font names)
                if (obj.fontEditValue && obj.fontEditValue instanceof Array && obj.fontEditValue.length > 0) {
                  textStyles.fontFamily = obj.fontEditValue[0];
                  textStyles.fontFamilyArray = obj.fontEditValue;
                }

                // Font size (array of sizes)
                if (obj.fontSizeEditValue && obj.fontSizeEditValue instanceof Array && obj.fontSizeEditValue.length > 0) {
                  textStyles.fontSize = obj.fontSizeEditValue[0];
                  textStyles.fontSizeArray = obj.fontSizeEditValue;
                }

                // Font style flags (arrays)
                if (obj.fontFSBoldValue && obj.fontFSBoldValue instanceof Array) {
                  textStyles.fontBold = obj.fontFSBoldValue[0] || false;
                }
                if (obj.fontFSItalicValue && obj.fontFSItalicValue instanceof Array) {
                  textStyles.fontItalic = obj.fontFSItalicValue[0] || false;
                }
                if (obj.fontFSAllCapsValue && obj.fontFSAllCapsValue instanceof Array) {
                  textStyles.fontAllCaps = obj.fontFSAllCapsValue[0] || false;
                }
                if (obj.fontFSSmallCapsValue && obj.fontFSSmallCapsValue instanceof Array) {
                  textStyles.fontSmallCaps = obj.fontFSSmallCapsValue[0] || false;
                }

                // Find font style field (faux/style/weight) - for "очертание шрифта"
                for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    var keyLower = key.toLowerCase();
                    if ((keyLower.indexOf("faux") !== -1 || keyLower.indexOf("style") !== -1 || keyLower.indexOf("weight") !== -1) && (keyLower.indexOf("edit") !== -1 || keyLower.indexOf("value") !== -1)) {
                      var styleVal = obj[key];
                      if (styleVal instanceof Array && styleVal.length > 0) {
                        textStyles.fontStyleName = styleVal[0];
                        textStyles.fontStyleField = key;
                        textStyles.fontStyleArray = styleVal;
                      } else if (styleVal !== undefined && styleVal !== null) {
                        textStyles.fontStyleName = styleVal;
                        textStyles.fontStyleField = key;
                      }
                      break;
                    }
                  }
                }

                // Store text styles in the param object for UI access
                // We'll add it to the paramsList item

                // valueRaw stays as original JSON string
              } else {
                // JSON but not TextDocument, keep as is
                valueType = "string";
                uiValue = rawValue;
                editable = true;
              }
            } catch (e) {
              // Not valid JSON, check if it's group identifier (UUID or UUIDs with semicolons)
              if (isGroupIdentifier(trimmed)) {
                // This is a group container
                valueType = "group";
                uiValue = null;
                editable = false;
                // Use first UUID as groupId, or the whole string if it's a single UUID
                var firstUuidMatch = trimmed.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
                groupId = firstUuidMatch ? firstUuidMatch[1] : trimmed;
              } else {
                // Regular string
                valueType = "string";
                uiValue = rawValue;
                editable = true;
              }
            }
          } else {
            // Not JSON, check if it's group identifier (UUID or UUIDs with semicolons)
            if (isGroupIdentifier(trimmed)) {
              // This is a group container
              valueType = "group";
              uiValue = null;
              editable = false;
              // Use first UUID as groupId, or the whole string if it's a single UUID
              var _firstUuidMatch = trimmed.match(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
              groupId = _firstUuidMatch ? _firstUuidMatch[1] : trimmed;
            } else {
              // Regular string
              valueType = "string";
              uiValue = rawValue;
              editable = true;
            }
          }
        } else if (rawValue instanceof Array) {
          valueType = "array";
          // Check if this is a Position or Scale parameter (point control)
          // Position and Scale in MOGRT are normalized (0-1), but Premiere UI shows pixels/percent
          var isPosition = displayName && displayName.toLowerCase().indexOf("position") !== -1;
          var isScale = displayName && displayName.toLowerCase().indexOf("scale") !== -1;
          if ((isPosition || isScale) && rawValue.length === 2) {
            // Convert normalized values to pixels/percent
            if (isPosition) {
              // Position: convert normalized (0-1) to pixels
              uiValue = [rawValue[0] * compWidth, rawValue[1] * compHeight];
            } else if (isScale) {
              // Scale: convert normalized to pixels
              // Premiere uses compWidth for X and compHeight for Y even for Scale
              uiValue = [rawValue[0] * compWidth, rawValue[1] * compHeight];
            } else {
              uiValue = rawValue;
            }
            // Keep original normalized values in valueRaw
            valueRaw = rawValue;
          } else {
            uiValue = rawValue;
          }
          editable = true;
        } else if (typeof rawValue === "boolean") {
          valueType = "boolean";
          uiValue = rawValue;
          editable = true;
        } else if (typeof rawValue === "number") {
          valueType = "number";
          uiValue = rawValue;
          editable = true;
        }

        
        var matchName = param.matchName || '';
        // Note: matchNameLower already declared above for color detection
        
        var isTimeVarying = param.isTimeVarying ? param.isTimeVarying() : false;
        
        var minValue = param.minValue !== undefined ? param.minValue : null;
        
        var maxValue = param.maxValue !== undefined ? param.maxValue : null;
        var paramObj = {
          displayName: displayName,
          matchName: matchName,
          propertyType: propertyType,
          value: uiValue,
          // For backward compatibility, keep uiValue as value
          valueType: valueType,
          valueRaw: valueRaw,
          // ALWAYS original param.getValue() without changes
          uiValue: uiValue,
          // Normalized value for UI
          editable: editable,
          groupId: groupId,
          // UUID for group containers
          isTimeVarying: isTimeVarying,
          minValue: minValue,
          maxValue: maxValue
        };

        // Store color format if this is a color property (format detected during decoding)
        if (colorFormat !== null) {
          paramObj.colorFormat = colorFormat;
        }

        // Extract text styles from TextDocument JSON if this is a textDocument
        if (valueType === "textDocument" && typeof rawValue === "string") {
          var _trimmed = String(rawValue).replace(/^\s+|\s+$/g, "");
          if (_trimmed.charAt(0) === "{") {
            try {
              var _obj = JSON.parse(_trimmed);
              var _textStyles = {};

              // Font family (array)
              if (_obj.fontEditValue && _obj.fontEditValue instanceof Array && _obj.fontEditValue.length > 0) {
                _textStyles.fontFamily = _obj.fontEditValue[0];
                _textStyles.fontFamilyArray = _obj.fontEditValue;
              }

              // Font size (array)
              if (_obj.fontSizeEditValue && _obj.fontSizeEditValue instanceof Array && _obj.fontSizeEditValue.length > 0) {
                _textStyles.fontSize = _obj.fontSizeEditValue[0];
                _textStyles.fontSizeArray = _obj.fontSizeEditValue;
              }

              // Font style flags (arrays)
              if (_obj.fontFSBoldValue && _obj.fontFSBoldValue instanceof Array) {
                _textStyles.fontBold = _obj.fontFSBoldValue[0] || false;
              }
              if (_obj.fontFSItalicValue && _obj.fontFSItalicValue instanceof Array) {
                _textStyles.fontItalic = _obj.fontFSItalicValue[0] || false;
              }
              if (_obj.fontFSAllCapsValue && _obj.fontFSAllCapsValue instanceof Array) {
                _textStyles.fontAllCaps = _obj.fontFSAllCapsValue[0] || false;
              }
              if (_obj.fontFSSmallCapsValue && _obj.fontFSSmallCapsValue instanceof Array) {
                _textStyles.fontSmallCaps = _obj.fontFSSmallCapsValue[0] || false;
              }

              // Find font style field (faux/style/weight) - for "очертание шрифта"
              var fontStyleField = null;
              var fontStyleValue = null;
              for (var _key in _obj) {
                if (_obj.hasOwnProperty(_key)) {
                  var _keyLower = _key.toLowerCase();
                  if ((_keyLower.indexOf("faux") !== -1 || _keyLower.indexOf("style") !== -1 || _keyLower.indexOf("weight") !== -1) && (_keyLower.indexOf("edit") !== -1 || _keyLower.indexOf("value") !== -1)) {
                    fontStyleField = _key;
                    var _styleVal = _obj[_key];
                    if (_styleVal instanceof Array && _styleVal.length > 0) {
                      fontStyleValue = _styleVal[0];
                    } else if (_styleVal !== undefined && _styleVal !== null) {
                      fontStyleValue = _styleVal;
                    }
                    break;
                  }
                }
              }
              if (fontStyleField && fontStyleValue !== null) {
                _textStyles.fontStyleName = fontStyleValue;
                _textStyles.fontStyleField = fontStyleField;
              }

              // Extract capability flags for UI disabled states
              if (_obj.capPropFontEdit !== undefined) {
                _textStyles.capPropFontEdit = Boolean(_obj.capPropFontEdit);
              }
              if (_obj.capPropFontSizeEdit !== undefined) {
                _textStyles.capPropFontSizeEdit = Boolean(_obj.capPropFontSizeEdit);
              }
              if (_obj.capPropFontFauxStyleEdit !== undefined) {
                _textStyles.capPropFontFauxStyleEdit = Boolean(_obj.capPropFontFauxStyleEdit);
              }

              // Check if we found any styles
              var hasStyles = false;
              for (var _key2 in _textStyles) {
                if (_textStyles.hasOwnProperty(_key2)) {
                  hasStyles = true;
                  break;
                }
              }
              if (hasStyles) {
                paramObj.textStyles = _textStyles;
              }
            } catch (e) {
              // Failed to parse TextDocument JSON
            }
          }
        }
        paramsList.push(paramObj);
      } catch (e) {
        // Skip properties that can't be read
        continue;
      }
    }
    return JSON.stringify({
      success: true,
      properties: paramsList,
      clipName: trackItem.name || 'Unknown'
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Minimal host-style API: getSelectedMogrtParams()
 * Returns JSON with list of editable params for currently selected MOGRT
 */
var getSelectedMogrtParams = function getSelectedMogrtParams() {
  try {
    var ctx = getActiveMogrtTrackItem();
    if (!ctx) {
      return JSON.stringify({
        error: "No selected MOGRT TrackItem"
      });
    }
    var mgt = ctx.mgt;
    
    var props = mgt.properties;
    if (!props) {
      return JSON.stringify({
        error: "No properties on MGT component"
      });
    }
    var result = [];
    
    var num = props.numItems || props.length || 0;
    for (var i = 0; i < num; i++) {
      try {
        
        var p = props[i] || props.getItemAt(i);
        if (!p || !p.displayName || !p.getValue) {
          continue;
        }
        
        var val = p.getValue();
        var valueType = _typeof(val);
        
        if (val instanceof Array) {
          valueType = "array";
        }
        result.push({
          
          displayName: p.displayName,
          
          matchName: p.matchName || "",
          value: val,
          valueType: valueType
        });
      } catch (e) {
        continue;
      }
    }
    return JSON.stringify({
      ok: true,
      params: result
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Minimal host-style API: setSelectedMogrtParam(name, valueJsonOrPrimitive)
 * Sets value on currently selected MOGRT parameter and pings UI
 */
var setSelectedMogrtParam = function setSelectedMogrtParam(name, valueJsonOrPrimitive) {
  try {
    var ctx = getActiveMogrtTrackItem();
    if (!ctx) {
      return JSON.stringify({
        error: "No selected MOGRT TrackItem"
      });
    }
    var sequence = ctx.sequence,
      trackItem = ctx.trackItem,
      mgt = ctx.mgt;
    
    var props = mgt.properties;
    if (!props) {
      return JSON.stringify({
        error: "No properties on MGT component"
      });
    }

    // Find param by displayName or matchName
    var param = null;
    
    if (props.getParamForDisplayName) {
      
      param = props.getParamForDisplayName(name);
    }
    if (!param) {
      
      var num = props.numItems || props.length || 0;
      for (var i = 0; i < num; i++) {
        try {
          
          var c = props[i] || props.getItemAt(i);
          
          if (!c) continue;
          
          if (c.displayName && c.displayName === name ||
          
          c.matchName && c.matchName === name) {
            param = c;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    if (!param || !param.getValue || !param.setValue) {
      return JSON.stringify({
        error: "Param not found: ".concat(name)
      });
    }

    
    var currentValue = param.getValue();
    var newVal = valueJsonOrPrimitive;

    // Decode JSON / primitives from string
    if (typeof newVal === "string") {
      var trimmed = newVal.toString().replace(/^\s+|\s+$/g, "");
      if (trimmed.charAt(0) === "{" || trimmed.charAt(0) === "[") {
        try {
          newVal = JSON.parse(trimmed);
        } catch (e1) {
          // keep as string
        }
      } else if (trimmed === "true" || trimmed === "false") {
        newVal = trimmed === "true";
      } else if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        var numVal = Number(trimmed);
        if (numVal === numVal) {
          newVal = numVal;
        }
      }
    }

    // Checkbox: map boolean to 0/1 when current value is numeric 0/1
    if (typeof newVal === "boolean" && typeof currentValue === "number" && (currentValue === 0 || currentValue === 1)) {
      newVal = newVal ? 1 : 0;
    }

    // Arrays (color, point, etc.): keep same length
    
    if (currentValue instanceof Array && newVal instanceof Array) {
      
      var targetLen = currentValue.length;
      if (newVal.length !== targetLen) {
        var fixed = [];
        for (var _i = 0; _i < targetLen; _i++) {
          fixed[_i] = _i < newVal.length ? newVal[_i] : currentValue[_i];
        }
        newVal = fixed;
      }
    }

    // Set value with different signatures
    try {
      
      param.setValue(newVal, true);
    } catch (e1) {
      try {
        
        param.setValue(newVal, false);
      } catch (e2) {
        try {
          
          param.setValue(newVal);
        } catch (e3) {
          return JSON.stringify({
            error: "Failed to set value: ".concat(e3)
          });
        }
      }
    }

    // UI ping: player position + reselect clip
    try {
      
      var pos = sequence.getPlayerPosition();
      
      sequence.setPlayerPosition(pos);
    } catch (e4) {
      // non-critical
    }
    try {
      
      sequence.setSelection([trackItem]);
    } catch (e5) {
      // non-critical
    }
    return JSON.stringify({
      ok: true
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Gets a single MOGRT property value by name (for readback/validation)
 * @param templateId - Template ID (unused)
 * @param propertyName - Display name or match name of the property
 * @returns JSON string with property value
 */
var getMogrtProperty = function getMogrtProperty(templateId, propertyName) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    
    var trackItem = selection[0];
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }

    // Find parameter by displayName
    
    var param = properties.getParamForDisplayName(propertyName);

    // If not found by displayName, try searching by matchName
    if (!param) {
      
      var numProps = properties.numItems || properties.length || 0;
      for (var i = 0; i < numProps; i++) {
        try {
          
          var candidate = properties[i] || properties.getItemAt(i);
          
          if (candidate && (candidate.matchName === propertyName || candidate.displayName === propertyName)) {
            param = candidate;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    if (!param) {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" not found")
      });
    }

    
    var value = param.getValue();
    return JSON.stringify({
      success: true,
      propertyName: propertyName,
      value: value
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Safe version of getMogrtProperty that returns hex strings for color values
 * to avoid JS Number precision loss for values > 2^53
 * @param templateId - Template ID (unused)
 * @param propertyName - Property display name or matchName
 * @returns JSON with valueType and valueHexString for colors, or regular value for others
 */
var getMogrtPropertySafe = function getMogrtPropertySafe(templateId, propertyName) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    
    var trackItem = selection[0];
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }

    // Find parameter by displayName
    
    var param = properties.getParamForDisplayName(propertyName);

    // If not found by displayName, try searching by matchName
    if (!param) {
      
      var numProps = properties.numItems || properties.length || 0;
      for (var i = 0; i < numProps; i++) {
        try {
          
          var candidate = properties[i] || properties.getItemAt(i);
          
          if (candidate && (candidate.matchName === propertyName || candidate.displayName === propertyName)) {
            param = candidate;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    if (!param) {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" not found")
      });
    }

    
    var rawValue = param.getValue();
    
    var valueType = _typeof(rawValue);

    // Check if this is a color property
    
    var displayName = param.displayName || "";
    
    var matchName = param.matchName || "";
    var isColor = valueType === "number" && (displayName.toLowerCase().includes("color") || matchName.toLowerCase() === "adbe color control");
    if (isColor && typeof rawValue === "number") {
      // Return as hex string to avoid precision loss
      // Check if value exceeds 32-bit (64-bit color)
      var is64Bit = rawValue > 0xFFFFFFFF || rawValue < 0;
      var valueHexString;
      if (is64Bit) {
        // 64-bit: convert to hex string (16 chars, no 0x prefix)
        // Use string manipulation to avoid precision loss
        var absValue = Math.abs(rawValue);
        // For very large numbers, use toString with base 16
        var hexStr = absValue.toString(16).toUpperCase();
        valueHexString = hexStr.padStart(16, "0");
      } else {
        // 32-bit: convert to hex string (8 chars, no 0x prefix)
        var v32 = rawValue >>> 0;
        valueHexString = v32.toString(16).toUpperCase().padStart(8, "0");
      }
      return JSON.stringify({
        success: true,
        propertyName: propertyName,
        valueType: "color",
        valueHexString: valueHexString,
        is64Bit: is64Bit,
        rawValue: rawValue // Keep for backward compatibility, but use valueHexString
      });
    }

    // For non-color properties, return as before
    return JSON.stringify({
      success: true,
      propertyName: propertyName,
      valueType: valueType,
      value: rawValue
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};
var setMogrtProperty = function setMogrtProperty(templateId, propertyName, value, meta) {
  // A) Абсолютный version marker
  var JSX_BUILD_FP = "JSX_SETMOGRT_V6_2026_02_01_1800";

  // Get sequence dimensions for point/scale conversion
  var compWidth = 1920; // Default to Full HD
  var compHeight = 1080;
  try {
    
    if (app.project && app.project.activeSequence) {
      
      var sequence = app.project.activeSequence;
      
      if (sequence && sequence.getSequenceSettings) {
        
        var settings = sequence.getSequenceSettings();
        
        if (settings && settings.videoFrameWidth && settings.videoFrameHeight) {
          
          compWidth = settings.videoFrameWidth;
          
          compHeight = settings.videoFrameHeight;
        }
      }
    }
  } catch (e) {
    // Fallback to default if we can't get sequence settings
  }

  // Helper: проверка массива (ExtendScript не имеет __isArray)
  function isArray(obj) {
    return obj && _typeof(obj) === "object" && obj.length !== undefined && typeof obj.length === "number";
  }

  // A2) Helper: parse MOGRT TextDocument (double-encoded)
  function parseMogrtTextDocument(raw) {
    var s = String(raw);
    var rawIn = s;
    var format = "unknown";
    var doc = null;

    // Попробуй JSON.parse(s) → lvl1
    try {
      var lvl1 = JSON.parse(s);

      // если typeof lvl1 === "string" → JSON.parse(lvl1) → lvl2 (это doc)
      if (typeof lvl1 === "string") {
        try {
          doc = JSON.parse(lvl1);
          format = "double";
        } catch (e) {
          return {
            ok: false,
            reason: "lvl1_string_not_json",
            rawIn: rawIn,
            lvl1: lvl1
          };
        }
      }
      // если typeof lvl1 === "object" → это doc
      else if (_typeof(lvl1) === "object" && lvl1 !== null) {
        doc = lvl1;
        format = "single";
      } else {
        return {
          ok: false,
          reason: "lvl1_not_string_or_object",
          rawIn: rawIn,
          lvl1: lvl1
        };
      }
    } catch (e) {
      // Если первый parse упал — попробуй парсить s как будто это уже {...} без внешних кавычек
      try {
        var sTrimmed = s.replace(/^\s+|\s+$/g, "");
        if (sTrimmed && sTrimmed.length > 0 && sTrimmed.charAt(0) === "{") {
          doc = JSON.parse(sTrimmed);
          format = "rawObject";
        } else {
          return {
            ok: false,
            reason: "raw_not_json_and_not_object_string",
            rawIn: rawIn
          };
        }
      } catch (e2) {
        return {
          ok: false,
          reason: "all_parse_attempts_failed",
          rawIn: rawIn,
          error: String(e2)
        };
      }
    }
    if (!doc || _typeof(doc) !== "object") {
      return {
        ok: false,
        reason: "doc_not_object",
        rawIn: rawIn,
        doc: doc,
        format: format
      };
    }
    return {
      ok: true,
      doc: doc,
      format: format,
      rawIn: rawIn
    };
  }

  // A2) Helper: serialize MOGRT TextDocument (must remain in same format)
  function serializeMogrtTextDocument(doc, format) {
    if (format === "double") {
      return JSON.stringify(JSON.stringify(doc));
    } else if (format === "single") {
      return JSON.stringify(doc);
    } else if (format === "rawObject") {
      return JSON.stringify(doc);
    } else {
      // Default to double for safety
      return JSON.stringify(JSON.stringify(doc));
    }
  }

  // 1) Жестко отличить styles payload от текста ДО любых изменений doc
  var incomingStr;
  if (typeof value === "string") {
    incomingStr = value;
  } else if (_typeof(value) === "object" && value !== null) {
    incomingStr = JSON.stringify(value);
  } else {
    incomingStr = String(value);
  }
  var trimmed = incomingStr.replace(/^\s+|\s+$/g, "");
  var payload = null;
  var isStylesPayload = false;

  // ДО JSON.parse добавь быстрый детектор
  var looksLikeStyles = trimmed.indexOf('"__aapKind"') !== -1 && trimmed.indexOf('"textStyles"') !== -1;
  if (looksLikeStyles) {
    // Если looksLikeStyles: try parse JSON в payload
    try {
      payload = JSON.parse(trimmed);
      if (payload && _typeof(payload) === "object" && !(payload instanceof Array)) {
        if (payload.__aapKind === "textStyles" && payload.textStyles) {
          isStylesPayload = true;
        }
      }
    } catch (e) {
      // Если не удалось распарсить styles payload
      return JSON.stringify({
        success: false,
        message: "styles_payload_parse_fail",
        fingerprint: JSX_BUILD_FP,
        error: String(e)
      });
    }
  } else if (trimmed && trimmed.length > 0 && trimmed.charAt(0) === "{") {
    // Другой JSON объект (не styles)
    try {
      payload = JSON.parse(trimmed);
    } catch (e) {
      payload = null;
    }
  }
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence",
        fingerprint: JSX_BUILD_FP
      });
    }

    
    var _sequence = app.project.activeSequence;
    
    var selection = _sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline.",
        fingerprint: JSX_BUILD_FP
      });
    }

    // Get the first selected TrackItem (always get fresh reference)
    
    var trackItem = selection[0];

    // Verify it's a MOGRT clip using getMGTComponent()
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip",
        fingerprint: JSX_BUILD_FP
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found",
        fingerprint: JSX_BUILD_FP
      });
    }

    // Find parameter by displayName using getParamForDisplayName()
    
    var param = properties.getParamForDisplayName(propertyName);

    // If not found by displayName, try searching by matchName
    if (!param) {
      
      var numProps = properties.numItems || properties.length || 0;
      for (var i = 0; i < numProps; i++) {
        try {
          
          var candidate = properties[i] || properties.getItemAt(i);
          
          if (candidate && (candidate.matchName === propertyName || candidate.displayName === propertyName)) {
            param = candidate;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    if (!param) {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" not found"),
        fingerprint: JSX_BUILD_FP
      });
    }

    // Get current value before change (always get fresh)
    
    var currentValueBefore = param.getValue();

    // For color properties, detect if incoming value is an RGBA array
    var isColorProperty = false;
    var originalColorArray = null;
    if (meta && meta.propertyType === "color") {
      isColorProperty = true;
    } else {
      // Also check if property is a color by matchName
      
      if (param.matchName === "ADBE Color Control") {
        isColorProperty = true;
      }
    }

    // Check if this is a group container - groups are not editable
    if (typeof currentValueBefore === "string") {
      var _trimmed2 = String(currentValueBefore).replace(/^\s+|\s+$/g, "");
      var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(_trimmed2) && _trimmed2.charAt(0) !== "{") {
        // This is a group container UUID, not editable
        return JSON.stringify({
          error: "Property \"".concat(propertyName, "\" is a group container and cannot be edited"),
          fingerprint: JSX_BUILD_FP
        });
      }
    }

    // Also check meta if provided
    if (meta && meta.valueType === "group") {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" is a group container and cannot be edited"),
        fingerprint: JSX_BUILD_FP
      });
    }

    // Parse / transform value
    var valueToSet = value;

    // Store raw result from styles branch (if it returns early)
    var rawStylesResult = null;

    // Special handling for Style parameters
    if (meta && meta.valueType === "style") {
      // Для style-параметров применяем stylesObject напрямую
      try {
        
        var currentValue = param.getValue();
        var _valueToSet = value;

        // Если value - JSON string, парсим его
        if (typeof value === "string") {
          try {
            var _trimmed3 = value.replace(/^\s+|\s+$/g, "");
            if (_trimmed3.charAt(0) === "{") {
              _valueToSet = JSON.parse(_trimmed3);
            }
          } catch (e) {
            // Оставляем как строку
          }
        }

        
        param.setValue(_valueToSet, true);
        return JSON.stringify({
          success: true,
          message: "style_applied",
          fingerprint: JSX_BUILD_FP,
          valueBefore: JSON.stringify(currentValue),
          valueAfter: JSON.stringify(_valueToSet)
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          message: "style_apply_failed",
          fingerprint: JSX_BUILD_FP,
          error: String(error)
        });
      }
    }

    // Special handling for TextDocument JSON: patch text and/or textStyles fields
    if (meta && meta.valueType === "textDocument") {
      // B) Styles-ветка должна быть первой и должна hard-stop
      if (isStylesPayload) {
        
        var raw = param.getValue();
        var parsed = parseMogrtTextDocument(raw);
        if (!parsed.ok) {
          return JSON.stringify({
            success: false,
            message: "parse_fail",
            fingerprint: JSX_BUILD_FP,
            parse: parsed
          });
        }
        var doc = parsed.doc;
        var s = payload.textStyles;

        // B) Сохрани beforeText = doc.textEditValue
        var beforeText = doc.textEditValue;
        var fontBefore = doc.fontEditValue && isArray(doc.fontEditValue) ? doc.fontEditValue[0] : undefined;
        var sizeBefore = doc.fontSizeEditValue && isArray(doc.fontSizeEditValue) ? doc.fontSizeEditValue[0] : undefined;
        var boldBefore = doc.fontFSBoldValue && isArray(doc.fontFSBoldValue) ? doc.fontFSBoldValue[0] : undefined;
        var italicBefore = doc.fontFSItalicValue && isArray(doc.fontFSItalicValue) ? doc.fontFSItalicValue[0] : undefined;
        var allCapsBefore = doc.fontFSAllCapsValue && isArray(doc.fontFSAllCapsValue) ? doc.fontFSAllCapsValue[0] : undefined;
        var smallCapsBefore = doc.fontFSSmallCapsValue && isArray(doc.fontFSSmallCapsValue) ? doc.fontFSSmallCapsValue[0] : undefined;

        // PATCH только существующие поля
        if (doc.fontEditValue && doc.capPropFontEdit !== false && s.fontFamily != null) {
          doc.fontEditValue[0] = String(s.fontFamily);
        }
        if (doc.fontSizeEditValue && doc.capPropFontSizeEdit !== false && s.fontSize != null) {
          doc.fontSizeEditValue[0] = Number(s.fontSize);
        }
        if (doc.capPropFontFauxStyleEdit !== false) {
          if (doc.fontFSBoldValue && s.fontBold != null) {
            doc.fontFSBoldValue[0] = !!s.fontBold;
          }
          if (doc.fontFSItalicValue && s.fontItalic != null) {
            doc.fontFSItalicValue[0] = !!s.fontItalic;
          }
          if (doc.fontFSAllCapsValue && s.fontAllCaps != null) {
            doc.fontFSAllCapsValue[0] = !!s.fontAllCaps;
          }
          if (doc.fontFSSmallCapsValue && s.fontSmallCaps != null) {
            doc.fontFSSmallCapsValue[0] = !!s.fontSmallCaps;
          }
        }
        var fontAfter = doc.fontEditValue && isArray(doc.fontEditValue) ? doc.fontEditValue[0] : undefined;
        var sizeAfter = doc.fontSizeEditValue && isArray(doc.fontSizeEditValue) ? doc.fontSizeEditValue[0] : undefined;
        var boldAfter = doc.fontFSBoldValue && isArray(doc.fontFSBoldValue) ? doc.fontFSBoldValue[0] : undefined;
        var italicAfter = doc.fontFSItalicValue && isArray(doc.fontFSItalicValue) ? doc.fontFSItalicValue[0] : undefined;
        var allCapsAfter = doc.fontFSAllCapsValue && isArray(doc.fontFSAllCapsValue) ? doc.fontFSAllCapsValue[0] : undefined;
        var smallCapsAfter = doc.fontFSSmallCapsValue && isArray(doc.fontFSSmallCapsValue) ? doc.fontFSSmallCapsValue[0] : undefined;

        // HARD ABORT: если doc.textEditValue !== beforeText → вернуть success:false и НЕ setValue
        if (doc.textEditValue !== beforeText) {
          return JSON.stringify({
            success: false,
            message: "STYLE_BRANCH_TOUCHED_TEXT_ABORT",
            fingerprint: JSX_BUILD_FP,
            beforeText: beforeText,
            afterText: doc.textEditValue
          });
        }

        // serialized = serializeMogrtTextDocument(doc)
        var serialized = serializeMogrtTextDocument(doc, parsed.format);
        
        param.setValue(serialized, true);

        // return {success:true, message:"styles_patched", fingerprint, debug:{...}}
        return JSON.stringify({
          success: true,
          message: "styles_patched",
          fingerprint: JSX_BUILD_FP,
          debug: {
            beforeText: beforeText,
            afterText: doc.textEditValue,
            fontBefore: fontBefore,
            fontAfter: fontAfter,
            sizeBefore: sizeBefore,
            sizeAfter: sizeAfter,
            boldBefore: boldBefore,
            boldAfter: boldAfter,
            italicBefore: italicBefore,
            italicAfter: italicAfter,
            allCapsBefore: allCapsBefore,
            allCapsAfter: allCapsAfter,
            smallCapsBefore: smallCapsBefore,
            smallCapsAfter: smallCapsAfter
          }
        });
      }

      // C) Любой другой JSON object (payload !== null) должен return unsupported_json_payload и НЕ менять param
      if (payload !== null) {
        return JSON.stringify({
          success: false,
          message: "unsupported_json_payload",
          fingerprint: JSX_BUILD_FP
        });
      }

      // Check if incoming is a composite JSON string (for composite params)
      // This happens when UI sends the full JSON object as a string (not wrapped in __aapKind)
      if (trimmed && trimmed.length > 0 && trimmed.charAt(0) === "{") {
        try {
          var incomingParsed = JSON.parse(trimmed);

          // Check if it's a composite param (has both textEditValue and style fields)
          if (incomingParsed && _typeof(incomingParsed) === "object" && incomingParsed.textEditValue !== undefined && (incomingParsed.fontEditValue !== undefined || incomingParsed.fontSizeEditValue !== undefined || incomingParsed.fontFSBoldValue !== undefined)) {
            // This is a composite param update - apply it directly
            
            var raw = param.getValue();
            var parsed = parseMogrtTextDocument(raw);
            if (!parsed.ok) {
              // If parsing fails, try setting the JSON string directly
              
              param.setValue(trimmed, true);
              return JSON.stringify({
                success: true,
                message: "composite_json_applied",
                fingerprint: JSX_BUILD_FP
              });
            }

            // Parse succeeded - merge styles into existing doc
            var doc = parsed.doc;
            var beforeText = doc.textEditValue;
            var fontBefore = doc.fontEditValue && isArray(doc.fontEditValue) ? doc.fontEditValue[0] : undefined;
            var sizeBefore = doc.fontSizeEditValue && isArray(doc.fontSizeEditValue) ? doc.fontSizeEditValue[0] : undefined;

            // Apply style fields from incomingParsed (only if arrays exist)
            if (incomingParsed.fontEditValue && __isArray(incomingParsed.fontEditValue) && doc.fontEditValue && __isArray(doc.fontEditValue) && doc.fontEditValue.length > 0) {
              doc.fontEditValue[0] = String(incomingParsed.fontEditValue[0]);
            }
            if (incomingParsed.fontSizeEditValue && __isArray(incomingParsed.fontSizeEditValue) && doc.fontSizeEditValue && __isArray(doc.fontSizeEditValue) && doc.fontSizeEditValue.length > 0) {
              doc.fontSizeEditValue[0] = Number(incomingParsed.fontSizeEditValue[0]);
            }
            if (incomingParsed.fontFSBoldValue && __isArray(incomingParsed.fontFSBoldValue) && doc.fontFSBoldValue && __isArray(doc.fontFSBoldValue) && doc.fontFSBoldValue.length > 0) {
              doc.fontFSBoldValue[0] = !!incomingParsed.fontFSBoldValue[0];
            }
            if (incomingParsed.fontFSItalicValue && __isArray(incomingParsed.fontFSItalicValue) && doc.fontFSItalicValue && __isArray(doc.fontFSItalicValue) && doc.fontFSItalicValue.length > 0) {
              doc.fontFSItalicValue[0] = !!incomingParsed.fontFSItalicValue[0];
            }
            if (incomingParsed.fontFSAllCapsValue && __isArray(incomingParsed.fontFSAllCapsValue) && doc.fontFSAllCapsValue && __isArray(doc.fontFSAllCapsValue) && doc.fontFSAllCapsValue.length > 0) {
              doc.fontFSAllCapsValue[0] = !!incomingParsed.fontFSAllCapsValue[0];
            }
            if (incomingParsed.fontFSSmallCapsValue && __isArray(incomingParsed.fontFSSmallCapsValue) && doc.fontFSSmallCapsValue && __isArray(doc.fontFSSmallCapsValue) && doc.fontFSSmallCapsValue.length > 0) {
              doc.fontFSSmallCapsValue[0] = !!incomingParsed.fontFSSmallCapsValue[0];
            }

            // CRITICAL: Never change textEditValue
            if (doc.textEditValue !== beforeText) {
              doc.textEditValue = beforeText; // Restore
            }
            var fontAfter = doc.fontEditValue && isArray(doc.fontEditValue) ? doc.fontEditValue[0] : undefined;
            var sizeAfter = doc.fontSizeEditValue && isArray(doc.fontSizeEditValue) ? doc.fontSizeEditValue[0] : undefined;
            var serialized = serializeMogrtTextDocument(doc, parsed.format);
            
            param.setValue(serialized, true);
            return JSON.stringify({
              success: true,
              message: "composite_styles_applied",
              fingerprint: JSX_BUILD_FP,
              debug: {
                beforeText: beforeText,
                afterText: doc.textEditValue,
                fontBefore: fontBefore,
                fontAfter: fontAfter,
                sizeBefore: sizeBefore,
                sizeAfter: sizeAfter
              }
            });
          } else {
            // It's JSON but not a composite param - refuse it
            return JSON.stringify({
              success: false,
              message: "REFUSED_JSON_AS_TEXT",
              fingerprint: JSX_BUILD_FP
            });
          }
        } catch (e) {
          // Not valid JSON - refuse it
          return JSON.stringify({
            success: false,
            message: "REFUSED_JSON_AS_TEXT",
            fingerprint: JSX_BUILD_FP
          });
        }
      }

      // D) Text ветка (payload === null) - только реальные plain string
      
      var rawText = param.getValue();
      var parseText = parseMogrtTextDocument(rawText);
      if (!parseText.ok) {
        return JSON.stringify({
          success: false,
          message: "parse_fail",
          fingerprint: JSX_BUILD_FP,
          parse: parseText
        });
      }
      var docText = parseText.doc;

      // D) doc.textEditValue = incomingStr (строка, не JSON)
      if (docText.textEditValue !== undefined) {
        docText.textEditValue = incomingStr;
      } else if (docText.plainText !== undefined) {
        docText.plainText = incomingStr;
      } else if (docText.text !== undefined) {
        docText.text = incomingStr;
      } else if (docText.textDocument && _typeof(docText.textDocument) === "object" && docText.textDocument.text !== undefined) {
        docText.textDocument.text = incomingStr;
      } else {
        // Fallback: try setTextIntoJson
        var updated = setTextIntoJson(docText, incomingStr);
        // Copy properties from updated to docText
        for (var key in updated) {
          if (updated.hasOwnProperty(key)) {
            docText[key] = updated[key];
          }
        }
      }

      // D) param.setValue(serialize..., true)
      var serializedText = serializeMogrtTextDocument(docText, parseText.format);
      
      param.setValue(serializedText, true);

      // D) return {success:true, message:"text_updated", fingerprint:JSX_BUILD_FP}
      return JSON.stringify({
        success: true,
        message: "text_updated",
        fingerprint: JSX_BUILD_FP
      });
    } else if (typeof currentValueBefore === "string" && typeof value === "string") {
      // Legacy handling for non-meta textDocument detection
      var rawStr = currentValueBefore.toString();
      var rawTrimmed = rawStr.replace(/^\s+|\s+$/g, "");
      if (rawTrimmed.charAt(0) === "{") {
        try {
          var obj = JSON.parse(rawTrimmed);
          var maybeText = extractTextFromJson(obj);
          if (maybeText !== null) {
            var _updated = setTextIntoJson(obj, value);
            valueToSet = JSON.stringify(_updated);
          } else {
            valueToSet = value;
          }
        } catch (e) {
          valueToSet = value;
        }
      }
    }

    // Generic string parsing for non-TextDocument values
    // CRITICAL: For color properties, NEVER parse arrays from strings
    if (!isColorProperty && typeof valueToSet === 'string' && valueToSet === value) {
      var _trimmed4 = valueToSet.toString().replace(/^\s+|\s+$/g, "");
      if (_trimmed4.startsWith('[') || _trimmed4.startsWith('{')) {
        try {
          valueToSet = JSON.parse(_trimmed4);
        } catch (e) {
          valueToSet = valueToSet;
        }
      } else if (_trimmed4 === 'true') {
        valueToSet = true;
      } else if (_trimmed4 === 'false') {
        valueToSet = false;
      } else if (/^-?\d+\.?\d*$/.test(_trimmed4)) {
        var numValue = Number(_trimmed4);
        if (numValue === numValue) {
          valueToSet = numValue;
        }
      }
    }

    // Handle checkbox: Premiere sometimes expects 0/1 instead of true/false
    
    if (typeof valueToSet === 'boolean') {
      
      var currentType = _typeof(currentValueBefore);
      if (currentType === 'number' && (currentValueBefore === 0 || currentValueBefore === 1)) {
        valueToSet = valueToSet ? 1 : 0;
      }
    }

    // COLOR HANDLING
    // CRITICAL: Panel should have already converted RGBA arrays to packed numbers
    // This function should NEVER receive arrays for color properties
    // If we receive an array, it's an error - reject it
    if (isColorProperty) {
      
      if (isArray(valueToSet)) {
        
        if (typeof debugLog === "function") {
          
          debugLog("[COLOR ERROR] \"".concat(propertyName, "\": Received array for color parameter. Panel should have converted to number. Array: ").concat(JSON.stringify(valueToSet)));
        }
        return JSON.stringify({
          error: "Illegal Parameter type: Color parameters must be numbers, not arrays. Panel should convert RGBA arrays to packed integers before calling setMogrtProperty.",
          fingerprint: JSX_BUILD_FP
        });
      }

      // Ensure value is a number within safe 32-bit range
      if (typeof valueToSet !== "number") {
        
        if (typeof debugLog === "function") {
          
          debugLog("[COLOR ERROR] \"".concat(propertyName, "\": Received non-number for color: ").concat(_typeof(valueToSet), ", value=").concat(JSON.stringify(valueToSet)));
        }
        return JSON.stringify({
          error: "Illegal Parameter type: Color parameters must be numbers, not ".concat(_typeof(valueToSet)),
          fingerprint: JSX_BUILD_FP
        });
      }

      // Clamp to 32-bit unsigned range
      var _numValue = Number(valueToSet);
      if (_numValue < 0 || _numValue > 0xFFFFFFFF) {
        valueToSet = (_numValue & 0xFFFFFFFF) >>> 0;
        
        if (typeof debugLog === "function") {
          
          debugLog("[COLOR WARN] \"".concat(propertyName, "\": Clamped value to 32-bit range: ").concat(valueToSet, " (0x").concat(valueToSet.toString(16).toUpperCase().padStart(8, "0"), ")"));
        }
      }
    }

    // Convert Position/Scale from pixels/percent back to normalized (0-1) for MOGRT
    var isPosition = propertyName && propertyName.toLowerCase().indexOf("position") !== -1;
    var isScale = propertyName && propertyName.toLowerCase().indexOf("scale") !== -1;

    
    if ((isPosition || isScale) && valueToSet instanceof Array && valueToSet.length === 2) {
      // Convert from pixels/percent to normalized (0-1)
      if (isPosition) {
        // Position: convert pixels to normalized
        valueToSet = [valueToSet[0] / compWidth, valueToSet[1] / compHeight];
      } else if (isScale) {
        // Scale: convert pixels/percent to normalized
        // Reverse of: normalized * compSize = pixels
        valueToSet = [valueToSet[0] / compWidth, valueToSet[1] / compHeight];
      }
    }

    // For non-color array properties (e.g. Point), make sure we pass the same length
    // NOTE: Color properties are now integers, not arrays, so skip this check for colors
    if (!isColorProperty) {
      
      if (isArray(currentValueBefore) && isArray(valueToSet)) {
        
        var targetLen = currentValueBefore.length;
        
        if (valueToSet.length !== targetLen) {
          // Truncate or pad with existing components to match expected length
          var adjusted = [];
          for (var _i2 = 0; _i2 < targetLen; _i2++) {
            
            adjusted[_i2] = _i2 < valueToSet.length ? valueToSet[_i2] : currentValueBefore[_i2] || 0;
          }
          valueToSet = adjusted;
        }
      }
    }

    // Set value - try with second parameter first (true = create keyframe if time-varying)
    var setSuccess = false;
    var setError = null;
    try {
      
      param.setValue(valueToSet, true);
      setSuccess = true;
    } catch (e1) {
      setError = e1;
      try {
        
        param.setValue(valueToSet, false);
        setSuccess = true;
      } catch (e2) {
        setError = e2;
        try {
          
          param.setValue(valueToSet);
          setSuccess = true;
        } catch (e3) {
          setError = e3;
          // All setValue attempts failed
          return JSON.stringify({
            error: "Failed to set value: ".concat(e3),
            details: String(e3)
          });
        }
      }
    }
    if (!setSuccess) {
      return JSON.stringify({
        error: "Failed to set value",
        details: String(setError)
      });
    }

    // Verify value was set
    
    var finalValue = param.getValue();

    // For TextDocument, verify the text was actually updated
    if (meta && meta.valueType === "textDocument") {
      try {
        var finalStr = String(finalValue);
        if (finalStr.charAt(0) === "{") {
          var finalObj = JSON.parse(finalStr);
          var finalText = extractTextFromJson(finalObj);
          if (finalText !== String(value)) {
            // TextDocument text mismatch (non-critical)
          }
        }
      } catch (e) {
        // Non-critical verification
      }
    }

    // Force UI update: ping player position to refresh Essential Graphics panel
    try {
      
      var currentPos = _sequence.getPlayerPosition();
      
      _sequence.setPlayerPosition(currentPos);
    } catch (e) {
      // Non-critical, continue
    }

    // Also re-select the clip to ensure UI updates
    try {
      
      _sequence.setSelection([trackItem]);
    } catch (e) {
      // Non-critical
    }

    // B) Bridge/Wrapper - прокинь raw JSX return в resultJson
    var rawResult = rawStylesResult || null;
    var rawParsed = null;
    if (rawResult) {
      try {
        rawParsed = JSON.parse(rawResult);
      } catch (e) {
        rawParsed = null;
      }
    }

    // For colors, add decoded values to help debug
    var colorDebug = null;
    if (isColorProperty && originalColorArray && originalColorArray.length >= 3) {
      try {
        // Decode using argbIntToRgba for standard ARGB format
        var numBefore = typeof currentValueBefore === "number" ? Number(currentValueBefore) : 0;
        var numAfter = typeof finalValue === "number" ? Number(finalValue) : 0;
        var decodedBeforeRGBA = numBefore <= 0xFFFFFFFF ? argbIntToRgba(numBefore) : [0, 0, 0, 1];
        var decodedAfterRGBA = numAfter <= 0xFFFFFFFF ? argbIntToRgba(numAfter) : [0, 0, 0, 1];
        colorDebug = {
          uiRGBA: originalColorArray,
          packedSentNumber: String(valueToSet),
          packedSentNumberHex: "0x" + Number(valueToSet).toString(16).toUpperCase().padStart(8, "0"),
          rawPremiereNumber: String(currentValueBefore),
          decodedRGBA: decodedAfterRGBA,
          beforeRGBA: decodedBeforeRGBA
        };
      } catch (e) {
        // Ignore decode errors
      }
    }
    var response = {
      success: true,
      message: "Property updated",
      valueBefore: JSON.stringify(currentValueBefore),
      valueAfter: JSON.stringify(finalValue),
      valueExpected: JSON.stringify(valueToSet),
      fingerprint: JSX_BUILD_FP
    };
    if (colorDebug) {
      response.colorDebug = colorDebug;
    }
    return JSON.stringify(response);
  } catch (error) {
    return JSON.stringify({
      error: "ERR: " + error.toString(),
      fingerprint: JSX_BUILD_FP
    });
  }
};

/**
 * Sets MOGRT color property from hex string (supports 32-bit and 64-bit colors)
 * This avoids precision loss when setting large color values
 * @param templateId - Template ID (unused)
 * @param propertyName - Property display name or matchName
 * @param hexString - Hex string (without 0x prefix, e.g. "FFF0AF24" or "0100FF00FF00FF00")
 * @returns JSON string with success or error
 */
var setMogrtColorFromHex = function setMogrtColorFromHex(templateId, propertyName, hexString) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    
    var trackItem = selection[0];
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }

    // Find parameter by displayName
    
    var param = properties.getParamForDisplayName(propertyName);

    // If not found by displayName, try searching by matchName
    if (!param) {
      
      var numProps = properties.numItems || properties.length || 0;
      for (var i = 0; i < numProps; i++) {
        try {
          
          var candidate = properties[i] || properties.getItemAt(i);
          
          if (candidate && (candidate.matchName === propertyName || candidate.displayName === propertyName)) {
            param = candidate;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    if (!param) {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" not found")
      });
    }

    // Parse hex string to number
    // Remove 0x prefix if present
    var cleanHex = hexString.replace(/^0x/i, "").toUpperCase();
    var is64Bit = cleanHex.length === 16;
    var valueToSet;
    if (is64Bit) {
      // 64-bit: parse as BigInt equivalent (but ExtendScript doesn't have BigInt)
      // For 64-bit, we need to handle it carefully
      // Since ExtendScript Number can't represent > 2^53 precisely,
      // we'll try to set it as a number, but it may lose precision
      // The API might accept it anyway if it's stored internally as 64-bit
      // Try parsing as two 32-bit parts and reconstructing
      var highHex = cleanHex.substring(0, 8);
      var lowHex = cleanHex.substring(8, 16);
      var high = parseInt(highHex, 16);
      var low = parseInt(lowHex, 16);
      // Combine: high * 2^32 + low
      // But this will lose precision if high > 2^21
      // For now, try setting as a large number
      valueToSet = high * 4294967296 + low;
    } else {
      // 32-bit: parse normally
      valueToSet = parseInt(cleanHex, 16);
    }

    // Set value
    var setSuccess = false;
    try {
      
      param.setValue(valueToSet, true);
      setSuccess = true;
    } catch (e1) {
      try {
        
        param.setValue(valueToSet, false);
        setSuccess = true;
      } catch (e2) {
        try {
          
          param.setValue(valueToSet);
          setSuccess = true;
        } catch (e3) {
          return JSON.stringify({
            error: "Failed to set color from hex: ".concat(e3),
            details: String(e3),
            hexString: hexString,
            parsedValue: valueToSet,
            is64Bit: is64Bit
          });
        }
      }
    }

    // Verify value was set
    
    var finalValue = param.getValue();
    return JSON.stringify({
      success: true,
      hexString: hexString,
      parsedValue: valueToSet,
      readbackValue: finalValue,
      is64Bit: is64Bit,
      fingerprint: JSX_BUILD_FP
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString(),
      fingerprint: JSX_BUILD_FP
    });
  }
};

/**
 * Gets list of available fonts
 * Returns a list of common system fonts and Adobe fonts
 */
var getAvailableFonts = function getAvailableFonts() {
  try {
    // Common system fonts and Adobe fonts
    var fonts = ["Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Calibri", "Cambria", "Candara", "Comic Sans MS", "Consolas", "Constantia", "Corbel", "Courier New", "Franklin Gothic Medium", "Garamond", "Georgia", "Impact", "Lucida Console", "Lucida Sans Unicode", "Microsoft Sans Serif", "Palatino Linotype", "Segoe UI", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana", "Montserrat", "Montserrat-Bold", "Montserrat-SemiBold", "Montserrat-Light", "Montserrat-Medium", "Open Sans", "Open Sans Bold", "Roboto", "Roboto Bold", "Lato", "Lato Bold", "Oswald", "Playfair Display", "Raleway", "Source Sans Pro", "Ubuntu", "Helvetica", "Helvetica Neue", "Futura", "Gill Sans", "Baskerville", "Bodoni", "Didot", "Minion Pro", "Myriad Pro", "Trajan Pro"];

    // Try to get fonts from Premiere Pro if available
    // Note: Premiere Pro doesn't expose a direct font list API in ExtendScript
    // So we use a curated list of common fonts

    return JSON.stringify({
      success: true,
      fonts: fonts.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      })
    });
  } catch (error) {
    return JSON.stringify({
      error: "Failed to get fonts: " + error.toString()
    });
  }
};

/**
 * Gets controller layer info (placeholder for compatibility)
 * In PR, we work with MOGRT parameters directly, not Controller Layer
 */
var getControllerLayerInfo = function getControllerLayerInfo(clip) {
  try {
    // In PR, we don't have Controller Layer concept
    // Instead, we'll work with MOGRT properties directly
    return JSON.stringify({
      error: "Controller Layer concept doesn't exist in Premiere Pro"
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Applies a MOGRT template to the active sequence
 * Minimal working implementation using importMGT()
 * @param mogrtPath - Full path to the .mogrt file
 * @param templateId - Template ID for tracking (unused in minimal version)
 * @returns JSON string with "OK" or "ERR: ..."
 */
var applyTemplateByPath = function applyTemplateByPath(mogrtPath, templateId) {
  try {
    // Check project
    
    if (!app.project) {
      return JSON.stringify({
        error: "ERR: No active project"
      });
    }
    
    var project = app.project;

    // Check sequence
    
    if (!project.activeSequence) {
      return JSON.stringify({
        error: "ERR: No active sequence"
      });
    }
    
    var sequence = project.activeSequence;

    // Check file exists
    var mogrtFile = new File(mogrtPath);
    if (!mogrtFile.exists) {
      return JSON.stringify({
        error: "ERR: File not found: " + mogrtPath
      });
    }

    // Convert path to native format (Windows backslashes)
    var nativePath = mogrtFile.fsName;

    // Get playhead position
    
    var playheadTime = sequence.getPlayerPosition();
    
    var playheadSeconds = playheadTime.seconds;
    
    var playheadTicks = playheadTime.ticks;

    // Helper function: Check if track is free at given time range (from MotionBro5)
    
    var checkTrackFree = function checkTrackFree(track, tStart, requiredFreeDuration, ignoreClip) {
      var tEnd = tStart + requiredFreeDuration;
      
      if (track.clips.length === 0) {
        return true;
      }
      
      for (var i = 0; i < track.clips.length; i++) {
        
        var _clip2 = track.clips[i];
        // Ignore the clip we just added
        
        if (ignoreClip && _clip2.projectItem && ignoreClip.projectItem &&
        
        _clip2.projectItem.nodeId === ignoreClip.projectItem.nodeId) {
          continue;
        }
        // Check if clip overlaps with time range
        
        if (!(_clip2.end.seconds <= tStart || _clip2.start.seconds >= tEnd)) {
          return false;
        }
      }
      return true;
    };

    // Helper function: Find free video track (from MotionBro5)
    
    var findVideoTrack = function findVideoTrack(startTrack, tStart, requiredFreeDuration, ignoreClip) {
      
      var videoTracks = sequence.videoTracks;
      
      for (var trackNum = startTrack; trackNum < videoTracks.numTracks; trackNum++) {
        
        var track = videoTracks[trackNum];
        if (checkTrackFree(track, tStart, requiredFreeDuration, ignoreClip)) {
          return trackNum;
        }
      }
      // If no free track found, return last track (will be created if needed)
      
      return videoTracks.numTracks;
    };

    // Step 1: Find initial track for importMGT (use large duration for initial check)
    var initialDuration = 350; // Large duration for initial check
    
    var initialVidTrack = findVideoTrack(0, playheadSeconds, initialDuration, null);
    
    var initialAudTrack = 0; // Use A1

    // Step 2: Import MOGRT using importMGT() - this adds to timeline
    
    var clip = sequence.importMGT(nativePath, playheadTime, initialVidTrack, initialAudTrack);
    if (!clip) {
      return JSON.stringify({
        error: "ERR: importMGT returned null"
      });
    }

    // Step 3: Find the imported clip on initial track
    
    var newClip = null;
    
    var initialTrack = sequence.videoTracks[initialVidTrack];
    
    for (var i = 0; i < initialTrack.clips.length; i++) {
      
      var candidateClip = initialTrack.clips[i];
      
      if (!candidateClip.projectItem) {
        continue;
      }
      
      if (Math.abs(candidateClip.start.seconds - playheadSeconds) < 0.02) {
        newClip = candidateClip;
        break;
      }
    }
    if (!newClip) {
      return JSON.stringify({
        error: "ERR: Could not find imported clip"
      });
    }

    // Step 7: Select the imported clip so it can be edited immediately
    try {
      
      sequence.setSelection([newClip]);
      
      $.writeln("[DEBUG applyTemplateByPath] Selected imported clip for editing");
    } catch (selectError) {
      // Non-critical: if selection fails, continue anyway
      
      $.writeln("[DEBUG applyTemplateByPath] Failed to select clip: ".concat(selectError.toString()));
    }

    // Step 4: Get actual clip duration
    
    var actualDuration = newClip.duration && newClip.duration.seconds ? newClip.duration.seconds : 0;
    if (actualDuration <= 0) {
      actualDuration = 10; // Default duration
    }

    // Step 5: Find desired track with actual duration, ignoring the clip we just added
    
    var desiredVidTrack = findVideoTrack(initialVidTrack, playheadSeconds, actualDuration, newClip);

    // Step 6: Move clip to desired track if needed (MotionBro5 method: overwriteClip + remove)
    
    if (desiredVidTrack > initialVidTrack) {
      
      var targetTrack = sequence.videoTracks[desiredVidTrack];
      
      if (targetTrack) {
        // MotionBro5 method: overwriteClip on target track, then remove from source
        
        targetTrack.overwriteClip(newClip.projectItem, playheadTicks);
        
        newClip.remove(0, 0);
        // Update newClip reference to the moved clip
        
        for (var _i3 = 0; _i3 < targetTrack.clips.length; _i3++) {
          
          var _candidateClip = targetTrack.clips[_i3];
          
          if (!_candidateClip.projectItem) {
            continue;
          }
          
          if (Math.abs(_candidateClip.start.seconds - playheadSeconds) < 0.02) {
            newClip = _candidateClip;
            break;
          }
        }
      }
    }

    // Step 7: Auto-trim clip based on "Clip Duration" parameter (for text packs)
    try {
      
      var mgtComponent = newClip.getMGTComponent();
      if (mgtComponent) {
        
        var properties = mgtComponent.properties;
        if (properties) {
          // Find "Clip Duration" parameter
          
          var clipDurationParam = properties.getParamForDisplayName("Clip Duration");
          if (!clipDurationParam) {
            // Try case-insensitive search
            
            var numProps = properties.numItems || properties.length || 0;
            for (var _i4 = 0; _i4 < numProps; _i4++) {
              
              var param = properties[_i4] || properties.getItemAt(_i4);
              if (param && param.displayName && param.displayName.toLowerCase().indexOf("clip duration") !== -1) {
                clipDurationParam = param;
                break;
              }
            }
          }
          if (clipDurationParam) {
            
            var clipDurationValue = clipDurationParam.getValue();
            if (typeof clipDurationValue === "number" && clipDurationValue > 0) {
              // Trim clip to Clip Duration value using seconds (like competitor does)
              
              var clipStartSeconds = newClip.start.seconds;
              var newEndSeconds = clipStartSeconds + clipDurationValue;

              // DEBUG: Log auto-trim attempt
              $.writeln("[DEBUG applyTemplateByPath] Auto-trimming clip: Clip Duration=".concat(clipDurationValue, "s, start=").concat(clipStartSeconds, "s, newEnd=").concat(newEndSeconds, "s"));

              // Set clip end time using seconds (like competitor does)
              try {
                
                newClip.end = newEndSeconds;
                
                $.writeln("[DEBUG applyTemplateByPath] Success: Set newClip.end. New end=".concat(newClip.end.seconds, "s"));
              } catch (e1) {
                
                $.writeln("[DEBUG applyTemplateByPath] Direct assignment failed: ".concat(e1.toString()));
                // Fallback: Create Time object from seconds
                try {
                  
                  var clipEnd = new Time();
                  
                  clipEnd.seconds = newEndSeconds;
                  
                  newClip.end = clipEnd;
                  
                  $.writeln("[DEBUG applyTemplateByPath] Success: Used Time object. New end=".concat(newClip.end.seconds, "s"));
                } catch (e2) {
                  
                  $.writeln("[DEBUG applyTemplateByPath] Time object failed: ".concat(e2.toString()));
                  // Silently fail - non-critical
                }
              }
            }
          }
        }
      }
    } catch (e) {
      // Non-critical: if auto-trim fails, continue anyway
      // The user can still manually set Clip Duration using the playhead button
    }
    return JSON.stringify({
      success: true,
      message: "OK"
    });
  } catch (error) {
    return JSON.stringify({
      error: "ERR: " + error.toString()
    });
  }
};

/**
 * Sets Clip Duration from playhead position and trims the clip
 * @param templateId - Template ID (unused)
 * @param propertyName - Property name (should be "Clip Duration")
 * @returns JSON string with success status and duration value
 */
var setClipDurationFromPlayhead = function setClipDurationFromPlayhead(templateId, propertyName) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    // Get the first selected TrackItem
    
    var trackItem = selection[0];

    // Get playhead position
    
    var playheadTime = sequence.getPlayerPosition();
    
    var playheadSeconds = playheadTime.seconds;
    
    var clipStartSeconds = trackItem.start.seconds;

    // Calculate duration from clip start to playhead
    var duration = playheadSeconds - clipStartSeconds;
    if (duration <= 0) {
      return JSON.stringify({
        error: "Playhead must be after clip start"
      });
    }

    // Set Clip Duration property value
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }

    // Find Clip Duration parameter
    
    var param = properties.getParamForDisplayName(propertyName);
    if (!param) {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" not found")
      });
    }

    // Set the value
    
    param.setValue(duration, true);

    // Trim the clip to match the duration (using seconds like competitor)
    var newEndSeconds = clipStartSeconds + duration;

    // DEBUG: Log trimming attempt
    $.writeln("[DEBUG setClipDurationFromPlayhead] Setting Duration=".concat(duration, "s, trimming clip to end=").concat(newEndSeconds, "s"));
    
    $.writeln("[DEBUG setClipDurationFromPlayhead] Current clip: start=".concat(trackItem.start.seconds, "s, end=").concat(trackItem.end.seconds, "s"));

    // Set clip end time using seconds (like competitor does)
    try {
      
      var oldEnd = trackItem.end.seconds;
      
      trackItem.end = newEndSeconds;
      
      var actualEnd = trackItem.end.seconds;
      
      $.writeln("[DEBUG setClipDurationFromPlayhead] Success: Set trackItem.end. oldEnd=".concat(oldEnd, "s, newEnd=").concat(actualEnd, "s, target=").concat(newEndSeconds, "s"));
    } catch (e1) {
      
      $.writeln("[DEBUG setClipDurationFromPlayhead] Direct assignment failed: ".concat(e1.toString()));
      // Fallback: Create Time object from seconds
      try {
        
        var clipEnd = new Time();
        
        clipEnd.seconds = newEndSeconds;
        
        trackItem.end = clipEnd;
        
        $.writeln("[DEBUG setClipDurationFromPlayhead] Success: Used Time object. New end=".concat(trackItem.end.seconds, "s"));
      } catch (e2) {
        
        $.writeln("[DEBUG setClipDurationFromPlayhead] Time object failed: ".concat(e2.toString()));
        return JSON.stringify({
          error: "Failed to trim clip: ".concat(e2.toString()),
          details: "duration: ".concat(duration, "s, clipStartSeconds: ").concat(clipStartSeconds, "s, newEndSeconds: ").concat(newEndSeconds, "s")
        });
      }
    }
    return JSON.stringify({
      success: true,
      duration: duration,
      message: "Clip Duration set and clip trimmed"
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Trims MOGRT clip to specified duration
 * @param templateId - Template ID (unused)
 * @param durationSeconds - Duration in seconds
 * @returns JSON string with success status
 */
var trimMogrtClip = function trimMogrtClip(templateId, durationSeconds) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    // Get the first selected TrackItem
    
    var trackItem = selection[0];
    if (durationSeconds <= 0) {
      return JSON.stringify({
        error: "Duration must be greater than 0"
      });
    }

    // Calculate clip end time using seconds (like competitor does)
    
    var clipStartSeconds = trackItem.start.seconds;
    var newEndSeconds = clipStartSeconds + durationSeconds;

    // DEBUG: Log trimming attempt
    $.writeln("[DEBUG trimMogrtClip] Trimming clip: duration=".concat(durationSeconds, "s, start=").concat(clipStartSeconds, "s, newEnd=").concat(newEndSeconds, "s"));
    
    $.writeln("[DEBUG trimMogrtClip] Current clip end=".concat(trackItem.end.seconds, "s"));

    // Set clip end time using seconds (like competitor does)
    try {
      
      var oldEnd = trackItem.end.seconds;
      
      trackItem.end = newEndSeconds;
      
      var actualEnd = trackItem.end.seconds;
      
      $.writeln("[DEBUG trimMogrtClip] Success: Set trackItem.end. oldEnd=".concat(oldEnd, "s, newEnd=").concat(actualEnd, "s, target=").concat(newEndSeconds, "s"));
    } catch (e1) {
      
      $.writeln("[DEBUG trimMogrtClip] Direct assignment failed: ".concat(e1.toString()));
      // Fallback: Create Time object from seconds
      try {
        
        var clipEnd = new Time();
        
        clipEnd.seconds = newEndSeconds;
        
        trackItem.end = clipEnd;
        
        $.writeln("[DEBUG trimMogrtClip] Success: Used Time object. New end=".concat(trackItem.end.seconds, "s"));
      } catch (e2) {
        
        $.writeln("[DEBUG trimMogrtClip] Time object failed: ".concat(e2.toString()));
        return JSON.stringify({
          error: "Failed to trim clip: ".concat(e2.toString()),
          details: "durationSeconds: ".concat(durationSeconds, ", clipStartSeconds: ").concat(clipStartSeconds, ", newEndSeconds: ").concat(newEndSeconds)
        });
      }
    }
    return JSON.stringify({
      success: true,
      duration: durationSeconds,
      message: "Clip trimmed successfully"
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Trims MOGRT clip to playhead position (simple version - just trims the clip, doesn't change Clip Duration)
 * @returns JSON string with success status
 */
var trimMogrtClipToPlayhead = function trimMogrtClipToPlayhead() {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    // Get the first selected TrackItem
    
    var trackItem = selection[0];

    // Get playhead position (absolute time on timeline)
    
    var playheadTime = sequence.getPlayerPosition();
    
    var playheadSeconds = playheadTime.seconds;

    // Get clip position on timeline (absolute time)
    
    var clipStartSeconds = trackItem.start.seconds;

    // Calculate playhead position relative to clip start
    var playheadRelativeToClip = playheadSeconds - clipStartSeconds;

    // Check if playhead is after clip start (must be positive)
    if (playheadRelativeToClip <= 0) {
      return JSON.stringify({
        error: "Playhead must be after clip start. Playhead position relative to clip: " + playheadRelativeToClip.toFixed(3) + "s"
      });
    }

    // Duration is the playhead position relative to clip start
    var newDurationSeconds = playheadRelativeToClip;

    // Calculate new end position (in seconds) - absolute time on timeline
    var newEndSeconds = clipStartSeconds + newDurationSeconds;

    // DEBUG: Log current state
    $.writeln("[DEBUG trimMogrtClipToPlayhead] Timeline: clipStart=".concat(clipStartSeconds.toFixed(3), "s, playhead=").concat(playheadSeconds.toFixed(3), "s, relative=").concat(playheadRelativeToClip.toFixed(3), "s, duration=").concat(newDurationSeconds.toFixed(3), "s, newEnd=").concat(newEndSeconds.toFixed(3), "s"));
    
    $.writeln("[DEBUG trimMogrtClipToPlayhead] Current clip end=".concat(trackItem.end.seconds, "s"));

    // Method 1: Set end using seconds directly (like competitor does)
    var trimmed = false;
    try {
      
      var oldEnd = trackItem.end.seconds;
      
      trackItem.end = newEndSeconds;
      
      var actualEnd = trackItem.end.seconds;
      
      $.writeln("[DEBUG trimMogrtClipToPlayhead] Method 1: oldEnd=".concat(oldEnd, "s, newEnd=").concat(actualEnd, "s, target=").concat(newEndSeconds, "s"));
      if (Math.abs(actualEnd - newEndSeconds) < 0.001) {
        trimmed = true;
        
        $.writeln("[DEBUG trimMogrtClipToPlayhead] Success: Method 1 worked. New end=".concat(actualEnd, "s"));
      }
    } catch (e1) {
      
      $.writeln("[DEBUG trimMogrtClipToPlayhead] Method 1 exception: ".concat(e1.toString()));
    }

    // Method 2: Create Time object from seconds and assign
    if (!trimmed) {
      try {
        
        var _oldEnd = trackItem.end.seconds;
        
        var clipEnd = new Time();
        
        clipEnd.seconds = newEndSeconds;
        
        trackItem.end = clipEnd;
        
        var _actualEnd = trackItem.end.seconds;
        
        $.writeln("[DEBUG trimMogrtClipToPlayhead] Method 2: oldEnd=".concat(_oldEnd, "s, newEnd=").concat(_actualEnd, "s, target=").concat(newEndSeconds, "s"));
        if (Math.abs(_actualEnd - newEndSeconds) < 0.001) {
          trimmed = true;
          
          $.writeln("[DEBUG trimMogrtClipToPlayhead] Success: Method 2 worked. New end=".concat(_actualEnd, "s"));
        }
      } catch (e2) {
        
        $.writeln("[DEBUG trimMogrtClipToPlayhead] Method 2 exception: ".concat(e2.toString()));
      }
    }
    if (!trimmed) {
      return JSON.stringify({
        error: "Failed to trim clip: Could not set end. Current end=".concat(trackItem.end.seconds, "s, target=").concat(newEndSeconds, "s"),
        details: "playheadSeconds: ".concat(playheadSeconds, ", clipStartSeconds: ").concat(clipStartSeconds, ", newDurationSeconds: ").concat(newDurationSeconds)
      });
    }

    // Update "Clip Duration" parameter in MOGRT to match the new duration
    try {
      
      var mgtComponent = trackItem.getMGTComponent();
      if (mgtComponent) {
        
        var properties = mgtComponent.properties;
        if (properties) {
          // Find Clip Duration parameter
          
          var clipDurationParam = properties.getParamForDisplayName("Clip Duration");
          if (clipDurationParam) {
            // Set the Clip Duration value to match the trimmed duration
            
            clipDurationParam.setValue(newDurationSeconds, true);
            
            $.writeln("[DEBUG trimMogrtClipToPlayhead] Updated Clip Duration parameter to ".concat(newDurationSeconds, "s"));
          } else {
            
            $.writeln("[DEBUG trimMogrtClipToPlayhead] Clip Duration parameter not found, skipping update");
          }
        }
      }
    } catch (e3) {
      // Non-critical: log but don't fail
      
      $.writeln("[DEBUG trimMogrtClipToPlayhead] Failed to update Clip Duration parameter: ".concat(e3.toString()));
    }

    
    var newDuration = trackItem.end.seconds - trackItem.start.seconds;
    return JSON.stringify({
      success: true,
      duration: newDuration,
      message: "Clip trimmed to playhead position and Clip Duration updated"
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Gets the application name (for debugging)
 */
var getAppName = function getAppName() {
  try {
    
    if (typeof BridgeTalk !== "undefined" && BridgeTalk.appName) {
      
      return BridgeTalk.appName;
    }
    
    if (app && app.path) {
      
      var path = app.path;
      if (path.toLowerCase().indexOf("premiere") !== -1) {
        return "premierepro";
      }
    }
    return "unknown";
  } catch (error) {
    return "unknown";
  }
};

/**
 * Test color conversion by writing 4 test colors and reading them back
 * Tests: red [1,0,0,1], green [0,1,0,1], blue [0,0,1,1], white [1,1,1,1]
 * For each color, logs sent float, returned int, readback int, and decoded floats
 * @param propertyName - Name of color property to test (e.g., "Fill Color")
 * @returns JSON string with test results
 */
var testColorConversion = function testColorConversion(propertyName) {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }

    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected"
      });
    }

    
    var trackItem = selection[0];
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }

    // Find parameter
    
    var param = properties.getParamForDisplayName(propertyName);
    if (!param) {
      
      var numProps = properties.numItems || properties.length || 0;
      for (var i = 0; i < numProps; i++) {
        try {
          
          var candidate = properties[i] || properties.getItemAt(i);
          
          if (candidate && (candidate.matchName === propertyName || candidate.displayName === propertyName)) {
            param = candidate;
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    if (!param || !param.getValue || !param.setValue) {
      return JSON.stringify({
        error: "Property \"".concat(propertyName, "\" not found")
      });
    }

    // Test colors: red, green, blue, white
    var testColors = [{
      name: "red",
      rgba: [1, 0, 0, 1]
    }, {
      name: "green",
      rgba: [0, 1, 0, 1]
    }, {
      name: "blue",
      rgba: [0, 0, 1, 1]
    }, {
      name: "white",
      rgba: [1, 1, 1, 1]
    }];
    var results = [];

    
    var originalValue = param.getValue();
    var _loop = function _loop() {
      var testColor = _testColors[_i5];
      try {
        // Get current value to detect format
        
        var currentValue = param.getValue();
        var numValue = typeof currentValue === "string" ? parseFloat(currentValue) : Number(currentValue);
        var is64Bit = !isNaN(numValue) && numValue > 0xFFFFFFFF;
        var preferredFormat = is64Bit ? "16bit" : "8bit";

        // Encode using detected format
        var encodedValue = rgbaToARGBInt(testColor.rgba[0], testColor.rgba[1], testColor.rgba[2], testColor.rgba[3] || 1);

        // Write
        
        param.setValue(encodedValue, true);

        // Read back immediately
        
        var readbackValue = param.getValue();

        // Decode readback value
        var decoded = decodeMogrtColorToRGBA(readbackValue);

        // Calculate roundtrip error
        var error = decoded.rgba.map(function (v, i) {
          return Math.abs(v - testColor.rgba[i]);
        });
        var maxError = Math.max.apply(Math, _toConsumableArray(error));
        results.push({
          testColor: testColor.name,
          sentFloat: testColor.rgba,
          encodedValue: String(encodedValue),
          readbackValue: String(readbackValue),
          decodedRGBA: decoded.rgba,
          format: decoded.format,
          roundtripError: error,
          maxError: maxError,
          diagnostics: decoded.diagnostics
        });
      } catch (e) {
        results.push({
          testColor: testColor.name,
          error: String(e)
        });
      }
    };
    for (var _i5 = 0, _testColors = testColors; _i5 < _testColors.length; _i5++) {
      _loop();
    }

    // Restore original value
    try {
      
      param.setValue(originalValue, true);
    } catch (e) {
      // Ignore restore error
    }
    return JSON.stringify({
      ok: true,
      results: results
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * Debug helper: dumps raw getValue() for all MOGRT params
 * so we can inspect how Premiere exposes specific properties (e.g. Text)
 */
var debugSelectedMogrtRaw = function debugSelectedMogrtRaw() {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }
    
    var sequence = app.project.activeSequence;
    if (!sequence || !sequence.getSelection) {
      return JSON.stringify({
        error: "Sequence has no getSelection()"
      });
    }
    
    var sel = sequence.getSelection();
    
    if (!sel || sel.length === 0) {
      return JSON.stringify({
        error: "No TrackItem selected"
      });
    }
    
    var trackItem = sel[0];
    if (!trackItem || !trackItem.getMGTComponent) {
      return JSON.stringify({
        error: "Selected item has no getMGTComponent()"
      });
    }
    
    var mgt = trackItem.getMGTComponent();
    if (!mgt || !mgt.properties) {
      return JSON.stringify({
        error: "No MGT properties found"
      });
    }
    
    var props = mgt.properties;
    var out = [];
    
    var num = props.numItems || props.length || 0;
    for (var i = 0; i < num; i++) {
      try {
        
        var p = props[i] || props.getItemAt(i);
        if (!p || !p.displayName || !p.getValue) continue;
        
        var raw = p.getValue();
        out.push({
          
          displayName: p.displayName,
          
          matchName: p.matchName || "",
          raw: raw
        });
      } catch (e) {
        continue;
      }
    }
    return JSON.stringify({
      ok: true,
      props: out
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * 1) Implement a function listMogrtParamsDetailed() in ExtendScript
 * Returns ALL MOGRT parameters for the selected Essential Graphics/MOGRT clip
 * @returns JSON string with all parameters
 */
var listMogrtParamsDetailed = function listMogrtParamsDetailed() {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }
    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    
    var trackItem = selection[0];
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }
    var paramsList = [];
    
    var numProps = properties.numItems || properties.length || 0;
    for (var i = 0; i < numProps; i++) {
      try {
        
        var param = properties[i] || properties.getItemAt(i);
        if (!param) {
          continue;
        }

        
        var displayName = param.displayName || "";
        
        var matchName = param.matchName || "";
        
        var internalName = param.name || matchName || "";

        // Читаем значение максимально безопасно
        var currentValue = null;
        var currentValueStr = "";
        var isReadable = false;
        var readError = "";
        try {
          
          currentValue = param.getValue();
          currentValueStr = String(currentValue);
          // Ограничиваем длину для JSON
          if (currentValueStr.length > 500) {
            currentValueStr = currentValueStr.substring(0, 500) + "...[truncated]";
          }
          isReadable = true;
        } catch (e) {
          readError = String(e);
          currentValueStr = "UNREADABLE";
        }

        // Определяем тип
        var valueType = "unknown";
        if (!isReadable) {
          valueType = "unreadable";
        } else if (currentValue === null || currentValue === undefined) {
          valueType = "null";
        } else if (typeof currentValue === "string") {
          valueType = "string";
        } else if (typeof currentValue === "number") {
          valueType = "number";
        } else if (typeof currentValue === "boolean") {
          valueType = "boolean";
        } else {
          
          if (currentValue instanceof Array || currentValue.length !== undefined && typeof currentValue.length === "number") {
            valueType = "array";
          } else if (_typeof(currentValue) === "object") {
            valueType = "object";
          }
        }

        // Проверяем readOnly/disabled
        var isReadOnly = false;
        var isDisabled = false;
        try {
          
          if (param.isReadOnly !== undefined) {
            isReadOnly = !!param.isReadOnly;
          }
          
          if (param.isDisabled !== undefined) {
            isDisabled = !!param.isDisabled;
          }
        } catch (e) {
          // Игнорируем ошибки проверки readOnly/disabled
        }
        paramsList.push({
          index: i,
          displayName: displayName,
          internalName: internalName,
          matchName: matchName,
          valueType: valueType,
          isReadOnly: isReadOnly,
          isDisabled: isDisabled,
          currentValue: currentValue,
          currentValueStr: currentValueStr,
          isReadable: isReadable,
          readError: readError
        });
      } catch (e) {
        // Пропускаем параметр, который не удалось обработать
        continue;
      }
    }
    return JSON.stringify({
      ok: true,
      params: paramsList,
      totalCount: paramsList.length
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

/**
 * 1) Диагностическая функция inspectMogrtParams()
 * Получает список всех параметров MOGRT с их значениями и типами
 * @returns JSON string with params dump
 */
var inspectMogrtParams = function inspectMogrtParams() {
  try {
    
    if (!app.project || !app.project.activeSequence) {
      return JSON.stringify({
        error: "No active sequence"
      });
    }
    
    var sequence = app.project.activeSequence;
    
    var selection = sequence.getSelection();
    if (!selection || selection.length === 0) {
      return JSON.stringify({
        error: "No clip selected. Please select a MOGRT clip on timeline."
      });
    }

    
    var trackItem = selection[0];
    
    var mgtComponent = trackItem.getMGTComponent();
    if (!mgtComponent) {
      return JSON.stringify({
        error: "Selected clip is not a MOGRT clip"
      });
    }

    
    var properties = mgtComponent.properties;
    if (!properties) {
      return JSON.stringify({
        error: "MOGRT properties not found"
      });
    }
    var paramsDump = [];
    
    var numProps = properties.numItems || properties.length || 0;
    var _loop2 = function _loop2() {
        try {
          
          var param = properties[i] || properties.getItemAt(i);
          if (!param || !param.displayName) {
            return 0; // continue
          }

          
          var displayName = param.displayName || "";
          
          var matchName = param.matchName || "";

          // Читаем значение максимально безопасно
          var rawValue = null;
          var valueStr = "";
          var isReadable = false;
          var readError = "";
          try {
            
            rawValue = param.getValue();
            valueStr = String(rawValue);
            isReadable = true;
          } catch (e) {
            readError = String(e);
            valueStr = "UNREADABLE";
          }

          // Определяем тип по эвристикам
          var detectedType = "unknown";
          var typeReasons = [];
          if (!isReadable) {
            detectedType = "unreadable";
            typeReasons.push("UNREADABLE: " + readError);
          } else {
            // a) Если value содержит JSON с ключами capPropFontEdit/fontEditValue/fontSizeEditValue/textEditValue — это Text
            try {
              var parsed = null;
              var valueToParse = valueStr;

              // Пробуем парсить как double-encoded JSON
              try {
                var firstParse = JSON.parse(valueToParse);
                if (typeof firstParse === "string") {
                  parsed = JSON.parse(firstParse);
                } else {
                  parsed = firstParse;
                }
              } catch (e1) {
                // Пробуем как обычный JSON
                try {
                  var trimmed = valueToParse.replace(/^\s+|\s+$/g, "");
                  if (trimmed.charAt(0) === "{") {
                    parsed = JSON.parse(trimmed);
                  }
                } catch (e2) {
                  // Не JSON
                }
              }
              if (parsed && _typeof(parsed) === "object") {
                var hasTextEditValue = parsed.textEditValue !== undefined;
                var hasFontEditValue = parsed.fontEditValue !== undefined;
                var hasFontSizeEditValue = parsed.fontSizeEditValue !== undefined;
                var hasCapPropFontEdit = parsed.capPropFontEdit !== undefined;
                if (hasTextEditValue || hasFontEditValue || hasFontSizeEditValue || hasCapPropFontEdit) {
                  detectedType = "text";
                  typeReasons.push("Contains textEditValue/fontEditValue/fontSizeEditValue/capPropFontEdit");
                } else {
                  // b) Если value является объектом/JSON со структурой, похожей на style
                  var hasFontFamily = parsed.fontFamily !== undefined;
                  var hasFontSize = parsed.fontSize !== undefined;
                  var hasBold = parsed.fontBold !== undefined || parsed.bold !== undefined;
                  var hasItalic = parsed.fontItalic !== undefined || parsed.italic !== undefined;
                  var hasAllCaps = parsed.fontAllCaps !== undefined || parsed.allCaps !== undefined;
                  var hasSmallCaps = parsed.fontSmallCaps !== undefined || parsed.smallCaps !== undefined;
                  if (hasFontFamily || hasFontSize || hasBold || hasItalic || hasAllCaps || hasSmallCaps) {
                    detectedType = "style_candidate";
                    typeReasons.push("Contains style-like fields (fontFamily/fontSize/bold/italic/allCaps/smallCaps)");
                  }
                }
              }
            } catch (e) {
              // Парсинг не удался, оставляем unknown
            }

            // c) Если параметр называется/помечен как "Style", "Character", "Font", "Appearance" и т.п.
            var nameLower = displayName.toLowerCase();
            var styleKeywords = ["style", "character", "font", "appearance", "formatting", "typography"];
            var textKeywords = ["text", "edit", "content", "string"];
            if (styleKeywords.some(function (kw) {
              return nameLower.includes(kw);
            })) {
              if (detectedType === "unknown") {
                detectedType = "style_candidate";
              }
              typeReasons.push("Name contains style keyword: " + displayName);
            }
            if (textKeywords.some(function (kw) {
              return nameLower.includes(kw);
            })) {
              if (detectedType === "unknown") {
                detectedType = "text";
              }
              typeReasons.push("Name contains text keyword: " + displayName);
            }
          }
          paramsDump.push({
            index: i,
            displayName: displayName,
            matchName: matchName,
            rawValue: rawValue,
            valueStr: valueStr.substring(0, 500),
            // Ограничиваем длину для логов
            isReadable: isReadable,
            readError: readError,
            detectedType: detectedType,
            typeReasons: typeReasons
          });
        } catch (e) {
          // Пропускаем параметр, который не удалось обработать
          return 0; // continue
        }
      },
      _ret;
    for (var i = 0; i < numProps; i++) {
      _ret = _loop2();
      if (_ret === 0) continue;
    }
    return JSON.stringify({
      ok: true,
      params: paramsDump,
      totalCount: paramsDump.length
    });
  } catch (error) {
    return JSON.stringify({
      error: error.toString()
    });
  }
};

var ppro = /*#__PURE__*/__objectFreeze({
    __proto__: null,
    selectDir: selectDir,
    getLayerInfo: getLayerInfo,
    getSelectedMogrtParams: getSelectedMogrtParams,
    setSelectedMogrtParam: setSelectedMogrtParam,
    getMogrtProperty: getMogrtProperty,
    getMogrtPropertySafe: getMogrtPropertySafe,
    setMogrtProperty: setMogrtProperty,
    setMogrtColorFromHex: setMogrtColorFromHex,
    getAvailableFonts: getAvailableFonts,
    getControllerLayerInfo: getControllerLayerInfo,
    applyTemplateByPath: applyTemplateByPath,
    setClipDurationFromPlayhead: setClipDurationFromPlayhead,
    trimMogrtClip: trimMogrtClip,
    trimMogrtClipToPlayhead: trimMogrtClipToPlayhead,
    getAppName: getAppName,
    testColorConversion: testColorConversion,
    debugSelectedMogrtRaw: debugSelectedMogrtRaw,
    listMogrtParamsDetailed: listMogrtParamsDetailed,
    inspectMogrtParams: inspectMogrtParams
});

var host = typeof $ !== "undefined" ? $ : window;

// A safe way to get the app name since some versions of Adobe Apps broken BridgeTalk in various places (e.g. After Effects 24-25)
// in that case we have to do various checks per app to deterimine the app name

var getAppNameSafely = function getAppNameSafely() {
  var compare = function compare(a, b) {
    return a.toLowerCase().indexOf(b.toLowerCase()) > -1;
  };
  var exists = function exists(a) {
    return typeof a !== "undefined";
  };
  var isBridgeTalkWorking = typeof BridgeTalk !== "undefined" && typeof BridgeTalk.appName !== "undefined";
  if (isBridgeTalkWorking) {
    return BridgeTalk.appName;
  } else if (app) {
    
    if (exists(app.name)) {
      
      var name = app.name;
      if (compare(name, "photoshop")) return "photoshop";
      if (compare(name, "illustrator")) return "illustrator";
      if (compare(name, "audition")) return "audition";
      if (compare(name, "bridge")) return "bridge";
      if (compare(name, "indesign")) return "indesign";
    }
    
    if (exists(app.appName)) {
      
      var appName = app.appName;
      if (compare(appName, "after effects")) return "aftereffects";
      if (compare(appName, "animate")) return "animate";
    }
    
    if (exists(app.path)) {
      
      var path = app.path;
      if (compare(path, "premiere")) return "premierepro";
    }
    
    if (exists(app.getEncoderHost) && exists(AMEFrontendEvent)) {
      return "ame";
    }
  }
  return "unknown";
};
switch (getAppNameSafely()) {
  case "aftereffects":
  case "aftereffectsbeta":
    host[ns] = aeft;
    break;
  case "premierepro":
  case "premiereprobeta":
    host[ns] = ppro;
    break;
}

// https://extendscript.docsforadobe.dev/interapplication-communication/bridgetalk-class.html?highlight=bridgetalk#appname
})(this);