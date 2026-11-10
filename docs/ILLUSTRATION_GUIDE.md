# Story illustration framing

Joshua's direction, November 10, 2026: use square masters for new images so the same image can serve portrait and landscape playback. Keep the four approved opening images and their portrait extensions.

## New image masters

- Request 2048 × 2048 square artwork in the approved polished 3D animated-film style, with detailed materials and lighting matching the character references.
- Keep essential faces, hands, interactions and story props within the central 50% of both dimensions; 55% is the outer safe limit for essential content. A 3 × 3 grid's middle cell is unnecessarily restrictive.
- Continue scenery and lighting naturally to every outer edge. Treat outer scenery as expendable when framing changes. Do not bake in black bars, padding, text, framing guides or the grid.
- Leave comfortable headroom and avoid important foreground objects touching a crop boundary. Check character identity, costume, location layout and prop continuity before accepting a shot.
- The default focal point is the center. When a shot needs a different focal point, review both crops before authoring a specific position; a wide group interaction may need another camera shot rather than a tighter crop.

| Crop from a 2048-square master | Retained pixels |
| --- | --- |
| 9:16 portrait | 1152 × 2048 |
| 16:9 landscape | 2048 × 1152 |
| Region shared by both centered crops | Central 1152 × 1152, or 56.25% |

The 50–55% safe region fits inside that shared region. On-screen player artwork may use a less extreme aspect ratio to leave room for captions and playback controls; it should fill its frame with a centered cover crop.

## Player image changes

Keep the current image opaque while the next file loads and decodes. Fade the incoming image over it for 500ms. Do not fade both layers toward transparency, a cover image, black or white. Keep the same image nodes when controls rerender. Failed image loads retain the current story image; later cues can recover. The lab cover at the end of the opening is an intentional next shot and receives the same direct fade.

The existing opening batch uses portraitSrc extensions when the viewport is portrait and its original wide images in landscape. New square masters can use src alone for both orientations.
