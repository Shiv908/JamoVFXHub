var fs = require("fs");
var path = require("path");
var extensionRoot = path.join(__dirname, "..");

global.window = global;
global.SystemPath = { EXTENSION: "EXTENSION" };
global.CSInterface = function () {
  this.getSystemPath = function () { return extensionRoot; };
};
global.GS = {};

require(path.join(extensionRoot, "client", "js", "modules", "scanner.js"));
var result = GS.Scanner.scanAll();
var cachePath = path.join(extensionRoot, "Database", "assets.json");
fs.writeFileSync(cachePath, JSON.stringify(result, null, 2), "utf8");
console.log("Rebuilt asset cache from files:", result.assets.length);
