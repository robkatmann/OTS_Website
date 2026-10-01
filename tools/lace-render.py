#!/usr/bin/env python3
"""
lace-render: redraw a scan (e.g. the lace collage of the About page) with
code instead of showing the photo. The result is an SVG picture that stays
sharp however far you zoom in, so tiny marks can read as "a photo" from afar
and reveal what they are up close.

Styles:
  emoji       real emojis picked by colour, like a photo mosaic (🤍 🩶 💚 🎾 💍 🎀)
  math        arithmetic: · − + = × ÷ ± ≠ ∞ % and digits, in the lace's colours
  halftone    dots of different sizes on a slanted grid, like a printed photo
  stitch      cross-stitch: x stitches in a small set of thread colours
  typewriter  Courier characters struck over each other, like typewriter art
  threads     short strokes that follow the lace, rings for holes, petals, knots

Usage:
  python3 tools/lace-render.py IMAGE OUT.svg --style emoji [--cols 150]
                               [--width 1500] [--png] [--seed 1]

  --cols   how many marks across (more = finer, tinier marks)
  --width  width of the picture in SVG units (CSS pixels when shown 1:1)
  --png    also save OUT.png (twice the width), using Google Chrome if installed

  python3 tools/lace-render.py --measure "🌷🦋"
           measure new emojis (coverage and ink colour) to add to the EMOJI table

Uses numpy and macOS's built-in `sips`; nothing else to install.
"""
import argparse
import math
import os
import random
import struct
import subprocess
import tempfile

import numpy as np

PAPER = np.array([255.0, 255.0, 255.0])
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# measured once in Chrome on macOS: how much of its square each mark fills
# ("cov", at 80% of the square for emojis and signs, 100% for Courier) and
# the average colour of its ink. Emojis: bridal and lace things only.
EMOJI = {
    "🤍": (.357, (222, 222, 222)), "🩶": (.380, (150, 150, 150)), "💛": (.387, (249, 202, 86)),
    "💚": (.385, (83, 202, 70)), "🩷": (.382, (231, 69, 167)), "💗": (.381, (228, 126, 180)),
    "🌸": (.463, (247, 165, 201)), "🌼": (.429, (229, 195, 68)), "🌿": (.252, (120, 180, 76)),
    "🍀": (.355, (125, 208, 69)), "🌱": (.153, (126, 189, 53)), "🍃": (.237, (138, 178, 87)),
    "💍": (.235, (161, 173, 181)), "🕊️": (.254, (193, 193, 184)),
    "🦢": (.291, (199, 195, 177)), "🫧": (.191, (211, 216, 226)), "☁️": (.182, (215, 222, 229)),
    "🪽": (.204, (193, 210, 217)), "🧵": (.390, (98, 125, 129)), "🪡": (.097, (150, 184, 204)),
    "🥂": (.184, (210, 192, 141)), "⭐": (.299, (247, 219, 133)), "✨": (.113, (253, 215, 112)),
    "🍏": (.405, (134, 180, 71)), "🎾": (.459, (196, 215, 58)),
    "🍐": (.370, (173, 175, 72)), "🥚": (.353, (221, 216, 209)), "🐚": (.423, (185, 174, 174)),
    "🐑": (.348, (192, 190, 182)), "🎀": (.400, (219, 115, 152)),
    # sea greens for the dyed edge: a puzzle piece (the missing piece) and a peacock
    "🧩": (.356, (146, 202, 122)), "🦚": (.370, (91, 144, 102)),
}
EMOJI_FINDS = ["💍", "🎀", "🕊️", "🥂", "🧵", "🪡"]  # sprinkled now and then, found when zoomed in
EMOJI_WHITE = ["🤍", "🩶", "🕊️", "🦢", "🫧", "☁️", "🪽", "🥚", "🐚", "🐑", "💍"]  # for the white lace
EMOJI_COLOUR = [e for e in EMOJI if e not in EMOJI_WHITE and e not in ("🧵", "🪡")]

# Helvetica Neue 300
MATH_SIGNS = {"·": .009, "−": .021, "÷": .038, "+": .043, "=": .046, "×": .052, "≈": .057,
              "±": .063, "≠": .067, "∞": .072, "√": .079, "∓": .090, "∑": .113, "%": .123}
MATH_DIGITS = {"1": .044, "7": .058, "4": .078, "2": .086, "3": .088, "5": .088, "0": .091,
               "9": .102, "6": .103, "8": .105}

# Courier New, share of one character cell (0.6em wide)
TYPE = {".": .033, "'": .053, "-": .052, ":": .065, ";": .080, "/": .082, "\\": .082,
        "*": .087, "+": .090, "=": .093, "o": .125, "x": .147, "%": .142, "#": .183,
        "@": .190, "M": .218, "W": .218}


# ------------------------------------------------------------------ reading

def read_bmp(path):
    """the uncompressed 24/32-bit BMP files sips writes, as an RGB array"""
    with open(path, "rb") as f:
        d = f.read()
    off = struct.unpack_from("<I", d, 10)[0]
    w, h = struct.unpack_from("<ii", d, 18)
    bpp = struct.unpack_from("<H", d, 28)[0]
    step, row = bpp // 8, ((w * bpp + 31) // 32) * 4
    a = np.frombuffer(d, np.uint8, count=row * abs(h), offset=off).reshape(abs(h), row)
    a = a[:, :w * step].reshape(abs(h), w, step)[:, :, 2::-1]  # BGR(A) -> RGB
    return (a[::-1] if h > 0 else a).astype(float)


def load(image, cols, rows):
    """the image averaged down to cols x rows"""
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "s.bmp")
        subprocess.run(["sips", "-s", "format", "bmp", "-z", str(rows), str(cols), image, "--out", out],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return read_bmp(out)


def image_size(image):
    info = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", image],
                          check=True, capture_output=True, text=True).stdout.split()
    return int(info[-3]), int(info[-1])


def blur(a, r):
    """box blur with radius r (in cells), edges clamped"""
    if r < 1:
        return a.copy()
    p = np.pad(a, ((r, r), (r, r), (0, 0)), mode="edge")
    c = p.cumsum(0).cumsum(1)
    c = np.pad(c, ((1, 0), (1, 0), (0, 0)))
    k = 2 * r + 1
    return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)


def target(img, detail=1.6, deepen=1.9, radius=2):
    """the colour each mark should add up to: holes and threads made a little
    clearer (detail), the pale lace made a little darker (deepen) so it shows
    on white paper. Also returns the colour of each mark's surroundings: a
    mark takes its hue from there and only its darkness from its own spot,
    so near-white holes do not turn into stray purple or pink marks."""
    m = blur(img, radius)
    t = m + (img - m) * detail
    t = PAPER - (PAPER - t) * deepen
    hue = PAPER - (PAPER - blur(img, 1)) * deepen
    return np.clip(t, 0, 255), np.clip(hue, 0, 255)


def neutral(diff):
    """near-white and cream lace keeps a grey ink instead of turning khaki;
    dyed lace (chartreuse, yellow, the green edge) keeps its colour"""
    peak = diff.max()
    r = (peak - diff.min()) / peak if peak > 0 else 0
    creamy = diff[2] > 1.3 * max(diff[0], diff[1])  # mostly blue missing: cream, khaki
    k = min(1, max(0, ((.6 if creamy else .3) - r) / .15))
    return diff * (1 - k) + diff.mean() * k


def pattern(img, radius=2):
    """-1..1 per cell: darker than its surroundings (a thread, +) or lighter
    (a hole, -). Lets marks follow the lace even where the colour is so
    strong that every mark would otherwise be at its biggest."""
    lum = img @ np.array([.299, .587, .114])
    m = blur(lum[:, :, None], radius)[:, :, 0]
    return np.clip((m - lum) / 16, -1, 1)


def shape(a, dl, cap, swing=.8):
    """coverage a, at most cap, pushed up on threads and down in holes"""
    return min(cap, max(cap * .12, min(a, cap) * (1 + swing * dl)))


def ink_for(t, hue, depth=160.0, most=235.0, grey=120.0):
    """a strong ink in the colour of the surroundings (hue), and how much of
    the cell it must cover to look as dark as t from afar. White lace gets a
    soft grey (at most `grey`), drawn larger, rather than a harsh charcoal."""
    peak = (PAPER - t).max()
    tone = neutral(PAPER - hue)
    if peak <= 0 or tone.max() <= 0:
        return PAPER, 0.0
    r = (tone.max() - tone.min()) / tone.max()
    strength = min(most, max(depth, peak), grey + (most - grey) * min(1, r / .3))
    return PAPER - tone / tone.max() * strength, peak / strength


def hexc(c):
    return "#%02x%02x%02x" % tuple(int(max(0, min(255, round(v)))) for v in c)


def svg_doc(w, h, body, style=""):
    css = f"<style>{style}</style>" if style else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'<rect width="100%" height="100%" fill="#fff"/>{css}\n{body}\n</svg>\n')


def palette(colours, k, rng):
    """k thread colours that best cover the given colours (k-means)"""
    pts = np.array(colours)
    cent = pts[rng.sample(range(len(pts)), k)]
    for _ in range(18):
        lab = ((pts[:, None, :] - cent[None]) ** 2).sum(2).argmin(1)
        for i in range(k):
            if (lab == i).any():
                cent[i] = pts[lab == i].mean(0)
    return cent


# ------------------------------------------------------------------ styles

def emoji(img, W, H, cols, rng):
    rows = round(cols * H / W)
    raw = load(img, cols, rows)
    t, hue = target(raw, detail=1.4, deepen=1.05)
    dl = pattern(raw, 2)
    p = W / cols
    out = []
    for y in range(rows):
        for x in range(cols):
            peak = (PAPER - t[y, x]).max()
            if peak < 10:
                continue
            tone = PAPER - hue[y, x]
            if tone.max() <= 0:
                continue
            # the surroundings' colour, this spot's darkness, a little darker on
            # a thread and lighter in a hole so the pattern survives strong colour
            want = -tone / tone.max() * peak * (1 + .45 * dl[y, x])
            grey = neutral(tone)
            white = (grey.max() - grey.min()) / grey.max() < .2
            if rng.random() < .004:
                choice, s = rng.choice(EMOJI_FINDS), .95
            else:
                scored = []
                for e in (EMOJI_WHITE if white else EMOJI_COLOUR):
                    cov, col = EMOJI[e]
                    d = np.array(col) - PAPER
                    # share of the cell the emoji should cover, within the sizes allowed
                    a = float(np.dot(want, d) / np.dot(d, d))
                    a = min(max(a, cov * .3 ** 2), cov * 1.35 ** 2)
                    s = math.sqrt(a / cov)
                    # a dark emoji shrunk to a speck reads worse than a light one at a good size
                    small = max(0, .75 - s) * peak
                    scored.append((float(((want - a * d) ** 2).sum()) + 6 * small ** 2, e, s))
                scored.sort()
                # mostly the best fit; a near-equal second or third now and then
                close = [c for c in scored[:3] if c[0] <= scored[0][0] * 1.5 + 1]
                _, choice, s = close[min(int(rng.random() ** 2 * len(close)), len(close) - 1)]
                s = min(1.35, max(.3, s * (1 + .2 * dl[y, x])))  # threads bigger, holes smaller
            fs = p * .8 * s
            cx = (x + .5) * p + (rng.random() - .5) * p * .12
            cy = (y + .5) * p + (rng.random() - .5) * p * .12
            out.append(f'<text x="{cx:.1f}" y="{cy:.1f}" font-size="{fs:.1f}">{choice}</text>')
    style = ('text{font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif;'
             'text-anchor:middle;dominant-baseline:central}')
    return svg_doc(W, H, "\n".join(out), style)


def glyph_for(a, table, smin, smax, rng):
    """a mark whose coverage at some size in [smin, smax] gives a"""
    fits = [(g, math.sqrt(a / c)) for g, c in table.items() if smin ** 2 * c <= a <= smax ** 2 * c]
    if fits:
        return rng.choice(fits)
    g = max(table, key=table.get) if a > max(table.values()) else min(table, key=table.get)
    return g, (smax if a > table[g] else smin)


def math_signs(img, W, H, cols, rng):
    rows = round(cols * H / W)
    raw = load(img, cols, rows)
    t, hue = target(raw, detail=1.5, deepen=1.3)
    dl = pattern(raw)
    p = W / cols
    out = []
    for y in range(rows):
        for x in range(cols):
            col = t[y, x]
            if (PAPER - col).max() < 12:
                continue
            ink, a = ink_for(col, hue[y, x], depth=200, most=235)
            a = shape(a / 1.27 * .7, dl[y, x], .26)  # drawn at 0.9 of the cell; small text prints heavier
            table = MATH_DIGITS if rng.random() < .2 else MATH_SIGNS
            bold = a > .085
            g, s = glyph_for(a / 1.7 if bold else a, table, .7, 1.4, rng)
            cls = ' class="b"' if bold else ""
            out.append(f'<text x="{(x + .5) * p:.1f}" y="{(y + .5) * p:.1f}" font-size="{p * .9 * s:.1f}" '
                       f'fill="{hexc(ink)}"{cls}>{g}</text>')
    style = ('text{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-weight:400;'
             'text-anchor:middle;dominant-baseline:central}.b{font-weight:700}')
    return svg_doc(W, H, "\n".join(out), style)


def halftone(img, W, H, cols, rng, angle=15):
    # sample finely, then read the colour under each dot of a slanted grid
    fw = cols * 3
    fh = round(fw * H / W)
    raw = load(img, fw, fh)
    t, hue = target(raw, detail=1.4, deepen=1.15, radius=4)
    dl = pattern(raw, 4)
    p = W / cols
    th = math.radians(angle)
    cs, sn = math.cos(th), math.sin(th)
    reach = int(math.hypot(W, H) / p) + 2
    out = []
    for j in range(-reach, reach):
        for i in range(-reach, reach):
            x = W / 2 + (i * cs - j * sn) * p
            y = H / 2 + (i * sn + j * cs) * p
            if not (0 <= x < W and 0 <= y < H):
                continue
            fy, fx = min(fh - 1, int(y / H * fh)), min(fw - 1, int(x / W * fw))
            col = t[fy, fx]
            if (PAPER - col).max() < 10:
                continue
            ink, a = ink_for(col, hue[fy, fx], depth=170, most=195)
            a = shape(a, dl[fy, fx], .95, .6)
            r = min(p * .62, p * math.sqrt(a / math.pi))
            if r < p * .07:
                continue
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{hexc(ink)}"/>')
    return svg_doc(W, H, "\n".join(out))


def stitch(img, W, H, cols, rng, threads=12):
    rows = round(cols * H / W)
    raw = load(img, cols, rows)
    t, hue = target(raw, detail=1.4, deepen=1.15)
    dl = pattern(raw)
    p = W / cols
    cells = []
    for y in range(rows):
        for x in range(cols):
            peak = (PAPER - t[y, x]).max()
            if peak < 9:
                continue
            if dl[y, x] < -.6:
                continue  # a hole in the lace
            full = peak >= 18 and dl[y, x] > -.3
            cover = .42 if full else .22  # a full x covers more of the cell than half of one
            thread, _ = ink_for(t[y, x], hue[y, x], depth=min(200, peak / cover), most=200)
            cells.append((x, y, full, thread))
    pal = palette([c[3] for c in cells], threads, rng)
    under = [[] for _ in pal]  # "\" legs first, then the "/" legs on top, as embroidered
    over = [[] for _ in pal]
    for x, y, full, thread in cells:
        k = int(((pal - thread) ** 2).sum(1).argmin())
        j = lambda: (rng.random() - .5) * p * .08
        x0, y0, x1, y1 = x * p + p * .18, y * p + p * .18, x * p + p * .82, y * p + p * .82
        if full:
            under[k].append(f"M{x0 + j():.1f} {y0 + j():.1f}L{x1 + j():.1f} {y1 + j():.1f}")
        over[k].append(f"M{x0 + j():.1f} {y1 + j():.1f}L{x1 + j():.1f} {y0 + j():.1f}")
    sw = p * .24
    out = []
    for layer in (under, over):
        for k, segs in enumerate(layer):
            if segs:
                out.append(f'<path d="{"".join(segs)}" stroke="{hexc(pal[k])}" stroke-width="{sw:.2f}" '
                           f'stroke-linecap="round" fill="none"/>')
    # a thin highlight along the top legs, like the sheen on a thread
    for k, segs in enumerate(over):
        if segs:
            out.append(f'<path d="{"".join(segs)}" stroke="#fff" stroke-opacity=".28" '
                       f'stroke-width="{sw * .28:.2f}" stroke-linecap="round" fill="none" '
                       f'transform="translate({-sw * .18:.2f},{-sw * .18:.2f})"/>')
    return svg_doc(W, H, "\n".join(out))


def typewriter(img, W, H, cols, rng):
    cw = W / cols                # Courier: 0.6em wide, 1em high
    ch = cw / .6
    rows = round(H / ch)
    raw = load(img, cols, rows)
    t, hue = target(raw, detail=1.4, deepen=1.2)
    dl = pattern(raw)
    ribbon = np.array([34.0, 34.0, 34.0])
    out = []
    for y in range(rows):
        drift = (rng.random() - .5) * ch * .12  # each typed line sits a little crooked
        for x in range(cols):
            col = t[y, x]
            diff = PAPER - col
            if diff.max() < 12:
                continue
            tone = neutral(PAPER - hue[y, x])
            dyed = tone.max() > 0 and (tone.max() - tone.min()) / tone.max() >= .25
            # black ribbon for the white lace, a coloured one where the lace is dyed
            ink = ink_for(col, hue[y, x], depth=200, most=225)[0] if dyed else ribbon
            # small type prints heavier than its measured size suggests
            need = shape(.34 * diff.max() / max(1.0, (PAPER - ink).max()), dl[y, x], .24)
            strikes, covered = [], 0.0
            while covered < need - .02 and len(strikes) < 3:
                options = sorted(TYPE.items(), key=lambda kv: abs(1 - (1 - covered) * (1 - kv[1] * .85) - need))
                g = rng.choice(options[:3])[0]
                strikes.append(g)
                covered = 1 - (1 - covered) * (1 - TYPE[g] * .85)
            if not strikes:
                strikes = ["."]
            for g in strikes:
                op = .5 + rng.random() * .38  # the ribbon wears unevenly
                gx = x * cw + (rng.random() - .5) * cw * .14
                gy = (y + .78) * ch + drift + (rng.random() - .5) * ch * .06
                g = {"<": "&lt;", "&": "&amp;", ">": "&gt;"}.get(g, g)
                out.append(f'<text x="{gx:.1f}" y="{gy:.1f}" fill="{hexc(ink)}" fill-opacity="{op:.2f}">{g}</text>')
    style = f'text{{font:400 {ch:.2f}px "Courier New",Courier,monospace}}'
    return svg_doc(W, H, "\n".join(out), style)


def threads(img, W, H, cols, rng):
    fw = cols * 2
    fh = round(fw * H / W)
    raw = load(img, fw, fh)
    t, hue = target(raw, detail=1.5, deepen=1.25, radius=3)
    dl = pattern(raw, 3)
    ring_hue = blur(hue, 3)  # holes take the colour of the lace around them
    lum = blur(raw, 2).mean(2)
    gy, gx = np.gradient(lum)
    local = blur(raw, 4).mean(2)
    sx, sy = W / fw, H / fh
    p = W / cols
    strokes, rings, dots, petals = [], [], [], []
    step = 1  # one possible stroke per fine cell
    for y in range(0, fh, step):
        for x in range(0, fw, step):
            jx = min(fw - 1, x + int(rng.random() * step))
            jy = min(fh - 1, y + int(rng.random() * step))
            col = t[jy, jx]
            ink, a = ink_for(col, hue[jy, jx], depth=165)
            if a < .05:
                continue
            px, py = (jx + .5) * sx, (jy + .5) * sy
            g = math.hypot(gx[jy, jx], gy[jy, jx])
            # a hole: brighter than everything around it, inside the lace
            if 255 - local[jy, jx] > 14 and lum[jy, jx] - local[jy, jx] > 9 and rng.random() < .5:
                rings.append((px, py, p * (.35 + rng.random() * .3), ink_for(ring_hue[jy, jx], ring_hue[jy, jx], depth=150)[0]))
                continue
            # dense, even lace: a petal; edges and mesh: a thread
            if g < 1.2 and a > .45 and rng.random() < .35:
                ang = rng.random() * math.pi
                petals.append((px, py, p * .55, p * .22, ang, ink))
                continue
            if rng.random() > min(1, a * 1.7) * (1 + .6 * dl[jy, jx]):
                continue
            ang = math.atan2(gy[jy, jx], gx[jy, jx]) + math.pi / 2 if g > .4 else rng.random() * math.pi
            L = p * (.7 + rng.random() * .9)
            dx, dy = math.cos(ang) * L / 2, math.sin(ang) * L / 2
            bend = (rng.random() - .5) * L * .5
            mx, my = px - math.sin(ang) * bend, py + math.cos(ang) * bend
            strokes.append((f"M{px - dx:.1f} {py - dy:.1f}Q{mx:.1f} {my:.1f} {px + dx:.1f} {py + dy:.1f}", ink))
            if a > .7 and rng.random() < .06:
                dots.append((px, py, p * .18, ink))
    # group the threads into a few colours so the file stays small
    pal = palette([s[1] for s in strokes], 14, rng)
    groups = [[] for _ in pal]
    for d, ink in strokes:
        groups[int(((pal - ink) ** 2).sum(1).argmin())].append(d)
    out = []
    for k, segs in enumerate(groups):
        if segs:
            out.append(f'<path d="{"".join(segs)}" stroke="{hexc(pal[k])}" stroke-width="{p * .16:.2f}" '
                       f'stroke-linecap="round" fill="none" stroke-opacity=".9"/>')
    for x, y, rx, ry, ang, ink in petals:
        out.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.2f}" ry="{ry:.2f}" '
                   f'transform="rotate({math.degrees(ang):.0f} {x:.1f} {y:.1f})" fill="{hexc(ink)}" fill-opacity=".55"/>')
    for x, y, r, ink in rings:
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="none" stroke="{hexc(ink)}" '
                   f'stroke-width="{p * .1:.2f}"/>')
    for x, y, r, ink in dots:
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}" fill="{hexc(ink)}"/>')
    return svg_doc(W, H, "\n".join(out))


STYLES = {"emoji": (emoji, 150), "math": (math_signs, 200), "halftone": (halftone, 190),
          "stitch": (stitch, 160), "typewriter": (typewriter, 250), "threads": (threads, 170)}


def save_png(svg_path, W, H):
    if not os.path.exists(CHROME):
        print("Google Chrome not found: open the SVG in a browser instead")
        return
    png = svg_path[:-4] + ".png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2",
                    "--virtual-time-budget=2000", f"--screenshot={png}", f"--window-size={W},{H}",
                    "file://" + os.path.abspath(svg_path)],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    print(f"wrote {png}")


def measure(emojis):
    """print table lines for new emojis, measured the same way as the EMOJI
    table: each drawn at 80px in a 100px square, in Chrome"""
    marks = list(dict.fromkeys(e for e in emojis if not e.isspace() and e not in "\ufe0f\u200d"))
    with tempfile.TemporaryDirectory() as tmp:
        cells = "".join(f"<div>{e}</div>" for e in marks)
        page = os.path.join(tmp, "m.html")
        with open(page, "w") as f:
            f.write('<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#fff}'
                    'body{display:grid;grid-template-columns:repeat(10,100px);grid-auto-rows:100px}'
                    'div{font:80px/100px "Apple Color Emoji",sans-serif;text-align:center;overflow:hidden}'
                    f'</style>{cells}')
        png = os.path.join(tmp, "m.png")
        rows = (len(marks) + 9) // 10
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=800",
                        f"--screenshot={png}", f"--window-size=1000,{rows * 100}", "file://" + page],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
        bmp = os.path.join(tmp, "m.bmp")
        subprocess.run(["sips", "-s", "format", "bmp", png, "--out", bmp], check=True, stdout=subprocess.DEVNULL)
        img = read_bmp(bmp)
    for i, e in enumerate(marks):
        y, x = divmod(i, 10)
        c = img[y * 100:(y + 1) * 100, x * 100:(x + 1) * 100]
        ink = (255 - c).max(axis=2) > 12
        col = c[ink].mean(0) if ink.any() else PAPER
        print(f'    "{e}": ({ink.mean():.3f}, ({int(col[0])}, {int(col[1])}, {int(col[2])})),')


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image", nargs="?")
    ap.add_argument("out", nargs="?")
    ap.add_argument("--style", choices=sorted(STYLES))
    ap.add_argument("--measure", metavar="EMOJIS", help="measure emojis for the EMOJI table, then stop")
    ap.add_argument("--cols", type=int, help="marks across (each style has its own default)")
    ap.add_argument("--width", type=int, default=1500, help="picture width in SVG units")
    ap.add_argument("--seed", type=int, default=1, help="change for a different random arrangement")
    ap.add_argument("--png", action="store_true", help="also save a PNG next to the SVG (needs Google Chrome)")
    a = ap.parse_args()
    if a.measure:
        measure(a.measure)
        raise SystemExit
    if not (a.image and a.out and a.style):
        ap.error("IMAGE, OUT and --style are needed (or --measure)")
    fn, default_cols = STYLES[a.style]
    iw, ih = image_size(a.image)
    W = a.width
    H = round(W * ih / iw)
    svg = fn(a.image, W, H, a.cols or default_cols, random.Random(a.seed))
    with open(a.out, "w") as f:
        f.write(svg)
    print(f"wrote {a.out} ({a.style}, {W}x{H}, {len(svg) // 1024} KB)")
    if a.png:
        save_png(a.out, W, H)
