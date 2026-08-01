/**
 * JV main entry point.
 */
var GS = window.GS || {};
window.GS = GS;

// ---- Host bridge: wraps CSInterface.evalScript calls to host/host.jsx ----
GS.Host = (function () {
  var csInterface = new CSInterface();
  var hostName = "";

  function call(fnName, args, cb) {
    var argStr = (args || []).map(function (a) {
      var jsonStr = typeof a === "string" ? a : JSON.stringify(a);
      return JSON.stringify(jsonStr);
    }).join(", ");
    csInterface.evalScript(fnName + "(" + argStr + ")", function (result) {
      var parsed;
      try { parsed = JSON.parse(result); } catch (e) { parsed = { ok: false, error: "Bad response: " + result }; }
      if (!parsed.ok) console.error(fnName, parsed.error);
      if (cb) cb(parsed);
    });
  }

  return {
    hostName: hostName,
    importSound: function (filePath, dropOnTimeline) {
      call("gsImportSound", [JSON.stringify([filePath]), !!dropOnTimeline], function (res) {
        GS.UI.toast(res.ok
          ? "Imported: " + filePath.split(/[\\/]/).pop()
          : "Import failed: " + res.error,
          res.ok ? "ok" : "err");
      });
    },
    applyShake: function (params) {
      call("gsApplyShake", [JSON.stringify(params)], function (res) {
        GS.UI.toast(res.ok ? "Shake applied" : "Apply failed: " + res.error, res.ok ? "ok" : "err");
      });
    },
    applyPreset: function (presetFile, hostHint) {
      call("gsApplyPreset", [JSON.stringify(presetFile)], function (res) {
        GS.UI.toast(res.ok
          ? "Preset applied: " + presetFile.split(/[\\/]/).pop()
          : "Preset failed: " + res.error,
          res.ok ? "ok" : "err");
      });
    },
    importTemplate: function (filePath) {
      call("gsImportTemplate", [JSON.stringify(filePath)], function (res) {
        GS.UI.toast(res.ok ? "Text animation imported" : "Template failed: " + res.error, res.ok ? "ok" : "err");
      });
    },
    getInfo: function (cb) { call("gsGetHostInfo", [], cb); }
  };
})();

function setStatus(msg) {
  var node = document.getElementById("statusText");
  if (node) node.textContent = msg;
  clearTimeout(setStatus._t);
  setStatus._t = setTimeout(function () {
    if (node) node.textContent = "Ready";
  }, 4000);
}

document.addEventListener("DOMContentLoaded", function () {
  // Settings first — everything downstream reads them (volume, accent, urls)
  GS.Settings.load();
  GS.Player.setVolume(GS.Settings.get("volume"));
  var accent = GS.Settings.get("accent");
  if (accent) document.documentElement.style.setProperty("--accent", accent);

  GS.DB.loadPersisted();

  var hadCache = GS.DB.loadFromCache();
  if (!hadCache) {
    setStatus("Scanning assets…");
    GS.DB.rescan();
  }

  GS.UI.init();

  var refreshBusy = false;
  document.getElementById("refreshBtn").addEventListener("click", function () {
    if (refreshBusy) return;
    refreshBusy = true;
    var refreshButton = document.getElementById("refreshBtn");
    if (refreshButton) refreshButton.disabled = true;
    setStatus("Rescanning…");
    setTimeout(function () {
      try {
        GS.DB.rescan();
        GS.UI.refreshAll();
        setStatus("Rescan complete");
      } catch (e) {
        console.error("JamoVFX rescan failed", e);
        setStatus("Rescan failed");
        if (GS.UI && GS.UI.toast) GS.UI.toast("Rescan failed. Check the asset folders.", "err");
      } finally {
        refreshBusy = false;
        if (refreshButton) refreshButton.disabled = false;
      }
    }, 0);
  });

  // Host detection for AE vs Premiere
  GS.Host.getInfo(function (res) {
    if (res.ok) {
      GS.Host.hostName = res.appName || "";
      var badge = document.getElementById("hostBadge");
      if (badge) {
        badge.textContent = String(res.appName).replace("Adobe ", "");
        badge.classList.add("live");
      }
      setStatus("Connected to " + (res.appName || "host"));
    } else {
      setStatus("Warning: not running inside an Adobe host.");
    }
  });

  // Optional update check
  GS.Updater.check(function (err, data) {
    if (data) GS.UI.showUpdateBanner(data);
  });
});
