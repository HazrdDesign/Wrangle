# Wrangle for After Effects

One-click expressions with their controls. Select timeline properties, then click a library row.

## 1.6.0 update

Fixes Typewriter's illegal dropdown labels, consolidates Auto Center Anchor Point in Essentials with controls, upgrades Posterize + Wiggle with controls, restores Color, and removes Inertial Bounce. Adds the 17 approved non-bounce patterns from the supplied one-click document, with property targets, purpose comments and controls. Essentials references presets without duplicating them.

The default catalog contains 40 unique presets. Existing libraries preserve user edits and deletions. Loop In variants run before the first keyframe; the panel now makes that timing explicit.

[Full update notes](docs/UPDATE-1.6.md). Download Wrangle-v1.6.0.zxp from GitHub Releases. 47 automated checks and browser checks passed. After Effects testing is left to the user.
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

Before upgrading an older library, Wrangle creates a timestamped pre-v15 backup beside data.json (or a browser backup in preview mode). It replaces only recognized, unchanged stock presets, preserves custom entries/category order/deletions, and retires the requested stock IDs while adding newly introduced presets. Edited/custom copies are preserved. Changes do not alter expressions already applied to AE projects.

Writes use a temporary file and rename. A revision number chooses the newest valid file/browser copy after a failed save. Errors appear in the panel. Recovering edits already lost by an earlier v11 migration requires an existing backup.

## Development

Target: After Effects 17.0.1 or later with CEP 9+, using the JavaScript expression engine. The manifest permits AE 17+; dropdown configuration is guarded at runtime. This is a target minimum, not a tested version matrix.

Run `node tests/run.cjs`. No dependencies are required. The checks use AE mocks and cannot replace a real AE run.

The panel can be served from `Extension Files/client` for visual testing; timeline actions explain that AE is required. The source ZIP is not an installer; use the signed ZXP from GitHub Releases. For AE development, use the normal CEP development installation process; for distribution, validate in AE and produce a freshly signed ZXP.

See [release notes and acceptance checklist](docs/UPDATE-1.1.md) and [community research](docs/COMMUNITY-EXPRESSIONS.md).

Created by Jose “Hazrd” Lopez.
