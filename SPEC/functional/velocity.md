# VELOCITY

---

## TABLE OF CONTENTS

- [GENERAL RULES](#general-rules)
- [SETTING](#setting)
- [BASE TIMING](#base-timing)
- [CALCULATION](#calculation)
- [EXAMPLES](#examples)
- [RUNTIME VARIABILITY](#runtime-variability)

---

## GENERAL RULES

- Velocity defines generated timing during scenario execution
- Velocity applies to pointer movement, target stabilization, button hold, release-to-click pause, and completed-action pause
- Action-specific behavior is described in [Actions](actions.md)

---

## SETTING

- Velocity is controlled by the extension-wide setting: [Settings - Execution speed](../pages/settings.md#settings-page)
- The setting applies to all generated timing during execution
- Default value: `1x`
- Each velocity is a positive multiplier, lower or higher than `1`
- Velocity lower than `1` slows execution down
- Velocity higher than `1` speeds execution up
- Available velocity options:
   - `0.5x`
   - `1x`
   - `4x`
   - `10x`

---

## BASE TIMING

- `1x` is the base timing profile
- Click action:
   - Movement point interval: 15 ms between generated pointer movement points before the click
   - Pause before pressing: 200 ms after target entry and before `pointerdown`
   - Button hold: 200 ms between `mousedown` and `pointerup`
   - Release-to-click pause: 1 ms between `mouseup` and `click`
- Key down action:
   - No specific pauses
- Key up action:
   - No specific pauses
- Completed-action pause: 100-200 ms after each action

---

## CALCULATION

- For any selected velocity, calculate each timing value from the base `1x` value:

  `W = ceil(V / X)`

  Where:
   - `W` is the final timing value in milliseconds
   - `V` is the base timing value at `1x`
   - `X` is the selected positive velocity multiplier
- For ranges, apply the formula to both range boundaries
- Round calculated values up to whole milliseconds
- The final value must not be lower than 1 ms

---

## EXAMPLES

  | Base value | Velocity | Calculation | Final value |
  |---:|---:|---:|---:|
  | 100 ms | `4x` | `ceil(100 / 4)` | 25 ms |
  | 100 ms | `0.5x` | `ceil(100 / 0.5)` | 200 ms |

---

## RUNTIME VARIABILITY

- Distance may increase pointer movement duration; the multiplier controls relative pacing but does not guarantee a proportional change in total duration
- Calculate pauses at runtime
- Do not repeat timing patterns
- Avoid a uniform overall pace by varying the curve and non-movement pauses
