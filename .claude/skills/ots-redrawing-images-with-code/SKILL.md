---
name: ots-redrawing-images-with-code
description: Use when anyone discusses, reviews or wants changes to the Ode to Shelly lace pictures made of emojis, symbols, arithmetic signs, dots, stitches, typewriter letters or threads (the typed lace on About v2 or the pictures in docs/explorations/lace), or wants another scan, strip or photo redrawn from characters or shapes, e.g. for Instagram.
---

# Redrawing images with code (the lace pictures)

## Overview

The designers want the lace drawn by code, not shown as a photo: tiny marks (emojis, signs, stitches...) that read as the lace from afar, and reveal what they are when you zoom in. That discovery is the point. Fidelity to the real lace (shapes, holes, colours) matters as much as the fun.

| What | Where | Made with |
|---|---|---|
| Six pictures: emoji, math (arithmetic), halftone, stitch, typewriter, threads | `docs/explorations/lace/` (`README.md`, `overview.jpg`, `lace-<style>.svg/.png`) | `tools/lace-render.py` |
| The comparison sheet | `docs/explorations/lace/overview.jpg` | `tools/lace-overview.py` |
| Their source: the collage exactly as on the About page | `docs/explorations/lace/source-collage.jpg` | see Technical notes |
| Single strips: the same scans as in the collage, straight (the collage tilts them); `img-lace-*.jpg` are older crops, not these | `prototypes/assets/lace-strip-{yellow,defect,chartreuse,peach}.jpg` | |
| Typed lace on the About v2 page | the `<pre class="lace-type ...">` in `prototypes/v3/about-v2.html`; settings in the comment in `about-v2.css` | `tools/lace-to-text.py --mix` |

**Names for the parts of the collage**, top to bottom: the pale **yellow lace** (top edge), the **white lace** (with the scallops at the bottom), the bright **chartreuse band** across the middle, and the **dyed edge** (the white lace's scallops, grey on the left, sea-green on the right). "The green part" can mean the chartreuse band or the dyed edge: look at the picture, and ask if still unsure.

## Steps

1. **Brand first:** "Typed images" in `docs/brand/brand-brain.md` and the newest `docs/brand/taste-log.md` entries.
2. **Clear wish** (finer, another strip, leave out an emoji): do it. **Open wish** ("more romantic", "too busy"): ask 1 or 2 questions with concrete options and a recommendation. Say plainly when an option moves away from the photo: emojis are chosen by colour, so removing the best match (🎾 is the only true chartreuse) makes that part warmer yellow or greener.
3. **New versions go next to the old ones**, named `lace-<style>-<word>.svg`, e.g. `lace-emoji-romantic.svg`, `lace-stitch-chartreuse.svg`. Replace or delete a version only when they say so.
4. **Make it** (commands below). Each style runs in seconds.
5. **Check it yourself** before showing: open the PNG. From afar (shrink it, e.g. `sips -Z 500 in.png --out /tmp/x.png`) it must read as the lace; up close the marks must be clear. White lace = soft grey (never khaki or brown), chartreuse bright, the green-dyed edge green (their favourite part), holes open.
6. **Update the folder:** add the version's row to the table in its `README.md` (the overview takes titles and descriptions from there) and its exact command under "Commands for each version", then rebuild the sheet with `python3 tools/lace-overview.py docs/explorations/lace`.
7. **Capture** their reactions with `ots-capturing-brand-thinking`. Offer a save point; PNGs are 1.5 to 3 MB each, so suggest deleting rejected versions (ask first).

## Commands

```bash
python3 tools/lace-render.py docs/explorations/lace/source-collage.jpg docs/explorations/lace/lace-emoji-romantic.svg --style emoji --avoid "🎾" --png
```

| Wish | Setting |
|---|---|
| Finer, tinier marks | `--cols` higher. Defaults: emoji 150, math 200, halftone 190, stitch 160, typewriter 250, threads 170 |
| Same, arranged differently | `--seed 2` |
| Leave out an emoji | `--avoid "🎾"` (only what they named: 🍐 also sits in the yellow lace) |
| Add an emoji | `--extra "🌷"`: measured on the fly, placed wherever its colour fits, for this picture only |
| Hide a few emojis here and there (about 1 in 250 marks) | `--finds "🌷💍"` replaces the usual hidden 💍 🎀 🕊️ 🥂 🧵 🪡 |
| One strip only, or another scan | use that file as the image (crop first with `sips -c H W --cropOffset Y X in.jpg --out out.jpg`) |
| Lighter or darker overall | `deepen=` in that style's `target(...)` call |
| About v2 typed lace: more symbols, other sizes | `lace-to-text.py --symbols`, the `.z0` to `.z8` sizes and `--fs` in `about-v2.css`; rerun the command in the `about-v2.css` comment and swap the `<pre>` in `about-v2.html`. It is a site page: also use `ots-changing-the-website`. |

**Emojis that read romantic or bridal, by part** (all measured): white lace 🤍 🩶 🕊️ 🦢 🫧 ☁️ 🪽 🥚 🐚 💍; yellow lace ⭐ ✨ 💛 🌼; chartreuse band 🎾 (exact colour, sporty), 🍀 💚 🍏 (greener), 💛 🌼 (warmer); dyed edge 💚 🌿 🍃 🧩 🦚; pink only as tiny finds 🎀 🌸 🩷 💗 🌷 (pink stays small in this brand).

Prefer the options above to editing the tool: changing the lists in `lace-render.py` changes every future emoji picture, and the existing ones can no longer be remade exactly. Edit the lists only for a lasting decision (then regenerate the affected pictures and say so).

## Technical notes

- PNGs and `--measure` need Google Chrome (headless, with time limits). If one hangs, stop only processes whose command line contains `--headless`, by their number. Never close the person's own Chrome.
- Emojis look slightly different on iPhone, Android and Windows; the PNGs show Apple's.
- `source-collage.jpg` is the About page's `.lace-hero` (three strips, angles in `prototypes/v3/style.css`) without the menu, screenshotted at 1500 x 510 at double resolution. Rebuild it only if the collage on About changes.

## Common mistakes

| Mistake | Instead |
|---|---|
| Overwriting a version they liked | Save beside it under a new name |
| Judging only the zoomed-in detail | Check from afar too: it must still read as the lace |
| White lace turning khaki or brown | Cream counts as white (`neutral()`); check after changing colours |
| Building a page to show the pictures | Pictures only, unless they ask |
