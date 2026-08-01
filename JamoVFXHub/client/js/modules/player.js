/**
 * JV.Player
 * Lightweight audio preview player with a canvas waveform and volume control,
 * built on the Web Audio API (available inside CEP's Chromium runtime).
 */
var GS = window.GS || {};
window.GS = GS;

GS.Player = (function () {
  var audioCtx = null;
  var gainNode = null;
  var currentSource = null;
  var currentBuffer = null;
  var isPlaying = false;
  var isLooping = false;
  var startedAt = 0;
  var endedCbs = [];

  function ctx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.value = (GS.Settings && GS.Settings.get("volume")) || 0.8;
    }
    return audioCtx;
  }

  function loadAndDecode(filePath, cb) {
    var fs = require("fs");
    fs.readFile(filePath, function (err, data) {
      if (err) return cb(err);
      var arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      ctx().decodeAudioData(arrayBuffer, function (buffer) {
        cb(null, buffer);
      }, function (decodeErr) { cb(decodeErr); });
    });
  }

  function stop() {
    if (currentSource) {
      try { currentSource.onended = null; currentSource.stop(); } catch (e) {}
      currentSource = null;
    }
    isPlaying = false;
  }

  function play(filePath, opts) {
    opts = opts || {};
    stop();
    loadAndDecode(filePath, function (err, buffer) {
      if (err) { console.error("JV.Player decode error", err); return; }
      currentBuffer = buffer;
      startSource(0);
      if (opts.onDecoded) opts.onDecoded(buffer);
    });
  }

  function startSource(startOffset) {
    var source = ctx().createBufferSource();
    source.buffer = currentBuffer;
    source.loop = isLooping;
    source.connect(gainNode);
    source.onended = function () {
      if (!isLooping) {
        isPlaying = false;
        endedCbs.forEach(function (cb) { try { cb(); } catch (e) {} });
      }
    };
    source.start(0, startOffset);
    startedAt = ctx().currentTime - startOffset;
    currentSource = source;
    isPlaying = true;
  }

  function toggleLoop(val) { isLooping = val; if (currentSource) currentSource.loop = val; }

  function setVolume(val) {
    val = Math.max(0, Math.min(1, parseFloat(val) || 0));
    if (GS.Settings) GS.Settings.set("volume", val);
    if (gainNode) gainNode.gain.value = val;
  }

  function getProgress() {
    if (!isPlaying || !currentBuffer) return 0;
    return Math.min(1, (ctx().currentTime - startedAt) / currentBuffer.duration);
  }

  function drawWaveform(canvas, buffer) {
    var dc = canvas.getContext("2d");
    var w = canvas.width, h = canvas.height;
    dc.clearRect(0, 0, w, h);
    if (!buffer) return;
    var data = buffer.getChannelData(0);
    var step = Math.ceil(data.length / w);
    var mid = h / 2;
    dc.fillStyle = "#A970FF";
    for (var i = 0; i < w; i++) {
      var min = 1.0, max = -1.0;
      for (var j = 0; j < step; j++) {
        var v = data[i * step + j] || 0;
        if (v < min) min = v;
        if (v > max) max = v;
      }
      dc.fillRect(i, mid + min * mid, 1, Math.max(1, (max - min) * mid));
    }
  }

  return {
    play: play,
    stop: stop,
    toggleLoop: toggleLoop,
    setVolume: setVolume,
    getProgress: getProgress,
    drawWaveform: drawWaveform,
    isPlaying: function () { return isPlaying; },
    onEnded: function (cb) { endedCbs.push(cb); }
  };
})();
