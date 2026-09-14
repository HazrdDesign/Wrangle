# Wrangle 1.5.0

Seven controller-driven additions bring the library to 32 presets.

| ID | Preset | Apply to | Controls |
|---|---|---|---|
| 410 | Constant Drift | Numeric properties | Speed, Axis, Delay Seconds, Hold Before Start |
| 411 | Random Position | Unseparated layer Position | X/Y/Z Spread, Seed |
| 412 | Maintain Scale When Parented | Layer Scale | Compensate Parent, Scale Multiplier |
| 413 | Auto-Orient Along Path | 2D layer Rotation | Smoothing Frames, Angle Offset |
| 211 | Random Reveal | Opacity | Progress, Seed |
| 212 | Random Fade In | Opacity | Maximum Delay, Fade Seconds, Seed |
| 213 | Opacity Wave | Opacity | Frequency, Minimum, Maximum, Phase, Layer Phase |

## Sources and attribution

Reviewed [NoSleepCreative's Expressions & Snippets](https://docs.nosleepcreative.com/after-effects/expressions#both). These are Wrangle adaptations with added controllers and input guards. Six additions end with the requested `//Expressions by Desmon Du/NoSleepCreative` credit; the author's name on the site is Desmond Du. Each includes the source URL.

Auto-Orient is credited to [Videolancer](https://videolancer.net/expressions/), the original author named on the collection page. Its final comment is `//Expressions by Videolancer`. The Wrangle adaptation uses +X as its default forward axis; Angle Offset adjusts the artwork's facing direction.

Overlapping presets already in Wrangle were not duplicated. Unfinished snippets and setups requiring manually named layers were not included.

## Behavior and limits

Drift starts relative to each layer's in-point. Random Position adds stable offsets around the existing position and preserves dimensionality. Reveal and fades retain the original opacity; Progress 0/100 guarantees fully hidden/revealed endpoints. Fade duration 0 creates a step. Opacity Wave stays within its normalized limits and supports phase offsets across layers.

Maintain Scale compensates the immediate parent only. It is intended for uniform parent scale or aligned axes, not arbitrary shear or rotated nonuniform scaling. No-parent, missing-Z, negative-scale and near-zero-scale cases are guarded; a zero parent scale cannot be inverted.

Auto-Orient needs animated unseparated Position. The host rejects 3D parent chains, separated Position and enabled native Auto-Orient before adding controls. Stationary segments return the original Rotation plus offset. Smoothing samples are bounded in size, and keyframed paths retain their endpoint direction outside the keyed time range.

## Upgrade and validation

Schema 14 creates a pre-v14 backup, keeps edited presets and prior deletions, and adds eligible new presets once, including when skipping releases. Existing timeline expressions remain unchanged.

46 automated checks pass. They cover new expression behavior, attribution, compatibility, controllers, and migration as well as previous regression checks. The signed ZXP is verified and its packaged source compared to the build. Live After Effects testing remains pending; VM/host mocks do not replace the AE expression engine.
