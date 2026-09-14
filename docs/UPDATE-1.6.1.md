# Wrangle 1.6.1

Library rows show the expression name, Apply To property, and controller count. The extra keyframe and timing lines, description tooltips, and appended timing messages have been removed. Property checks still work when applying an expression. Comments inside the editable expression code remain available.

The 40 existing presets were compared with [NoSleepCreative's Expressions & Snippets](https://docs.nosleepcreative.com/after-effects/expressions). This update changes credits, not expression behavior or the preset list.

## Credit comparison

The following match or adapt methods on the page. Controls, guards, offsets, or dimension handling may differ from the examples.

| Wrangle preset | Matching example | Credit |
| --- | --- | --- |
| Auto Center Anchor Point | Changing anchor point, Center | Desmond Du/NoSleepCreative |
| Random Time Offset | Random delayed/advanced layer playback; adapted to sampling the property's own animation | Desmond Du/NoSleepCreative |
| Posterize + Wiggle | Jumpy Wiggle 2; fixed-rate sampling implemented with posterizeTime | Desmond Du/NoSleepCreative |
| Wiggle X-Axis Only | Axis-specific Wiggle, adapted from Y to X | Desmond Du/NoSleepCreative |
| Wiggle Y-Axis Only | Axis-specific Wiggle | Desmond Du/NoSleepCreative |
| Basic Wiggle | Wiggle | Desmond Du/NoSleepCreative |
| Counter Rotation | Ignore Parent Rotation; extended to the parent chain | Desmond Du/NoSleepCreative |
| Randomize Position | Random positioning XYZ; adapted to offsets and preserved Z | Desmond Du/NoSleepCreative |
| Random Color Per Second | Random fill; adapted to timed seeds and preserved alpha | Desmond Du/NoSleepCreative |
| Wiggle Loop | Linked [Looping Wiggle](https://www.motionscript.com/design-guide/looping-wiggle.html), two time-offset wiggles blended across the loop | Dan Ebberts/Motionscript |

These credits identify the source examples requested for comparison; they do not claim that common AE functions or mathematical operations originated with the page author.

The remaining 30 presets are tagged `Expressions by Jose "Hazrd" Lopez`, as requested: Digital Clock, Number Counter, Typewriter, Loop Out, Posterize Time, Loop In, Loop Out Duration, Loop In Duration, Auto Fade In / Out, Stagger by Layer Index, Loop with Offset, Oscillate, Ping-Pong Oscillate, Drift, Randomize Scale, Maintain Stroke Width, Procedural Sine Path, Circular Orbit, Randomize Rotation, Alternate Direction, Progressive Offset — Position, Progressive Offset — Rotation, Progressive Offset — Scale, Quantized Value, Clamp Value, Random Hold, Rainbow Cycle, Brightness Pulse (Same Hue), Flicker, and Randomize Opacity.

Similar names alone were not treated as code matches. In particular, Wrangle's Drift uses sine/cosine motion rather than the page's linear drift; its Flicker uses stepped random opacity rather than the page's segmented strobe. Auto-orient along path (Videolancer), Aim constraint (Kevin Camp / Dan Ebberts), and Distance-based opacity fade (Animoplex / Adobe) are not in the current 40-preset catalog and were not added.

## Existing libraries

Schema 16 backs up the saved library before correcting credits. Recognized executable code is matched independently of preset name/category and controller values. Custom expression code and library arrangements are preserved. The incorrect Markdown filename attribution is removed from edited copies too. No preset reset is needed. Already-applied project expressions retain their existing comments until reapplied.

## Validation

49 automated checks passed, including comparison of executable code for all 40 presets and upgrade coverage for renamed presets, controller values, custom edits, deletions, backups, and repeat loading. After Effects testing remains with the user.
