#!/usr/bin/env python3
"""
lace-to-text: turn a scan (lace, fabric, anything) into typed "emoticon art".

Dark threads become <3, then xo, then :*, fading to dots where the lace has
holes. Greenish areas (like dyed lace edges) keep a green tint. The result is
an HTML snippet (a <pre> with coloured spans) to paste into a page.

Uses only macOS's built-in `sips` for resizing; no extra installs.

Usage:
  python3 tools/lace-to-text.py IMAGE OUT.html [--cols 90] [--crop X Y W H]
                                [--cell-aspect 1.2] [--contrast 1.0] [--clip-dark 0.02] [--local 0.6]

  --cols         number of 2-character cells per row (width of the art)
  --crop         optional crop box in source pixels before converting
  --cell-aspect  width/height of one cell as rendered (2 chars of Courier at
                 line-height 1 is about 1.2)
  --contrast     >1 makes more hearts, <1 makes the lace airier
  --clip-dark    raise (e.g. 0.25) when a very dark edge makes the rest faint
  --local        0 to 1, how much the pattern (holes, threads) counts; ~0.6 for lace
  --single       one character per cell, twice the detail (use --cell-aspect 0.6)
  --photo-colour use the scan's own colours; --darken sets how much darker
  --rows         wrap each line, for row-by-row "unravel" effects
  --mix          typed in pairs of characters: each pair is an emoticon (<3, xo)
                 or one copy-paste symbol (♡ ✿ ❀ ✧), in patches, with sizes and
                 colours that vary, so a zoom shows it is typed (About v2).
                 Use with --single; needs the .lace-type styles in about-v2.css
                 (deleted; in git save point 4f9c976).
"""
import argparse
import math
import os
import struct
import subprocess
import tempfile

# light -> dark. Each token is two characters wide.
TOKENS = ["  ", ". ", "'.", ":*", "xo", "<3"]
LIMITS = [0.16, 0.28, 0.40, 0.52, 0.64]  # darkness thresholds between tokens

# ink colours: light, mid, dark grey (white lace reads as grey on paper),
# plus a green for dyed areas
GREYS = ["#c8c4b9", "#a6a195", "#7a7568"]
GREEN = "#6f8f5a"

# --single: one character per cell (twice the detail). Each level is a pair
# that alternates along the row, so runs still read as emoticons.
RAMP = [("  "), (". "), (".'"), (":."), (":*"), (";)"), ("xo"), ("<3"), ("<3")]
RAMP_LIMITS = [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.84]
BOLD_LEVEL = 8  # the heaviest parts: <3 in bold

# --mix: what a pair of cells can hold at each darkness level (1 to 8).
# Emoticons fill both cells; a symbol sits alone in the middle of the pair.
# None of these symbols turn into colour emojis on phones.
MIX_EMOTICONS = [None, [". ", " .", "' "], [".'", "'.", ", "], [":.", ".:", "'*"], [":*", "*:"],
                 [";)", ":)"], ["xo", "ox"], ["<3"], ["<3"]]
MIX_SYMBOLS = [None, ["·", "˚"], ["°", "∘", "⋆"], ["✧", "☆", "⋆"], ["♡", "✩", "❀"],
               ["♡", "❁", "※", "❀"], ["✾", "❦", "❀", "♡"], ["✿", "❦", "✾"], ["✿", "✽", "❦"]]
# size of each level, as a share of the base size (darker = bigger)
MIX_SIZES = [0, .5, .6, .72, .84, .96, 1.08, 1.2, 1.36]
# the size steps that exist in the CSS (.z0 to .z8)
Z_STEPS = [.45, .55, .65, .75, .85, .95, 1.05, 1.2, 1.38]
# small colour drifts for the near-white lace: none, warm, cool, olive, rose
TINTS = [(0, 0, 0), (0, 0, 0), (10, 4, -6), (-6, 0, 8), (6, 8, -10), (10, -4, 0)]
PINK = "#e07aa8"  # the brand pink, a little deeper so it shows in the lace


def rnd(x, y, salt):
    """repeatable random number 0..1 for a cell (same picture every run)"""
    n = (x * 374761393 + y * 668265263 + salt * 2147483647) & 0xFFFFFFFF
    n = ((n ^ (n >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((n ^ (n >> 16)) & 0xFFFFFF) / 0xFFFFFF


def patches(x, y, scale, salt):
    """smooth random field 0..1: neighbouring cells get similar values"""
    gx, gy = x / scale, y / scale
    x0, y0 = math.floor(gx), math.floor(gy)
    tx, ty = gx - x0, gy - y0
    tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
    top = rnd(x0, y0, salt) + (rnd(x0 + 1, y0, salt) - rnd(x0, y0, salt)) * tx
    bottom = rnd(x0, y0 + 1, salt) + (rnd(x0 + 1, y0 + 1, salt) - rnd(x0, y0 + 1, salt)) * tx
    return top + (bottom - top) * ty


def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def read_bmp(path):
    """Minimal reader for the uncompressed 24/32-bit BMP files sips writes."""
    with open(path, "rb") as f:
        data = f.read()
    offset = struct.unpack_from("<I", data, 10)[0]
    width, height = struct.unpack_from("<ii", data, 18)
    bpp = struct.unpack_from("<H", data, 28)[0]
    bottom_up = height > 0
    height = abs(height)
    step = bpp // 8
    row_size = ((width * bpp + 31) // 32) * 4
    pixels = []
    for y in range(height):
        src_y = height - 1 - y if bottom_up else y
        base = offset + src_y * row_size
        row = []
        for x in range(width):
            b, g, r = data[base + x * step: base + x * step + 3]
            row.append((r, g, b))
        pixels.append(row)
    return width, height, pixels


def convert(image, out, cols, crop, cell_aspect, contrast, clip_dark, local_mix=0.0, detail_range=0.06,
            single=False, photo_colour=False, darken=0.72, wrap_rows=False, radius=3, saturate=1.0,
            mix=False, symbol_share=0.4):
    with tempfile.TemporaryDirectory() as tmp:
        src = os.path.join(tmp, "src.png")
        run("sips", "-s", "format", "png", image, "--out", src)
        if crop:
            x, y, w, h = crop
            run("sips", "-c", str(h), str(w), "--cropOffset", str(y), str(x), src, "--out", src)
        # size of the source after the crop
        info = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", src],
                              check=True, capture_output=True, text=True).stdout.split()
        w_px, h_px = int(info[-3]), int(info[-1])
        rows = max(1, round(cols * (h_px / w_px) * cell_aspect))
        small = os.path.join(tmp, "small.bmp")
        run("sips", "-s", "format", "bmp", "-z", str(rows), str(cols), src, "--out", small)
        width, height, pixels = read_bmp(small)

    lum = [[(0.299 * r + 0.587 * g + 0.114 * b) / 255 for (r, g, b) in row] for row in pixels]
    flat = sorted(v for row in lum for v in row)
    lo = flat[int(len(flat) * clip_dark)]
    hi = flat[int(len(flat) * 0.98)]
    span = max(hi - lo, 1e-6)

    # local contrast: compare each cell with the average of its neighbours, so
    # holes stay open and threads show even inside bright lace
    r = radius
    local = [[0.0] * width for _ in range(height)]
    for y in range(height):
        for x in range(width):
            ys = range(max(0, y - r), min(height, y + r + 1))
            xs = range(max(0, x - r), min(width, x + r + 1))
            vals = [lum[j][i] for j in ys for i in xs]
            local[y][x] = sum(vals) / len(vals)

    def darkness(x, y):
        g = min(1.0, max(0.0, (hi - lum[y][x]) / span))
        if g < 0.06:  # bare paper stays empty
            return 0.0
        detail = min(1.0, max(0.0, 0.5 + (local[y][x] - lum[y][x]) / (2 * detail_range)))
        d = (1 - local_mix) * g + local_mix * detail
        return min(1.0, max(0.0, d)) ** (1 / contrast)

    def pick(x, d):
        """returns (characters, bold)"""
        if single:
            level = sum(d > t for t in RAMP_LIMITS)
            return RAMP[level][x % 2], level >= BOLD_LEVEL  # runs read <3<3, xoxo, ;);)
        return TOKENS[sum(d > t for t in LIMITS)], False

    def ink(x, y, d):
        r_, g_, b_ = pixels[y][x]
        if photo_colour:
            # the scan's own colour, darkened so pale lace still shows on paper
            # push saturation only where the scan is really coloured (a dye),
            # and keep near-neutral lace neutral, so cream does not turn khaki
            m = (r_ + g_ + b_) / 3
            chroma = max(r_, g_, b_) - min(r_, g_, b_)
            k = saturate if chroma > 30 else 0.25
            sat = [m + (v - m) * k for v in (r_, g_, b_)]
            q = 14
            c = tuple(max(0, min(255, int(v * darken))) // q * q for v in sat)
            return "#%02x%02x%02x" % c
        if g_ > r_ + 8 and g_ > b_ + 4:
            return GREEN
        return GREYS[0 if d < 0.45 else 1 if d < 0.65 else 2]

    def wrap(text, style):
        if style is None:
            return text
        colour, bold = style
        weight = ";font-weight:700" if bold else ""
        return f'<span style="color:{colour}{weight}">{text}</span>'

    if mix:
        write_mix(out, width, height, darkness, ink, symbol_share)
        return

    lines = []
    for y in range(height):
        out_row = []
        current_colour, buffer = None, ""
        for x in range(width):
            d = darkness(x, y)
            token, bold = pick(x, d)
            colour = None if token.strip() == "" else (ink(x, y, d), bold)
            if colour != current_colour:
                if buffer:
                    out_row.append(wrap(buffer, current_colour))
                current_colour, buffer = colour, ""
            buffer += token.replace("<", "&lt;")
        if buffer:
            out_row.append(wrap(buffer, current_colour))
        line = "".join(out_row).rstrip()
        lines.append(f'<span class="row">{line}</span>' if wrap_rows else line)

    html = '<pre class="lace-type" aria-hidden="true">' + "\n".join(lines) + "</pre>\n"
    with open(out, "w") as f:
        f.write(html)
    print(f"wrote {out}: {width} cells x {height} rows")


def drift(colour, x, y):
    """nudge a "#rrggbb" colour a little, so neighbouring symbols differ"""
    r, g, b = (int(colour[i:i + 2], 16) for i in (1, 3, 5))
    light = (rnd(x, y, 4) - 0.5) * 28
    if max(r, g, b) - min(r, g, b) < 24:  # near-white lace: a faint tint
        dr, dg, db = TINTS[int(rnd(x, y, 3) * len(TINTS))]
    else:  # dyed: wander between teal and olive
        t = (rnd(x, y, 3) - 0.5) * 2
        dr, dg, db = 14 * t, 0, -16 * t
    c = (max(0, min(255, int(v + light + dv))) for v, dv in ((r, dr), (g, dg), (b, db)))
    return "#%02x%02x%02x" % tuple(c)


def write_mix(out, width, height, darkness, ink, symbol_share):
    """--mix: one <i> per pair of cells, sized and coloured per pair"""
    lines = []
    for y in range(height):
        units = []
        for x in range(0, width - 1, 2):
            d1, d2 = darkness(x, y), darkness(x + 1, y)
            d = (max(d1, d2) + (d1 + d2) / 2) / 2  # keep thin threads visible
            level = sum(d > t for t in RAMP_LIMITS)
            if level == 0:
                units.append("  ")
                continue
            u = x // 2
            # mostly scattered, with a slight pull into pasted-looking patches;
            # patches alone would add shapes the real lace does not have
            symbol = patches(u, y, 6, 1) * 0.35 + rnd(u, y, 2) * 0.65 > 1 - symbol_share * 0.9
            options = (MIX_SYMBOLS if symbol else MIX_EMOTICONS)[level]
            text = options[int(rnd(u, y, 5) * len(options))]
            if not symbol and level <= 2 and d2 > d1:
                text = text[::-1]  # the dot goes where the thread is
            colour = drift(ink(x if d1 >= d2 else x + 1, y, d), u, y)
            if symbol and 4 <= level <= 6 and rnd(u, y, 6) < 0.006:
                text, colour = "♡", PINK  # a rare pink heart, found when zoomed in
            # a symbol is one glyph where an emoticon is two: a little bigger,
            # so both carry the same amount of ink and the picture stays even
            size = MIX_SIZES[level] * (0.92 + rnd(u, y, 7) * 0.16) * (1.12 if symbol else 1)
            z = min(range(len(Z_STEPS)), key=lambda i: abs(Z_STEPS[i] - size))
            cls = f"z{z} b" if (level >= BOLD_LEVEL and not symbol) else f"z{z}"
            cls = f'"{cls}"' if " " in cls else cls
            units.append(f'<i class={cls} style=color:{colour}>{text.replace("<", "&lt;")}</i>')
        lines.append('<span class="row">' + "".join(units).rstrip() + "</span>")
    html = '<pre class="lace-type lace-mix" aria-hidden="true">' + "\n".join(lines) + "</pre>\n"
    with open(out, "w") as f:
        f.write(html)
    print(f"wrote {out}: {width // 2} pairs x {height} rows")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("image")
    p.add_argument("out")
    p.add_argument("--cols", type=int, default=90)
    p.add_argument("--crop", type=int, nargs=4, metavar=("X", "Y", "W", "H"))
    p.add_argument("--cell-aspect", type=float, default=1.2)
    p.add_argument("--contrast", type=float, default=1.0)
    p.add_argument("--clip-dark", type=float, default=0.02,
                   help="share of the darkest cells treated as fully dark (raise it when a dark edge makes the rest too faint)")
    p.add_argument("--local", type=float, default=0.0,
                   help="0 to 1: how much the pattern (holes and threads) counts versus overall darkness; 0.5 to 0.7 suits lace")
    p.add_argument("--detail-range", type=float, default=0.06,
                   help="how big a brightness difference counts as a full thread; smaller = more pronounced pattern")
    p.add_argument("--single", action="store_true",
                   help="one character per cell (twice the detail); use --cell-aspect 0.6")
    p.add_argument("--photo-colour", action="store_true",
                   help="colour each character with the scan's own colour (darkened)")
    p.add_argument("--darken", type=float, default=0.72,
                   help="with --photo-colour: how much to darken the scan colours (lower = darker)")
    p.add_argument("--rows", action="store_true",
                   help="wrap each line in <span class=\"row\"> (for row-by-row effects)")
    p.add_argument("--radius", type=int, default=3,
                   help="neighbourhood size for --local, in cells; larger picks out bigger shapes")
    p.add_argument("--saturate", type=float, default=1.0,
                   help="with --photo-colour: boost colour (2 to 3 keeps a faint dye green)")
    p.add_argument("--mix", action="store_true",
                   help="pairs of cells hold an emoticon or one symbol, with varied sizes and colours (use with --single --photo-colour)")
    p.add_argument("--symbols", type=float, default=0.4,
                   help="with --mix: roughly what share of the lace is symbols rather than emoticons")
    a = p.parse_args()
    convert(a.image, a.out, a.cols, a.crop, a.cell_aspect, a.contrast, a.clip_dark, a.local, a.detail_range,
            a.single, a.photo_colour, a.darken, a.rows, a.radius, a.saturate, a.mix, a.symbols)
