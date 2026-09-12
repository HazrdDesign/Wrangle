# Wrangle for After Effects

One-click expressions with their controls. Select timeline properties, then click a library row.

## 1.4.0 update

- Ships 25 presets, with property comments and controller defaults for every expression.
- Removes stock 101, 106, and 204; adds Typewriter with optional blinking cursor, axis-only wiggles, Auto Center Anchor Point, Counter Rotation, Inertial Bounce, Auto Fade In / Out, and Basic Wiggle.
- Covers all four loop functions and all four modes, with keyframe-count or duration controls.
- Fixes the accent picker with in-panel RGB sliders and hex entry; adds Rotation, Anchor Point, and Other targets; centers the add icon.
- Preserves edited presets and existing controller values during upgrades.

Download the signed Wrangle-v1.4.0.zxp from GitHub Releases. 36 automated checks and browser checks passed; live After Effects acceptance remains pending. See [full 1.4 release notes](docs/UPDATE-1.4.md).
## Use

- **Click:** expression and controllers, on compatible selected properties.
- **Ctrl / Cmd + click:** expression only.
- **Alt / Option + click:** controllers only, on selected layers.
- **+:** capture the selected expression and current controller values, or enter a new expression. Ctrl/Cmd-click + omits controllers.
- **Edit:** change name, category, expression code, target, or inclusion of captured controls.
- **More actions:** category management, remove expressions from selected properties, accent, help.
- **Drag:** reorder expression rows or category tabs.
- **Undo in AE:** restore the preceding timeline operation.

A controller already present with the same name and type is reused without resetting its value/keyframes. A same-name, wrong-type control produces an error. Stored current values are snapshots, not complete animation/effect presets. Custom dropdown labels cannot be read by this capture flow; the UI explains that limitation. Cross-layer/dynamic expression references require manual review.

## Data

Windows: `%APPDATA%/Hazrd/Wrangle/data.json`
macOS: `~/Library/Application Support/Hazrd/Wrangle/data.json`

Before upgrading an older library, Wrangle creates a timestamped pre-v13 backup beside data.json (or a browser backup in preview mode). It replaces only recognized, unchanged stock presets, preserves custom entries/category order/deletions, and retires the requested stock IDs while adding newly introduced presets. Edited/custom copies are preserved. Changes do not alter expressions already applied to AE projects.

Writes use a temporary file and rename. A revision number chooses the newest valid file/browser copy after a failed save. Errors appear in the panel. Recovering edits already lost by an earlier v11 migration requires an existing backup.

## Development

Target: After Effects 17.0.1 or later with CEP 9+, using the JavaScript expression engine. The manifest permits AE 17+; dropdown configuration is guarded at runtime. This is a target minimum, not a tested version matrix.

Run `node tests/run.cjs`. No dependencies are required. The checks use AE mocks and cannot replace a real AE run.

The panel can be served from `Extension Files/client` for visual testing; timeline actions explain that AE is required. The source ZIP is not an installer; use the signed ZXP from GitHub Releases. For AE development, use the normal CEP development installation process; for distribution, validate in AE and produce a freshly signed ZXP.

See [release notes and acceptance checklist](docs/UPDATE-1.1.md) and [community research](docs/COMMUNITY-EXPRESSIONS.md).

Created by Jose “Hazrd” Lopez.
