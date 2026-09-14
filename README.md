# Wrangle for After Effects

One-click expressions with their controls. Select timeline properties, then click a library row.

## 1.6.1 update

Library rows show the preset name, Apply To property, and controller count. Extra keyframe/timing lines, description tooltips, and appended timing messages are removed.

The existing 40 expressions were compared with NoSleepCreative's page. Matching methods credit Desmond Du/NoSleepCreative or the original source linked there (Dan Ebberts for Wiggle Loop). The remaining presets credit Jose "Hazrd" Lopez. The placeholder Markdown-filename attribution is removed. Expression behavior and controllers are unchanged.

Saved libraries receive corrected credits automatically, with a backup, while preserving user edits, controller values, organization, and deletions. No reset is needed.

[Update notes and credit comparison](docs/UPDATE-1.6.1.md). 49 automated checks passed; browser preview confirms compact rows. After Effects testing is left to the user.
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
