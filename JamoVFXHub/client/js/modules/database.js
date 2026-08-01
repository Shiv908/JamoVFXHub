/**
 * JV.DB
 * In-memory asset database, backed by Database/assets.json (cache) and
 * Config/{favorites,recent,settings}.json (persisted between sessions).
 */
var GS = window.GS || {};
window.GS = GS;

GS.DB = (function () {
  var fs = require("fs");
  var path = require("path");

  var state = {
    assets: [],
    categories: [],
    favorites: {},  // id -> true
    recent: [],     // array of ids, most recent first
    customAssets: [] // array of user-created custom assets & presets
  };

  function extensionRoot() {
    var csInterface = new CSInterface();
    return csInterface.getSystemPath(SystemPath.EXTENSION);
  }

  function dbPath() { return path.join(extensionRoot(), "Database", "assets.json"); }
  function favPath() { return path.join(extensionRoot(), "Config", "favorites.json"); }
  function recentPath() { return path.join(extensionRoot(), "Config", "recent.json"); }
  function customPath() { return path.join(extensionRoot(), "Config", "customAssets.json"); }

  function readJSON(p, fallback) {
    try {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) { /* ignore, use fallback */ }
    return fallback;
  }

  function writeJSON(p, obj) {
    try { fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8"); }
    catch (e) { console.error("JV.DB write failed", p, e); }
  }

  function loadPersisted() {
    state.favorites = readJSON(favPath(), {});
    state.recent = readJSON(recentPath(), []);
    state.customAssets = readJSON(customPath(), []);
  }

  function mergeCustomAssets() {
    if (!state.customAssets || !state.customAssets.length) return;
    var existingIds = {};
    state.assets.forEach(function (a) { existingIds[a.id] = true; });
    state.customAssets.forEach(function (ca) {
      if (!existingIds[ca.id]) {
        state.assets.unshift(ca);
      }
    });
  }

  function loadFromCache() {
    var cached = readJSON(dbPath(), null);
    if (cached && cached.assets) {
      state.assets = cached.assets;
      state.categories = cached.categories || [];
      mergeCustomAssets();
      applyFavorites();
      return true;
    }
    return false;
  }

  function rescan() {
    var result = GS.Scanner.scanAll();
    state.assets = result.assets;
    state.categories = result.categories;
    mergeCustomAssets();
    applyFavorites();
    writeJSON(dbPath(), result);
    return state;
  }

  function applyFavorites() {
    state.assets.forEach(function (a) {
      a.favorite = !!state.favorites[a.id];
    });
  }

  function toggleFavorite(id) {
    if (state.favorites[id]) delete state.favorites[id];
    else state.favorites[id] = true;
    writeJSON(favPath(), state.favorites);
    applyFavorites();
  }

  function markRecent(id) {
    var max = (GS.Settings && GS.Settings.get("maxRecent")) || 40;
    state.recent = state.recent.filter(function (r) { return r !== id; });
    state.recent.unshift(id);
    if (state.recent.length > max) state.recent = state.recent.slice(0, max);
    writeJSON(recentPath(), state.recent);
  }

  function getAll() { return state.assets; }
  function getCategories() { return state.categories; }

  function getByCategory(catName) {
    return state.assets.filter(function (a) { return a.category === catName; });
  }

  function getByGroup(groupName) {
    return state.assets.filter(function (a) { return a.group === groupName; });
  }

  function getFavorites() {
    return state.assets.filter(function (a) { return a.favorite; });
  }

  function getRecent() {
    var map = {};
    state.assets.forEach(function (a) { map[a.id] = a; });
    return state.recent.map(function (id) { return map[id]; }).filter(Boolean);
  }

  /** Assets that should appear in the Downloads tab: remote-only, premium,
   *  or not installed locally. */
  function getDownloads() {
    return state.assets.filter(function (a) {
      return !!a.downloadURL || (a.premium && !a.installed);
    });
  }

  function search(query) {
    if (!query || !query.trim()) return [];
    var q = query.toLowerCase().trim();
    var terms = q.split(/\s+/);
    return state.assets.filter(function (a) {
      var haystack = [
        a.name,
        a.category,
        a.group,
        a.description,
        (a.tags || []).join(" "),
        (a.keywords || []).join(" ")
      ].join(" ").toLowerCase();
      return terms.every(function (t) { return haystack.indexOf(t) > -1; });
    });
  }

  function addCustomAsset(asset) {
    if (!asset.id) asset.id = "custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    asset.custom = true;
    state.customAssets.unshift(asset);
    state.assets.unshift(asset);
    writeJSON(customPath(), state.customAssets);
    return asset;
  }

  function deleteCustomAsset(id) {
    state.customAssets = state.customAssets.filter(function (a) { return a.id !== id; });
    state.assets = state.assets.filter(function (a) { return a.id !== id; });
    writeJSON(customPath(), state.customAssets);
  }

  function getCustomAssets() {
    return state.customAssets;
  }

  return {
    loadPersisted: loadPersisted,
    loadFromCache: loadFromCache,
    rescan: rescan,
    getAll: getAll,
    getCategories: getCategories,
    getByCategory: getByCategory,
    getByGroup: getByGroup,
    getFavorites: getFavorites,
    getRecent: getRecent,
    getDownloads: getDownloads,
    search: search,
    toggleFavorite: toggleFavorite,
    markRecent: markRecent,
    addCustomAsset: addCustomAsset,
    deleteCustomAsset: deleteCustomAsset,
    getCustomAssets: getCustomAssets
  };
})();
