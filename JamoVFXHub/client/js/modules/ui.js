/**
 * JV.UI — Compact Cyber-Obsidian UI/UX System
 * High-density list/grid layout, sliding category drawer, quick category pills,
 * and bottom floating mini-player.
 */
var GS = window.GS || {};
window.GS = GS;

GS.UI = (function () {
  var currentCategory = "__home";
  var selectedAsset = null;
  var playingAssetId = null;
  var previewTimer = null;
  var viewMode = "list"; // "list" | "grid"
  var bulkAudioQueue = [];
  var onboardingStep = 0;
  var searchTimer = null;
  var renderBatchSize = 120;

  var SHAKE_DEFAULTS = {
    intensity: 20, duration: 0.6, scale: 4, rotation: 2, frequency: 12,
    seed: 1, invert: false, reverse: false, motionBlur: false, anchorX: 0, anchorY: 0
  };

  function el(id) { return document.getElementById(id); }

  function hostName() { return (GS.Host && GS.Host.hostName) || ""; }

  function toast(msg, type) {
    var wrap = el("toasts");
    if (!wrap) return;
    var t = document.createElement("div");
    t.className = "toast" + (type ? " toast-" + type : "");
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () {
      t.classList.add("hide");
      setTimeout(function () { t.remove(); }, 400);
    }, 2800);
  }

  // ---------------- Sidebar & Category Pills ----------------
  function renderSidebar() {
    var list = el("categoryList");
    if (!list) return;
    list.innerHTML = "";
    var cats = GS.DB.getCategories();
    var byGroup = {};
    cats.forEach(function (c) {
      byGroup[c.group] = byGroup[c.group] || [];
      byGroup[c.group].push(c);
    });

    Object.keys(byGroup).forEach(function (group) {
      var header = document.createElement("div");
      header.className = "sidebar-item";
      header.style.color = "var(--text-low)";
      header.style.fontSize = "9.5px";
      header.style.textTransform = "uppercase";
      header.style.cursor = "default";
      header.style.marginTop = "6px";
      header.textContent = group;
      list.appendChild(header);

      byGroup[group].forEach(function (c) {
        var item = document.createElement("div");
        item.className = "sidebar-item";
        item.dataset.cat = c.name;
        item.innerHTML = c.name.replace(/^\d+\s*/, "") + '<span class="count">' + c.count + "</span>";
        item.addEventListener("click", function () {
          selectCategory(c.name);
          closeSidebar();
        });
        list.appendChild(item);
      });
    });

    renderCategoryPills();
  }

  function renderCategoryPills() {
    var pillsBar = el("categoryPills");
    if (!pillsBar) return;
    var cats = GS.DB.getCategories();
    var topCats = cats.slice(0, 12);
    pillsBar.querySelectorAll(".pill-dynamic").forEach(function (n) { n.remove(); });

    topCats.forEach(function (c) {
      var btn = document.createElement("button");
      btn.className = "pill pill-dynamic";
      btn.dataset.cat = c.name;
      btn.textContent = c.name.replace(/^\d+\s*/, "");
      btn.addEventListener("click", function () { selectCategory(c.name); });
      pillsBar.appendChild(btn);
    });
  }

  function toggleSidebar() {
    var sb = el("sidebar");
    if (sb) sb.classList.toggle("open");
  }

  function closeSidebar() {
    var sb = el("sidebar");
    if (sb) sb.classList.remove("open");
  }

  function selectCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll(".sidebar-item, .pill").forEach(function (n) {
      n.classList.remove("active");
      if (n.dataset.cat === cat) n.classList.add("active");
    });

    var title = cat, assets = [];
    if (cat === "__home") { title = "Home"; renderHome(); return; }
    else if (cat === "__custom") { title = "My Custom Assets"; assets = GS.DB.getCustomAssets(); }
    else if (cat === "__favorites") { title = "Favorites"; assets = GS.DB.getFavorites(); }
    else if (cat === "__recent") { title = "Recent"; assets = GS.DB.getRecent(); }
    else if (cat === "__downloads") { renderDownloads(); return; }
    else if (cat === "__updates") { renderUpdates(); return; }
    else {
      assets = GS.DB.getByCategory(cat);
      if (!assets.length) assets = GS.DB.getByGroup(cat);
    }

    el("contentTitle").textContent = title;
    renderGrid(assets);
  }

  // ---------------- AI PROMPT MOTION SYNTHESIZER ----------------
  function synthesizeAiMotion(promptText) {
    if (!promptText || !promptText.trim()) {
      toast("Please enter an AI prompt!", "err");
      return;
    }
    var txt = promptText.toLowerCase();
    toast("AI Synthesizing Motion Parameters…", "ok");

    var p = {
      presetBase: 3,
      name: "AI " + promptText.slice(0, 20),
      category: "AI Presets",
      intensity: 50,
      duration: 0.8,
      scale: 15,
      rotation: 8,
      frequency: 18,
      rgb: 40,
      easing: "expo"
    };

    if (txt.indexOf("explosion") !== -1 || txt.indexOf("bomb") !== -1 || txt.indexOf("blast") !== -1) {
      p.presetBase = 3; p.intensity = 85; p.duration = 0.9; p.scale = 22; p.rotation = 14; p.frequency = 22; p.rgb = 85; p.easing = "expo";
    } else if (txt.indexOf("sniper") !== -1 || txt.indexOf("gun") !== -1 || txt.indexOf("recoil") !== -1 || txt.indexOf("shot") !== -1) {
      p.presetBase = 8; p.intensity = 75; p.duration = 0.35; p.scale = 12; p.rotation = 8; p.frequency = 30; p.rgb = 50; p.easing = "elastic";
    } else if (txt.indexOf("glitch") !== -1 || txt.indexOf("cyber") !== -1 || txt.indexOf("strobe") !== -1) {
      p.presetBase = 10; p.intensity = 65; p.duration = 0.45; p.scale = 14; p.rotation = 14; p.frequency = 32; p.rgb = 100; p.easing = "linear";
    } else if (txt.indexOf("earthquake") !== -1 || txt.indexOf("tremor") !== -1 || txt.indexOf("rumble") !== -1) {
      p.presetBase = 4; p.intensity = 65; p.duration = 2.5; p.scale = 8; p.rotation = 0; p.frequency = 12; p.rgb = 20; p.easing = "linear";
    } else if (txt.indexOf("vlog") !== -1 || txt.indexOf("drift") !== -1 || txt.indexOf("drone") !== -1 || txt.indexOf("organic") !== -1) {
      p.presetBase = 1; p.intensity = 15; p.duration = 1.8; p.scale = 3; p.rotation = 2; p.frequency = 5; p.rgb = 10; p.easing = "smooth";
    } else if (txt.indexOf("whip") !== -1 || txt.indexOf("zoom") !== -1 || txt.indexOf("fast") !== -1) {
      p.presetBase = 15; p.intensity = 70; p.duration = 0.5; p.scale = 35; p.rotation = 6; p.frequency = 25; p.rgb = 40; p.easing = "expo";
    } else if (txt.indexOf("crash") !== -1 || txt.indexOf("car") !== -1 || txt.indexOf("collision") !== -1) {
      p.presetBase = 13; p.intensity = 95; p.duration = 1.0; p.scale = 25; p.rotation = 22; p.frequency = 20; p.rgb = 90; p.easing = "elastic";
    }

    if (el("customShakeName")) el("customShakeName").value = "AI: " + promptText.slice(0, 24);
    if (el("studioIntensity")) el("studioIntensity").value = p.intensity;
    if (el("studioDuration")) el("studioDuration").value = p.duration;
    if (el("studioScale")) el("studioScale").value = p.scale;
    if (el("studioRotation")) el("studioRotation").value = p.rotation;
    if (el("studioFrequency")) el("studioFrequency").value = p.frequency;
    if (el("studioRgb")) el("studioRgb").value = p.rgb;

    var badge = el("aiSynthesisBadge");
    if (badge) badge.textContent = "SYNTHESIZED ✨";
    var summary = el("aiParamSummary");
    if (summary) summary.textContent = "INTENSITY " + p.intensity + " • FREQ " + p.frequency + "Hz • RGB " + p.rgb + "%";

    var canvas = el("studioShakeCanvas");
    if (canvas) startLiveShakeSimulation(canvas, p, p.presetBase, drawMotionGraph);
    toast("AI Motion Synthesized!", "ok");
  }

  // ---------------- ASSET STUDIO & BUILDER MODAL ----------------
  function openAssetStudio() {
    var modal = el("assetStudioModal");
    if (!modal) return;
    modal.style.display = "flex";
    var defaultDuration = el("studioDuration");
    if (defaultDuration) defaultDuration.value = GS.Settings.get("defaultShakeDuration") || 0.6;

    var canvas = el("studioShakeCanvas");
    if (canvas) startLiveStudioShake();

    renderCustomAssetsManagerList();
  }

  function closeAssetStudio() {
    var modal = el("assetStudioModal");
    if (modal) modal.style.display = "none";
    stopLiveShakeSimulation();
  }

  var graphHistory = [];
  function drawMotionGraph(dx, dy) {
    var graphCanvas = el("studioGraphCanvas");
    if (!graphCanvas) return;
    var gCtx = graphCanvas.getContext("2d");
    var gw = graphCanvas.width = 280;
    var gh = graphCanvas.height = 35;

    graphHistory.push({ x: dx, y: dy });
    if (graphHistory.length > 80) graphHistory.shift();

    gCtx.clearRect(0, 0, gw, gh);

    // Center line
    gCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    gCtx.lineWidth = 1;
    gCtx.beginPath();
    gCtx.moveTo(0, gh / 2); gCtx.lineTo(gw, gh / 2);
    gCtx.stroke();

    // Plot X Curve (Cyan)
    gCtx.strokeStyle = "#00F2FE";
    gCtx.lineWidth = 1.5;
    gCtx.beginPath();
    for (var i = 0; i < graphHistory.length; i++) {
      var px = (i / 80) * gw;
      var py = gh / 2 + (graphHistory[i].x * 0.4);
      if (i === 0) gCtx.moveTo(px, py);
      else gCtx.lineTo(px, py);
    }
    gCtx.stroke();

    // Plot Y Curve (Violet)
    gCtx.strokeStyle = "#7F00FF";
    gCtx.lineWidth = 1.2;
    gCtx.beginPath();
    for (var j = 0; j < graphHistory.length; j++) {
      var px2 = (j / 80) * gw;
      var py2 = gh / 2 + (graphHistory[j].y * 0.4);
      if (j === 0) gCtx.moveTo(px2, py2);
      else gCtx.lineTo(px2, py2);
    }
    gCtx.stroke();
  }

  function startLiveStudioShake() {
    var canvas = el("studioShakeCanvas");
    if (!canvas) return;
    var presetBase = parseInt((el("studioPresetBase") && el("studioPresetBase").value) || "3", 10);
    var p = {
      intensity: parseFloat((el("studioIntensity") && el("studioIntensity").value) || 45),
      duration: parseFloat((el("studioDuration") && el("studioDuration").value) || 0.8),
      scale: parseFloat((el("studioScale") && el("studioScale").value) || 15),
      rotation: parseFloat((el("studioRotation") && el("studioRotation").value) || 10),
      frequency: parseFloat((el("studioFrequency") && el("studioFrequency").value) || 18),
      rgb: parseFloat((el("studioRgb") && el("studioRgb").value) || 40),
      easing: (el("studioEasingCurve") && el("studioEasingCurve").value) || "expo"
    };
    startLiveShakeSimulation(canvas, p, presetBase, drawMotionGraph);
  }

  function exportPresetPack() {
    var custom = GS.DB.getCustomAssets();
    if (!custom || !custom.length) {
      toast("No custom assets to export!", "err");
      return;
    }
    var jsonStr = JSON.stringify(custom, null, 2);
    var blob = new Blob([jsonStr], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "JamoVFX_Custom_Presets_" + Date.now() + ".json";
    a.click();
    toast("Exported Custom Presets Pack!", "ok");
  }

  function importPresetPack(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var pack = JSON.parse(e.target.result);
        if (Array.isArray(pack)) {
          pack.forEach(function (item) { GS.DB.addCustomAsset(item); });
          toast("Imported " + pack.length + " presets!", "ok");
          renderCustomAssetsManagerList();
          refreshAll();
        }
      } catch (err) {
        toast("Invalid preset pack file!", "err");
      }
    };
    reader.readAsText(file);
  }

  function renderCustomAssetsManagerList() {
    var list = el("customAssetsList");
    if (!list) return;
    var custom = GS.DB.getCustomAssets();
    if (!custom || !custom.length) {
      list.innerHTML = '<p style="color:var(--text-mid); font-size:10px; text-align:center; padding:10px;">No custom assets created yet.</p>';
      return;
    }
    list.innerHTML = "";
    custom.forEach(function (ca) {
      var item = document.createElement("div");
      item.className = "custom-asset-item";
      item.innerHTML =
        '<div>' +
          '<div style="font-weight:700; color:var(--text-hi);">' + escapeHTML(ca.name) + '</div>' +
          '<div style="font-size:9px; color:var(--text-mid);">' + escapeHTML(ca.category) + ' (' + (ca.type || "custom") + ')</div>' +
        '</div>' +
        '<div class="custom-asset-actions"><button class="edit-btn">EDIT</button><button class="delete-btn">DELETE</button></div>';

      item.querySelector(".edit-btn").onclick = function () {
        var nextName = window.prompt("Asset name", ca.name);
        if (nextName === null) return;
        var nextCategory = window.prompt("Category", ca.category);
        if (nextCategory === null) return;
        if (!nextName.trim() || !nextCategory.trim()) {
          toast("Name and category are required", "err");
          return;
        }
        GS.DB.updateCustomAsset(ca.id, { name: nextName, category: nextCategory });
        toast("Custom asset updated", "ok");
        renderCustomAssetsManagerList();
        refreshAll();
      };

      item.querySelector(".delete-btn").onclick = function () {
        GS.DB.deleteCustomAsset(ca.id);
        toast("Deleted custom asset", "ok");
        renderCustomAssetsManagerList();
        refreshAll();
      };
      list.appendChild(item);
    });
  }

  // ---------------- Bulk Builder & Intelligent Organization ----------------
  function cleanBulkName(fileName) {
    return String(fileName || "")
      .replace(/\.[^/.]+$/, "")
      .replace(/[._-]+/g, " ")
      .replace(/\b(ES|SFX|SFXPRODUCER|SOUND EFFECT)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function inferBulkMetadata(file) {
    var raw = String(file.name || "").toLowerCase();
    var rules = [
      { category: "Impacts", words: ["impact", "hit", "slam", "crash", "boom", "punch"] },
      { category: "Whooshes", words: ["whoosh", "swoosh", "swish", "sweep", "pass"] },
      { category: "Risers", words: ["riser", "build", "uplift", "ascend", "rise"] },
      { category: "Weapons", words: ["gun", "shot", "reload", "bullet", "weapon", "rifle"] },
      { category: "Vehicles", words: ["car", "engine", "vehicle", "drift", "skid", "horn"] },
      { category: "UI", words: ["click", "button", "beep", "ui", "interface", "notification"] },
      { category: "Glitch", words: ["glitch", "digital", "error", "static", "data"] },
      { category: "Foley", words: ["cloth", "footstep", "paper", "door", "object", "metal"] }
    ];
    var match = rules.filter(function (rule) {
      return rule.words.some(function (word) { return raw.indexOf(word) !== -1; });
    })[0];
    var category = match ? match.category : "My Custom Sounds";
    var tags = [category.toLowerCase()];
    if (raw.indexOf("long") !== -1) tags.push("long");
    if (raw.indexOf("short") !== -1) tags.push("short");
    if (raw.indexOf("reverse") !== -1) tags.push("reverse");
    if (raw.indexOf("heavy") !== -1) tags.push("heavy");
    return { name: cleanBulkName(file.name), category: category, tags: tags };
  }

  function renderBulkQueue() {
    var list = el("bulkAudioQueue");
    var status = el("bulkQueueStatus");
    var importBtn = el("bulkImportBtn");
    if (!list || !status || !importBtn) return;
    status.textContent = bulkAudioQueue.length ? bulkAudioQueue.length + " file" + (bulkAudioQueue.length === 1 ? "" : "s") + " ready" : "No files queued";
    importBtn.disabled = !bulkAudioQueue.length;
    if (!bulkAudioQueue.length) {
      list.innerHTML = '<div class="bulk-empty">Your import queue will appear here.</div>';
      return;
    }
    list.innerHTML = "";
    bulkAudioQueue.forEach(function (item, index) {
      var row = document.createElement("div");
      row.className = "bulk-queue-item";
      row.innerHTML =
        '<span class="bulk-file-type">AUDIO</span>' +
        '<div class="bulk-file-name" title="' + escapeHTML(item.file.name) + '">' + escapeHTML(item.file.name) + '</div>' +
        '<input class="bulk-name-input" value="' + escapeHTML(item.name) + '" aria-label="Asset name" />' +
        '<select class="bulk-category-input" aria-label="Asset category">' +
          ["Impacts", "Whooshes", "Risers", "Weapons", "Vehicles", "UI", "Glitch", "Foley", "My Custom Sounds"].map(function (category) {
            return '<option' + (category === item.category ? " selected" : "") + '>' + category + '</option>';
          }).join("") +
        '</select>' +
        '<button class="bulk-remove-btn" title="Remove from queue">×</button>';
      row.querySelector(".bulk-name-input").addEventListener("input", function (e) { item.name = e.target.value; });
      row.querySelector(".bulk-category-input").addEventListener("change", function (e) { item.category = e.target.value; });
      row.querySelector(".bulk-remove-btn").addEventListener("click", function () {
        bulkAudioQueue.splice(index, 1);
        renderBulkQueue();
      });
      list.appendChild(row);
    });
  }

  function queueBulkAudio(files) {
    Array.prototype.forEach.call(files || [], function (file) {
      var ext = (file.name.match(/\.([a-z0-9]+)$/i) || ["", ""])[1].toLowerCase();
      if (["wav", "mp3", "aiff", "aif", "m4a", "ogg"].indexOf(ext) === -1) return;
      var meta = inferBulkMetadata(file);
      bulkAudioQueue.push({ file: file, name: meta.name, category: meta.category, tags: meta.tags });
    });
    renderBulkQueue();
  }

  function organizeBulkQueue() {
    bulkAudioQueue.forEach(function (item) {
      var meta = inferBulkMetadata(item.file);
      item.name = meta.name;
      item.category = meta.category;
      item.tags = meta.tags;
    });
    renderBulkQueue();
    toast(bulkAudioQueue.length ? "Library metadata organized" : "Add files to organize first", bulkAudioQueue.length ? "ok" : "err");
  }

  function importBulkQueue() {
    if (!bulkAudioQueue.length) return;
    var imported = 0;
    var failed = 0;
    bulkAudioQueue.forEach(function (item) {
      var sourceFile = item.file.path || item.file.name;
      var asset = GS.DB.addCustomAsset({
        id: "audio_bulk_" + Date.now() + "_" + Math.floor(Math.random() * 100000),
        name: item.name || cleanBulkName(item.file.name),
        category: item.category || "My Custom Sounds",
        group: "Custom Audio",
        type: "audio",
        kind: "audio",
        tags: item.tags || [],
        keywords: item.tags || [],
        sourceFile: sourceFile,
        length: ""
      });
      if (asset) imported++;
      else failed++;
    });
    bulkAudioQueue = [];
    renderBulkQueue();
    refreshAll();
    selectCategory("__custom");
    toast(imported + " asset" + (imported === 1 ? "" : "s") + " added" + (failed ? "; " + failed + " failed" : ""), failed ? "err" : "ok");
  }

  // ---------------- First-run Onboarding ----------------
  function finishOnboarding() {
    try { localStorage.setItem("jamovfx.onboarding.complete", "1"); } catch (e) {}
    var overlay = el("onboardingOverlay");
    if (overlay) overlay.style.display = "none";
  }

  function renderOnboardingStep() {
    var overlay = el("onboardingOverlay");
    if (!overlay) return;
    overlay.querySelectorAll(".onboarding-step").forEach(function (step) {
      step.classList.toggle("active", parseInt(step.dataset.onboardingStep, 10) === onboardingStep);
    });
    overlay.querySelectorAll(".onboarding-progress span").forEach(function (dot, index) {
      dot.classList.toggle("active", index === onboardingStep);
      dot.classList.toggle("done", index < onboardingStep);
    });
    var next = el("nextOnboardingBtn");
    if (next) next.textContent = onboardingStep === 2 ? "OPEN MY LIBRARY" : "CONTINUE";
  }

  function openOnboardingIfNeeded() {
    var complete = false;
    try { complete = localStorage.getItem("jamovfx.onboarding.complete") === "1"; } catch (e) {}
    if (complete) return;
    var overlay = el("onboardingOverlay");
    if (overlay) {
      onboardingStep = 0;
      renderOnboardingStep();
      setTimeout(function () { overlay.style.display = "flex"; }, 450);
    }
  }

  // ---------------- Home Overview ----------------
  function renderHome() {
    var all = GS.DB.getAll();
    el("contentTitle").textContent = "Home";
    el("contentCount").textContent = all.length + " assets";
    el("emptyState").style.display = "none";

    var grid = el("cardGrid");
    grid.className = "card-grid list-view";
    grid.innerHTML = "";

    // Home is the complete library view. Filtering and scrolling remain fast
    // because rows are lightweight DOM nodes.
    renderGrid(all);
  }

  // ---------------- Grid & List rendering ----------------
  function renderGrid(assets) {
    var grid = el("cardGrid");
    grid.innerHTML = "";
    grid.className = "card-grid " + (viewMode === "list" ? "list-view" : "grid-view");
    
    el("contentCount").textContent = assets.length + " assets";
    el("emptyState").style.display = assets.length ? "none" : "block";
    if (!assets.length) return;

    // Keep the full result set in memory, but only mount a small batch of DOM
    // nodes. This prevents a low-end CEP machine from creating 1,912 rows at once.
    grid._assetResults = assets;
    grid._assetCursor = 0;
    grid._loadingBatch = false;
    appendAssetBatch(grid);
    grid.onscroll = function () {
      if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 180) appendAssetBatch(grid);
    };
  }

  function appendAssetBatch(grid) {
    if (!grid || grid._loadingBatch || !grid._assetResults || grid._assetCursor >= grid._assetResults.length) return;
    grid._loadingBatch = true;
    var end = Math.min(grid._assetCursor + (viewMode === "list" ? renderBatchSize : 72), grid._assetResults.length);
    var doc = document.createDocumentFragment();
    for (var i = grid._assetCursor; i < end; i++) {
      doc.appendChild(viewMode === "list" ? buildRow(grid._assetResults[i]) : buildCard(grid._assetResults[i]));
    }
    grid.appendChild(doc);
    grid._assetCursor = end;
    grid._loadingBatch = false;
  }

  function isShakeAsset(asset) {
    if (!asset) return false;
    if (asset.type === "shake" || asset.kind === "shake") return true;
    if (asset.group && String(asset.group).toLowerCase().indexOf("shake") !== -1) return true;
    if (asset.category && String(asset.category).toLowerCase().indexOf("shake") !== -1) return true;
    if (asset.file && (/\.(json|ffx|prfpset)$/i).test(asset.file)) return true;
    return false;
  }

  // --- High-Density List Row (32px) ---
  function buildRow(asset) {
    var row = document.createElement("div");
    row.className = "asset-row";
    row.draggable = true;
    row.dataset.id = asset.id;
    if (selectedAsset && selectedAsset.id === asset.id) row.classList.add("selected");
    if (playingAssetId === asset.id) row.classList.add("is-playing");

    var playIcon = isShakeAsset(asset) ? svgIcon("shake") : (playingAssetId === asset.id ? svgIcon("pause") : svgIcon("play"));
    var duration = asset.length || asset.duration || "--:--";

    row.innerHTML =
      '<button class="row-play-btn" title="Preview">' + playIcon + '</button>' +
      '<div class="row-name" title="' + escapeHTML(asset.name) + '">' + escapeHTML(asset.name) + '</div>' +
      '<span class="row-waveform" aria-hidden="true"></span>' +
      '<div class="row-meta">' +
        '<span>' + escapeHTML(asset.category.replace(/^\d+\s*/, "")) + '</span>' +
        '<span>' + escapeHTML(duration) + '</span>' +
        (playingAssetId === asset.id ? '<span class="playing-label">PLAYING</span>' : '') +
        '<span class="card-fav' + (asset.favorite ? " active" : "") + '">' + svgIcon("star") + '</span>' +
        '<button class="row-insert-btn" title="Insert to timeline">' + svgIcon("add") + 'ADD</button>' +
      '</div>';

    var playBtn = row.querySelector(".row-play-btn");
    playBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      selectAsset(asset);
    });

    row.querySelector(".row-insert-btn").addEventListener("click", function (e) {
      e.stopPropagation();
      GS.DB.markRecent(asset.id);
      if (isShakeAsset(asset)) {
        inspectShake(asset);
      } else {
        GS.Host.importSound(asset.file, true);
      }
    });

    row.querySelector(".card-fav").addEventListener("click", function (e) {
      e.stopPropagation();
      GS.DB.toggleFavorite(asset.id);
      e.target.classList.toggle("active");
    });

    row.addEventListener("click", function () {
      selectAsset(asset);
    });

    row.addEventListener("dragstart", function (e) {
      handleDragStart(e, asset.file);
    });

    return row;
  }

  function handleDragStart(e, filePath) {
    var normalized = String(filePath).replace(/\\/g, "/");
    var fileURI = "file:///" + encodeURI(normalized).replace(/#/g, "%23");
    var fileName = filePath.split(/[\\/]/).pop();

    e.dataTransfer.setData("text/plain", filePath);
    e.dataTransfer.setData("text/uri-list", fileURI);
    e.dataTransfer.setData("URL", fileURI);
    e.dataTransfer.setData("DownloadURL", "application/octet-stream:" + fileName + ":" + fileURI);
  }

  // --- Compact Grid Card ---
  function buildCard(asset) {
    var card = document.createElement("div");
    card.className = "asset-card";
    card.draggable = true;
    card.dataset.id = asset.id;
    if (selectedAsset && selectedAsset.id === asset.id) card.classList.add("selected");
    if (playingAssetId === asset.id) card.classList.add("is-playing");

    var icon = isShakeAsset(asset) ? svgIcon("shake") : svgIcon("audio");

    card.innerHTML =
      '<div class="card-preview">' + icon + '</div>' +
      '<div class="card-name">' + escapeHTML(asset.name) + '</div>' +
      '<div class="card-meta"><span>' + asset.category.replace(/^\d+\s*/, "") + '</span>' +
      '<span class="card-fav' + (asset.favorite ? " active" : "") + '">' + svgIcon("star") + '</span></div>';

    card.addEventListener("click", function (e) {
      if (e.target.classList.contains("card-fav")) {
        GS.DB.toggleFavorite(asset.id);
        e.target.classList.toggle("active");
        return;
      }
      selectAsset(asset);
    });

    card.addEventListener("dragstart", function (e) {
      handleDragStart(e, asset.file);
    });

    return card;
  }

  // ---------------- Asset Selection & Floating Mini-Player ----------------
  function selectAsset(asset) {
    selectedAsset = asset;
    document.querySelectorAll(".asset-row, .asset-card").forEach(function (n) {
      n.classList.remove("selected");
      if (n.dataset.id === asset.id) n.classList.add("selected");
    });

    if (isShakeAsset(asset)) {
      inspectShake(asset);
    } else {
      inspectAudio(asset);
      if (GS.Settings.get("autoPreview") !== false) playAudio(asset);
    }
  }

  function openSettings() {
    var modal = el("settingsModal");
    if (!modal) return;
    el("settingAutoPreview").checked = GS.Settings.get("autoPreview") !== false;
    el("settingTheme").value = GS.Settings.get("theme") || "dark";
    el("settingAccent").value = GS.Settings.get("accent") || "#A970FF";
    el("settingVolume").value = GS.Settings.get("volume");
    el("settingMaxRecent").value = GS.Settings.get("maxRecent");
    el("settingShakeDuration").value = GS.Settings.get("defaultShakeDuration") || 0.6;
    modal.style.display = "flex";
  }

  function closeSettings() {
    var modal = el("settingsModal");
    if (modal) modal.style.display = "none";
  }

  function setPlayingState(asset, isPlaying) {
    playingAssetId = isPlaying && asset ? asset.id : null;
    if (!isPlaying && previewTimer) {
      clearInterval(previewTimer);
      previewTimer = null;
    }
    document.querySelectorAll(".asset-row, .asset-card").forEach(function (node) {
      var active = playingAssetId && node.dataset.id === playingAssetId;
      node.classList.toggle("is-playing", !!active);
      var play = node.querySelector(".row-play-btn");
      if (play) play.innerHTML = active ? svgIcon("pause") : svgIcon("play");
    });
    if (asset) {
      var playerButton = el("playerPlayBtn");
      if (playerButton) playerButton.innerHTML = isPlaying ? svgIcon("pause") : svgIcon("play");
      var inspectorButton = el("audioPlayBtn");
      if (inspectorButton) inspectorButton.innerHTML = isPlaying ? svgIcon("pause") + "PAUSE" : svgIcon("play") + "PLAY PREVIEW";
    }
  }

  function playAudio(asset) {
    selectedAsset = asset;
    showPlayerBar(asset);
    setPlayingState(asset, true);
    GS.Player.play(asset.file, {
      onDecoded: function (buffer) {
        drawPlayerWaveform(buffer);
        var preview = el("audioWaveformCanvas");
        if (preview && GS.Player.drawWaveform) GS.Player.drawWaveform(preview, buffer);
        var duration = el("audioDuration");
        if (duration && buffer) duration.textContent = formatDuration(buffer.duration);
        if (previewTimer) clearInterval(previewTimer);
        previewTimer = setInterval(function () {
          if (!GS.Player.isPlaying() || playingAssetId !== asset.id) return;
          var progress = GS.Player.getProgress();
          var current = el("audioCurrentTime");
          if (current && buffer) current.textContent = formatDuration(progress * buffer.duration);
          var audioPreview = el("audioWaveformCanvas");
          if (audioPreview) audioPreview.style.setProperty("--play-progress", (progress * 100) + "%");
        }, 80);
      }
    });
  }

  function formatDuration(seconds) {
    if (!isFinite(seconds)) return "--:--";
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }

  function inspectAudio(asset) {
    var drawer = el("inspectorDrawer");
    var container = el("inspector");
    if (!drawer || !container) return;
    drawer.style.display = "flex";
    el("inspectorTitle").textContent = "AUDIO PREVIEW";
    container.innerHTML =
      '<div class="audio-preview-panel">' +
        '<div class="audio-preview-kicker"><span class="audio-live-dot"></span> SOUND FX PREVIEW <span>WAVEFORM</span></div>' +
        '<div class="audio-artwork"><div class="audio-artwork-glow"></div><span>JV</span></div>' +
        '<canvas id="audioWaveformCanvas" class="audio-waveform" width="520" height="120"></canvas>' +
        '<div class="audio-time-row"><span id="audioCurrentTime">00:00</span><span id="audioDuration">' + escapeHTML(asset.length || "--:--") + '</span></div>' +
        '<h3 class="audio-title">' + escapeHTML(asset.name) + '</h3>' +
        '<p class="audio-meta">' + escapeHTML(asset.category.replace(/^\d+\s*/, "")) + ' <span>•</span> ' + escapeHTML(asset.sampleRate || "STEREO") + '</p>' +
        '<div class="audio-actions"><button id="audioPlayBtn" class="audio-play-btn">' + svgIcon("play") + 'PLAY PREVIEW</button><button id="audioInsertBtn" class="audio-insert-btn">' + svgIcon("add") + 'ADD TO TIMELINE</button></div>' +
      '</div>';
    var preview = el("audioWaveformCanvas");
    if (preview && GS.Player.drawWaveform) GS.Player.drawWaveform(preview);
    el("audioPlayBtn").onclick = function () {
      if (GS.Player.isPlaying() && playingAssetId === asset.id) {
        GS.Player.stop();
        setPlayingState(asset, false);
      } else {
        playAudio(asset);
      }
    };
    el("audioInsertBtn").onclick = function () {
      GS.DB.markRecent(asset.id);
      GS.Host.importSound(asset.file, true);
      toast("Added to timeline", "ok");
    };
  }

  function showPlayerBar(asset) {
    var pBar = el("playerBar");
    if (!pBar) return;
    pBar.style.display = "flex";
    el("playerTitle").textContent = asset.name;

    el("playerPlayBtn").onclick = function () {
      if (GS.Player.isPlaying() && playingAssetId === asset.id) {
        GS.Player.stop();
        setPlayingState(asset, false);
        el("playerPlayBtn").innerHTML = svgIcon("play");
      } else {
        playAudio(asset);
      }
    };

    el("playerInsertBtn").onclick = function () {
      GS.DB.markRecent(asset.id);
      GS.Host.importSound(asset.file, true);
    };

    drawPlayerWaveform();
  }

  function drawPlayerWaveform(buffer) {
    var canvas = el("waveformCanvas");
    if (canvas && GS.Player.drawWaveform) {
      GS.Player.drawWaveform(canvas, buffer);
    }
  }

  // ---------------- Inspector Drawer (Shake preset sliders & Real Camera Viewfinder Simulator) ----------------
  var currentShakeRaf = null;

  function stopLiveShakeSimulation() {
    if (currentShakeRaf) {
      cancelAnimationFrame(currentShakeRaf);
      currentShakeRaf = null;
    }
  }

  function startLiveShakeSimulation(canvas, p, presetNum) {
    stopLiveShakeSimulation();
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width = 230;
    var h = canvas.height = 125;
    var startTime = Date.now();
    var num = presetNum || 1;
    var lastFrameTime = 0;

    function renderScene(targetCtx, offsetX, offsetY, rot, sca, rgbSplit) {
      targetCtx.save();
      targetCtx.clearRect(0, 0, w, h);

      // Dark obsidian void backdrop
      targetCtx.fillStyle = "#090A0F";
      targetCtx.fillRect(0, 0, w, h);

      // Apply camera shake transform centered on canvas
      targetCtx.translate(w / 2 + offsetX, h / 2 + offsetY);
      targetCtx.rotate(rot);
      targetCtx.scale(sca, sca);

      // Motion graphic background frame
      targetCtx.fillStyle = "#121522";
      targetCtx.fillRect(-90, -50, 180, 100);
      targetCtx.strokeStyle = "rgba(0, 242, 254, 0.4)";
      targetCtx.lineWidth = 1.5;
      targetCtx.strokeRect(-90, -50, 180, 100);

      // Camera Rule-of-Thirds Grid
      targetCtx.strokeStyle = "rgba(127, 0, 255, 0.2)";
      targetCtx.lineWidth = 1;
      for (var x = -90; x <= 90; x += 30) {
        targetCtx.beginPath();
        targetCtx.moveTo(x, -50);
        targetCtx.lineTo(x, 50);
        targetCtx.stroke();
      }
      for (var y = -50; y <= 50; y += 25) {
        targetCtx.beginPath();
        targetCtx.moveTo(-90, y);
        targetCtx.lineTo(90, y);
        targetCtx.stroke();
      }

      // Center Subject Box (Target)
      targetCtx.fillStyle = "rgba(0, 242, 254, 0.12)";
      targetCtx.fillRect(-30, -22, 60, 44);
      targetCtx.strokeStyle = "#00F2FE";
      targetCtx.lineWidth = 2;
      targetCtx.strokeRect(-30, -22, 60, 44);

      // Dynamic focal point crosshair
      targetCtx.strokeStyle = "#FFB84D";
      targetCtx.lineWidth = 1;
      targetCtx.beginPath();
      targetCtx.moveTo(-10, 0); targetCtx.lineTo(10, 0);
      targetCtx.moveTo(0, -10); targetCtx.lineTo(0, 10);
      targetCtx.stroke();

      targetCtx.fillStyle = "#FFFFFF";
      targetCtx.font = "bold 9px sans-serif";
      targetCtx.textAlign = "center";
      targetCtx.fillText("PRESET " + num + " TARGET", 0, -26);

      targetCtx.restore();

      // Dynamic RGB Chromatic Aberration on high velocity impact
      if (rgbSplit > 0.5) {
        targetCtx.save();
        targetCtx.globalCompositeOperation = "screen";
        targetCtx.globalAlpha = 0.35;
        targetCtx.fillStyle = "rgba(255, 0, 80, 0.6)";
        targetCtx.fillRect(offsetX * 1.8, offsetY * 1.8, w, h);
        targetCtx.fillStyle = "rgba(0, 242, 254, 0.6)";
        targetCtx.fillRect(-offsetX * 1.8, -offsetY * 1.8, w, h);
        targetCtx.restore();
      }
    }

    function step() {
      if (!canvas || !document.body.contains(canvas)) return;
      var now = Date.now();
      if (document.body.classList.contains("performance-lite") && now - lastFrameTime < 33) {
        currentShakeRaf = requestAnimationFrame(step);
        return;
      }
      lastFrameTime = now;
      var elapsed = (now - startTime) / 1000;
      var dur = Math.max(0.1, p.duration || 0.6);
      var loopProgress = (elapsed % dur) / dur;
      var decay = Math.pow(1 - loopProgress, 1.4);
      var t = elapsed * (p.frequency || 12);
      var intensity = p.intensity || 20;

      var dx = 0, dy = 0, dr = 0, ds = 1;

      switch (num) {
        case 1: // Handheld Organic Drift
          dx = Math.sin(t * 0.8) * (intensity * 0.4) * decay;
          dy = Math.cos(t * 0.6) * (intensity * 0.3) * decay;
          dr = Math.sin(t * 0.4) * 0.03 * decay;
          ds = 1 + Math.sin(t * 0.3) * 0.02 * decay;
          break;
        case 2: // Micro Impact Snap
          dx = (loopProgress < 0.15 ? (intensity * 0.8) : 0) * decay;
          dy = (loopProgress < 0.15 ? (-intensity * 0.5) : 0) * decay;
          dr = (loopProgress < 0.15 ? 0.08 : 0);
          ds = 1 + (loopProgress < 0.2 ? 0.08 : 0);
          break;
        case 3: // Explosion Blast Shockwave
          dx = Math.sin(t * 2.2) * (intensity * 0.6) * decay;
          dy = Math.cos(t * 2.5) * (intensity * 0.5) * decay;
          dr = Math.sin(t * 1.5) * 0.22 * decay;
          ds = 1 + Math.sin(t * 1.8) * 0.18 * decay;
          break;
        case 4: // Earthquake Tremor (Horizontal Ground Rumble)
          dx = Math.sin(t * 3.5) * (intensity * 0.7) * decay;
          dy = 0;
          dr = 0;
          ds = 1;
          break;
        case 5: // Fast Action Punch
          dx = Math.sin(t * 2.0) * (intensity * 0.5) * decay;
          dy = -Math.abs(Math.sin(t * 2.0)) * (intensity * 0.4) * decay;
          dr = Math.sin(t * 1.2) * 0.09 * decay;
          ds = 1 + Math.sin(t * 1.5) * 0.12 * decay;
          break;
        case 6: // Vertical Drop Plunge
          dx = Math.sin(t * 1.0) * 4 * decay;
          dy = Math.sin(loopProgress * Math.PI * 3) * (intensity * 0.6) * decay;
          dr = Math.sin(t * 0.8) * 0.04 * decay;
          ds = 1 + Math.sin(t * 1.0) * 0.06 * decay;
          break;
        case 7: // Wobble Distortion Wave
          dx = Math.sin(t * 0.5) * 6 * decay;
          dy = Math.cos(t * 0.5) * 4 * decay;
          dr = Math.sin(t * 0.8) * 0.20 * decay;
          ds = 1 + Math.sin(t * 0.4) * 0.04 * decay;
          break;
        case 8: // Gunfire Rapid Chatter (Vertical 30Hz Chatter)
          dx = (Math.random() - 0.5) * 4 * decay;
          dy = (Math.sin(t * 4.5) > 0 ? 1 : -1) * (intensity * 0.4) * decay;
          dr = (Math.random() - 0.5) * 0.03 * decay;
          ds = 1 + Math.abs(Math.sin(t * 4.5)) * 0.05 * decay;
          break;
        case 9: // Cinematic Tracking Dolly
          dx = Math.sin(t * 0.4) * 5 * decay;
          dy = Math.cos(t * 0.3) * 4 * decay;
          dr = Math.sin(t * 0.2) * 0.02 * decay;
          ds = 1 + (loopProgress * 0.18);
          break;
        case 10: // Cyberpunk Glitch Strobe
          dx = (Math.floor(t * 3) % 2 === 0 ? 1 : -1) * (intensity * 0.5) * decay;
          dy = (Math.floor(t * 2.5) % 2 === 0 ? -1 : 1) * (intensity * 0.3) * decay;
          dr = (Math.floor(t * 2) % 3 === 0 ? 0.15 : -0.15);
          ds = 1 + (Math.floor(t * 3) % 2 === 0 ? 0.14 : 0);
          break;
        case 11: // Sub-Bass Drop Pulse
          dx = Math.sin(t * 1.2) * 8 * decay;
          dy = Math.cos(t * 1.2) * 6 * decay;
          dr = Math.sin(t * 0.6) * 0.04 * decay;
          ds = 1 + Math.pow(Math.sin(loopProgress * Math.PI * 4), 3) * 0.22;
          break;
        case 12: // Quick Twitch Snap
          dx = (loopProgress < 0.2 ? -1 : loopProgress > 0.8 ? 1 : 0) * (intensity * 0.5) * decay;
          dy = (loopProgress < 0.2 ? 1 : -1) * (intensity * 0.2) * decay;
          dr = (loopProgress < 0.2 ? -0.08 : 0.08);
          ds = 1 + (loopProgress < 0.2 ? 0.04 : 0);
          break;
        case 13: // Collision Crash Shockwave
          dx = Math.sin(t * 2.8) * (intensity * 0.6) * decay;
          dy = Math.cos(t * 2.4) * (intensity * 0.5) * decay;
          dr = Math.sin(t * 1.8) * 0.35 * decay;
          ds = 1 + Math.sin(t * 2.0) * 0.25 * decay;
          break;
        case 14: // Running Handheld Stride
          dx = Math.sin(t * 1.0) * 12 * decay;
          dy = Math.abs(Math.sin(t * 2.0)) * (intensity * 0.5) * decay;
          dr = Math.sin(t * 1.0) * 0.06 * decay;
          ds = 1 + Math.abs(Math.sin(t * 2.0)) * 0.04 * decay;
          break;
        case 15: // Whip Zoom Snap
          dx = Math.sin(t * 1.8) * 15 * decay;
          dy = Math.cos(t * 1.8) * 10 * decay;
          dr = Math.sin(t * 1.0) * 0.08 * decay;
          ds = 1 + (Math.sin(loopProgress * Math.PI) * 0.40);
          break;
        default:
          dx = Math.sin(t * 1.0) * (intensity * 0.35) * decay;
          dy = Math.cos(t * 0.9) * (intensity * 0.35) * decay;
          dr = Math.sin(t * 0.5) * 0.035 * decay;
          ds = 1 + Math.sin(t * 1.2) * 0.05 * decay;
          break;
      }

      var speed = Math.sqrt(dx * dx + dy * dy);
      var rgbSplit = (speed > 4 || num === 3 || num === 8 || num === 10 || num === 13) ? (speed * 0.25 + 1) : 0;

      renderScene(ctx, dx, dy, dr, ds, rgbSplit);
      if (typeof onStep === "function") onStep(dx, dy);

      currentShakeRaf = requestAnimationFrame(step);
    }
    step();
  }

  function getPresetParams(asset) {
    if (asset.params && typeof asset.params === "object" && asset.params.intensity) {
      return Object.assign({}, asset.params);
    }
    var num = 1;
    var m = (asset.name || "").match(/\d+/);
    if (m) {
      num = parseInt(m[0], 10);
    } else {
      var hash = 0;
      for (var i = 0; i < (asset.name || "").length; i++) hash += asset.name.charCodeAt(i);
      num = (hash % 15) + 1;
    }

    var profiles = {
      1: { intensity: 12, duration: 1.2, scale: 2, rotation: 1.5, frequency: 6 },
      2: { intensity: 45, duration: 0.3, scale: 8, rotation: 4.0, frequency: 24 },
      3: { intensity: 85, duration: 0.8, scale: 18, rotation: 12.0, frequency: 18 },
      4: { intensity: 60, duration: 2.5, scale: 10, rotation: 6.0, frequency: 8 },
      5: { intensity: 50, duration: 0.4, scale: 12, rotation: 8.0, frequency: 22 },
      6: { intensity: 35, duration: 0.5, scale: 6, rotation: 2.0, frequency: 16 },
      7: { intensity: 28, duration: 1.0, scale: 5, rotation: 9.0, frequency: 10 },
      8: { intensity: 75, duration: 0.35, scale: 15, rotation: 10.0, frequency: 28 },
      9: { intensity: 18, duration: 1.8, scale: 3, rotation: 2.5, frequency: 5 },
      10: { intensity: 65, duration: 0.45, scale: 14, rotation: 14.0, frequency: 30 },
      11: { intensity: 55, duration: 1.1, scale: 11, rotation: 5.0, frequency: 14 },
      12: { intensity: 22, duration: 0.4, scale: 3, rotation: 3.0, frequency: 18 },
      13: { intensity: 95, duration: 1.0, scale: 22, rotation: 16.0, frequency: 20 },
      14: { intensity: 16, duration: 1.5, scale: 4, rotation: 2.0, frequency: 7 },
      15: { intensity: 70, duration: 0.5, scale: 20, rotation: 7.0, frequency: 25 }
    };

    return profiles[num] || profiles[1];
  }

  function inspectShake(asset) {
    var drawer = el("inspectorDrawer");
    if (!drawer) return;
    stopLiveShakeSimulation();
    drawer.style.display = "flex";
    var titleEl = el("inspectorTitle");
    if (titleEl) titleEl.textContent = asset.name;

    var container = el("inspector");
    var hasVideo = asset.preview && (/\.(mp4|webm|gif|webp)$/i).test(asset.preview);

    var presetNum = 1;
    var m = (asset.name || "").match(/\d+/);
    if (m) presetNum = parseInt(m[0], 10);

    if (hasVideo) {
      container.innerHTML =
        '<div class="shake-preview-viewport">' +
          '<video src="file:///' + encodeURI(asset.preview.replace(/\\/g, "/")) + '" autoplay loop muted style="width:100%; height:100%; object-fit:cover;"></video>' +
        '</div>' +
        '<h3>' + escapeHTML(asset.name) + '</h3>' +
        '<p style="color:var(--text-mid); font-size:10px; margin-bottom:10px;">' + escapeHTML(asset.category) + '</p>' +
        '<div id="shakeControls"></div>' +
          '<button id="applyShakeBtn" class="insert-action-btn" style="width:100%; margin-top:12px; height:32px;">' + svgIcon("bolt") + 'APPLY SHAKE TO TIMELINE</button>';
    } else {
      container.innerHTML =
        '<div class="shake-preview-viewport">' +
          '<canvas id="shakeCanvas" class="shake-canvas"></canvas>' +
          '<div class="hud-layer">' +
            '<div class="hud-top">' +
              '<span class="rec-badge"><span class="rec-dot"></span>REC</span>' +
              '<span>4K 60FPS</span>' +
            '</div>' +
            '<div class="hud-center"><div class="hud-crosshair"></div></div>' +
            '<div class="hud-bottom">' +
              '<span>PRESET #' + presetNum + '</span>' +
              '<span>[ TARGET LOCKED ]</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<h3>' + escapeHTML(asset.name) + '</h3>' +
        '<p style="color:var(--text-mid); font-size:10px; margin-bottom:10px;">' + escapeHTML(asset.category) + '</p>' +
        '<div id="shakeControls"></div>' +
          '<button id="applyShakeBtn" class="insert-action-btn" style="width:100%; margin-top:12px; height:32px;">' + svgIcon("bolt") + 'APPLY SHAKE TO TIMELINE</button>';
    }

    var p = getPresetParams(asset);
    asset.params = p;

    var shakeCanvas = el("shakeCanvas");
    if (shakeCanvas) {
      startLiveShakeSimulation(shakeCanvas, p, presetNum);
    }

    var ctrlRoot = el("shakeControls");

    var sliders = [
      { name: "Intensity", key: "intensity", min: 1, max: 100, step: 1 },
      { name: "Duration (s)", key: "duration", min: 0.1, max: 5, step: 0.1 },
      { name: "Scale", key: "scale", min: 0, max: 30, step: 1 },
      { name: "Rotation", key: "rotation", min: 0, max: 30, step: 1 },
      { name: "Frequency", key: "frequency", min: 1, max: 30, step: 1 }
    ];

    sliders.forEach(function (s) {
      var wrap = document.createElement("div");
      wrap.style.marginBottom = "8px";
      wrap.innerHTML =
        '<div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-mid); margin-bottom:2px;">' +
        '<span>' + s.name + '</span><span id="v_' + s.key + '">' + p[s.key] + '</span></div>' +
        '<input type="range" id="s_' + s.key + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + p[s.key] + '" style="width:100%; accent-color:var(--accent-cyan);" />';
      ctrlRoot.appendChild(wrap);

      wrap.querySelector("input").addEventListener("input", function (e) {
        p[s.key] = parseFloat(e.target.value);
        el("v_" + s.key).textContent = p[s.key];
        if (shakeCanvas) startLiveShakeSimulation(shakeCanvas, p, presetNum);
      });
    });

    el("applyShakeBtn").onclick = function () {
      GS.DB.markRecent(asset.id);
      if (asset.hostHint === "AEFT" && asset.file.endsWith(".ffx")) {
        GS.Host.applyPreset(asset.file, "AEFT");
      } else {
        GS.Host.applyShake(p);
      }
    };
  }

  function closeInspector() {
    var drawer = el("inspectorDrawer");
    if (drawer) drawer.style.display = "none";
    stopLiveShakeSimulation();
  }

  // ---------------- Downloads & Updates views ----------------
  function renderDownloads() {
    el("contentTitle").textContent = "Downloads";
    var items = GS.DB.getDownloads();
    renderGrid(items);
  }

  function renderUpdates() {
    el("contentTitle").textContent = "Updates";
    renderGrid([]);
  }

  // ---------------- Helpers & Wiring ----------------
  function wireEvents() {
    el("toggleSidebarBtn").addEventListener("click", toggleSidebar);
    el("closeSidebarBtn").addEventListener("click", closeSidebar);

    // Static navigation items need explicit wiring; dynamically generated
    // category items are wired in renderSidebar().
    document.querySelectorAll(".sidebar-item[data-cat]").forEach(function (item) {
      item.addEventListener("click", function () {
        selectCategory(item.dataset.cat);
        closeSidebar();
      });
    });
    document.querySelectorAll(".pill[data-cat]").forEach(function (pill) {
      pill.addEventListener("click", function () {
        document.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        selectCategory(pill.dataset.cat);
      });
    });

    var reloadBtn = el("reloadPanelBtn");
    if (reloadBtn) {
      reloadBtn.addEventListener("click", function () {
        toast("Reloading UI…", "ok");
        location.reload(true);
      });
    }

    window.addEventListener("keydown", function (e) {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        location.reload(true);
      }
      if (e.key === "Escape") {
        closeSidebar();
        closeInspector();
        closeAssetStudio();
        closeSettings();
      }
      if (e.key === "/" && document.activeElement !== el("searchInput")) {
        e.preventDefault();
        el("searchInput").focus();
      }
    });

    var studioModal = el("assetStudioModal");
    if (studioModal) {
      studioModal.addEventListener("click", function (e) {
        if (e.target === studioModal) closeAssetStudio();
      });
    }
    var settingsModal = el("settingsModal");
    if (settingsModal) settingsModal.addEventListener("click", function (e) {
      if (e.target === settingsModal) closeSettings();
    });

    el("viewToggleBtn").addEventListener("click", function () {
      viewMode = viewMode === "list" ? "grid" : "list";
      el("viewToggleBtn").innerHTML = viewMode === "list" ? svgIcon("list") : svgIcon("grid");
      selectCategory(currentCategory);
    });

    // Tag pills click handlers
    document.querySelectorAll(".pill-tag").forEach(function (pill) {
      pill.addEventListener("click", function () {
        document.querySelectorAll(".pill").forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var tag = pill.dataset.tag;
        el("searchInput").value = tag;
        var results = GS.DB.search(tag);
        el("contentTitle").textContent = 'Tag: "' + tag.toUpperCase() + '"';
        renderGrid(results);
      });
    });

    var closeInsp = el("closeInspectorBtn");
    if (closeInsp) closeInsp.addEventListener("click", closeInspector);

    var volSlider = el("volumeSlider");
    if (volSlider) {
      volSlider.addEventListener("input", function (e) {
        GS.Player.setVolume(e.target.value);
      });
    }

    var settingsButton = el("settingsBtn");
    if (settingsButton) settingsButton.addEventListener("click", openSettings);
    var closeSettingsButton = el("closeSettingsBtn");
    if (closeSettingsButton) closeSettingsButton.addEventListener("click", closeSettings);
    var autoPreviewSetting = el("settingAutoPreview");
    if (autoPreviewSetting) autoPreviewSetting.addEventListener("change", function (e) { GS.Settings.set("autoPreview", e.target.checked); });
    var themeSetting = el("settingTheme");
    if (themeSetting) themeSetting.addEventListener("change", function (e) {
      GS.Settings.set("theme", e.target.value);
      document.documentElement.dataset.theme = e.target.value;
    });
    var accentSetting = el("settingAccent");
    if (accentSetting) accentSetting.addEventListener("input", function (e) {
      GS.Settings.set("accent", e.target.value);
      document.documentElement.style.setProperty("--accent-cyan", e.target.value);
    });
    var settingVolume = el("settingVolume");
    if (settingVolume) settingVolume.addEventListener("input", function (e) { GS.Player.setVolume(e.target.value); });
    var maxRecentSetting = el("settingMaxRecent");
    if (maxRecentSetting) maxRecentSetting.addEventListener("change", function (e) { GS.Settings.set("maxRecent", Math.max(5, Math.min(200, parseInt(e.target.value, 10) || 40))); });
    var shakeDurationSetting = el("settingShakeDuration");
    if (shakeDurationSetting) shakeDurationSetting.addEventListener("change", function (e) {
      GS.Settings.set("defaultShakeDuration", Math.max(0.1, Math.min(5, parseFloat(e.target.value) || 0.6)));
    });
    var resetSettings = el("resetSettingsBtn");
    if (resetSettings) resetSettings.addEventListener("click", function () {
      GS.Settings.reset();
      openSettings();
      toast("Preferences reset", "ok");
    });

      el("searchInput").addEventListener("input", function (e) {
      var q = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        if (!q.trim()) { selectCategory(currentCategory); return; }
        var results = GS.DB.search(q);
        el("contentTitle").textContent = 'Search: "' + q + '"';
        renderGrid(results);
      }, 120);
    });

    // ---------------- Asset Studio & Builder Modal Events ----------------
    var buildBtn = el("buildAssetBtn");
    if (buildBtn) buildBtn.addEventListener("click", openAssetStudio);

    var closeStudioBtn = el("closeStudioBtn");
    if (closeStudioBtn) closeStudioBtn.addEventListener("click", closeAssetStudio);

    document.querySelectorAll("#assetStudioModal .tab-btn").forEach(function (tab) {
      tab.addEventListener("click", function () {
        document.querySelectorAll("#assetStudioModal .tab-btn").forEach(function (t) { t.classList.remove("active"); });
        document.querySelectorAll("#assetStudioModal .tab-content").forEach(function (c) { c.style.display = "none"; });
        tab.classList.add("active");
        var targetId = tab.dataset.tab;
        var targetEl = el(targetId);
        if (targetEl) targetEl.style.display = "block";
        if (targetId === "manageTab") renderCustomAssetsManagerList();
      });
    });

    var bulkInput = el("bulkAudioInput");
    if (bulkInput) bulkInput.addEventListener("change", function (e) { queueBulkAudio(e.target.files); });
    var bulkOrganize = el("bulkOrganizeBtn");
    if (bulkOrganize) bulkOrganize.addEventListener("click", organizeBulkQueue);
    var bulkImport = el("bulkImportBtn");
    if (bulkImport) bulkImport.addEventListener("click", importBulkQueue);

    // ---------------- AI PROMPT MOTION SYNTHESIZER EVENTS ----------------
    var aiGenBtn = el("generateAiMotionBtn");
    var aiPromptInput = el("aiMotionPrompt");
    if (aiGenBtn && aiPromptInput) {
      aiGenBtn.addEventListener("click", function () {
        synthesizeAiMotion(aiPromptInput.value);
      });
      aiPromptInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") synthesizeAiMotion(aiPromptInput.value);
      });
    }

    document.querySelectorAll(".ai-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var pText = chip.dataset.prompt;
        if (aiPromptInput) aiPromptInput.value = pText;
        synthesizeAiMotion(pText);
      });
    });

    // ---------------- 100X PRO MOTION STUDIO EVENTS ----------------
    var presetBaseSelect = el("studioPresetBase");
    if (presetBaseSelect) presetBaseSelect.addEventListener("change", startLiveStudioShake);

    var easingSelect = el("studioEasingCurve");
    if (easingSelect) easingSelect.addEventListener("change", startLiveStudioShake);

    ["Intensity", "Duration", "Scale", "Rotation", "Frequency", "Rgb"].forEach(function (k) {
      var input = el("studio" + k);
      if (input) {
        input.addEventListener("input", function (e) {
          var valEl = el("studioVal" + k);
          if (valEl) {
            var unit = k === "Duration" ? "s" : k === "Rotation" ? "°" : (k === "Scale" || k === "Rgb") ? "%" : k === "Frequency" ? "Hz" : "";
            valEl.textContent = e.target.value + unit;
          }
          startLiveStudioShake();
        });
      }
    });

    // Bulk File Dropzone Handlers
    var dropZone = el("bulkDropZone");
    var bulkInput = el("bulkFileInput");
    var bulkList = el("bulkFileList");
    var bulkSaveBtn = el("saveBulkBtn");
    var pendingBulkFiles = [];

    if (dropZone) {
      dropZone.addEventListener("click", function () { if (bulkInput) bulkInput.click(); });
      dropZone.addEventListener("dragover", function (e) { e.preventDefault(); dropZone.classList.add("dragover"); });
      dropZone.addEventListener("dragleave", function () { dropZone.classList.remove("dragover"); });
      dropZone.addEventListener("drop", function (e) {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
          handleBulkFiles(e.dataTransfer.files);
        }
      });
    }

    if (bulkInput) {
      bulkInput.addEventListener("change", function (e) {
        if (e.target.files && e.target.files.length) handleBulkFiles(e.target.files);
      });
    }

    function handleBulkFiles(files) {
      pendingBulkFiles = Array.prototype.slice.call(files).filter(function (f) {
        return (/\.(wav|mp3|aiff|m4a|flac|ogg)$/i).test(f.name);
      });
      if (!pendingBulkFiles.length) {
        toast("No supported audio files found!", "err");
        return;
      }
      bulkList.innerHTML = "";
      pendingBulkFiles.forEach(function (f) {
        var div = document.createElement("div");
        div.style.cssText = "font-size:10px; color:var(--text-hi); padding:3px 0; border-bottom:1px solid var(--line-subtle);";
        div.textContent = "🎵 " + f.name + " (" + (f.size / 1024 / 1024).toFixed(1) + " MB)";
        bulkList.appendChild(div);
      });
      if (bulkSaveBtn) bulkSaveBtn.disabled = false;
      toast("Loaded " + pendingBulkFiles.length + " audio files", "ok");
    }

    if (bulkSaveBtn) {
      bulkSaveBtn.addEventListener("click", function () {
        var cat = (el("bulkCategoryInput").value || "").trim() || "Imported Pack";
        pendingBulkFiles.forEach(function (f) {
          var name = f.name.replace(/\.[^/.]+$/, "");
          var asset = {
            id: "audio_custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            name: name,
            category: cat,
            group: "Custom Audio",
            type: "audio",
            kind: "audio",
            sourceFile: f.path || f.name,
            length: "00:03"
          };
          GS.DB.addCustomAsset(asset);
        });
        toast("Batch imported " + pendingBulkFiles.length + " audio assets!", "ok");
        pendingBulkFiles = [];
        bulkList.innerHTML = "";
        bulkSaveBtn.disabled = true;
        closeAssetStudio();
        refreshAll();
        selectCategory("__custom");
      });
    }

    // Export & Import Pack Buttons
    var exportBtn = el("exportPackBtn");
    if (exportBtn) exportBtn.addEventListener("click", exportPresetPack);

    var importBtn = el("importPackBtn");
    var importInput = el("importPackInput");
    if (importBtn && importInput) {
      importBtn.addEventListener("click", function () { importInput.click(); });
      importInput.addEventListener("change", function (e) {
        if (e.target.files && e.target.files.length) importPresetPack(e.target.files[0]);
      });
    }

    var saveShakeBtn = el("saveCustomShakeBtn");
    if (saveShakeBtn) {
      saveShakeBtn.addEventListener("click", function () {
        var name = (el("customShakeName").value || "").trim() || "Custom Shake Preset";
        var cat = (el("customShakeCategory").value || "").trim() || "Custom Shakes";
        var presetBase = parseInt((el("studioPresetBase") && el("studioPresetBase").value) || "3", 10);
        var p = {
          presetBase: presetBase,
          intensity: parseFloat(el("studioIntensity").value),
          duration: parseFloat(el("studioDuration").value),
          scale: parseFloat(el("studioScale").value),
          rotation: parseFloat(el("studioRotation").value),
           frequency: parseFloat((el("studioFrequency") && el("studioFrequency").value) || "14"),
           rgb: parseFloat((el("studioRgb") && el("studioRgb").value) || "0"),
           easing: (el("studioEasingCurve") && el("studioEasingCurve").value) || "linear"
        };
        var asset = {
          id: "shake_custom_" + Date.now(),
          name: name,
          category: cat,
          group: "Shakes",
          type: "shake",
          kind: "shake",
          file: "custom_shake.json",
          params: p
        };
        if (!GS.DB.addCustomAsset(asset)) {
          toast("Could not save the custom shake preset", "err");
          return;
        }
        toast("Saved Custom Shake Preset to Library!", "ok");
        closeAssetStudio();
        refreshAll();
        selectCategory("__custom");
      });
    }

    var saveAudioBtn = el("saveCustomAudioBtn");
    if (saveAudioBtn) {
      saveAudioBtn.addEventListener("click", function () {
        var fileInput = el("audioFileInput");
        var name = (el("customAudioName").value || "").trim();
        var cat = (el("customAudioCategory").value || "").trim() || "My Custom Sounds";
         var tagsField = el("customAudioTags");
         var tagsStr = tagsField ? (tagsField.value || "").trim() : "";

        if (!fileInput.files || !fileInput.files.length) {
          toast("Please select an audio file first!", "err");
          return;
        }
        var file = fileInput.files[0];
        var extension = (file.name.match(/\.([a-z0-9]+)$/i) || ["", ""])[1].toLowerCase();
        if (["wav", "mp3", "aiff", "aif", "m4a", "ogg", "flac"].indexOf(extension) === -1) {
          toast("Unsupported audio format", "err");
          return;
        }
        var assetName = name || file.name.replace(/\.[^/.]+$/, "");
        var tagsArr = tagsStr ? tagsStr.split(",").map(function(t) { return t.trim(); }).filter(Boolean) : [];
        var asset = {
          id: "audio_custom_" + Date.now(),
          name: assetName,
          category: cat,
          group: "Custom Audio",
          type: "audio",
          kind: "audio",
          tags: tagsArr,
          sourceFile: file.path || file.name,
          length: ""
        };
        if (!GS.DB.addCustomAsset(asset)) {
          toast("Could not copy audio into the extension library", "err");
          return;
        }
        toast("Added Audio Asset to Library!", "ok");
        closeAssetStudio();
        refreshAll();
        selectCategory("__custom");
      });
    }

    var nextOnboarding = el("nextOnboardingBtn");
    if (nextOnboarding) nextOnboarding.addEventListener("click", function () {
      if (onboardingStep >= 2) finishOnboarding();
      else { onboardingStep++; renderOnboardingStep(); }
    });
    var skipOnboarding = el("skipOnboardingBtn");
    if (skipOnboarding) skipOnboarding.addEventListener("click", finishOnboarding);
  }

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function svgIcon(name) {
    var paths = {
      play: '<path d="m8 5 11 7-11 7z"/>',
      pause: '<path d="M7 5h3v14H7zM14 5h3v14h-3z"/>',
      star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
      add: '<path d="M12 5v14M5 12h14"/>',
      bolt: '<path d="m13 2-8 12h6l-1 8 8-12h-6z"/>',
      shake: '<path d="m4 9 5 3-5 3M20 9l-5 3 5 3M12 4v16"/>',
      audio: '<path d="M5 10v4h3l4 4V6l-4 4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
      list: '<path d="M5 6h14M5 12h14M5 18h14"/>',
      grid: '<path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z"/>'
    };
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || paths.audio) + '</svg>';
  }

  function init() {
    if ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || document.body.classList.contains("low-spec")) {
      document.body.classList.add("performance-lite");
    }
    document.documentElement.dataset.theme = GS.Settings.get("theme") || "dark";
    document.documentElement.style.setProperty("--accent-cyan", GS.Settings.get("accent") || "#A970FF");
    wireEvents();
    renderSidebar();
    selectCategory("__home");
    GS.Player.onEnded(function () {
      if (selectedAsset) setPlayingState(selectedAsset, false);
    });
    el("assetTotal").textContent = GS.DB.getAll().length + " assets";
    openOnboardingIfNeeded();
  }

  function refreshAll() {
    renderSidebar();
    selectCategory(currentCategory);
    el("assetTotal").textContent = GS.DB.getAll().length + " assets";
  }

  return {
    init: init,
    refreshAll: refreshAll,
    toast: toast
  };
})();
