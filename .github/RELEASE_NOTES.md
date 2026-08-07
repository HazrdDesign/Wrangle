## Wrangle 1.2.0 — "Ember"

A visual pass. No layout changes, no feature removals — same panel, with an identity. Download `Wrangle-v1.2.0.zxp` below and install with ZXPInstaller (or the PluginPlay Browser).

### Look

- **Brand orange is the accent.** `#ff5500`, straight from the logo, replaces the generic UI blue — active tab, focus rings, primary button, and the apply animation.
- **Film grain** across the whole panel, generated inline (no image files), so surfaces stop looking machine-flat.
- **Warm neutrals.** The greys are pulled a few degrees toward the accent at identical brightness, so the panel still matches After Effects exactly while no longer reading as default grey.
- **Three typographic voices** — Archivo Narrow caps for labels and tabs, IBM Plex Mono for counts, keys and code, system sans for expression names. Both webfonts ship with the extension (SIL OFL, 27 KB total).
- **Stitched hairlines** between rows instead of solid rules.
- **Depth**: recessed search and text fields, hairline highlights on raised chrome, a heat line along the top of every dialog, and a glow on the category color bar you're hovering.
- **Empty categories** carry the Wrangle lasso mark, ghosted.

### Feel

- **The apply sweep.** Applying an expression now fires a 480 ms band of heat across the row — clear confirmation that After Effects took the click, replacing the old grey flash.

### New setting

- **Accent** color picker in Settings, defaulting to Wrangle orange, for anyone who wants a different heat.

### Fixed

- Warm tinting no longer shifts panel brightness, so "Match After Effects" stays pixel-accurate against native panels.
- A failed or unavailable `evalScript` call can no longer swallow the panel's own visual feedback.
