# Wrangle 1.6.0

This update fixes the reported library issues and adds the supplied one-click collection. It replaces the unapproved 1.5 additions in the bundled catalog. Modified user copies are preserved; no existing timeline expressions are changed.

## Fixes

- Typewriter's dropdown uses **Vertical Bar** and **Underscore** as legal AE item labels. The output characters remain `|` and `_`. Invalid saved dropdown labels are caught before adding controls. The exact older Typewriter copies reported by the user are consolidated and repaired, including malformed escaping, with the old typing speed retained.
- Auto Center Anchor Point lives only in Essentials, targets layer **Anchor Point**, and has an Offset Point control. The reported Essentials copy keeps its ID; the recognized Transform duplicate is removed.
- Posterize + Wiggle has Frame Rate, Frequency, and Amplitude controls. The reported hard-coded version is upgraded in place, retaining its 15 FPS / 15 frequency / 5 amplitude settings.
- Restores Rainbow Cycle, Random Color Per Second, and Brightness Pulse in Color with their controllers.
- Removes Inertial Bounce. The document's Bounce / Overshoot section is intentionally excluded because the user's removal request takes precedence.
- Essentials provides references to selected presets rather than additional stored copies. Editing a shortcut edits its source preset. Reordering Essentials does not reorder its source categories. Auto Center is physically stored only in Essentials.

## Loop In clarification

Loop In and Loop In Duration act **before the first keyframe**; Loop Out variants act **after the last**. For example, put keys at 2 and 3 seconds and preview 0–2 seconds to see Loop In. Keys at the layer's in-point leave no visible time for the preceding loop. The cards and expression comments now state this directly.

Keyframe Count counts intervals, with 0 using all keys. Duration is the sampled segment length, not a stop time for looping. Continue ignores the span. The underlying loop functions are retained, including working Loop Out Duration. See [Adobe's expression reference](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-language-reference/expression-language-reference.html).

## Approved document coverage

All 17 non-bounce patterns are included. Existing Randomize Scale, Maintain Stroke Width and Flicker entries are updated instead of duplicated. Progressive Offset has separate Position, Rotation and Scale variants so each exposes the appropriate controls. Alternate Direction and Drift support both Position and Rotation, retaining Z for 3D Position.

| Category | New or updated document presets |
|---|---|
| Transform | Randomize Rotation, Randomize Scale, Randomize Position, Alternate Direction, Progressive Offset — Position / Rotation / Scale, Maintain Stroke Width |
| Opacity | Randomize Opacity, Flicker |
| Time | Random Time Offset, Stagger by Layer Index, Loop with Offset |
| Utility | Quantized Value, Clamp Value, Random Hold |
| Wiggle | Oscillate, Ping-Pong Oscillate, Drift |

Each includes an Apply to comment, purpose, appropriate target restrictions and controller defaults. The supplied Markdown contains no named author credits. Its filename is cited in the new expressions; no author has been invented and these expressions do not use the Wrangle author footer.

## Data and validation

There are **40 unique bundled presets**. Essentials shortcuts are not counted twice. Upgraded libraries may contain a different total because user deletions and custom presets remain intact.

Schema 15 saves a pre-v15 backup, repairs only exact known older snippets, restores the explicitly requested color/controller presets and preserves other edits/deletions. The installed library was read and tested on a copy, not overwritten. The user's migration preview contains one Essentials anchor with controls, one Typewriter, controlled Posterize + Wiggle, and three Color presets.

47 automated checks cover syntax, controllers, dropdown validation, migration, scalar/vector behavior, timing, loop dispatch, and Essentials references. Browser checks verify Essentials editing and the Color list. Live After Effects testing is left to the user as requested. The signed package is checked separately for signature and source contents before release.
