## Wrangle 1.1.0

Complete UI overhaul plus a long list of fixes. Download `Wrangle-v1.1.0.zxp` below and install with ZXPInstaller (or the PluginPlay Browser).

### New

- **Search** across the whole library, grouped by category — plus an **All** view
- **Category tabs** replace the sidebar rail; the list gets the full panel width
- **Controller badges**: rows show how many controls an expression bundles; hover for where to apply it
- **Match After Effects theme** — the panel follows AE's Brightness setting (custom hue still available in Settings)
- **Curated monochrome icon picker** for categories (replaces typed emoji/SVG)
- Always-visible Click / Ctrl / Alt legend (⌘ / ⌥ on macOS)
- Captured controllers keep their **current values**, and bundled sliders arrive with sensible defaults

### Changed

- Default library trimmed to six battle-tested Essentials (spin, wiggle, loop, posterize time, auto-center anchor, typewriter). Anything you saved yourself is preserved on upgrade — only the old bundled items are replaced.

### Fixed

- Editing an expression no longer moves it to the end of its list
- Renaming a category over an existing name no longer corrupts icons
- Names with quotes or angle brackets no longer break the UI
- Text fields are selectable/editable again (CSS reset bug)
- CEP 9 (AE 2019/2020) styling issues (flex gap / backdrop-filter)
- Ctrl+Click capture called a host function that didn't exist
- Multi-layer apply no longer fails when the first layer has no selected property
- Works on localized (non-English) AE installs
- Destructive "Remove All" now confirms first; Esc/overlay-click close dialogs
- Panel enforces a minimum size instead of collapsing
