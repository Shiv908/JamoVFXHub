#!/usr/bin/env node
/**
 * generate-metadata.js
 *
 * Run this after dropping new files into Assets/. It creates a
 * "<filename>.metadata.json" sidecar for any asset that doesn't
 * already have one, inferring Name/Category/Tags from the folder
 * and filename so you never have to hand-write metadata for every
 * file.
 *
 * Usage:
 *   node scripts/generate-metadata.js
 *
 * Re-run any time you add files — it skips files that already have
 * a metadata.json sidecar, so it's safe to run repeatedly.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "Assets");
const SOUND_EXT = [".wav", ".mp3", ".aiff", ".aif", ".m4a"];
const SHAKE_EXT = [".json", ".prfpset", ".ffx"];
const SKIP_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

function titleCase(str) {
  return str
    .replace(/^\d+\s*/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function walk(dir, categoryHint) {
  let created = 0, skipped = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const r = walk(full, entry.name);
      created += r.created; skipped += r.skipped;
      return;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const base = path.basename(entry.name, ext);
    if (base.endsWith(".metadata") || entry.name === "metadata.json") return;
    if (SKIP_EXT.includes(ext)) return;

    const isSound = SOUND_EXT.includes(ext);
    const isShake = SHAKE_EXT.includes(ext);
    if (!isSound && !isShake) return;

    const metaPath = path.join(dir, base + ".metadata.json");
    if (fs.existsSync(metaPath)) { skipped++; return; }

    const categoryTag = categoryHint
      ? categoryHint.toLowerCase().replace(/^\d+\s*/, "")
      : path.basename(dir).toLowerCase().replace(/^\d+\s*/, "");
    const tags = [categoryTag];
    // Derive extra search keywords from the filename so search stays useful.
    const extra = base.toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/).filter(w => w.length > 2);
    extra.forEach(w => { if (tags.indexOf(w) === -1) tags.push(w); });

    const meta = {
      Name: titleCase(base),
      Category: categoryHint ? titleCase(categoryHint) : titleCase(path.basename(dir)),
      Tags: tags.slice(0, 12),
      Keywords: tags,
      Description: "",
      Premium: false,
      Version: "1.0"
    };

    if (isShake) {
      meta.Params = { intensity: 20, duration: 0.6, scale: 4, rotation: 2, frequency: 12 };
      if (ext === ".ffx") meta.Host = "AEFT";
      if (ext === ".prfpset") meta.Host = "PPRO";
    }

    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf8");
    created++;
  });

  return { created, skipped };
}

if (!fs.existsSync(ASSETS)) {
  console.error("No Assets/ folder found at", ASSETS);
  process.exit(1);
}

const result = walk(ASSETS, null);
console.log(`Metadata generation complete: ${result.created} created, ${result.skipped} already existed.`);
console.log("Edit any .metadata.json file by hand to fix names, tags, or descriptions — the scanner reads them live.");
