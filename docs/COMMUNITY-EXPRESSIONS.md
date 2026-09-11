# Community expression shortlist
Researched September 11, 2026.

Reddit discussions consistently mention looping and wiggle; valueAtTime, linear mapping, sourceRectAtTime, and inertial bounce also recur. This is qualitative evidence from discussion threads, not a usage survey.

The requested removals remain removed. The ideas below are research recommendations, not extra features or presets copied from the visual reference. No new standalone community presets were added in this update.

| Candidate | Target label | Suggested controls | Assessment |
|---|---|---|---|
| Inertial Bounce / Overshoot | Numeric properties · Requires keyframes | Amount, Frequency, Decay | Strong next addition for motion work. Needs scalar/vector tests and a no-keyframe guard. |
| Auto Fade In / Out | Opacity | Fade In Frames, Fade Out Frames | A small, understandable addition. Clamp overlapping fades on short layers. |
| Basic Wiggle | Numeric properties | Frequency, Amplitude | Common everyday use; simpler than Choppy Stop Motion or Wiggle Loop. Avoid returning any retired X-only preset. |
| Map Slider to Range | Numeric scalar property | Input, Input Min/Max, Output Min/Max | Useful way to expose linear mapping without editing code; guard equal input endpoints. |
| Smooth Keyframes | Numeric properties | Sample Width, Samples | Useful for noisy tracks/motion. Show that smoothing can change peaks and keyframe timing. |
| Responsive Rectangle Size | Rectangle Path Size · Source text layer required | Source Layer, Padding X/Y | Repeated community use of sourceRectAtTime. Needs a clear source-layer selection flow and transformed-text tests before adding. |

The repaired Loop dropdown already includes Cycle, Ping-pong, Offset, and Continue. Continue is specifically highlighted in community discussion; it does not restore removed Simple Time Driver ID 205.

## Evidence

- [How many expressions do you actively use? — March 2025](https://www.reddit.com/r/AfterEffects/comments/1j8qdlx/) has recurring mentions of loopOut, wiggle, linear, valueAtTime, sourceRectAtTime, and inertial bounce.
- [Most essential must-know expressions — April 2024](https://www.reddit.com/r/AfterEffects/comments/1cdq7co/what_are_the_most_essential_mustknow_expressions/) discusses loop modes including Continue, range mapping, overshoot, and sizing boxes around text.
- [Favorites and most-used expressions — September 2020](https://www.reddit.com/r/AfterEffects/comments/iqdbdh/) gives longer-term corroboration for looping/wiggle and discusses numeric counters and seamless wiggle loops.
- [Three expressions replacing keyframes — June 2025](https://www.reddit.com/r/AfterEffects/comments/1l1m6b1/these_3_after_effects_expressions_replaced_most/) includes discussion of layer-duration-independent auto fade.
- [Favorite expressions — May 2019](https://www.reddit.com/r/AfterEffects/comments/bpdfsb/) discusses smoothing and its trade-offs.

For implementation behavior, use primary documentation and test in AE rather than trusting copied Reddit code:
[Adobe expression examples](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-examples/expression-examples.html),
[Adobe expression reference](https://helpx.adobe.com/after-effects/desktop/work-with-expressions/expression-language-reference/expression-language-reference.html).

Recommended next shortlist: **Inertial Bounce, Auto Fade In/Out, and Basic Wiggle**. They are useful additions with straightforward target labels and controller needs. The more involved source-layer rigs should follow after the core release has passed AE acceptance.

