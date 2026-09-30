# Ode to Shelly website: discovery notes

Running log of decisions made during Q&A. Feeds the design spec (`docs/design-spec.md`, not written yet).

## Confirmed

- **Primary goals (year one):** bridal inquiries (studio appointments) AND brand building (credibility for press, collaborators, stockists).
- **Audience:** mostly arrives from Instagram, on a phone.
- **Design priority:** desktop first (the designers compose on the big canvas), then scaled down for phones. Phone view must still work well given the Instagram traffic.
- **Photography:** lives on Instagram for now; photos get added to the site later. Design must work with zero images at launch.
- **Language:** English only.
- **Roles:** Kristin Sigus-Katmann and Karen Müller review design; the site owner handles tech and relays.
- **Pages:** Home, Bridal, Collection, About, Contact (content base: `brief/website-structure.txt`).
- **Principle (proposed):** two layers. The noise layer can be as broken as we like; the information layer (offer, price, how to inquire, email) stays readable within seconds on a phone.
- **Colour:** black on white, with olive and chartreuse (from the one-pager) as rare accents only: a caption fragment, a stray number. Never large fields of colour.
- **Bridal inquiry:** a short form on the site, delivered to the inbox by email (free form service). Calendar booking can come later.
- **Inquiry form fields (approved):**
  1. Name (required)
  2. Email (required)
  3. Wedding date, or "not set yet" (required)
  4. Interested in: The Shelly Custom / Semi-custom / The Collection / Not sure yet (required)
  5. "Tell us about your wedding and what you're looking for" (required)
  6. Instagram handle or Pinterest board link (optional)
  7. Where did you hear about OTS (optional)
  - Left out on purpose: phone number, budget.
  - Tone: submit button `send >>`; confirmation `received. we'll write back_`.
- **Editing after launch:** Kristin and Karen edit the content themselves, either directly in the files (a local git-synced folder each, or the GitHub web editor) or with Claude's help. The site owner handles setup at launch.
  - Consequence: all words live in plain, clearly labelled content files (one per page, one per collection piece), separate from the layout code.
  - Consequence: the repo gets a `CLAUDE.md` explaining the project, so any Claude session Kristin or Karen opens understands the site straight away.
  - `CLAUDE.md` is a living file: it instructs Claude to update it (and the design docs) whenever it is outdated or the site changes. Project skills (e.g. "add a collection piece", "update bridal copy") and design/context docs get created when a repeated task needs them, and Claude keeps them current too.
- **Domain:** `odetoshelly.com`, registered via Squarespace. Only the old Squarespace *website* subscription expired; the domain is owned and `contact@odetoshelly.com` works. Launch = point the domain's website records (DNS) at the new host, leaving the email records untouched.
- **Timing:** as soon as possible; 2027 brides are booking now, and inquiries peak around New Year and January. Aim to be live before the holidays (late 2026). Speed over completeness: launch lean, add photos and pieces after.
- **Copy:** prototypes use the structure doc copy where it exists; missing parts (About story, Bridal intro) get deliberately weird filler (nonsense syllables, weather reports from space). Real texts come later.
- **Defaults agreed:** no tracking cookies and no cookie banner; system fonts (Helvetica Neue thinnest weights, Times, Courier); no embedded Instagram feed, plain link instead; clean semantic text for screen readers and search engines.
- **Analytics:** later, after launch. Cookieless (Plausible or Cloudflare Web Analytics), so no banner needed.
- **Tech (proposed):** throwaway prototypes in plain HTML; real site in Astro.

## Prototype round 1 feedback (2026-09-27)

- All three liked. **Favourite: 3, Broken Browser**: mysterious but not messy or confusing. "Not far from a good first version."
- 3's endless menu was a straight copy of the nhogirl reference: irritating, feels like stealing. Replace with an own idea, or keep it simple.
- 3 needs a **girly / bridal touch** so it reads as bridalwear, not an IT website (from the new images or otherwise).
- Kristin likes the **placement of the noise fragments in 1, Torn Page** (caption fragments bleeding off the left edge, "2027 / VEIL / 210", "36 / Silhoutte / 68", "/_", the half-cut olive "01", footer line).
- Round 2: redo all three, **slightly simplified**, using the new images.
- **Cursor:** custom and cryptic, like the pink shard shape the designers supplied, or similar but more bridal. Made: `prototypes/assets/cursor-shard.svg` (their shape) and `cursor-pin.svg` (pearl-headed sewing pin).
- **New images** (originals in `docs/backgrounds/` and `docs/imagery/`, web versions in `prototypes/assets/`):
  - Backgrounds (10 scans): usable sitewide or per section, subtle, may be layered or modified.
  - Imagery (3): moodboard collage, tulle close-up, satin ribbon. Usable across pages at any size or format.
- **Round 2 tweaks (2026-09-27):** sitewide background in Torn Page v2 and Broken Browser v2 swapped to the designers' sparser thread scan (`docs/backgrounds/backdrop11.webp`, web: `prototypes/assets/bg-threads-light.jpg`, opacity 0.7); the old `bg-threads.jpg` was too intense. Tulle veil over the Broken Browser wordmark removed: it looked better without it.
- **Palette update:** pink enters as an accent through the images and cursor (`#f28ab9` from the shard; soft paper pink in the scans).

## Prototype round 2 feedback (2026-09-30)

- **Torn Page is "almost good to go": focus on that design** for v3 (base version to confirm: v1 or v2).
- From Broken Browser, keep two details, used minimally: the olive Courier coordinates `55.6761 N / 12.5683 E` and the `>>` with the blinking/moving `_` (the animation was liked).
- **No custom cursor.** v1 had none; the designers chose v1. Tried in round 2, not wanted.
- **Cursor test (requested 2026-09-30):** one test page only, v3 home with the normal cursor inverted (white fill, black edges, "white wedding dress"): `prototypes/assets/cursor-white-arrow.svg` and `cursor-white-hand.svg`. The rest of v3 keeps default cursors until decided.
- **Rule:** when a version is chosen as the base, take it as it is. Only add what the designers explicitly ask for; never carry over features from other rounds by assumption.
- **New pages in v3:** Collection, About, Contact.
- **New images** (`docs/imagery 2/`): two lace scans. `Scan 14.jpeg`: chartreuse and pale-yellow lace strips plus a white lace with a green-stained edge. `Scan 4.jpeg`: peach heart-shaped lace plus the same stained white lace. Use on a subpage (e.g. About), small, once, with a caption along the lines of: this lace is defected, and for us the defects are the most beautiful part.

## Open

- Final About and Bridal intro texts (after prototypes)
- Who or what is "Shelly"? (parked; shapes tone)
