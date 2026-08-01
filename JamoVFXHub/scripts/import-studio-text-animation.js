var fs = require("fs");
var path = require("path");

var root = path.join(__dirname, "..");
var source = path.join(root, "..", "Studio Text Animation", "02. After Effects Project", "Studio Text Animation - AAPOWER.aep");
var targetDir = path.join(root, "Assets", "Templates", "Studio Text Animation");
var target = path.join(targetDir, "Studio Text Animation - AAPOWER.aep");

if (!fs.existsSync(source)) {
  console.error("Studio Text Animation project not found:", source);
  process.exit(1);
}
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
fs.copyFileSync(source, target);
console.log("Imported:", target);

var cachePath = path.join(root, "Database", "assets.json");
var cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
var id = "Templates/Studio Text Animation/Studio Text Animation - AAPOWER";
if (!cache.assets.some(function (asset) { return asset.id === id; })) {
  cache.assets.push({
    id: id,
    name: "Studio Text Animation - AAPOWER",
    category: "Studio Text Animation",
    group: "Templates",
    type: "template",
    kind: "template",
    tags: ["text", "animation", "after effects", "template"],
    keywords: ["text", "animation", "after effects", "template"],
    description: "After Effects Studio Text Animation project.",
    file: target,
    preview: null,
    premium: false,
    favorite: false,
    params: null,
    hostHint: "AEFT",
    version: "1.0",
    length: "",
    sampleRate: "",
    downloadURL: "",
    installed: true,
    thumbnail: ""
  });
  cache.scannedAt = Date.now();
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf8");
  console.log("Added template to asset cache.");
}
