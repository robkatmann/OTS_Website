---
name: ots-previewing-and-sharing
description: Use when someone wants to see or test the Ode to Shelly website, view it on their phone, share it with someone else, make a zip, or when the preview is not loading, looks outdated or a change doesn't show.
---

# Previewing and sharing the Ode to Shelly website

## Preview on this computer

Start a small local web server from the repository folder (keep it running in its own terminal tab). In the Claude desktop app, `.claude/launch.json` (`ots-prototypes`) does the same:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/site/ (the website) or http://127.0.0.1:8765/prototypes/ (earlier design rounds). Prefer running it in a visible terminal tab the person can see, and tell them: closing that tab stops the preview.

Opening `site/index.html` by double-click also works, but a few effects behave better with the server.

When checking a change, look at the changed part (and its phone view) rather than every page, unless the change affects all pages.

## Common problems

| Problem | Fix |
|---|---|
| Page does not load | The server stopped (tab closed, computer restarted). Start it again. Check with `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8765/` (200 = running). |
| "Address already in use" | A server is already running on 8765; just open the address. |
| Change doesn't show | Browser cache: hard refresh with Cmd + Shift + R. |

## See it on a phone

On the same Wi-Fi, find the computer's address with `ipconfig getifaddr en0` and open `http://<that address>:8765/site/` on the phone (the server must then be started without `--bind 127.0.0.1`). Only works while the server runs.

## Share with someone else

Make a zip of the `prototypes` folder, dated, next to the repo folder, and delete older zips first:

```bash
cd .. && rm -f OTS-prototypes*.zip && cd OTS_Website && zip -rq "../OTS-prototypes-$(date +%Y-%m-%d).zip" prototypes -x "*.DS_Store"
```

Tell the person: unzip, open the `prototypes` folder, double-click `index.html`. A zip is a snapshot; after changes, make a new one. (A real web address comes when the site is launched.)
