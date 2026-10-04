---
name: ots-changing-the-website
description: Use when Karen, Kristin or anyone asks to change the Ode to Shelly website in any way, such as texts, prices, images, colours, spacing, layout, a section or a new page, including vague wishes like "more romantic", "too empty", "make it pop" or "something feels off".
---

# Changing the Ode to Shelly website

## Overview

The people asking are designers, not programmers. A change is only done when it matches what they meant, fits the brand, and works on desktop and phone. Understanding the wish comes before touching any file.

## Steps

1. **Load the brand.** Read `docs/brand/brand-brain.md` and the newest entries of `docs/brand/taste-log.md` if not already read this session.
2. **Turn the wish into something concrete.**
   - Clear and small (typo, swap a given word, change a given price): go to step 3.
   - Open or visual ("more romantic", "fix it", "too empty"): ask 1 to 3 short questions first, one at a time if possible. Useful angles: which page and which part; what feeling or what bothers them; an example they like; does it affect text, images or layout. Offer 2 or 3 concrete options they can pick from, each described in one plain sentence, and say which one you would choose and why.
   - Conflicts with a decided rule (taste log, CLAUDE.md design rules): mention the earlier decision kindly and ask if they want to change it.
3. **Pick the smallest way** (see "Work small" in CLAUDE.md). Visual or uncertain changes: try them on the isolated piece first (a picture, a scratch snippet, one section), show that, and only put the agreed version into the page. Clear changes: edit just those lines.
4. **Confirm bigger changes** (new section, redesign, removing content, several pages): describe the plan in 2 to 4 plain sentences and wait for a yes.
5. **Make the change** in `site/`. Words live in the `.html` files; the look lives in `style.css`. Keep `<span ...>` tags paired. New images: put originals in `docs/source-images/`, web copies in `site/assets/` (max ~2000 px, JPEG).
6. **Check it yourself.** Open the page in the browser (see `ots-previewing-and-sharing`), at desktop width and at phone width (~390 px). No sideways scrolling, information readable, nothing overlapping. Browsers cache: hard refresh.
7. **Tell them plainly** what changed, where to see it, and anything you were unsure about. Offer a next step if one is obvious.
8. **Capture new taste.** If they revealed a preference or reason, use `ots-capturing-brand-thinking`.
9. **Offer a save point** (git commit) after a finished change; ask first. Then offer to share it (push) so the other designer gets it; see CLAUDE.md "Saving work".

## Common mistakes

| Mistake | Instead |
|---|---|
| Guessing what "romantic" means and redesigning | Ask, offer options, then change |
| Adding extras they didn't ask for (cursor, animation, colour) | Only what was asked; suggest extras, don't add them |
| Checking only desktop | Always check phone width too |
| Rewriting a whole page or stylesheet for a small change | Edit the few lines involved; iterate on the isolated piece, then integrate |
| Explaining in code terms | Plain words: "the space between the two text blocks is bigger now" |
| Editing `prototypes/` or `docs/source-images` | Only edit `site/` (the lace pictures in `docs/explorations/lace`: see `ots-redrawing-images-with-code`) |
| Retyping a typed lace by hand | It is generated: use `ots-redrawing-images-with-code` |
