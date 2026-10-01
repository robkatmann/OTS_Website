#!/usr/bin/env python3
"""
lace-overview: one picture comparing the photo with every version made by
lace-render.py, each with a zoomed-in detail. Rebuild it after adding,
changing or removing a version.

Usage:
  python3 tools/lace-overview.py docs/explorations/lace [--source source-collage.jpg]
                                 [--zoom 0.58 0.59]

  --zoom   where the zoomed-in detail is cut from, as a share of the width and
           height (0.58 0.59 shows the chartreuse, the white lace and the dyed edge)

Reads FOLDER/<source> and every FOLDER/lace-*.png; writes FOLDER/overview.jpg.
Needs Google Chrome; uses macOS's built-in `sips`.
"""
import argparse
import glob
import html
import os
import subprocess
import tempfile

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# known styles first, in this order; anything else (e.g. lace-emoji-romantic.png) follows
LABELS = {
    "emoji": ("Emoji", "Real emojis picked by colour, like a photo mosaic: white things (swans, sheep, shells, "
                       "hearts) for white lace, tennis balls and pears for chartreuse, peacocks, green hearts "
                       "and puzzle pieces for the dyed edge. A ring, bows and doves are hidden in it."),
    "math": ("Arithmetic", "+ − × ÷ = ± ≠ √ ∑ % and digits in the lace's colours, bold where the lace is dense."),
    "halftone": ("Halftone dots", "Dots of different sizes on a slanted grid, like a printed magazine photo seen up close."),
    "stitch": ("Cross-stitch", "x stitches in a few thread colours, like an embroidery chart. The holes stay open."),
    "typewriter": ("Typewriter", "Courier letters struck over each other, like typewriter art."),
    "threads": ("Shapes & threads", "Short thread strokes that follow the lace, rings for the holes, petals and knots."),
}


def size(path):
    out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", path],
                         check=True, capture_output=True, text=True).stdout.split()
    return int(out[-3]), int(out[-1])


def sips(*args):
    subprocess.run(["sips", *args], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def label(path):
    name = os.path.basename(path)[5:-4]  # lace-<name>.png
    style, _, variant = name.partition("-")
    title, text = LABELS.get(style, (name.replace("-", " ").capitalize(), ""))
    if variant:
        title += f" ({variant.replace('-', ' ')})"
    return title, text


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder")
    ap.add_argument("--source", default="source-collage.jpg")
    ap.add_argument("--zoom", type=float, nargs=2, default=(.58, .59), metavar=("X", "Y"))
    a = ap.parse_args()

    order = list(LABELS)
    pngs = sorted(glob.glob(os.path.join(a.folder, "lace-*.png")),
                  key=lambda p: (order.index(os.path.basename(p)[5:-4].split("-")[0])
                                 if os.path.basename(p)[5:-4].split("-")[0] in order else 99, p))
    rows = [(os.path.join(a.folder, a.source), "The photo", "The original lace, for comparison.")]
    rows += [(p, *label(p)) for p in pngs]

    with tempfile.TemporaryDirectory() as tmp:
        items = []
        for i, (path, title, text) in enumerate(rows):
            w, h = size(path)
            full, zoom = os.path.join(tmp, f"{i}-full.png"), os.path.join(tmp, f"{i}-zoom.png")
            sips("-s", "format", "png", "-Z", "1300", path, "--out", full)
            # the detail: 600 x 340 pixels of the full-size picture (at the size of the 3000px renders)
            cw, ch = round(w * .2), round(w * .2 * 340 / 600)
            x = min(w - cw, round(w * a.zoom[0]))
            y = min(h - ch, round(h * a.zoom[1]))
            sips("-s", "format", "png", "-c", str(ch), str(cw), "--cropOffset", str(y), str(x), path, "--out", zoom)
            items.append(f'<section><div><h2>{html.escape(title)}</h2><p>{html.escape(text)}</p></div>'
                         f'<img class="f" src="{full}"><figure><img src="{zoom}">'
                         f'<figcaption>zoomed in</figcaption></figure></section>')
        page = f'''<!doctype html><meta charset="utf-8"><style>
body{{margin:0;padding:40px 40px 20px;background:#fff;color:#111;width:2180px;
  font:300 15px/1.45 "Helvetica Neue",Helvetica,sans-serif}}
header{{font:400 16px "Courier New",monospace;margin:0 0 30px}} header span{{color:#8a8600}}
section{{display:grid;grid-template-columns:230px 1300px 600px;gap:24px;align-items:start;
  padding:22px 0;border-top:1px solid #111}}
h2{{margin:0 0 8px;font:400 30px/1.05 "Times New Roman",serif}} p{{margin:0}}
.f{{width:1300px;display:block}} figure{{margin:0}} figure img{{width:600px;height:340px;display:block}}
figcaption{{font:400 12px "Courier New",monospace;color:#8a8600;margin-top:6px}}
</style><header>ode to shelly <span>/_ the lace, redrawn with code (tools/lace-render.py)</span></header>
{"".join(items)}'''
        page_path = os.path.join(tmp, "overview.html")
        with open(page_path, "w") as f:
            f.write(page)
        shot = os.path.join(tmp, "overview.png")
        height = 120 + len(rows) * 490
        try:
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            "--allow-file-access-from-files", f"--screenshot={shot}",
                            f"--window-size=2260,{height}", "file://" + page_path],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
        except subprocess.TimeoutExpired:
            raise SystemExit("Chrome took too long; try again")
        out = os.path.join(a.folder, "overview.jpg")
        sips("-s", "format", "jpeg", "-s", "formatOptions", "85", shot, "--out", out)
        print(f"wrote {out} ({len(rows)} rows)")


if __name__ == "__main__":
    main()
