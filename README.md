# Wrangle for After Effects

One-click expressions with their controls. Select timeline properties, then click a library row.

## 1.3.0 update

- Retires stock IDs **102, 103, 205, 206, 303, 401, 405, and 702**. Seventeen repaired presets remain.
- Adds visible target labels (such as **Opacity · 1 control**) and host-side compatibility checks.
- Initializes useful controller values and dropdown options. Reusing the same preset keeps existing controller values; bundled presets use distinct control names.
- Captures current expression-control values, reports unsupported references, and restores previous expressions if application fails.
- Uses a neutral charcoal interface with rounded rows and an orange accent. **More actions → Accent color** changes only the accent.
- Makes dialogs scroll within narrow/short docks; keyboard focus and Escape are supported.
- Migrates the existing library without resetting custom categories or edited expressions.

This update has automated/mock and browser validation. Download the signed Wrangle-v1.3.0.zxp from GitHub Releases. Live After Effects acceptance remains pending. The legacy Builds/Wrangle.zxp on main is not this release.

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

Before upgrading an older library, Wrangle creates a timestamped pre-v12 backup beside data.json (or a browser backup in preview mode). It replaces only recognized, unchanged stock presets, preserves custom entries/category order/deletions, and retires the eight requested stock IDs. Edited/custom copies are preserved. Changes do not alter expressions already applied to AE projects.

Writes use a temporary file and rename. A revision number chooses the newest valid file/browser copy after a failed save. Errors appear in the panel. Recovering edits already lost by an earlier v11 migration requires an existing backup.

## Development

Target: After Effects 17.0.1 or later with CEP 9+, using the JavaScript expression engine. The manifest permits AE 17+; dropdown configuration is guarded at runtime. This is a target minimum, not a tested version matrix.

Run `node tests/run.cjs`. No dependencies are required. The checks use AE mocks and cannot replace a real AE run.

The panel can be served from `Extension Files/client` for visual testing; timeline actions explain that AE is required. The source ZIP is not an installer; use the signed ZXP from GitHub Releases. For AE development, use the normal CEP development installation process; for distribution, validate in AE and produce a freshly signed ZXP.

See [release notes and acceptance checklist](docs/UPDATE-1.1.md) and [community research](docs/COMMUNITY-EXPRESSIONS.md).

Created by Jose “Hazrd” Lopez.

