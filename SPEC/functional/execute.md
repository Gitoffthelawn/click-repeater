# EXECUTION MODE

---

## START AND STOP

- Clicking the extension icon in the browser toolbar:
   - Opens the popup
   - Does not start anything
   - Stops the active mode, if one is running
- Recording mode starts only from the button in the popup
- Execution mode starts:
   - From the button for a specific entry in the popup
   - From the shortcut for the default

---

## HUMAN BEHAVIOR SIMULATION

### Execution speed

- Speed is controlled by the extension-wide setting: [Settings - Execution speed](../pages/settings.md#settings-page)
- The setting applies to all
- Default value: `1×`
- The speed setting controls the complete execution pace, including:
   - Cursor movement interval
   - Pause before pressing
   - Button hold duration
   - Pause between release and click
   - Pause after a completed step
- Available speed options:
   - `0.5×`
   - `1×`
   - `4×`
   - `10×`
- Timing profiles:

  | Speed | Movement point interval | Pause before pressing | Button hold | Release-to-click pause | Completed-step pause |
  |---|---:|---:|---:|---:|---:|
  | `0.5×` | 24 ms | 160–250 ms | 100–150 ms | 80–120 ms | 700–1000 ms |
  | `1×` | 12 ms | 80–140 ms | 50–90 ms | 25–60 ms | 250–450 ms |
  | `4×` | 6 ms | 30–60 ms | 20–40 ms | 10–25 ms | 70–130 ms |
  | `10×` | 4 ms | 15–25 ms | 8–14 ms | 5–10 ms | 35–50 ms |

- Target duration between nearby clicks at `10×`: approximately 100–150 ms
- Distance may increase movement duration; the multiplier controls relative pacing but does not guarantee a proportional change in total duration

### General rules
- Do not jump the cursor
- Calculate the path at runtime
- Use an uneven path
- Use one smooth curve for the complete movement
- Do not apply independent random displacement to every intermediate point
- Randomize the target point
- Offset radius of the click by 0.2mm
- Populate movementX
- Populate movementY
- Calculate pauses at runtime
- Do not repeat timing patterns
- Avoid a uniform overall pace by varying the curve and non-movement pauses

### Movement path

- The number of intermediate movement points depends logarithmically on the distance between the current cursor position and the click point
- Calculate the number of points as:

  `N = round(2 + 5 × log2(1 + D / 10))`

  Where:
   - `N` is the number of movement points
   - `D` is the movement distance in pixels
- Do not apply an additional minimum or maximum limit to `N`
- The interval between movement points is fixed within one speed option
- Do not randomize the interval between individual movement points
- Different speed options may define different fixed movement intervals
- Movement events change the virtual cursor position from one calculated point to the next; the system cursor is not moved

### Target entry and hover

- Before clicking a new target, send the target-entry event sequence:
   1. `pointerover`
   2. `pointerenter`
   3. `mouseover`
   4. `mouseenter`
- When leaving the previous target, send the corresponding target-exit events in the correct browser order
- After entering the target, allow a short stabilization period before pressing
- Recheck the element at the click point after stabilization and immediately before pressing
- If the target has changed, update the target and send the required exit and entry events before continuing
- Synthetic events support JavaScript hover handlers but do not guarantee native CSS `:hover`
- Do not add fixed 1 px micro-movements solely to force hover; they do not guarantee hover activation
- The pause before pressing is the target stabilization period
- If the target changes during stabilization, send the required exit and entry events and click the updated target
- Native CSS `:hover` has no synthetic fallback because browser-generated trusted pointer movement is required

### Action sequence

Loop conditions:
- A next step exists
- The user has not clicked
- Stop has not been requested

Loop:
1. Prepare the target
    1. Find the element or point. Stop if the target is not found
    2. Set the click point
    3. Offset radius of the click by 0.2mm
2. If a path is needed
    1. Calculate the path at runtime
    2. Account for distance
    3. Calculate the number of movement points using the logarithmic formula
    4. Build one smooth uneven curve without independent random displacement of each point
    5. Move through the points using the fixed interval for the selected speed
    6. Send pointermove
    7. Send mousemove
    8. Populate movementX/Y
3. If the target is new
    1. Send the exit events for the previous target
    2. Send pointerover
    3. Send pointerenter
    4. Send mouseover
    5. Send mouseenter
    6. Apply the target stabilization delay defined by the selected speed
    7. Recheck the target at the click point
    8. Update the exit and entry events if the target changed
4. Perform the click
    1. Send pointerdown
    2. Send mousedown
    3. Hold for the duration defined by the selected speed
    4. Send pointerup
    5. Send mouseup
    6. Pause for the duration defined by the selected speed
    7. Send click
5. Complete the step
    1. Pause for the duration defined by the selected speed
6. Start the loop for the next click if:
    - A next step exists
    - The user has not clicked
    - Stop has not been requested
    - The target was found
