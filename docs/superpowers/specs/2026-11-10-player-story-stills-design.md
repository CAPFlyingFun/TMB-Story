# Cue-driven player stills

Joshua approved replacing the Listen player's static artwork with the new story images and pushing directly to TMB-Story. Images switch immediately on narration/dialogue cues; no animation or fading is required.

Use the four reviewed island opening images, in order, including the revised third view. Return to the existing laboratory cover at the laboratory introduction until subsequent illustration batches are ready. Other chapters retain their covers. Chapter text and audio are unchanged.

## Approach

Use a chapter JSON shot list anchored to script lines and phrases. Resolve it against the loaded audio manifest. Determine progress from the current audio reading, including clip playback, rather than hardcoded elapsed chapter seconds. This reuses the existing player's audio selection and seeking. Fixed five-second slides would drift when readings change and are not the approved approach.

Use WebP assets, preserve their complete composition with contain sizing, and preload the small opening batch. Failed or unavailable images use the existing cover. Seeking backward, replaying, switching readings or chapters, and delayed image loads must never display an obsolete frame.
