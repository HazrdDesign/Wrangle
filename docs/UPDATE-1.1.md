# Wrangle 1.1 development update

## Scope

Removes stock IDs 102, 103, 205, 206, 303, 401, 405, 702. Does not alter expressions already applied to projects. Existing custom expressions, edited copies, categories, order and intentional preset deletions survive migration.

Seventeen presets remain. The main changes are:
- Gradient Ramp fits text bounds in layer coordinates and accepts both Ramp points on a text layer.
- Digital Clock uses layer-relative time and an offset control.
- Number Counter reads a Value slider with clamped decimal formatting.
- Glitched Text gets meaningful defaults.
- Loop has labeled options and a two-keyframe requirement.
- Posterize/Flicker/Choppy use positive frame-rate guards.
- Hold Outside Time Range holds the correct end value and offers frame offsets.
- Wiggle Loop guards zero duration and blends samples at the seam.
- Random Layer Scale uses uniform 2D/3D scale with Min/Max/Seed controls.
- Stroke Width replaces the undefined math call; nonuniform, perspective and nested group transforms remain approximate/unsupported as described in the preset.
- Sine Path guards zero wavelength/length and exposes phase.
- Circular Orbit preserves Z and exposes speed/radius.
- Color presets use RGBA, preserve alpha, and Brightness Pulse derives the original hue.

## UX

Rounded rows and dialogs, neutral charcoal surfaces, orange default accent. Only accent color is customizable. Existing per-expression colors remain preserved in legacy data but are no longer rendered; they cannot override the global accent.

Each row shows its target and control count. Keyframe requirements are a separate short label. Tooltip descriptions provide optional detail. The main action remains one click. Added no search, favorites, recent lists, inline slider panels, or other functionality from the reference image.

Host validation skips incompatible targets before adding controls. Custom expressions can select a target when saved; “Any expression property” is explicit. Result messages report applied/skipped counts and expandable error details.

## Reliability

- Reacquires property paths after creating effects.
- Checks expression evaluation errors at the current comp time; restores the old expression on failure.
- Removes controls just created on a layer when no expression application succeeds.
- Captures current controller values, without pretending to capture complete keyframed animation.
- Reuses matching controls without resetting them; rejects wrong-type name collisions.
- Balanced undo groups and property-scoped removal.
- Plain-text rendering and listener-based actions replace user-input HTML.
- Backups before migration, atomic file replacement, revision-based fallback selection, transaction rollback on failed saves.

## Verification

Run: node tests/run.cjs

Automated tests cover removal, controller definitions, migration/data preservation, backup recovery, save failures, rename collisions, stable edits, property filtering, multiple layers, controls-only behavior, defaults/reuse, rollback, capture, undo, keyframes, numeric formula edge cases, color/3D handling, and script syntax. AE objects and functions are mocked.

Browser checks completed:
- 300 × 740: target labels and charcoal/orange layout.
- 232 × 330: scrolling editor, visible Save, Escape dismissal.
- 1060 × 330: responsive library layout.
- Saving a new expression with a selected target.
- HTML-like expression name remains text (zero child elements).
- Accent changes persist after reload; background remains rgb(24, 25, 27).
- Reset restores orange.

## Pending live AE acceptance

After Effects was not running during this update. The source is a development candidate, not a validated signed release.

1. Install this source via the normal CEP development workflow; do not install the old Builds/Wrangle.zxp.
2. Fresh library: confirm all 17 presets and the eight removals.
3. Existing library: confirm timestamped backup, customized categories/expressions, order, and previous deletions.
4. Apply each preset at the target listed in its row; confirm controls, useful defaults, and visible animation at multiple times.
5. Select Opacity and Position together, apply Flicker: only Opacity changes and skipped-target feedback appears.
6. Multiple selected layers/properties, effect-property targets (Ramp), keyframed properties, locked layers, and separated Position.
7. Apply a deliberately invalid custom expression: prior expression returns; newly added controls are removed; undo remains usable.
8. Reuse a preset: edited controller values stay unchanged. Test wrong-type collisions.
9. Capture sliders/colors/points/Layer Controls; verify current values and warnings. Layer Controls resolve only a unique matching source-layer name.
10. Verify dropdown options and the four loop modes. Capturing arbitrary custom dropdown labels remains limited.
11. Test on the intended AE versions/platforms and expression engine; check non-English property access.
12. Verify undo, persistence after restart, compact docks, and ZXP signing/install behavior before releasing.

The committed 1.0 ZXP is intentionally not rebuilt using unverified signing credentials. The delivered ZIP contains the updated source, tests, and docs.

