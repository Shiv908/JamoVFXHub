# JamoVFX Hub

A single **After Effects + Premiere Pro** panel that houses **The Complete Sound FX Pack**
(111 sound effects) and **The Complete Shake Pack** (15 AE `.ffx` + 15 Premiere `.prfpset`
shake presets) — built as a modular, generic CEP asset-management platform.

The architecture is generic (Phase 20 style): **any folder dropped under `Assets/` becomes a
new product in the panel with zero code changes.** Adding Transitions, Titles, Motion, LUTs,
Icons, Templates… later is just a folder + metadata.

## Features

**Core**
- 🎛️ Panel loads inside **both After Effects and Premiere Pro** with a dark Adobe-style UI
  (top bar, sidebar, card grid, inspector, status bar)
- 📁 Dynamic folder scanner — drop a file in `Assets/`, it appears in the app
- 🏷️ Metadata-driven categories & groups — Sounds, Shakes, and any future group type
- 🔍 Instant search across name / category / tags / **keywords** / description
- ⭐ Favorites and 🕒 Recents, persisted to `Config/`
- 🖱️ Drag-and-drop from cards straight onto your timeline

**Sounds**
- 🎧 Preview player with waveform, play/stop, loop toggle, and **volume slider**
- 🎬 **Insert at Playhead** / **Import to Project** via real scripting
  (AE: audio layer at current time · Premiere: audio track at playhead)
- ⚡ Card hover quick-actions: ▶ quick preview, ⧉ copy path, ⬇ download

**Shakes**
- 🥇 **Apply Original Preset** — applies the real `.ffx` to your selected AE layer
- 🎚️ **Apply Custom Shake** — keyframes Position/Rotation/Scale with:
  Intensity · Duration · Scale · Rotation · Frequency · **Random Seed** (🎲)
  · **Invert** · **Reverse** · **Motion Blur (AE)** · **Anchor X/Y**

**Platform (Phases 11–17)**
- ⚙️ **Settings modal** — accent color, default volume, max recents, auto-update,
  update/license server URLs, storage usage, clear cache, export/import favorites, reset
- ⬇ **Downloads tab** — one-click install of remote assets (metadata `DownloadURL`), with
  progress; premium-not-installed assets appear here too
- ⟳ **Updates tab** — auto-update checker against your `version.json`, update banner
- 🔑 **License activation** — key storage + server validation hook (see below)

## Folder structure

```
JamoVFXHub/
├── CSXS/manifest.xml        ← extension registration (AEFT + PPRO)
├── .debug                   ← lets Adobe load this unsigned (dev only)
├── client/
│   ├── index.html
│   ├── css/style.css
│   ├── icons/icon-*.png
│   └── js/
│       ├── lib/CSInterface.js      ← Adobe's official JS↔ExtendScript bridge
│       └── modules/
│           ├── scanner.js    generic asset engine
│           ├── database.js   cache + favorites/recents/search
│           ├── settings.js   Config/settings.json
│           ├── player.js     audio preview + volume
│           ├── updater.js    version check
│           ├── downloader.js remote asset download
│           ├── license.js    license validation
│           ├── ui.js         the panel UI
│           └── main.js       boot + host bridge
├── host/host.jsx            ← ExtendScript (AE + Premiere)
├── Assets/
│   ├── Sounds/<Category>/<file>.mp3 (+ <file>.metadata.json)
│   └── Shakes/{After Effects, Premiere Pro}/*.{ffx,prfpset} (+ metadata)
├── Database/assets.json     ← generated cache (safe to delete, rescans on launch)
├── Config/                  ← settings.json, favorites.json, recent.json (per-user)
└── scripts/generate-metadata.js
```

## Install (development / unsigned)

1. **Enable unsigned extensions** (dev machines only):
   - Windows: string value `PlayerDebugMode` = `1` under
     `HKEY_CURRENT_USER\Software\Adobe\CSXS.11`
   - macOS: `defaults write com.adobe.CSXS.11 PlayerDebugMode 1`
2. **Copy this folder** into your CEP extensions directory:
   - Windows: `%APPDATA%\Adobe\CEP\extensions\JamoVFXHub`
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/JamoVFXHub`
3. Launch After Effects or Premiere Pro → **Window → Extensions → JamoVFX Hub**.

## Wiring the commercial features (when you're ready to sell)

- **Auto-updates**: set **⚙ Settings → Update manifest URL** to a `version.json` you host:
  `{ "version": "1.1.0", "notes": "…", "url": "https://…/JamoVFXHub.zxp" }`
- **Cloud downloads**: put a `DownloadURL` in any asset's `.metadata.json` pointing at your
  CDN (S3/R2). The Downloads tab installs it into the local `Assets/` tree.
- **Licensing**: set **License server URL** in Settings. On activation the panel calls
  `GET <licenseUrl>?key=<key>` and expects `{ "valid": true, "expires": "…" }`.
  Until a server exists, a local 8-char sanity check is used so the flow is demonstrable.
- **Premium gating**: mark assets `"Premium": true` in their `.metadata.json`; they surface
  in Downloads until installed, and show a ★ badge.

## First-run troubleshooting

- **Blank panel** → right-click inside the panel → **Inspect Element** → console. 95% of
  issues are the unsigned registry key or `--enable-nodejs` missing from `manifest.xml`.
- **"not running inside an Adobe host"** → the ExtendScript bridge wasn't reached.
- **Assets missing** → click **⟳ Rescan** in the top bar.

## Adding assets

1. Drop files into `Assets/<Group>/<Category>/`.
2. Run `node scripts/generate-metadata.js` — creates sidecars with name/tags/keywords
   (skips existing sidecars).
3. Click **⟳ Rescan**.

## Known limits

- **Premiere `.prfpset`**: Premiere has no script API to apply a `.prfpset` to a clip, so in
  Premiere the shake is generated from the sliders. The files remain for manual application.
- **AE `.ffx`**: **Apply Original Preset** applies the real animation preset to the layer.
- Node integration needs CEP's `--enable-nodejs` (standard for CEP today).

## Packaging for sale

Sign with Adobe's `ZXPSignCmd` into a `.zxp`, distribute via ZXPInstaller / Anastasiy's
Extension Manager, or wrap in an installer that handles your license flow.
