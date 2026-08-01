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
    customAssets: [], // array of user-created custom assets & presets
    searchIndex: [],
    categoryIndex: {},
    groupIndex: {}
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

  function rebuildIndexes() {
    state.searchIndex = [];
    state.categoryIndex = {};
    state.groupIndex = {};
    state.assets.forEach(function (asset) {
      var haystack = [
        asset.name,
        asset.category,
        asset.group,
        asset.description,
        (asset.tags || []).join(" "),
        (asset.keywords || []).join(" ")
      ].join(" ").toLowerCase();
      state.searchIndex.push({ asset: asset, haystack: haystack });
      (state.categoryIndex[asset.category] || (state.categoryIndex[asset.category] = [])).push(asset);
      (state.groupIndex[asset.group] || (state.groupIndex[asset.group] = [])).push(asset);
    });
  }

  function normalizeAsset(raw) {
    if (!raw) return null;
    var name = raw.name || raw.Name || raw.title || raw.Title || "Unnamed Asset";
    var category = raw.category || raw.Category || "General";
    var group = raw.group || raw.Group || "Library";
    var file = raw.file || raw.File || raw.sourceFile || raw.SourceFile || "";
    var id = raw.id || raw.ID || ("asset_" + Math.random().toString(36).substr(2, 9));
    var type = raw.type || raw.Type || raw.kind || raw.Kind || (file.toLowerCase().endsWith(".ffx") || file.toLowerCase().endsWith(".json") || file.toLowerCase().endsWith(".prfpset") ? "shake" : "audio");

    return {
      id: String(id),
      name: String(name).trim(),
      category: String(category).trim(),
      group: String(group).trim(),
      type: String(type).toLowerCase(),
      kind: String(type).toLowerCase(),
      file: String(file),
      sourceFile: String(file),
      hostHint: raw.hostHint || raw.Host || "",
      params: raw.params || raw.Params || null,
      length: raw.length || raw.Length || raw.duration || raw.Duration || "--:--",
      tags: raw.tags || raw.Tags || [category.toLowerCase()],
      favorite: !!raw.favorite,
      preview: raw.preview || raw.Preview || ""
    };
  }

  function loadFromCache() {
    var cached = readJSON(dbPath(), null);
    if (cached && cached.assets) {
      state.assets = cached.assets.map(normalizeAsset).filter(Boolean);
      state.categories = cached.categories || [];
      mergeCustomAssets();
      applyFavorites();
      rebuildIndexes();
      return true;
    }
    return false;
  }

  function rescan() {
    var result = GS.Scanner.scanAll();
    state.assets = (result.assets || []).map(normalizeAsset).filter(Boolean);
    state.categories = result.categories || [];
    mergeCustomAssets();
    applyFavorites();
    rebuildIndexes();
    writeJSON(dbPath(), { assets: state.assets, categories: state.categories });
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
    return state.categoryIndex[catName] || [];
  }

  function getByGroup(groupName) {
    return state.groupIndex[groupName] || [];
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
    return state.searchIndex.filter(function (entry) {
      var haystack = entry.haystack;
      return terms.every(function (t) { return haystack.indexOf(t) > -1; });
    }).map(function (entry) { return entry.asset; });
  }

  function addCustomAsset(asset) {
    try {
      if (!asset || !asset.name || !asset.category) return null;
      if (!asset.id) asset.id = "custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      var duplicate = state.customAssets.filter(function (existing) {
        if (asset.type !== existing.type) return false;
        if (asset.type === "audio" && asset.sourceFile && existing.file) {
          return path.normalize(asset.sourceFile) === path.normalize(existing.file);
        }
        return String(existing.name).toLowerCase() === String(asset.name).toLowerCase() && String(existing.category).toLowerCase() === String(asset.category).toLowerCase();
      })[0];
      if (duplicate) return null;
      var root = extensionRoot();
      var customDir = path.join(root, "Assets", "Custom Audio");

      if (asset.type === "audio") {
        if (!asset.sourceFile || !fs.existsSync(asset.sourceFile)) return null;
        if (!fs.existsSync(customDir)) fs.mkdirSync(customDir);
        var sourceName = path.basename(asset.sourceFile).replace(/[^a-zA-Z0-9._ -]/g, "_");
        var destination = path.join(customDir, asset.id + "_" + sourceName);
        fs.copyFileSync(asset.sourceFile, destination);
        asset.file = destination;
        delete asset.sourceFile;
      }

      if (asset.type === "shake") {
        var shakeDir = path.join(root, "Config", "Custom Shakes");
        if (!fs.existsSync(shakeDir)) fs.mkdirSync(shakeDir);
        asset.file = path.join(shakeDir, asset.id + ".json");
        writeJSON(asset.file, { name: asset.name, category: asset.category, params: asset.params || {} });
      }

      asset.custom = true;
      state.customAssets.unshift(asset);
      state.assets.unshift(asset);
      rebuildIndexes();
      writeJSON(customPath(), state.customAssets);
      return asset;
    } catch (e) {
      console.error("JV.DB custom asset import failed", e);
      return null;
    }
  }

  function deleteCustomAsset(id) {
    var removed = state.customAssets.filter(function (a) { return a.id === id; })[0];
    if (removed && removed.file && fs.existsSync(removed.file)) {
      try { fs.unlinkSync(removed.file); } catch (e) { console.warn("JV.DB could not remove custom file", e); }
    }
    state.customAssets = state.customAssets.filter(function (a) { return a.id !== id; });
    state.assets = state.assets.filter(function (a) { return a.id !== id; });
    rebuildIndexes();
    writeJSON(customPath(), state.customAssets);
  }

  function updateCustomAsset(id, changes) {
    var asset = state.customAssets.filter(function (a) { return a.id === id; })[0];
    if (!asset || !changes) return null;
    if (changes.name) asset.name = String(changes.name).trim();
    if (changes.category) asset.category = String(changes.category).trim();
    var live = state.assets.filter(function (a) { return a.id === id; })[0];
    if (live) {
      live.name = asset.name;
      live.category = asset.category;
    }
    rebuildIndexes();
    writeJSON(customPath(), state.customAssets);
    if (asset.type === "shake" && asset.file) {
      writeJSON(asset.file, { name: asset.name, category: asset.category, params: asset.params || {} });
    }
    return asset;
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
    updateCustomAsset: updateCustomAsset,
    getCustomAssets: getCustomAssets
  };
})();
