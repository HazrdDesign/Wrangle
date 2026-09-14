# Wrangle for After Effects

One-click expressions with their controls. Select timeline properties, then click a library row.

## Wrangle 2.0.0

40 bundled expressions with controllers, property targeting, Essentials shortcuts, and a redesigned charcoal panel with a customizable accent. Library rows stay compact, showing the expression name, property, and controller count.

Saved libraries upgrade automatically with backups and corrected source credits; custom edits, controller values, organization, and deletions are preserved. No preset reset is needed.

The owner completed After Effects testing and confirmed the plugin looks and works correctly. The tested 1.6.1 functionality is unchanged in 2.0.0.

[Download the signed ZXP](https://github.com/HazrdDesign/Wrangle/releases/tag/v2.0.0) · [Release notes](docs/UPDATE-2.0.md) · [Installation and library reset guide](docs/README.txt)

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

Before upgrading an older library, Wrangle creates a timestamped pre-v16 backup beside data.json (or a browser backup in preview mode). It replaces only recognized, unchanged stock presets, preserves custom entries/category order/deletions, and retires the requested stock IDs while adding newly introduced presets. Edited/custom copies are preserved. Changes do not alter expressions already applied to AE projects.

Writes use a temporary file and rename. A revision number chooses the newest valid file/browser copy after a failed save. Errors appear in the panel. Recovering edits already lost by an earlier v11 migration requires an existing backup.

## Development

Target: After Effects 17.0.1 or later with CEP 9+, using the JavaScript expression engine. The manifest permits AE 17+; dropdown configuration is guarded at runtime. This is a target minimum, not a tested version matrix.

Run `node tests/run.cjs`. No dependencies are required. The checks use AE mocks and cannot replace a real AE run.

The panel can be served from `Extension Files/client` for visual testing; timeline actions explain that AE is required. The source ZIP is not an installer; use the signed ZXP from GitHub Releases. For AE development, use the normal CEP development installation process; for distribution, validate in AE and produce a freshly signed ZXP.

See [release notes and acceptance checklist](docs/UPDATE-1.1.md) and [community research](docs/COMMUNITY-EXPRESSIONS.md).

Created by Jose “Hazrd” Lopez.
