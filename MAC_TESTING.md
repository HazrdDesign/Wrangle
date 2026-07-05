# Wrangle — macOS Test Checklist (v1.1.0)

Everything below is untested on macOS. The code paths exist and should work,
but a marketplace review will exercise all of it — so we should first.
Test on the newest AE you have, plus the oldest you intend to support
(manifest allows AE 2019+).

## 1. Install

- [ ] Install `Builds/Wrangle.zxp` (ZXPInstaller, or PluginPlay Browser once they list it)
- [ ] Extension appears under **Window → Extensions → Wrangle**
- [ ] Confirm install location exists: `~/Library/Application Support/Adobe/CEP/extensions/com.hazrd.wrangle`
- [ ] Panel opens with no errors and shows **All / Essentials / Custom** tabs and 6 Essentials rows

## 2. macOS-specific behavior (the actual risk areas)

- [ ] Footer legend reads **⌘ expression only · ⌥ controls only** (platform detection)
- [ ] **⌘+Click** a row → expression applies WITHOUT creating controllers
- [ ] **⌥+Click** a row with a controller pill → controllers appear, property expression untouched
- [ ] **Ctrl+Click** on macOS is a right-click: Ctrl+Click a category tab should open **Edit Category** (same as right-click / two-finger tap)
- [ ] Text renders in San Francisco (system font), not a fallback serif
- [ ] Legacy emoji icons (if any custom category still uses one) render via Apple Color Emoji
- [ ] Color swatch input opens the macOS color picker and the chosen color sticks
- [ ] Retina display: SVG icons and text are sharp at 100% and 200% scaling

## 3. Data & persistence

- [ ] Save a custom expression → `~/Library/Application Support/Hazrd/Wrangle/data.json` is created
- [ ] Quit and relaunch AE → custom expression, category order, and settings survive
- [ ] (Upgrade case) If a v1.0 install existed: old bundled expressions are gone,
      anything user-saved survived, emoji icons became monochrome icons

## 4. Theme

- [ ] AE Preferences → Appearance: drag Brightness through darkest → lightest;
      with **Match After Effects** on, panel follows at each stop (text stays readable at the light end)
- [ ] Change Brightness while the panel is open → panel updates live (no relaunch)
- [ ] Settings → uncheck Match After Effects → hue slider takes over; recheck → snaps back
- [ ] Font size slider scales rows and text, layout stays intact at 10px and 18px

## 5. Core AE flows (ExtendScript)

- [ ] Click **Wiggle** with a property selected → expression + Frequency (3) / Amplitude (50)
      sliders appear with those values, wiggle visibly works immediately
- [ ] Click an expression with NO property selected → friendly alert, no broken state
- [ ] Select properties on TWO layers where only the second has a selected property → apply still works (multi-layer fix)
- [ ] Tune a slider, select the property + effect, click **+** → dialog captures code AND
      controllers with the tuned value; save; apply to a fresh layer → value comes back tuned
- [ ] **⌘+Click the + button** → captures expression only, no controller chips
- [ ] ⋯ → Remove Expressions from Selection → confirm dialog → expressions stripped; **⌘Z restores them**
- [ ] Test on a non-English AE install if available (effects group is accessed by matchName — should work)

## 6. UI mechanics (quick pass — already verified on Chromium, confirm nothing mac-weird)

- [ ] Search finds items across categories, grouped; clicking a group header jumps to that tab
- [ ] Drag-reorder rows within a category; drag-reorder tabs
- [ ] Esc closes dialogs; clicking the dim overlay closes; Enter saves in name fields
- [ ] Text can be selected/edited normally inside all input fields
- [ ] Icon picker: pick, save, icon shows in tab
- [ ] Resize panel down to minimum (240×300) — no horizontal scrollbar, no broken layout

## Known non-issues

- The `rundll32` warning during signing is a Wine artifact, not part of the product.
- The panel stores everything locally (data.json + localStorage); no network calls exist,
  so there's nothing privacy-related to test.
