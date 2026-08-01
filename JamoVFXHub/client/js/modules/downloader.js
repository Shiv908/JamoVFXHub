/**
 * JV.Downloader
 * Downloads remote assets (metadata `DownloadURL`) into the local Assets/
 * tree using Node's http/https modules (available in CEP with --enable-nodejs).
 * Once saved, GS.DB.rescan() indexes it like any local file.
 */
var GS = window.GS || {};
window.GS = GS;

GS.Downloader = (function () {
  var fs = require("fs");
  var path = require("path");

  function download(url, dest, onProgress, cb) {
    var http = url.indexOf("https") === 0 ? require("https") : require("http");
    var file = fs.createWriteStream(dest);
    var done = false;

    function fail(e) {
      if (done) return;
      done = true;
      try { file.close(); } catch (x) {}
      try { fs.unlinkSync(dest); } catch (x) {}
      cb(e);
    }

    var req;
    try {
      req = http.get(url, function (res) {
        if (res.statusCode >= 400) { fail(new Error("HTTP " + res.statusCode)); return; }
        var total = parseInt(res.headers["content-length"] || "0", 10) || 0;
        var got = 0;
        res.on("data", function (chunk) {
          got += chunk.length;
          if (onProgress) onProgress(got, total);
        });
        res.pipe(file);
      });
    } catch (e) { fail(e); return; }

    req.on("error", fail);
    file.on("error", fail);
    file.on("finish", function () {
      file.close(function () {
        if (!done) { done = true; cb(null, dest); }
      });
    });
  }

  return { download: download };
})();
