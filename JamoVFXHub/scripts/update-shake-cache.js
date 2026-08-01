/** Add imported Shake It Up V2 presets to the generated asset cache. */
var fs = require("fs");
var path = require("path");
var root = path.join(__dirname, "..");
var cachePath = path.join(root, "Database", "assets.json");
var shakesRoot = path.join(root, "Assets", "Shakes");
var cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
var known = {};
var added = 0;

cache.assets.forEach(function (asset) { known[asset.id] = true; });

fs.readdirSync(shakesRoot).forEach(function (category) {
  if (category.indexOf("Shake It Up V2 - ") !== 0) return;
  var categoryPath = path.join(shakesRoot, category);
  if (!fs.statSync(categoryPath).isDirectory()) return;
  fs.readdirSync(categoryPath).forEach(function (file) {
    if (!/\.ffx$/i.test(file)) return;
    var base = path.basename(file, ".ffx");
    var id = "Shakes/" + category + "/" + base;
    if (known[id]) return;
    var metadataPath = path.join(categoryPath, base + ".metadata.json");
    var metadata = fs.existsSync(metadataPath) ? JSON.parse(fs.readFileSync(metadataPath, "utf8")) : {};
    cache.assets.push({
      id: id,
      name: metadata.Name || base,
      category: category,
      group: "Shakes",
      type: "shake",
      kind: "shake",
      tags: metadata.Tags || ["shake", "after effects"],
      keywords: metadata.Keywords || ["shake", "after effects"],
      description: metadata.Description || "",
      file: path.join(categoryPath, file),
      preview: null,
      premium: false,
      favorite: false,
      params: metadata.Params || { intensity: 20, duration: 0.6, scale: 4, rotation: 2, frequency: 12 },
      hostHint: "AEFT",
      version: "1.0",
      length: "",
      sampleRate: "",
      downloadURL: "",
      installed: true,
      thumbnail: ""
    });
    known[id] = true;
    added++;
  });
});

cache.scannedAt = Date.now();
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
console.log("Shake cache entries added:", added);
