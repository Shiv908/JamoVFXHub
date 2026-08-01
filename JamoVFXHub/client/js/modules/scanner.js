/**
 * JV.Scanner — generic asset engine
 *
 * Walks the Assets/ folder tree and builds the asset database dynamically.
 * NOT hardcoded to Sounds/Shakes: any top-level folder under Assets/ becomes
 * an asset group, and each subfolder a category. Asset type is derived from
 * the group name ("sound" for Sounds, "shake" for Shakes, otherwise the
 * generic kind) and every field can be overridden by a <file>.metadata.json
 * sidecar. Dropping a new product folder in = new product in the UI.
 *
 * Requires CEP's Node integration (manifest has --enable-nodejs / --mixed-context).
 */
var GS = window.GS || {};
window.GS = GS;

GS.Scanner = (function () {

  var fs = require("fs");
  var path = require("path");

  var SOUND_EXT = [".wav", ".mp3", ".aiff", ".aif", ".m4a", ".ogg"];
  var SHAKE_EXT = [".json", ".prfpset", ".ffx"];
  var TEMPLATE_EXT = [".aep", ".aepx", ".mogrt"];
  var PREVIEW_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  var METADATA_RE = /\.metadata\.json$/i;
  var IGNORE_RE = /(^|\/)(preview|thumbnail|\.gitkeep)(\.|$)/i;

  function getExtensionRoot() {
    var csInterface = new CSInterface();
    return csInterface.getSystemPath(SystemPath.EXTENSION);
  }

  function readJSON(p, fallback) {
    try {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) { /* ignore */ }
    return fallback;
  }

  function readMetadata(dir, baseName) {
    return readJSON(path.join(dir, baseName + ".metadata.json"), {});
  }

  function findPreview(dir, baseName) {
    for (var i = 0; i < PREVIEW_EXT.length; i++) {
      var p = path.join(dir, baseName + PREVIEW_EXT[i]);
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  function titleCase(str) {
    return String(str || "")
      .replace(/^\d+\s*/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function cleanTag(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/^\d+\s*/, "")
      .replace(/[_-]+/g, " ")
      .trim();
  }

  function scanCategoryFolder(categoryPath, categoryName, group, kind) {
    var assets = [];
    var files;
    try { files = fs.readdirSync(categoryPath); } catch (e) { return assets; }

    files.forEach(function (file) {
      var full = path.join(categoryPath, file);
      var stat;
      try { stat = fs.statSync(full); } catch (e) { return; }
      if (stat.isDirectory()) return;
      if (METADATA_RE.test(file)) return;
      if (IGNORE_RE.test(file)) return;

      var ext = path.extname(file).toLowerCase();
      var base = path.basename(file, ext);
      var isSound = SOUND_EXT.indexOf(ext) > -1;
      var isShake = SHAKE_EXT.indexOf(ext) > -1;
      var isTemplate = TEMPLATE_EXT.indexOf(ext) > -1;
      var isPreview = PREVIEW_EXT.indexOf(ext) > -1;

      if (kind === "sound" && !isSound) return;
      if (kind === "shake" && !isShake) return;
      if (kind === "generic" && isPreview) return;

      var meta = readMetadata(categoryPath, base);

      // Bare .json shake presets carry their params inline (no sidecar needed).
      var inlineParams = null;
      if (isShake && ext === ".json" && !meta.Params) {
        var selfData = readJSON(full, null);
        if (selfData && selfData.params) inlineParams = selfData.params;
      }

      var preview = findPreview(categoryPath, base);
      var hostHint = meta.Host ||
        (ext === ".ffx" ? "AEFT" : ext === ".prfpset" ? "PPRO" : "");

      assets.push({
        id: group + "/" + categoryName + "/" + base,
        name: meta.Name || titleCase(base),
        category: categoryName,
        group: group,
        type: isTemplate ? "template" : kind,
        kind: meta.Kind || (isTemplate ? "template" : kind),
        tags: meta.Tags || (meta.Keywords ? meta.Keywords.slice() : [cleanTag(categoryName)]),
        keywords: meta.Keywords || [],
        description: meta.Description || "",
        file: full,
        preview: preview,
        premium: !!meta.Premium,
        favorite: false,
        params: meta.Params || inlineParams || null,
        hostHint: meta.Host || (isTemplate ? "AEFT" : hostHint),
        version: meta.Version || "1.0",
        length: meta.Length || "",
        sampleRate: meta.SampleRate || "",
        downloadURL: meta.DownloadURL || "",
        installed: fs.existsSync(full),
        thumbnail: meta.Thumbnail || ""
      });
    });

    return assets;
  }

  function scanAll() {
    var assetsRoot = path.join(getExtensionRoot(), "Assets");
    var allAssets = [];
    var categories = [];

    if (!fs.existsSync(assetsRoot)) {
      return { assets: [], categories: [] };
    }

    var groups = fs.readdirSync(assetsRoot).filter(function (g) {
      // Custom imports are owned by Database.customAssets and must not be
      // scanned a second time after a rescan.
      if (g.toLowerCase() === "custom audio") return false;
      try { return fs.statSync(path.join(assetsRoot, g)).isDirectory(); }
      catch (e) { return false; }
    });

    groups.forEach(function (group) {
      var groupPath = path.join(assetsRoot, group);
      var gl = group.toLowerCase();
      var kind = gl.indexOf("sound") > -1 ? "sound"
        : gl.indexOf("shake") > -1 ? "shake"
        : "generic";

      var subfolders = fs.readdirSync(groupPath).filter(function (s) {
        try { return fs.statSync(path.join(groupPath, s)).isDirectory(); }
        catch (e) { return false; }
      });

      var direct = scanCategoryFolder(groupPath, group, group, kind);
      allAssets = allAssets.concat(direct);

      subfolders.forEach(function (sub) {
        var found = scanCategoryFolder(path.join(groupPath, sub), sub, group, kind);
        allAssets = allAssets.concat(found);
        categories.push({ name: sub, group: group, kind: kind, count: found.length });
      });

      if (direct.length) {
        categories.push({ name: group, group: group, kind: kind, count: direct.length });
      }
    });

    return { assets: allAssets, categories: categories, scannedAt: Date.now() };
  }

  return { scanAll: scanAll };
})();
