/**
 * JV.Settings
 * User preferences persisted to Config/settings.json.
 */
var GS = window.GS || {};
window.GS = GS;

GS.Settings = (function () {
  var fs = require("fs");
  var path = require("path");

  var DEFAULTS = {
    theme: "dark",
    accent: "#FFB84D",
    autoUpdate: true,
    updateUrl: "",
    licenseKey: "",
    volume: 0.8,
    maxRecent: 40,
    autoPreview: true,
    theme: "dark",
    accent: "#A970FF",
    defaultShakeDuration: 0.6,
    performanceLite: false
  };

  var state = Object.assign({}, DEFAULTS);

  function file() {
    var csInterface = new CSInterface();
    return path.join(csInterface.getSystemPath(SystemPath.EXTENSION), "Config", "settings.json");
  }

  function load() {
    try {
      if (fs.existsSync(file())) {
        var d = JSON.parse(fs.readFileSync(file(), "utf8"));
        state = Object.assign({}, DEFAULTS, d);
      }
    } catch (e) { /* use defaults */ }
    return state;
  }

  function save() {
    try {
      fs.writeFileSync(file(), JSON.stringify(state, null, 2), "utf8");
    } catch (e) {
      console.error("JV.Settings save failed", e);
    }
  }

  function get(key) { return state[key]; }
  function set(key, value) { state[key] = value; save(); return value; }
  function all() { return state; }
  function reset() { state = Object.assign({}, DEFAULTS); save(); return state; }

  return { load: load, save: save, get: get, set: set, all: all, reset: reset, defaults: DEFAULTS };
})();
