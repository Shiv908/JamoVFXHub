// =====================================================================
// JamoVFX Hub — ExtendScript Host
// Runs INSIDE After Effects OR Premiere Pro's ExtendScript engine.
// The panel calls these functions via CSInterface.evalScript().
// Keep every function returning a STRING (ExtendScript <-> CEP can only
// pass strings/JSON reliably).
// =====================================================================

function isAfterEffects() {
    try { return app.name.toLowerCase().indexOf("after effects") > -1; }
    catch (e) { return false; }
}

function ok(extra) {
    extra = extra || {};
    extra.ok = true;
    return JSON.stringify(extra);
}

function fail(msg) {
    return JSON.stringify({ ok: false, error: String(msg) });
}

/**
 * Import one or more audio files into the active project's root bin,
 * then (optionally) place them at the playhead on the active
 * sequence (Premiere) / composition (After Effects).
 * @param {string} filePathsJSON - JSON array of absolute file paths
 * @param {boolean} dropOnTimeline - if true, also place at playhead
 */
function gsImportSound(filePathsJSON, dropOnTimeline) {
    try {
        var paths = JSON.parse(filePathsJSON);
        if (!app.project) return fail("No active project.");

        if (isAfterEffects()) {
            app.beginUndoGroup("JamoVFX Hub — Import Sound");
            var items = [];
            try {
                for (var i = 0; i < paths.length; i++) {
                    var io = new ImportOptions(new File(paths[i]));
                    io.sequence = false;
                    var item = app.project.importFile(io);
                    if (item) items.push(item);
                }
                if (items.length === 0) return fail("Nothing was imported.");
                if (dropOnTimeline) {
                    var comp = app.project.activeItem;
                    if (!comp || comp.typeName !== "Composition") return fail("No active composition.");
                    for (var j = 0; j < items.length; j++) {
                        var layer = comp.layers.add(items[j]);
                        layer.startTime = comp.time;
                    }
                }
            } finally {
                app.endUndoGroup();
            }
            return ok({ count: items.length });
        }

        // ---------- Premiere Pro ----------
        var imported = false;
        if (app.project && typeof app.project.importFiles === "function") {
            try {
                app.project.importFiles(paths, true, app.project.rootItem, false);
                imported = true;
            } catch (e1) {}
        }
        if (!imported && app.project && typeof app.project.importFile === "function") {
            try {
                for (var k = 0; k < paths.length; k++) {
                    app.project.importFile(paths[k], true, app.project.rootItem, false);
                }
                imported = true;
            } catch (e2) {}
        }
        if (!imported && typeof qe !== "undefined" && qe.project && typeof qe.project.importFiles === "function") {
            try {
                qe.project.importFiles(paths, true);
                imported = true;
            } catch (e3) {}
        }

        if (dropOnTimeline) {
            var seq = app.project.activeSequence;
            if (!seq) {
                if (!imported) return fail("No active sequence and import failed.");
                return ok({ note: "Imported to project bin (no active sequence)." });
            }
            var target = findProjectItemByPath(paths[0]);
            if (!target) {
                var fileName = new File(paths[0]).name;
                target = findProjectItemByName(fileName);
            }
            if (target && seq.audioTracks && seq.audioTracks.numTracks > 0) {
                var trackIndex = 0;
                for (var t = 0; t < seq.audioTracks.numTracks; t++) {
                    if (seq.audioTracks[t].isTargeted && seq.audioTracks[t].isTargeted()) {
                        trackIndex = t;
                        break;
                    }
                }
                var track = seq.audioTracks[trackIndex];
                var insertTime = seq.getPlayerPosition ? seq.getPlayerPosition() : { seconds: 0 };
                var timeSec = typeof insertTime === "object" ? insertTime.seconds : (parseFloat(insertTime) || 0);
                track.insertClip(target, timeSec);
            }
        }
        return ok();
    } catch (e) {
        return fail(e.toString());
    }
}

/**
 * Recursively search the project panel for an item matching a file path.
 */
function findProjectItemByPath(path, root) {
    root = root || app.project.rootItem;
    var normalized = String(path).replace(/\\/g, "/");
    for (var i = 0; i < root.children.numItems; i++) {
        var item = root.children[i];
        var mediaPath = "";
        if (item.getMediaPath) {
            mediaPath = String(item.getMediaPath()).replace(/\\/g, "/");
        }
        if (mediaPath === normalized) return item;
        if (item.type === 2 /* bin */) {
            var found = findProjectItemByPath(path, item);
            if (found) return found;
        }
    }
    return null;
}

function findProjectItemByName(name, root) {
    root = root || app.project.rootItem;
    for (var i = 0; i < root.children.numItems; i++) {
        var item = root.children[i];
        if (item.name === name) return item;
        if (item.type === 2 /* bin */) {
            var found = findProjectItemByName(name, item);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Apply a "shake" to the current selection by keyframing
 * Position / Rotation / Scale, driven by the preset's parameters.
 * Works on the selected video clip (Premiere) or selected layer (AE).
 * @param {string} paramsJSON - {intensity, duration, scale, rotation, frequency, seed}
 */
function gsApplyShake(paramsJSON) {
    try {
        var p = JSON.parse(paramsJSON);
        if (isAfterEffects()) return applyShakeAE(p);
        return applyShakePP(p);
    } catch (e) {
        return fail(e.toString());
    }
}

function applyShakeAE(p) {
    var comp = app.project.activeItem;
    if (!comp || comp.typeName !== "Composition") return fail("Open a composition and select a layer first.");
    var layers = comp.selectedLayers;
    if (!layers || layers.length === 0) return fail("Select a layer in the composition first.");

    app.beginUndoGroup("JamoVFX Hub — Apply Shake");
    try {
        var layer = layers[0];
        var pos = layer.property("Position");
        var rot = layer.property("Rotation");
        var sca = layer.property("Scale");
        if (!pos) return fail("Position property not found on layer.");

        if (p.motionBlur) {
            try { layer.motionBlur = true; } catch (e) {}
        }

        var fps = comp.frameRate || 30;
        var totalFrames = Math.max(2, Math.round(p.duration * fps));
        var startTime = comp.time;
        var rand = makeSeededRandom(p.seed || 1);
        var dir = p.invert ? -1 : 1;

        var baseX = (pos.value[0] || 0) + (p.anchorX || 0);
        var baseY = (pos.value[1] || 0) + (p.anchorY || 0);
        var baseRot = rot ? rot.value : 0;
        var baseScale = sca ? sca.value : 100;

        pos.setValueAtTime(startTime, pos.value);
        if (rot) rot.setValueAtTime(startTime, rot.value);
        if (sca) sca.setValueAtTime(startTime, sca.value);

        var stepFrames = Math.max(1, Math.round(fps / p.frequency));
        for (var f = 0; f <= totalFrames; f += stepFrames) {
            var t = startTime + (f / fps);
            var decay = p.reverse ? (f / totalFrames) : (1 - (f / totalFrames));
            var dx = dir * (rand() - 0.5) * p.intensity * decay;
            var dy = dir * (rand() - 0.5) * p.intensity * decay;
            var dr = dir * (rand() - 0.5) * (p.rotation || 0) * decay;
            var ds = (rand() - 0.5) * (p.scale || 0) * decay;

            pos.setValueAtTime(t, [baseX + dx, baseY + dy]);
            if (rot) rot.setValueAtTime(t, baseRot + dr);
            if (sca) sca.setValueAtTime(t, baseScale + ds);
        }
    } finally {
        app.endUndoGroup();
    }

    return ok();
}

function applyShakePP(p) {
    var seq = app.project.activeSequence;
    if (!seq) return fail("No active sequence.");

    var clip = getSelectedVideoClip(seq);
    if (!clip) return fail("Select a clip on the timeline first.");

    var motion = getComponent(clip, "Motion");
    if (!motion) return fail("Motion effect not found on clip.");

    var posProp = getProperty(motion, "Position");
    var rotProp = getProperty(motion, "Rotation");
    var scaleProp = getProperty(motion, "Scale");

    var fps = 30;
    try {
        if (seq.getSettings && seq.getSettings().videoFrameRate && seq.getSettings().videoFrameRate.seconds) {
            fps = 1 / seq.getSettings().videoFrameRate.seconds;
        }
    } catch (e) { /* fall back to 30 */ }

    var totalFrames = Math.max(2, Math.round(p.duration * fps));
    var startTime = clip.start.seconds;
    var rand = makeSeededRandom(p.seed || 1);
    var dir = p.invert ? -1 : 1;

    var baseX = (posProp.getValueAtTime ? posProp.getValueAtTime(startTime)[0] : 0) + (p.anchorX || 0);
    var baseY = (posProp.getValueAtTime ? posProp.getValueAtTime(startTime)[1] : 0) + (p.anchorY || 0);
    var baseRot = rotProp.getValueAtTime ? rotProp.getValueAtTime(startTime) : 0;
    var baseScale = scaleProp.getValueAtTime ? scaleProp.getValueAtTime(startTime) : 100;

    posProp.setTimeVarying(true);
    rotProp.setTimeVarying(true);
    scaleProp.setTimeVarying(true);

    var stepFrames = Math.max(1, Math.round(fps / p.frequency));
    for (var f = 0; f <= totalFrames; f += stepFrames) {
        var t = startTime + (f / fps);
        var decay = p.reverse ? (f / totalFrames) : (1 - (f / totalFrames));
        var dx = dir * (rand() - 0.5) * p.intensity * decay;
        var dy = dir * (rand() - 0.5) * p.intensity * decay;
        var dr = dir * (rand() - 0.5) * (p.rotation || 0) * decay;
        var ds = 100 + (rand() - 0.5) * (p.scale || 0) * decay;

        posProp.setValueAtTime(t, [baseX + dx, baseY + dy], true);
        rotProp.setValueAtTime(t, baseRot + dr, true);
        scaleProp.setValueAtTime(t, baseScale ? baseScale + (ds - 100) : ds, true);
    }

    return ok();
}

/**
 * Apply the ACTUAL preset file (.ffx in After Effects).
 * Premiere Pro exposes no script API to apply a .prfpset to a clip —
 * there we fall back to the custom keyframe shake instead.
 * @param {string} presetFileJSON - absolute path to the preset file
 */
function gsApplyPreset(presetFileJSON) {
    try {
        var presetFile = JSON.parse(presetFileJSON);
        var f = new File(presetFile);
        if (!f.exists) return fail("Preset file not found: " + presetFile);

        if (isAfterEffects()) {
            var comp = app.project.activeItem;
            if (!comp || comp.typeName !== "Composition") return fail("Open a composition and select a layer first.");
            var layers = comp.selectedLayers;
            if (!layers || layers.length === 0) return fail("Select a layer in the composition first.");
            app.beginUndoGroup("JamoVFX Hub — Apply Preset");
            var applied;
            try {
                applied = layers[0].applyPreset(f);
            } finally {
                app.endUndoGroup();
            }
            // applyPreset returns false only on failure; undefined/true both mean success.
            return applied === false ? fail("applyPreset returned false.") : ok();
        }

        // ---------- Premiere Pro ----------
        // No direct "apply .prfpset to clip" script call exists, but
        // Component.addPreset() applies an effect preset where the host
        // version exposes it — try that before falling back.
        var seq = app.project.activeSequence;
        if (!seq) return fail("No active sequence.");
        var clip = getSelectedVideoClip(seq);
        if (!clip) return fail("Select a clip on the timeline first.");

        for (var ci = 0; ci < clip.components.numItems; ci++) {
            var comp2 = clip.components[ci];
            if (comp2 && typeof comp2.addPreset === "function") {
                try {
                    var done = comp2.addPreset(presetFile);
                    if (done !== false) return ok();
                } catch (e) { /* try next component */ }
            }
        }
        return fail("Premiere couldn't apply this preset via script. Use the custom shake sliders, or apply the preset from the Effects panel.");
    } catch (e) {
        return fail(e.toString());
    }
}

/**
 * Returns basic host info so the panel can confirm the bridge is alive
 * and adapt the UI to After Effects vs Premiere Pro.
 */
function gsGetHostInfo() {
    try {
        var hasProject = !!app.project;
        var hasTarget = false;
        if (isAfterEffects()) {
            hasTarget = !!(app.project && app.project.activeItem && app.project.activeItem.typeName === "Composition");
        } else {
            hasTarget = !!(app.project && app.project.activeSequence);
        }
        return JSON.stringify({
            ok: true,
            appName: app.name,
            appVersion: app.version,
            isAE: isAfterEffects(),
            hasProject: hasProject,
            hasSequence: hasTarget
        });
    } catch (e) {
        return fail(e.toString());
    }
}

// ---------- Shared helpers ----------

function getSelectedVideoClip(seq) {
    for (var i = 0; i < seq.videoTracks.numTracks; i++) {
        var track = seq.videoTracks[i];
        for (var c = 0; c < track.clips.numItems; c++) {
            if (track.clips[c].isSelected()) return track.clips[c];
        }
    }
    return null;
}

function getComponent(clip, name) {
    var lower = String(name).toLowerCase();
    for (var i = 0; i < clip.components.numItems; i++) {
        var c = clip.components[i];
        var display = c.displayName ? String(c.displayName) : "";
        if (display.toLowerCase() === lower) return c;
    }
    // Some Premiere builds localize displayName; fall back to a
    // substring match on the English name to stay version/locale robust.
    for (var j = 0; j < clip.components.numItems; j++) {
        var c2 = clip.components[j];
        var d2 = c2.displayName ? String(c2.displayName) : "";
        if (d2.toLowerCase().indexOf(lower) > -1) return c2;
    }
    return null;
}

function getProperty(component, name) {
    var lower = String(name).toLowerCase();
    for (var i = 0; i < component.properties.numItems; i++) {
        var p = component.properties[i];
        var display = p.displayName ? String(p.displayName) : "";
        if (display.toLowerCase() === lower) return p;
    }
    for (var j = 0; j < component.properties.numItems; j++) {
        var p2 = component.properties[j];
        var d2 = p2.displayName ? String(p2.displayName) : "";
        if (d2.toLowerCase().indexOf(lower) > -1) return p2;
    }
    return null;
}

function makeSeededRandom(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}
