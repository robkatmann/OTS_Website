# The About lace, redrawn with code

The lace collage from the old About page (replaced on 2026-10-04), without the photo: each picture is drawn by code (`tools/lace-render.py`) from `source-collage.jpg`, the three lace strips exactly as they sit on the page. Pictures only, no pages. Start with `overview.jpg`, which shows all of them next to the photo, each with a zoomed-in detail.

| Style | Files | What it is |
|---|---|---|
| Emoji | `lace-emoji.svg` / `.png` | Real emojis picked by colour, like a photo mosaic: swans, sheep, shells, eggs, champagne and grey hearts for the white lace; tennis balls and pears for the chartreuse; peacocks, green hearts and puzzle pieces (the missing piece) for the dyed edge. A ring, bows and doves are hidden in it. |
| Arithmetic | `lace-math.svg` / `.png` | + − × ÷ = ± ≠ √ ∑ % and digits in the lace's colours, bold where the lace is dense. |
| Halftone dots | `lace-halftone.svg` / `.png` | Dots of different sizes on a slanted grid, like a printed magazine photo seen up close. |
| Cross-stitch | `lace-stitch.svg` / `.png` | x stitches in 12 thread colours, like an embroidery chart; the holes of the lace stay open. |
| Typewriter | `lace-typewriter.svg` / `.png` | Courier letters struck over each other; black ribbon for the white lace, coloured ribbons for the dyed parts. |
| Shapes & threads | `lace-threads.svg` / `.png` | Short thread strokes that follow the lace, rings for the holes, small petals and knots. |

## Looking at them

- **`.png`**: a normal picture, opens anywhere.
- **`.svg`**: open it in Chrome or Safari and zoom in (`Cmd +`). It stays sharp at any zoom, so you can see the tiny marks that make up the lace.
- Emojis look a little different on iPhone, Android and Windows. The PNG shows the Apple emojis.

## Making more (or ask Claude)

Every picture is made with one command, for example:

```
python3 tools/lace-render.py docs/explorations/lace/source-collage.jpg docs/explorations/lace/lace-emoji.svg --style emoji --png
```

- `--style`: `emoji`, `math`, `halftone`, `stitch`, `typewriter` or `threads`
- `--cols 220`: more marks across, so they are finer and tinier (each style has its own default)
- `--seed 2`: the same picture, arranged differently
- `--png`: also save a PNG (needs Google Chrome)
- `--avoid "🎾"`: leave these emojis out (emoji style)
- `--extra "🌷"`: also use these emojis, wherever their colour fits (emoji style)
- `--finds "🌷💍"`: the emojis hidden here and there (emoji style)

New versions are saved next to the old ones with an extra word, e.g. `lace-emoji-romantic.svg`, so you can compare. Add a row for each to the table above (the overview takes its titles and descriptions from it) and its command below, then rebuild the overview:

```
python3 tools/lace-overview.py docs/explorations/lace
```

It works with any scan, not only this lace (for example a single strip from `prototypes/assets/lace-strip-*.jpg`).

## Commands for each version

The six above use the command shown under "Making more", with only `--style` changed. Versions with extra settings:

- (none yet)
