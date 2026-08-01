/**
 * JV.Updater
 * Optional auto-update checker. When autoUpdate is on and Settings.updateUrl
 * is set, fetches a version manifest from your server:
 *
 *   { "version": "1.1.0", "name": "JamoVFX Hub 1.1", "notes": "...", "url": "..." }
 *
 * If the remote version is newer than the local manifest version, the UI
 * shows an update banner. No server = feature is inert (no errors).
 */
var GS = window.GS || {};
window.GS = GS;

GS.Updater = (function () {
  var CURRENT_VERSION = "1.0.0";
  var updateInfo = null;
  var lastChecked = 0;

  function fetch(url, cb) {
    var http = url.indexOf("https") === 0 ? require("https") : require("http");
    var req;
    try {
      req = http.get(url, function (res) {
        if (res.statusCode >= 400) { cb(new Error("HTTP " + res.statusCode)); return; }
        var body = "";
        res.setEncoding("utf8");
        res.on("data", function (c) { body += c; });
        res.on("end", function () {
          try { cb(null, JSON.parse(body)); }
          catch (e) { cb(new Error("Invalid update manifest")); }
        });
      });
    } catch (e) { cb(e); return; }
    req.on("error", cb);
    req.setTimeout(8000, function () { try { req.destroy(new Error("timeout")); } catch (e) {} });
  }

  function parseVer(v) {
    return String(v || "0").split(".").map(function (n) { return parseInt(n, 10) || 0; });
  }

  function check(cb) {
    cb = cb || function () {};
    if (!GS.Settings.get("autoUpdate")) return cb(null, null);
    var url = GS.Settings.get("updateUrl");
    if (!url) return cb(null, null);

    fetch(url, function (err, data) {
      if (err || !data || !data.version) return cb(err || new Error("bad payload"), null);
      var remote = parseVer(data.version);
      var local = parseVer(CURRENT_VERSION);
      if (remote > local) { updateInfo = data; cb(null, data); }
      else cb(null, null);
    });
  }

  function info() { return updateInfo; }
  function current() { return CURRENT_VERSION; }

  return { check: check, info: info, current: current };
})();
