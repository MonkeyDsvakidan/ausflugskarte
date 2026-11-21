# Erzeugt App-Icons und das Vorschaubild für geteilte Links.
#   python tools/bilder.py
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
GELB = (242, 207, 60)
TINTE = (38, 37, 30)
SCHIEFER = (36, 42, 52)
FONT_B = "C:/Windows/Fonts/segoeuib.ttf"
FONT_R = "C:/Windows/Fonts/segoeui.ttf"


def icon(size, pad_ratio=0.0):
    s = size * 4  # gross zeichnen, dann verkleinern = glatte Kanten
    img = Image.new("RGB", (s, s), SCHIEFER)
    d = ImageDraw.Draw(img)
    c, r = s / 2, s * (0.40 - pad_ratio)
    d.polygon([(c, c - r), (c + r, c), (c, c + r), (c - r, c)], fill=GELB)
    k = r / 15
    berg = [(-8, 5), (-3, -2), (0, 2), (2, -1), (8, 5)]
    d.polygon([(c + x * k, c + y * k) for x, y in berg], fill=TINTE)
    return img.resize((size, size), Image.LANCZOS)


def hoehenlinien(d, w, h, farbe, schritte=14):
    # Weiche, verschachtelte Linien wie auf der Landeskarte
    for zentrum, amp in (((w * 0.82, h * 0.3), 1.0), ((w * 0.65, h * 1.05), 0.8)):
        for i in range(1, schritte):
            pts = []
            for t in range(0, 361, 4):
                a = math.radians(t)
                rr = i * 26 * amp * (1 + 0.18 * math.sin(3 * a + i * 0.4) + 0.08 * math.cos(5 * a))
                pts.append((zentrum[0] + rr * math.cos(a) * 1.5, zentrum[1] + rr * math.sin(a)))
            d.line(pts, fill=farbe, width=2)


def vorschau():
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), SCHIEFER)
    d = ImageDraw.Draw(img)
    hoehenlinien(d, w, h, (52, 60, 74))
    # Wegweiser
    x0, y0, x1, y1, spitze = 70, 230, 1050, 380, 70
    d.polygon([(x0, y0), (x1, y0), (x1 + spitze, (y0 + y1) / 2), (x1, y1), (x0, y1)], fill=GELB)
    f_gross = ImageFont.truetype(FONT_B, 96)
    d.text((x0 + 44, (y0 + y1) / 2), "Ausflugskarte", font=f_gross, fill=TINTE, anchor="lm")
    f_zeit = ImageFont.truetype(FONT_B, 44)
    d.text((x1 - 20, (y0 + y1) / 2 + 6), "Schweiz", font=f_zeit, fill=TINTE, anchor="rm")
    f_text = ImageFont.truetype(FONT_R, 40)
    d.text((x0, y1 + 60), "Wanderungen und Ausflüge, gefiltert nach freier Zeit,", font=f_text, fill=(230, 232, 236))
    d.text((x0, y1 + 112), "Anreise und Wetter.", font=f_text, fill=(230, 232, 236))
    ico = icon(110)
    img.paste(ico, (x0, 80))
    img.save(ROOT / "og.png", optimize=True)


for groesse in (192, 512):
    icon(groesse).save(ROOT / f"icon-{groesse}.png", optimize=True)
icon(180).save(ROOT / "apple-touch-icon.png", optimize=True)
icon(512, pad_ratio=0.08).save(ROOT / "icon-maskable.png", optimize=True)
vorschau()
print("Bilder erzeugt.")
