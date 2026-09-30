# Prototype brief (shared by all three directions)

Throwaway design prototypes for **Ode to Shelly (OTS)**, a contemporary bridalwear brand in Copenhagen founded by designers Karen Müller and Kristin Sigus-Katmann. The purpose is for the designers to react to three contrasting visual directions and pick or mix. None of this code goes into the real site.

Background: `../docs/discovery-notes.md` (all decisions so far), `../docs/brief/website-structure.txt` (content), `../docs/brief/one-pager-startup-hub.pdf` (the designers' own document, the key aesthetic reference), `../docs/references/*.png` (inspiration screenshots).

## Brand feel

Stripped down. Looks like a page ripped out of a magazine where some information has gone missing or is encrypted. Underground; sparks curiosity because it is not too obvious. Hyper-minimalist, brutalist, anti-template: raw unadorned typography, zero decorative elements, lots of stark white space. Signs like `>>` `/_` used in a slightly chaotic way hint at a broken internet. Pre-internet, anti-internet feel.

## Hard rules

1. **Two layers.** The *noise layer* (fragments, glyphs, cut-off captions, decoy numbers, redactions, scrambles) can be as broken as you like. The *information layer* (what OTS offers, the price, the process, the inquiry button and form, the email) must always be readable within seconds. Never hide real information behind hover only, never render it in chartreuse, never make it illegibly small.
2. **Colour:** black ink on white paper. Olive and chartreuse only as rare accents (a caption fragment, a stray number), never large fields, never for information-layer text.
   - `--ink: #111`  `--paper: #fff`  `--olive: #8a8600`  `--chartreuse: #c4c200`
3. **Fonts: system fonts only, no web fonts, no CDNs.**
   - Main: `"Helvetica Neue", Helvetica, Arial, sans-serif` at thin weights (100 to 300).
   - Accent: `"Times New Roman", Times, serif` and `"Courier New", Courier, monospace` for the encrypted / typewriter feel.
4. **Desktop first** (design at ~1440px wide), then a working phone layout (~390px) via media queries. No horizontal scroll on phone.
5. **Zero images.** Entirely typographic. No stock photos, no image placeholders boxes. (Photos come later.)
6. **Plain HTML + CSS + a little vanilla JS.** No frameworks, no build step, no external requests. Pages must work when opened directly from disk (`file://`) and on a simple local server.
7. **Accessibility:** semantic HTML (`header`, `nav`, `main`, `h1`...), real text (not images of text), visible keyboard focus, `prefers-reduced-motion` disables animations. Decorative noise gets `aria-hidden="true"`.
8. **No em dashes (—) anywhere** in copy or comments. Use commas, colons, slashes or parentheses instead.

## Pages to build (per direction)

`index.html` (Home) and `bridal.html` (Bridal), plus that direction's `style.css` and `script.js`.

### Navigation (both pages)

`ODE TO SHELLY` always links home (`index.html`). Menu items: `/ BRIDAL` `/ COLLECTION` `/ ABOUT` `/ CONTACT`. Only Bridal exists. Collection, About and Contact are not built: clicking them must show an on-brand message instead of a broken link, e.g. `404_ this page has gone missing (not in the prototype)`, as a small toast or inline flicker, then fade.

Also a small fixed link somewhere discreet: `<< all prototypes` pointing to `../index.html`.

### Home copy

```
ODE TO SHELLY
Contemporary bridalwear & beyond
Copenhagen

Contemporary bridalwear for women who want something a little different.
Made to order in Copenhagen.

BRIDAL →
COLLECTION →
```

(COLLECTION → shows the "gone missing" message.) The homepage does not tell the whole story. Very minimal.

### Bridal copy

```
Contemporary bridalwear
[INTRO: placeholder filler, see below]

THE SHELLY CUSTOM
Our full custom bridal experience.
/ Starting from 20.000 DKK
/ Design development
/ Fabric and trim sourcing
/ Fittings
/ Construction
/ Final adjustments
The final price depends on the complexity and materials of the look.

SEMI-CUSTOM
For someone who likes an existing OTS design but wants to adapt it.

THE COLLECTION
For brides who want to build their look from existing OTS pieces.

THE PROCESS
01 / GET IN TOUCH
Tell us about your wedding and what you're looking for.
02 / MEET
We meet in our Copenhagen studio and talk through your ideas.
03 / CREATE
We develop and make your look.
04 / WEAR
Your finished look, made for you.

Getting married in 2027?
We'd love to hear from you.
[START YOUR BRIDAL INQUIRY]  (scrolls to / opens the form)
```

Placeholder filler for the intro (deliberately weird, the designers asked for this):

> Forecast for the outer planets: light tulle drifting in from the north at four knots. Saturn stays overcast with a good chance of lace. Blahblahblah, blimblamblum. Visibility over the Kuiper belt: excellent, if you squint.

### Inquiry form (approved, exact fields)

| # | Label | Type | Required |
|---|---|---|---|
| 1 | Name | text | yes |
| 2 | Email | email | yes |
| 3 | Wedding date | date input plus a "not set yet" checkbox (checking it disables the date) | yes (date or checkbox) |
| 4 | Interested in | radio: The Shelly Custom / Semi-custom / The Collection / Not sure yet | yes |
| 5 | Tell us about your wedding and what you're looking for | textarea | yes |
| 6 | Instagram handle or Pinterest board link | text | no |
| 7 | Where did you hear about OTS? | text | no |

- Submit button text: `send >>`
- No backend. On submit: validate required fields (native `required` + custom styling is fine), prevent the real submit, and replace the form with the confirmation `received. we'll write back_` (the `_` blinks).
- Error states must be readable and on-brand.

### Footer (both pages, minimal)

`contact@odetoshelly.com` (mailto link) / `instagram >>` (https://instagram.com/odetoshelly) / `Copenhagen`.
