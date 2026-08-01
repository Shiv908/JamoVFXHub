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
    else if (cat === "__favorites") { title = "Favorites"; assets = GS.DB.getFavorites(); }
    else if (cat === "__recent") { title = "Recent"; assets = GS.DB.getRecent(); }
    else if (cat === "__downloads") { renderDownloads(); return; }
    else if (cat === "__updates") { renderUpdates(); return; }
    else { assets = GS.DB.getByCategory(cat); }

    el("contentTitle").textContent = title;
    renderGrid(assets);
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

    // Show top 50 recent / featured assets in high-density list
    var sample = all.slice(0, 100);
    renderGrid(sample);
  }

  // ---------------- Grid & List rendering ----------------
  function renderGrid(assets) {
    var grid = el("cardGrid");
    grid.innerHTML = "";
    grid.className = "card-grid " + (viewMode === "list" ? "list-view" : "grid-view");
    
    el("contentCount").textContent = assets.length + " assets";
    el("emptyState").style.display = assets.length ? "none" : "block";
    if (!assets.length) return;

    var doc = document.createDocumentFragment();
    for (var i = 0; i < assets.length; i++) {
      if (viewMode === "list") doc.appendChild(buildRow(assets[i]));
      else doc.appendChild(buildCard(assets[i]));
    }
    grid.appendChild(doc);
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

    var playIcon = isShakeAsset(asset) ? "◆" : (playingAssetId === asset.id ? "❚❚" : "▶");
    var duration = asset.length || asset.duration || "--:--";

    row.innerHTML =
      '<button class="row-play-btn" title="Preview">' + playIcon + '</button>' +
      '<div class="row-name" title="' + escapeHTML(asset.name) + '">' + escapeHTML(asset.name) + '</div>' +
      '<span class="row-waveform" aria-hidden="true"></span>' +
      '<div class="row-meta">' +
        '<span>' + escapeHTML(asset.category.replace(/^\d+\s*/, "")) + '</span>' +
        '<span>' + escapeHTML(duration) + '</span>' +
        (playingAssetId === asset.id ? '<span class="playing-label">PLAYING</span>' : '') +
        '<span class="card-fav' + (asset.favorite ? " active" : "") + '">★</span>' +
        '<button class="row-insert-btn" title="Insert to timeline">ADD</button>' +
      '</div>';

    var playBtn = row.querySelector(".row-play-btn");
    playBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      selectAsset(asset);
      if (isShakeAsset(asset)) {
        inspectShake(asset);
      } else {
        playAudio(asset);
      }
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

    var icon = isShakeAsset(asset) ? "🎬" : "🔊";

    card.innerHTML =
      '<div class="card-preview">' + icon + '</div>' +
      '<div class="card-name">' + escapeHTML(asset.name) + '</div>' +
      '<div class="card-meta"><span>' + asset.category.replace(/^\d+\s*/, "") + '</span>' +
      '<span class="card-fav' + (asset.favorite ? " active" : "") + '">★</span></div>';

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
      playAudio(asset);
    }
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
      if (play) play.textContent = active ? "❚❚" : (selectedAsset && selectedAsset.id === node.dataset.id ? "▶" : play.textContent);
    });
    if (asset) {
      var playerButton = el("playerPlayBtn");
      if (playerButton) playerButton.textContent = isPlaying ? "❚❚" : "▶";
      var inspectorButton = el("audioPlayBtn");
      if (inspectorButton) inspectorButton.textContent = isPlaying ? "❚❚  PAUSE" : "▶  PLAY PREVIEW";
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
        '<div class="audio-actions"><button id="audioPlayBtn" class="audio-play-btn">▶  PLAY PREVIEW</button><button id="audioInsertBtn" class="audio-insert-btn">ADD TO TIMELINE</button></div>' +
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
        el("playerPlayBtn").textContent = "▶";
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

  function startLiveShakeSimulation(canvas, p, presetNum) {
    if (currentShakeRaf) cancelAnimationFrame(currentShakeRaf);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width = 230;
    var h = canvas.height = 125;
    var startTime = Date.now();
    var num = presetNum || 1;

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
      var elapsed = (Date.now() - startTime) / 1000;
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
        '<button id="applyShakeBtn" class="insert-action-btn" style="width:100%; margin-top:12px; height:32px;">⚡ APPLY SHAKE TO TIMELINE</button>';
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
        '<button id="applyShakeBtn" class="insert-action-btn" style="width:100%; margin-top:12px; height:32px;">⚡ APPLY SHAKE TO TIMELINE</button>';
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
    });

    el("viewToggleBtn").addEventListener("click", function () {
      viewMode = viewMode === "list" ? "grid" : "list";
      el("viewToggleBtn").textContent = viewMode === "list" ? "☰" : "☷";
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

    el("searchInput").addEventListener("input", function (e) {
      var q = e.target.value;
      if (!q.trim()) { selectCategory(currentCategory); return; }
      var results = GS.DB.search(q);
      el("contentTitle").textContent = 'Search: "' + q + '"';
      renderGrid(results);
    });
  }

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function init() {
    wireEvents();
    renderSidebar();
    selectCategory("__home");
    GS.Player.onEnded(function () {
      if (selectedAsset) setPlayingState(selectedAsset, false);
    });
    el("assetTotal").textContent = GS.DB.getAll().length + " assets";
    el("settingsBtn").addEventListener("click", function () {
      toast("JamoVFX Hub - Ready", "ok");
    });
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
