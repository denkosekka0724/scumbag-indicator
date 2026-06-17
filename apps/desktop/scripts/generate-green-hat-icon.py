#!/usr/bin/env python3
from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
ICON_DIR = ROOT / "src-tauri" / "icons"


def blend(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(4))


def rounded_gradient(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle((22, 22, size - 22, size - 22), radius=120, fill=255)

    top = (246, 255, 240, 255)
    bottom = (59, 145, 103, 255)
    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pixels = grad.load()
    for y in range(size):
        t = y / max(1, size - 1)
        color = blend(top, bottom, t)
        for x in range(size):
            pixels[x, y] = color

    img.alpha_composite(grad)
    img.putalpha(mask)
    return img


def ellipse(draw, box, fill, outline=None, width=1):
    draw.ellipse(tuple(int(v) for v in box), fill=fill, outline=outline, width=width)


def rounded_rectangle(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(tuple(int(v) for v in box), radius=int(radius), fill=fill, outline=outline, width=width)


def draw_icon(size=1024):
    scale = size / 1024
    img = rounded_gradient(size)
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    def s(v):
        return v * scale

    # Soft drop shadow for the hat silhouette.
    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((s(156), s(598), s(868), s(826)), fill=(3, 48, 31, 86))
    shadow = shadow.filter(ImageFilter.GaussianBlur(int(s(30))))
    layer.alpha_composite(shadow)

    dark = (25, 92, 56, 255)
    mid = (42, 154, 84, 255)
    bright = (72, 203, 112, 255)
    highlight = (156, 238, 160, 220)
    outline = (14, 67, 42, 230)

    # Brim: keep the green hat symbol unmistakable at small icon sizes.
    ellipse(draw, (s(140), s(540), s(884), s(760)), fill=dark)
    ellipse(draw, (s(168), s(514), s(856), s(706)), fill=mid, outline=outline, width=int(s(10)))
    ellipse(draw, (s(214), s(530), s(806), s(642)), fill=(83, 212, 121, 235))
    draw.arc((s(210), s(512), s(810), s(676)), start=184, end=356, fill=highlight, width=int(s(14)))

    # Crown with a fedora-like dent and soft rounded sides.
    rounded_rectangle(draw, (s(286), s(258), s(738), s(640)), s(136), fill=mid, outline=outline, width=int(s(10)))
    ellipse(draw, (s(316), s(226), s(708), s(392)), fill=bright, outline=outline, width=int(s(8)))
    draw.polygon(
        [(s(312), s(360)), (s(408), s(292)), (s(470), s(612)), (s(300), s(622))],
        fill=(35, 134, 75, 255),
    )
    draw.polygon(
        [(s(712), s(360)), (s(610), s(292)), (s(552), s(612)), (s(724), s(622))],
        fill=(31, 124, 70, 255),
    )
    rounded_rectangle(draw, (s(330), s(494), s(694), s(600)), s(44), fill=(18, 86, 54, 255))
    draw.arc((s(350), s(254), s(674), s(478)), start=202, end=338, fill=(207, 255, 190, 160), width=int(s(12)))
    draw.line((s(394), s(532), s(628), s(532)), fill=(100, 219, 131, 175), width=int(s(8)))

    # Small detector cue: a clean magnifier, secondary to the hat.
    lens_shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    lsd = ImageDraw.Draw(lens_shadow)
    lsd.ellipse((s(612), s(626), s(812), s(826)), fill=(0, 43, 30, 70))
    lsd.line((s(766), s(780), s(884), s(900)), fill=(0, 43, 30, 80), width=int(s(30)))
    lens_shadow = lens_shadow.filter(ImageFilter.GaussianBlur(int(s(12))))
    layer.alpha_composite(lens_shadow)

    ellipse(draw, (s(606), s(600), s(806), s(800)), fill=(239, 255, 244, 220), outline=(19, 81, 55, 255), width=int(s(18)))
    draw.line((s(752), s(756), s(872), s(876)), fill=(19, 81, 55, 255), width=int(s(24)))
    draw.line((s(752), s(756), s(872), s(876)), fill=(116, 230, 145, 255), width=int(s(10)))
    ellipse(draw, (s(680), s(660), s(732), s(712)), fill=(225, 42, 62, 255), outline=(125, 16, 30, 230), width=int(s(5)))
    draw.line((s(706), s(632), s(706), s(650)), fill=(225, 42, 62, 255), width=int(s(9)))

    # App icon gloss and border.
    gloss = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gloss)
    gd.ellipse((s(116), s(66), s(792), s(406)), fill=(255, 255, 255, 44))
    gloss = gloss.filter(ImageFilter.GaussianBlur(int(s(18))))
    layer.alpha_composite(gloss)
    draw.rounded_rectangle((s(22), s(22), s(1002), s(1002)), radius=int(s(120)), outline=(15, 76, 48, 185), width=int(s(5)))

    img.alpha_composite(layer)
    return img


def save_resized(base, path, size):
    path.parent.mkdir(parents=True, exist_ok=True)
    base.resize((size, size), Image.Resampling.LANCZOS).save(path)


def make_icns(base):
    if shutil.which("iconutil") is None:
        print("iconutil not found; skipped icon.icns")
        return
    with tempfile.TemporaryDirectory() as tmpdir:
        iconset = Path(tmpdir) / "AppIcon.iconset"
        iconset.mkdir()
        specs = [
            ("icon_16x16.png", 16),
            ("icon_16x16@2x.png", 32),
            ("icon_32x32.png", 32),
            ("icon_32x32@2x.png", 64),
            ("icon_128x128.png", 128),
            ("icon_128x128@2x.png", 256),
            ("icon_256x256.png", 256),
            ("icon_256x256@2x.png", 512),
            ("icon_512x512.png", 512),
            ("icon_512x512@2x.png", 1024),
        ]
        for name, size in specs:
            save_resized(base, iconset / name, size)
        subprocess.run(["iconutil", "-c", "icns", str(iconset), "-o", str(ICON_DIR / "icon.icns")], check=True)


def main():
    base = draw_icon(1024)
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    save_resized(base, ICON_DIR / "icon.png", 512)
    save_resized(base, SRC_DIR / "favicon.png", 128)
    for name, size in [
        ("32x32.png", 32),
        ("64x64.png", 64),
        ("128x128.png", 128),
        ("128x128@2x.png", 256),
        ("Square30x30Logo.png", 30),
        ("Square44x44Logo.png", 44),
        ("StoreLogo.png", 50),
        ("Square71x71Logo.png", 71),
        ("Square89x89Logo.png", 89),
        ("Square107x107Logo.png", 107),
        ("Square142x142Logo.png", 142),
        ("Square150x150Logo.png", 150),
        ("Square284x284Logo.png", 284),
        ("Square310x310Logo.png", 310),
    ]:
        save_resized(base, ICON_DIR / name, size)

    ico_sizes = [16, 24, 32, 48, 64, 128, 256]
    base.save(ICON_DIR / "icon.ico", sizes=[(size, size) for size in ico_sizes])
    make_icns(base)
    print(f"Generated green hat icon assets in {ICON_DIR}")


if __name__ == "__main__":
    main()
