---
name: ots-previewing-and-sharing
description: Use when someone wants to see or test the Ode to Shelly website, view it on their phone, share it with someone else, make a zip, or when the preview is not loading, looks outdated or a change doesn't show.
---

# Previewing and sharing the Ode to Shelly website

## Preview on this computer

Start a small local web server from the `prototypes` folder (keep it running in its own terminal tab):

```bash
cd prototypes && python3 -m http.server 8765
```

Then open http://127.0.0.1:8765 (start page with all versions) or http://127.0.0.1:8765/v3/index.html (the current site). Prefer running it in a visible terminal tab the person can see, and tell them: closing that tab stops the preview.

Opening `prototypes/v3/index.html` by double-click also works, but a few effects behave better with the server.

## Common problems

| Problem | Fix |
|---|---|
| Page does not load | The server stopped (tab closed, computer restarted). Start it again. Check with `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8765/` (200 = running). |
| "Address already in use" | A server is already running on 8765; just open the address. |
| Change doesn't show | Browser cache: hard refresh with Cmd + Shift + R. |

## See it on a phone

On the same Wi-Fi, find the computer's address with `ipconfig getifaddr en0` and open `http://<that address>:8765` on the phone. Only works while the server runs.

## Share with someone else

Make a zip of the `prototypes` folder, dated, next to the repo folder, and delete older zips first:

```bash
cd .. && rm -f OTS-prototypes*.zip && cd OTS_Website && zip -rq "../OTS-prototypes-$(date +%Y-%m-%d).zip" prototypes -x "*.DS_Store"
```

Tell the person: unzip, open the `prototypes` folder, double-click `index.html`. A zip is a snapshot; after changes, make a new one. (A real web address comes when the site is launched.)
