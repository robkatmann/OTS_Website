# Ode to Shelly: website

Hi Karen and Kristin. This folder holds your website, your images and your brand thinking.

## See the website

- Easiest: open the folder `site`, double-click `index.html`. Earlier design rounds: `prototypes/index.html`.
- Or ask Claude: *"show me the website"*. Claude starts a preview and gives you a link.

## Change something with Claude

Open this folder in Claude Code and just say what you want, in your own words, for example:

- *"Change the price on the bridal page to 22.000 DKK"*
- *"The about page feels too cold, can we make it warmer?"*
- *"Add this new lace photo to the collection page"* (and drop the photo into `docs/source-images/imagery/`)
- *"Write an Instagram caption for our new veil"*

Claude will ask questions when something is open to interpretation, suggest ideas, show you the result, and ask before saving.

**Your brand brain:** everything you tell Claude about your taste (likes, dislikes, reasons, ideas) is written down in `docs/brand/`. That way it's never forgotten and can be used later for a shop, Instagram, or a new site. You can read it, and correct it any time: *"that's not quite right, we meant..."*

## Change something yourself

- **Words:** in `site/` (`index.html` is Home, then `bridal.html`, `collection.html`, `about.html`, `contact.html`). Change the text, save, refresh the browser with Cmd + Shift + R.
- **Look** (sizes, spacing, colours): `site/style.css`. Easier to ask Claude.
- Keep tags like `<span ...>` and `</span>` in pairs. If something breaks, ask Claude to undo it.

## What's where

| Folder | What |
|---|---|
| `site/` | the website, exactly what gets published |
| `site/assets/` | images used on the site |
| `docs/brand/` | your brand brain and the log of your decisions |
| `docs/source-images/` | your original images (drop new ones here) |
| `docs/mockups/` | your design mockups |
| `docs/brief/` | the original website structure and your one-pager |
| `docs/references/` | inspiration screenshots |
| `prototypes/v1/`, `prototypes/v2/`, `docs/process/` | earlier rounds, kept for history |
