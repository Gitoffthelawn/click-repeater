# SOUND EFFECTS

- Each successfully executed scenario click plays a short sound imitating a mouse click.
- Each successfully executed scenario key press plays a short sound imitating a keyboard key press.
- Key release actions do not play a sound.
- Sounds are controlled by the extension-wide "Sound effects" setting.
- The setting is enabled by default at the quiet volume level.
- Each click on the setting cycles to the next volume level.
- When the setting changes to `volume-1` or `volume-2`, the extension starts the keep-alive signal, waits briefly for the audio output channel to open, and then plays a click sound preview at the selected level.
- When the setting changes to `volume`, no preview sound is played.
- When set to silent, scenario execution sounds are silent.
- Sounds are generated locally and do not require network access.

## Sound types

- Click sound:
   - Plays for every successfully executed click action.
   - Keeps the current mouse-click sound unchanged.
- Key press sound:
   - Plays for every successfully executed key down action.
   - Has the same perceived volume as the click sound.
   - Must clearly differ from the click sound.
   - Uses a duller, softer transient resembling a physical keyboard key press.

## Volume

- Sound-effect volume follows the user's operating-system and output-device volume.
- The extension must not read, change, bypass, or reset system volume or audio-device settings.
- Sound effects have three extension-controlled internal gain levels:
   - `volume`: silent; click gain `0`; key press gain `0`; gray icon.
   - `volume-1`: quiet; click gain `0.14`; key press gain `0.07`; light-blue icon.
   - `volume-2`: loud; click gain `0.28`; key press gain `0.14`; blue icon.
- The setting is shown as an icon button, not as a toggle.
- The icon button uses the Lucide `volume`, `volume-1`, and `volume-2` icons for the three levels.
- Future changes to internal gain must preserve sufficient audibility without clipping or dominating other audio.

## Implementation

- Sounds are generated with the Web Audio API and routed to the current system output.
- One audio context per document (tab page or popup) is created on first use and reused across runs. It is not closed after each scenario; keeping it open preserves Firefox user-gesture audio permission for the next run on the same tab.
- Closing or navigating the tab (or closing the popup) releases the audio context through browser lifecycle cleanup.
- A trusted user gesture on the page (pointer down or key down) may warm the audio context before the first scenario; this is required for reliable playback in Firefox.
- An approximately `-120 dBFS`, 30 Hz keep-alive signal starts with the audio context and stays active while it is open. This maintains an active Bluetooth audio channel for reliable system-volume synchronisation with wireless headphones such as AirPods. It must remain effectively inaudible and must not alter other audio streams or device settings.
- For sound-setting previews, the keep-alive signal starts before the preview click plays.
- Audible click and key press sounds are separate short transients played through the same audio context.
