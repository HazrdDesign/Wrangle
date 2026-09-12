# Wrangle 1.4.0

The bundled library now contains 25 presets. This update removes unchanged stock presets 101 (Lock Gradient Ramp to Text), 106 (Glitched Text), and 204 (Hold Outside Time Range).

## Added and expanded expressions

- 107 Typewriter: typing speed, delay, Show Cursor checkbox, | / _ dropdown, and blink speed. Starts relative to the layer in-point and preserves UTF-16 surrogate pairs. Uses the base text styling; does not promise per-character formatting preservation.
- 305 / 306 Wiggle X-Axis Only / Wiggle Y-Axis Only: Frequency and Amplitude; unseparated Position; preserves untouched axes, including Z. Corrects the submitted X-axis indexing and malformed array syntax.
- 307 Basic Wiggle: Frequency and Amplitude on numeric properties.
- 407 Auto Center Anchor Point: text/shape layer anchor, with a Point Offset control; preserves Z. This changes the anchor and can move artwork; it does not compensate Position. Rejects shape-group anchors and other layer types.
- 408 Counter Rotation: Angle Offset; cancels the entire 2D parent chain. Rejects 3D layers/parents because summed Euler angles cannot correctly cancel arbitrary 3D rotation.
- 409 Inertial Bounce: Amplitude, Frequency, Decay; requires two keyframes. Uses incoming keyframe velocity, so hold keys or zero incoming velocity produce no bounce.
- 210 Auto Fade In / Out: separate fade durations on Opacity. Handles zero durations and overlapping fades.
- 201 Loop Out, 207 Loop In, 208 Loop Out Duration, 209 Loop In Duration: all support Cycle, Ping-pong, Offset, and Continue. Keyframe Count uses intervals (0 means all keys); Duration Seconds uses AE's default at 0. Continue ignores the span.

Every bundled expression includes an `// Apply to ...` comment and named controllers with defaults. Maintain Stroke Width now has Width Multiplier; Random Color Per Second has Changes Per Second and Seed. Existing controls are reused without resetting their values.

## Panel fixes

- Replaced the browser-native color dialog with an in-panel RGB picker, color preview, validated hex entry, and Reset. Changes are immediate and persist across reloads; only the accent changes.
- Added Rotation, Anchor Point, and Other to the Edit Expression Apply to menu.
- Replaced the Add Expression text glyph with a geometrically centered SVG plus.

## Upgrading

Schema 13 creates a pre-v13 backup. Recognized unchanged stock from both the legacy library and v1.3 is upgraded, including items moved to another category. Edited copies and deletions of older presets are preserved. Newly introduced IDs are added once in their standard categories. Already-applied timeline expressions are unchanged.

## Validation

36 automated tests pass, covering migration, host compatibility/rollback/controllers, expression syntax and numeric behavior, all loop dispatch modes, typewriter timing/cursors, axis preservation, fades, bounds and rotation. AE objects are mocked.

Browser checks passed for RGB and hex updates, persistence after reload, target menu entries, and compact 232x330 dialogs / 300x740 panel layout. The add button is centered and the narrow panel has no horizontal overflow.

Live After Effects acceptance is still required; browser and VM tests do not execute AE's expression engine. Use the JavaScript expression engine.

Loop behavior and expression API usage were checked against [Adobe's expression language reference](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-language-reference/expression-language-reference.html) and [expression examples](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-examples/expression-examples.html).
