# Prototype brief, round 2

Everything in `BRIEF.md` still applies (copy, form, nav, two-layer rule, system fonts, no em dashes, accessibility, desktop first) **except where this file overrides it**. Round 1 lives in `prototypes/1-torn-page/`, `2-index/`, `3-broken-browser/` and stays untouched. Round 2 goes in `prototypes/v2/<same folder name>/`.

## Designer feedback on round 1

- All three liked. **Favourite: 3, Broken Browser**: "mysterious, but not too messy or confusing". Not far from a good first version.
- 3's endless repeating menu was a straight copy of the nhogirl reference. That irritated: it feels like stealing. **No endless menu anywhere.** Use an own idea or keep the menu simple.
- 3 needs a **girly / bridal touch** so it reads as bridalwear, not an IT website.
- Kristin likes the **placement of the noise fragments in 1, Torn Page**: tiny caption lines bleeding off the left edge, the "2027 / VEIL / 210" stack, "36 / Silhoutte / 68", the lone "/_", the half-cut olive "01", and the footer line on the right.
- Round 2: **slightly simplify** all three (fewer noise elements, calmer, more white space) and **use the new images** as backdrops and content.

## Overrides

- **Zero images rule is lifted.** Use the images below. Images are allowed in both the noise layer (backdrops, textures) and the content layer (a hero or feature image).
- **Pink** joins the palette as an accent, coming from the images and cursor: `--pink: #f28ab9` (shard pink), `--pink-paper: #f1b7b7` (soft scanned paper). Still no large flat colour fields in CSS; pink appears through the images, the cursor, `::selection`, and tiny details.
- Paths: from `prototypes/v2/<direction>/`, assets are at `../../assets/`, and "<< all prototypes" links to `../../index.html`.
- Performance: never load more than ~5 images per page; use `loading="lazy"` for images below the fold; CSS backgrounds are fine.

## Custom cursor (all directions)

The designers want a cryptic custom cursor, based on the pink shard shape they drew.
- `../../assets/cursor-shard.svg`: their pink shard (20x32). Hotspot at the top tip: `cursor: url(../../assets/cursor-shard.svg) 11 1, auto;`
- `../../assets/cursor-pin.svg`: a pearl-headed sewing pin (32x32), the "more bridal" variant. Hotspot at the needle tip: `cursor: url(../../assets/cursor-pin.svg) 1 1, pointer;`
- Keep the normal text cursor inside inputs and textareas (usability). Disable custom cursors on touch devices (`@media (hover: none)`), where they don't exist anyway.

## Image catalogue (`prototypes/assets/`)

All are scans at A4 portrait ratio (1414x2000 px, JPEG). The white scans are made for layering: `mix-blend-mode: multiply` over white makes their paper vanish so only the marks remain. Other treatments are welcome: opacity, `filter: grayscale()` / `contrast()`, cropping with `background-size` / `background-position` or `object-fit` / `object-position`, rotation, CSS masks (e.g. a gradient mask so a texture fades out), layering two scans.

| File | What it is | Good for |
|---|---|---|
| `bg-lined-paper.jpg` | Faint lined notebook paper with a fold line and pencil marks | Subtle sitewide paper, or behind the form |
| `bg-threads.jpg` | White page with scattered tiny cut threads | The most subtle sitewide texture |
| `bg-specks-sparse.jpg` | Very sparse grey specks | Barely-there texture |
| `bg-specks-bold.jpg` | High-contrast black thread specks | Noise at low opacity, or a small cropped patch |
| `bg-pins-thread.jpg` | Sewing pins with tiny pink thread snippets, lower half | Very bridal. Near the form, the process, a section corner |
| `bg-pink-tape-grid.jpg` | Torn pink tape strip at the top, a small graph paper scrap lower left, specks | Crop the pink strip as "tape" holding an image or note |
| `bg-label-button.jpg` | A small paper label reading "0.4.5" (upside down) and a mint button, specks | Crop the label or button as a found object |
| `bg-pink-paper-scissors.jpg` | Pink paper on grey, blurred scissors | Stronger, darker. One section only, or a crop |
| `bg-kraft-cards.jpg` | A 3x3 grid of kraft paper cards | A collection or index grid feeling |
| `bg-white-sleeve.jpg` | White fabric beside a translucent plastic sleeve | Soft, bridal, a section background |
| `img-moodboard-collage.jpg` | 3x3 photo collage: pink, lips, pearls, lace, hands, tape | Content image; can also be cropped into single tiles (each tile is about a third of the width and height) |
| `img-tulle.jpg` | Close-up of tulle/net, grey | A veil. Overlays, a hero, text masks |
| `img-ribbon.jpg` | Satin ribbon curling, warm grey | Content image, a divider crop |

## Verification

You may take screenshots with headless Chrome from the command line, for example:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/path/out.png --window-size=1440,900 file:///path/page.html`
Do NOT use the browser pane tools (`mcp__Claude_Browser__*`); another reviewer uses them. Check 1440x900 and 390x844. Look at your screenshots and fix what looks off before you finish.
