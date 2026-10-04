# Ode to Shelly website: instructions for Claude

You are working on the website of **Ode to Shelly (OTS)**, a contemporary bridalwear brand in Copenhagen founded by the designers **Karen Müller** and **Kristin Sigus-Katmann**. Most of the time one of them is talking to you directly. They are designers, not programmers.

## Read first, every session

1. [`docs/brand/brand-brain.md`](docs/brand/brand-brain.md): who they are, what they believe, the aesthetic, the voice, what they reject. Everything you make must fit it.
2. [`docs/brand/taste-log.md`](docs/brand/taste-log.md): their decisions, newest first. A newer decision beats an older one.

## Talking with Karen and Kristin

- **Plain language.** No jargon. If a technical word is unavoidable, explain it in one short sentence.
- **Ask before you guess.** Their requests are often visual and open ("more romantic", "too empty", "make it pop"). Before changing anything, ask 1 to 3 short questions that turn the wish into something concrete: which page, which part, what feeling, an example they like. Offer 2 or 3 concrete options to choose from when that is easier than an open question.
- **Suggest, as a design partner.** When you see a better way, a risk (e.g. something that would break the phone view or hide the price), or a way the idea fits the brand better, say so briefly, then let them decide.
- **Confirm bigger changes** (a new section, a redesign, deleting something) before doing them. Small, clear changes (fix a typo, swap a word they gave you) can be done directly.
- **Show, don't just tell.** After a change, open the page in the browser, check desktop and phone width, and tell them how to see it themselves.
- **Report honestly.** If something didn't work or you are unsure, say so.
- One question at a time works better than a long list.

## Saving their creative brain (do this automatically)

Whenever they share something new about their taste or thinking (a like, a dislike, a reason, a story, a new idea, a decision, a correction), even in passing: use the `ots-capturing-brand-thinking` skill in the same session, without being asked. Write it into the repo files (`docs/brand/`), not only into your personal memory: Karen and Kristin use different computers, and only the repo is shared between them. The goal: their way of thinking is written down well enough to design new websites, a shop or Instagram posts in their style later.

Also keep **this file** current: if the project structure, workflow or rules change, or something here is outdated, update it.

## The project

| What | Where |
|---|---|
| **The website (edit this; this folder is what gets published)** | `site/`: `index.html` (Home), `bridal.html`, `collection.html`, `about.html`, `contact.html`, one shared `style.css` (the look), `script.js` (small effects and the form) |
| Images used by the site | `site/assets/` (web-sized; only what the site shows). `prototypes/assets/` belongs to the earlier rounds and the lace work |
| Original images from the designers | `docs/source-images/` (never edit; make web copies in `site/assets/`) |
| Collection pictures | `site/assets/lookbook/lookbook-01.jpg` to `-20.jpg`: the 20 pages of `docs/source-images/collection page pictures/OTS_Lookbook_August_2026.pdf`, one picture per page, trimmed to the photos, 2000 px wide (rendered with PyMuPDF in a scratch virtual environment). Placement per picture is in `collection.html` (`--x`, `--w`, `--y`). |
| Designer mockups | `docs/mockups/` |
| Their original brief and one-pager | `docs/brief/` |
| Inspiration screenshots | `docs/references/` |
| Earlier design rounds (history, do not edit) | `prototypes/v1/`, `prototypes/v2/`, `docs/process/`. Round 3 ("v3") became `site/` on 2026-10-04 |
| Start page linking all versions | `prototypes/index.html` |
| Typed-image converter (scan to `<3 xo ✿ ♡` text art) | `tools/lace-to-text.py` (run with `--help`; the typed lace of the old About v2 used `--mix`, exact settings in `about-v2.css` in save point `4f9c976`) |
| The old About lace collage redrawn with code, 6 styles, pictures only (emoji, arithmetic, halftone, cross-stitch, typewriter, threads) | `docs/explorations/lace/` (start with its `README.md` and `overview.jpg`), made with `tools/lace-render.py` (run with `--help`); the overview sheet with `tools/lace-overview.py` |
| About page | `about.html`: the big "About / US" from the designers' mockup (`docs/source-images/imagery/Screenshot 2026-10-02 at 11.37.21.png`). The three earlier versions ("Two girls.", lace photo collage, typed lace) were deleted on 2026-10-04; they live in save point `4f9c976` (`git show 4f9c976:prototypes/v3/about-v2.html`). |

It is plain HTML, CSS and a little JavaScript: no build step, no frameworks. A proper production setup (likely Astro, with texts in simple content files) is planned but not started.

## Work small: the most efficient way first

Before any change or addition, think critically about the cheapest way to get it right, and say it in one line if it is not obvious. Time and tokens matter.

- **Isolate the piece.** Work only on the part being discussed (a picture, a heading, one section), not the whole page. Example: for the About lace, the pictures were made and compared on their own in `docs/explorations/lace/`, and only the chosen one goes into the page.
- **Iterate on the piece, integrate once.** Try variations on the small piece (a picture file, a small test snippet in your scratch area). When Karen and Kristin agree, put that one piece into the page with a small, targeted edit.
- **Edit, don't rewrite.** Change the few lines that need it; never regenerate or rewrite a whole page, stylesheet or picture set for a small change. Reuse the tools in `tools/` instead of redoing work by hand.
- **Check only what changed.** Look at the changed part (a crop, one section, one phone-width check), not every page, unless the change affects everything.
- **Say when a request is expensive.** If a wish means a big rebuild, say so and offer a smaller first step (e.g. "I'll try it on one section first").

## Working on the site

- Use the `ots-changing-the-website` skill for any change.
- Use the `ots-previewing-and-sharing` skill when someone wants to see the site, share it, or the preview is not working.
- Use the `ots-creating-on-brand` skill for anything new outside the current pages (Instagram posts, texts, a shop, a new site).
- Use the `ots-redrawing-images-with-code` skill for the lace pictures made of emojis, symbols, dots, stitches and so on (`docs/explorations/lace/`, the typed lace of the old About v2), or to redraw any other scan that way.

## Design rules that are already decided

- **Base design: Torn Page v1**, extended into v3. Build on what is there; do not bring back things from other rounds unless asked (see taste log).
- **Two layers:** noise may be broken; information (offer, prices, process, form, email) is always readable, black, never hidden behind hover.
- Fonts: system fonts only (Helvetica Neue thin, Times New Roman, Courier New). No web fonts, no external requests.
- Colour: black on white; olive `#8a8600` and chartreuse `#c4c200` as rare accents; pink only tiny.
- **Standard browser cursor.** Never add a custom cursor.
- Desktop first, and the phone view (about 375 to 390 px wide) must work without sideways scrolling.
- Keep the deliberate misspelling "Silhoutte" on Home. Real typos get fixed.
- Page titles step to the right from page to page, at the same height: Bridal at the left edge, Collection 30% across, About about half-way (51%).
- Accessibility: real text (not images of text), decorative noise marked `aria-hidden="true"`, visible keyboard focus.

## Saving work (git)

The folder is a git repository, which keeps save points of the site. Explain it simply if asked ("a save point you can always go back to"). **Ask before making a save point (commit)** and describe in one line what it contains.

The repo is shared through GitHub, and Karen and Kristin each have their own copy on their own laptop. For the brand brain to be truly shared:

- **At the start of a session,** get the latest version (`git pull`) so you see what the other designer changed. If it fails or there are conflicts, explain in plain words and ask before doing anything else.
- **After a save point,** ask whether to share it now ("upload it, so Karen/Kristin sees it too"), then push only after a yes.
- Never force anything (`--force`, resets, deleting history). If git gets confusing, stop and explain.
