# Prototype brief, round 3 (final prototype)

One direction, all five pages. `BRIEF.md` still applies (two-layer rule, system fonts, no em dashes, accessibility, desktop first, form spec, home and bridal copy) except where this file overrides it. Build in `prototypes/v3/`. Do not modify earlier rounds.

## Decisions from round 2

- **Base: Torn Page v1** (`prototypes/1-torn-page/`). The designers liked the first version best: plain white, typographic, the one-pager's mid-sentence font jumps, caption fragments bleeding off the left edge, the orphan stacks ("2027 / VEIL / 210", "36 / Silhoutte / 68"), the stacked S letters, the paper form. **Keep its look.** Do not bring in round 2's paper textures, taped clippings, ribbon or pins.
- **Two details from Broken Browser, used minimally** (at most one or two per page, not on every page):
  1. Olive Courier coordinates: `55.6761 N / 12.5683 E` (small, like a caption).
  2. `>>` followed by a blinking `_` (the blink/movement was liked). Pink `_` (`#f28ab9`) is fine. Respect `prefers-reduced-motion` (no blink).
- **No custom cursor.** v1 had none, and v1 is the base. Browser default cursors everywhere.
- **Rule:** do not carry over anything from round 2 that v1 did not have, unless this file lists it as new.
- **Images: only on About** (plus optional tiny ones on Collection, see below). Everything else stays typographic like v1.
- All five pages now exist, so the "404 gone missing" toast is no longer needed for nav. Mark the current page in the nav (e.g. italic Times like v1's active BRIDAL).

## Pages

Files: `prototypes/v3/index.html`, `bridal.html`, `collection.html`, `about.html`, `contact.html`, `style.css`, `script.js`. Assets at `../../assets/`. "<< all prototypes" links to `../../index.html`.

### Home and Bridal
Port from Torn Page v1 with minimal changes: nav links to the real pages, one coordinates caption and one `>>_` somewhere fitting (e.g. `>>_` beside COLLECTION → on Home, the coordinates near "Copenhagen"). Keep the inquiry form exactly as in v1.

### Collection (`collection.html`)
Copy:
```
THE COLLECTION
Pieces made for weddings, parties, nights out and everything in between.
```
Then 6 **invented placeholder pieces** in the same weird spirit as the space-weather filler (the designers will replace them later). Each piece: a number (01 to 06), a name, a material/detail line, a price in DKK, and a status (e.g. "made to order", "one of one", "gone"). Examples of the tone:
- `01 / Veil for a windy planet / silk tulle, hem rolled by hand / 1.800 DKK / made to order`
- `04 / Bolero, second life / a 1970s tablecloth, unpicked twice / 2.400 DKK / one of one`
Layout: a Torn Page arrangement, not a shop grid. Entries drift between columns like the process steps on Bridal; font jumps in names; tiny caption fragments. **Missing images are part of the look:** most pieces show a placeholder note like `[fig. 03 missing]` in small olive Courier instead of a photo. At most two pieces may show a small image cropped from existing assets (`img-tulle.jpg`, `img-ribbon.jpg`, or a tile of `img-moodboard-collage.jpg`). Each piece has an `ask about this >>` link to `contact.html` (or to `bridal.html#inquiry` with "The Collection" preselected, if simple). A small line near the end: `webshop: not yet_`.

### About (`about.html`)
Copy:
```
TWO GIRLS. ONE SEWING MACHINE.
Ode to Shelly was founded in Copenhagen by designers Karen Müller and Kristin Sigus-Katmann.
We met during our design studies at The Royal Danish Academy and started Ode to Shelly from our shared studio practice.
```
Then:
- **The story of Shelly:** placeholder filler in the weird spirit (the designers have not told us who Shelly is yet). Two or three short sentences.
- **Our approach to making / circularity** (real content, adapted from the designers' own one-pager, keep it short): we upcycle local materials and previously loved garments, revive carefully selected stagnant fabrics, and combine this with craftsmanship; each garment is a testimony of individuality; we blur the boundaries between couture and ready-to-wear. Two or three sentences, not a manifesto.
- **Masthead credits** (Cult* style: name, role underneath; no portraits):
  `Karen Müller` / `Co-founder / Designer`
  `Kristin Sigus-Katmann` / `Co-founder / Designer`
- **Image 1, the defect lace:** `img-lace-defect.jpg` (a white lace strip with a green-stained scalloped edge, 600x1400). Show it **small**, once. Caption (small, e.g. Times italic plus an olive Courier code), in this spirit: *"defect, left edge. the dye ran. for us, the defects are the most beautiful part."* Wording can be refined, keep it short.
- **Image 2, the typewriter stamp:** `img-typewriter-stamp.jpg` (670x163, a smudged typewritten "Ode to Shelly" on white). Small, and **misplaced**: slightly rotated, running off the page edge (partly cut by the viewport, use `overflow-x: clip` on the page so no horizontal scroll), as if a scrap slipped on the page. It can also be "broken", e.g. clipped with `clip-path` so a sliver is missing, or doubled with a slight offset like a misprint. Decorative: `alt=""` and `aria-hidden="true"`.
- Other lace files exist (`img-lace-chartreuse.jpg`, `img-lace-scan-a.jpg`, `img-lace-scan-b.jpg`). Do not use them unless the page clearly needs one; the designers asked for one little lace picture.

### Contact (`contact.html`)
Copy:
```
LET'S TALK
Have a question about bridalwear, a custom look, a collaboration or something else?

contact@odetoshelly.com
Instagram @odetoshelly

And for bridal:
START YOUR BRIDAL INQUIRY →
```
Email is a `mailto:` link, Instagram links to https://instagram.com/odetoshelly, the inquiry links to `bridal.html#inquiry`. Very simple, lots of white, Torn Page fragments around it. The coordinates caption fits here ("the studio, Copenhagen", no street address). The email and inquiry link are the information layer: large, black, unmissable.

## Verification

Headless Chrome screenshots at 1440x900 and a 390px-wide phone view for all five pages, for example:
`"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/path/out.png --window-size=1440,900 file:///path/page.html`
(on macOS headless may lay out wider than 390; render phone views inside a 390px iframe if needed). Look at every screenshot and fix what looks off. Do NOT use the browser pane tools (`mcp__Claude_Browser__*`), and do not start, stop or kill any server on port 8765 (the designers' preview server runs there).
