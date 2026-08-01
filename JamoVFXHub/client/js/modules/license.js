/**
 * JV.License
 * License-key activation. The panel stores the key in Config/settings.json
 * and verifies it against Settings.licenseUrl when one is configured.
 *
 * Wire-up for sale:
 *   Settings.licenseUrl = "https://your-api.example/license/validate"
 *   GET <licenseUrl>?key=<key>  ->  { "valid": true, "expires": "2027-01-01" }
 *
 * With no server configured it falls back to a local sanity check so the
 * feature is demonstrable in dev. Replace with your server before selling.
 */
var GS = window.GS || {};
window.GS = GS;

GS.License = (function () {
  var cached = null; // last validated result

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
          try { cb(null, JSON.parse(body)); } catch (e) { cb(e); }
        });
      });
    } catch (e) { cb(e); return; }
    req.on("error", cb);
    req.setTimeout(8000, function () { try { req.destroy(new Error("timeout")); } catch (e) {} });
  }

  function validate(key, cb) {
    cb = cb || function () {};
    key = (key || GS.Settings.get("licenseKey") || "").trim();
    var url = GS.Settings.get("licenseUrl") || "";

    if (!key) { cached = { valid: false, reason: "No license key entered." }; return cb(cached); }

    if (url) {
      var sep = url.indexOf("?") > -1 ? "&" : "?";
      fetch(url + sep + "key=" + encodeURIComponent(key), function (err, data) {
        if (err || !data) { cached = { valid: false, reason: "Could not reach license server." }; return cb(cached); }
        cached = { valid: !!data.valid, reason: data.reason || "", expires: data.expires || "" };
        cb(cached);
      });
    } else {
      // Local fallback (dev / no server yet)
      var ok = key.length >= 8;
      cached = { valid: ok, reason: ok ? "Activated (local mode)." : "Key too short." };
      cb(cached);
    }
  }

  function isActive() {
    return !!GS.Settings.get("licenseKey");
  }

  function lastResult() { return cached; }

  return { validate: validate, isActive: isActive, lastResult: lastResult };
})();
