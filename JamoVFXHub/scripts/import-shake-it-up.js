/**
 * Import the local Shake It Up V2 After Effects pack into the extension library.
 * Only .ffx presets are copied; promotional HTML/TXT files are intentionally ignored.
 */
var fs = require("fs");
var path = require("path");

var extensionRoot = path.join(__dirname, "..");
var sourceRoot = path.join(extensionRoot, "..", "@elevenpercent - Shake It Up V2 - AE");
var destinationRoot = path.join(extensionRoot, "Assets", "Shakes");
var imported = 0;

function safeName(value) {
  return String(value).replace(/[<>:"/\\|?*]/g, "-").trim();
}

if (!fs.existsSync(sourceRoot)) {
  console.error("Source pack not found:", sourceRoot);
  process.exit(1);
}

fs.readdirSync(sourceRoot).forEach(function (category) {
  var sourceCategory = path.join(sourceRoot, category);
  if (!fs.statSync(sourceCategory).isDirectory()) return;

  var destinationCategory = path.join(destinationRoot, "Shake It Up V2 - " + safeName(category));
  if (!fs.existsSync(destinationCategory)) fs.mkdirSync(destinationCategory);

  fs.readdirSync(sourceCategory).forEach(function (file) {
    if (!/\.ffx$/i.test(file)) return;
    var sourceFile = path.join(sourceCategory, file);
    if (!fs.statSync(sourceFile).isFile()) return;
    fs.copyFileSync(sourceFile, path.join(destinationCategory, file));
    imported++;
  });
});

console.log("Imported Shake It Up V2 presets:", imported);
