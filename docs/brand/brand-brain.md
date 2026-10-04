# Ode to Shelly: brand brain

The creative thinking of Karen Müller and Kristin Sigus-Katmann, written down so it can guide anything made for the brand: the website, a future web shop, Instagram posts, texts, print.

**This is a living document.** Claude updates it whenever the designers share something new about how they think, what they love or what they reject. Dated decisions and the reasons behind them live in [`taste-log.md`](taste-log.md). If this file and the taste log disagree, the newer entry wins, and this file gets corrected.

Labels used below: **(said)** the designers said it directly · **(one-pager)** from their own startup one-pager, `docs/brief/one-pager-startup-hub.pdf` · **(observed)** a pattern Claude noticed in their choices, confirmed by their feedback.

---

## 1. Who

- **Ode to Shelly (OTS):** contemporary bridalwear and beyond, made to order in Copenhagen. (said)
- Founded by designers **Karen Müller** and **Kristin Sigus-Katmann**, who met studying at The Royal Danish Academy (Fashion, Clothing and Textile) and started OTS from their shared studio practice. (said, one-pager)
- Tagline in use: *Contemporary bridalwear & beyond. Copenhagen.* (said)
- **Who "Shelly" is has not been told yet.** Treat it as a deliberate mystery until the designers explain it. Placeholder texts about Shelly are playful fiction and must be replaced by the real story when it arrives.

## 2. What they believe

- **Upcycling and circularity:** repurposing previously loved garments, reviving carefully selected stagnant fabrics, sourcing locally, building value in what is considered waste. (one-pager)
- **Craftsmanship and couture thinking**, used to blur the line between couture and ready-to-wear. (one-pager)
- **Individuality:** each garment is a testimony of the person wearing it. (one-pager)
- **A feminist perspective on design;** wearing should be meaningful and empowering. (one-pager)
- **Defects are beautiful.** A lace whose dye ran is "our favourite part", not a flaw. (said)
- Close relationships with customers, who inform the designs; collaboration with local makers and textile suppliers. (one-pager)
- The bridal market is seen as expensive, uninspiring and outdated; OTS is an alternative for women "who want something a little different". (one-pager, said)

## 3. Who it is for

- Brides who want something a little different. Many arrive from Instagram, on a phone. (said)
- The collection is for weddings, parties, nights out and everything in between. (said)

## 4. The offer (website facts)

- **The Shelly Custom:** full custom bridal, **from 20.000 DKK**: design development, fabric and trim sourcing, fittings, construction, final adjustments. Final price depends on complexity and materials. (said)
- **Semi-custom:** an existing OTS design, adapted. (said)
- **The Collection:** build a look from existing OTS pieces. Later a ready-to-wear web shop. (said)
- **Process:** 01 Get in touch, 02 Meet (Copenhagen studio), 03 Create, 04 Wear. (said)
- Contact: contact@odetoshelly.com, Instagram @odetoshelly. Domain odetoshelly.com: was at Squarespace and expired; being moved to Porkbun (2026-10-04). The website will be hosted on Cloudflare Pages. The contact@ email depends on the domain being active again. (said)
- Current bridal season focus: weddings in 2027. (said)

## 5. The aesthetic

**The core image: a page ripped out of a magazine where some information has gone missing or is encrypted.** (said)

- Stripped down, underground, anti-template. It should spark curiosity because it is **not too obvious**. (said)
- Hyper-minimalist and brutalist: raw typography, zero decoration for its own sake, a lot of stark white space. (said)
- A hint of a broken, pre-internet internet: signs like `>>` and `/_`, used sparingly. Text that decrypts or "unravels" here and there is liked (Broken Browser, About v2). (said)
- **Mysterious, but never messy or confusing.** This is the line they keep drawing. (said about their favourite prototype)
- Calm beats chaos. When offered more noise, they chose the calmer version. (observed)

### The two layers (the rule that keeps it usable)

- **Noise layer:** caption fragments cut off by the page edge, orphan codes, missing figures, redactions. Can be as broken as the design wants.
- **Information layer:** what OTS offers, prices, the process, the inquiry form, the email. Always readable within seconds, in black, never hidden behind hover, never tiny, never in chartreuse. (agreed)

## 6. Visual language

**Typography** (system fonts only):
- **Helvetica Neue, thin weights** (100 to 300): the main voice. (said)
- **Times New Roman:** the editorial voice, italics, mid-sentence jumps. (said)
- **Courier New:** typewriter moments, codes, the Contact letter. (said, observed)
- **Font and size switch mid-sentence**, like their one-pager ("Changing the LANDSCAPE OF BRIDAL WEAR *by* pushing a..."). Big jumps in headlines, gentle ones in body text. (one-pager, observed)
- **Big page titles mix Times and thin Helvetica at the same size**: "Contemporary / bridal", "Coll|ection", "Abo|ut / US". The Times part is what they call "bold". Titles look and behave alike across pages, including the misprint effect on mouse hover. (said, observed; About 2026-10-04)

**Colour:**
- Black ink on white paper. (said)
- **Olive `#8a8600` and chartreuse `#c4c200`** as rare accents only: a caption fragment, a stray number. (said)
- **Pink `#f28ab9`** exists as a tiny accent (e.g. a blinking underscore). Pink also arrives naturally through photos. (observed)
- Red was tried for "RE" and "BLE" in a mockup and not kept: headings stay black, "similar like on other pages". (said, 2026-10-01)
- The chartreuse lace in their scans matches the brand accent exactly. (observed)

**Materials and imagery:**
- Scans of real materials beat stock photos: lace (chartreuse, pale yellow, white with green-dyed edge, peach hearts), loose threads, pins with pink thread, tulle, satin ribbon, paper scraps, a typewritten "Ode to Shelly". (said, supplied)
- Images should be **subtle, not evident**; backgrounds that are too intense get rejected. (said)
- Imagery is sparse. Missing images can be part of the look: `[fig. 03 missing]`. (observed, liked)
- **Real photos arrive on Collection** (2026-10-04): the August 2026 lookbook, scattered in different sizes with a lot of white around them, the text merged with the pictures (references: `docs/source-images/collection page reference/`). (said)
- **Typed images:** a photo can be remade from typed characters instead of showing the photo itself, e.g. the lace on the old About v2. Fits the pre-internet, encrypted feel. `tools/lace-to-text.py` converts any scan. (said, 2026-10-01) Since 2026-10-04 the About page has no lace at all (their new mockup); the typed and redrawn lace stays an idea for other uses, e.g. Instagram.
  - It should stay close to the real photo (shapes, holes, colours), not become generic texture. (said)
  - **The symbols are tiny, so at first it reads as a picture; zoom in and you discover it is emoticons, symbols, "copy paste stuff".** That discovery is the point. (said)
  - Mixed sizes and colours per symbol; classic emoticons (`<3 xo ;) :*`) plus copy-paste symbols (♡ ✿ ❀ ✧). Real emojis are allowed too, whatever gets closest to the picture. (said)
  - The photo itself should not be shown: the lace is redrawn with code. Ways explored: emoji mosaic, arithmetic signs, halftone dots, cross-stitch, typewriter overstrike, shapes and threads (`docs/explorations/lace/`). (said, 2026-10-01; no favourite yet)

**Recurring motifs:** caption fragments bleeding off the left edge, orphan stacks like `2027 / VEIL / 210` and `36 / Silhoutte / 68` (the misspelling of "Silhoutte" is kept on purpose on Home), stacked giant letters, columns that jump left and right, a half-cut olive page number, `>>` and `/_`. (one-pager, observed, liked)

**Across pages:** the main title steps to the right from page to page, like turning pages: Bridal at the left edge, Collection about 30% across, About about half-way (51%, from their 2026-10-04 mockup; earlier 60%), all at the same height under the menu. (said, 2026-10-01)

## 7. Voice and tone

- Short, dry, a little poetic, slightly odd. Lowercase winks. Word play is welcome: RE(us)BLE = reusable, with "us" in the middle. (observed, liked)
- Examples they liked: `send >>` · `received. we'll write back_` · *"defect, left edge. the dye ran. for us, the defects are the most beautiful part."* · *"Getting married in 2027? We'd love to hear from you."*
- Playful nonsense is welcome as placeholder ("blahblahblah, blimblamblum", weather reports from space), but real texts come from the designers. (said)
- Not salesy: no sale banners, no pushy asks (budget is not asked in the inquiry form). (said)

## 8. What they reject (with reasons, details in the taste log)

- **Copying a reference too literally** (e.g. the endless repeating menu from a reference site): feels like stealing. Borrow the feeling, invent the form. (said)
- **Tech or "IT website" feel** without a bridal counterpart. (said)
- **Features tried and not chosen come back only if asked for** (e.g. custom cursors: tried, rejected; standard cursor). (said)
- Additions they did not ask for, even small ones, if they change a page they already liked. (observed)
- Images that dominate: too-intense backgrounds, a tulle veil over the wordmark. (said)

## 9. Taking the brand beyond the website

When making anything new (Instagram, a shop, print, emails), carry over: the torn-magazine-page idea, the two layers, the three fonts with mid-sentence jumps, black and white with rare olive or chartreuse, real material scans, short odd lowercase copy, lots of white space, curiosity over explanation. Always check new work against section 8.
