# CLAUDE.md – Ausflugskarte

Private Webseite von Aladin Kermo (für ihn und Freunde): interaktive 3D-Karte der Schweiz mit gesammelten Wanderungen und Ausflügen aus Reels. Bedienung, Funktionen und Design-Brief stehen in `README.md`.

## Technik
- **Statisch, ohne Build-Step:** `index.html`, `style.css`, `app.js` (Vanilla-JS), Karte mit MapLibre (über unpkg). GitHub Pages «Deploy from a branch»: **Push auf `main` = live**.
- **Daten:** alle Ausflüge in `aktivitaeten.js` (Felder oben in der Datei erklärt, `name` eindeutig). Danach `node tools/anreise.mjs` → schreibt `anreise.js` (Auto über OSRM, ÖV über transport.opendata.ch). App-Icons und Vorschaubild: `python tools/bilder.py`.
- **Externe Dienste:** swisstopo (Karten, Wanderwege), Open-Meteo (Wetter), transport.opendata.ch (Fahrplan), OSRM (Route), Google Fonts. Keine Anmeldung, keine Datenbank, keine Geheimnisse – Merkliste, «Gemacht» und Einstellungen liegen nur im `localStorage` des Browsers.
- **Cache-Busting:** nach Änderungen an CSS/JS `?v=` in `index.html` erhöhen.
- **Lokal ansehen:** `python -m http.server 8137` (Eintrag `karte` in `.claude/launch.json`), bei 375 px und 1280 px prüfen.

## Regeln
- Änderungen als Pull Request, ein PR pro Thema.
- Mobile-first: bei 375 px ohne seitliches Scrollen, Touch-Ziele mindestens 44 px (Kartenmarker und Zieh-Griff bewusst kleiner).
- Echte Einträge nur mit Angaben des Nutzers (Reels/Screenshots); nichts erfinden. Einträge mit `beispiel: true` sind Platzhalter.
- Aladin programmiert nicht selbst: Erklärungen einfach halten, Deutsch (Schweiz, «ss» statt «ß»).

## Offen
- Die 8 Einträge sind noch Platzhalter (`beispiel: true`) – der Nutzer liefert die echten Ausflüge aus seinen Reels später (22.11.2026).

## Allgemeine Regeln (zusätzlich)

Zusätzlich zu dieser Datei gelten die Skills aus Aladins Konto: **webseiten-check** (Teil A Design und Teil C Sicherheit – privates Projekt), beim Programmieren **ponytail**, bei Design-Arbeiten **unslop** (falls vorhanden). Bei einem Widerspruch geht diese Datei vor. Ist unklar, welche Regel gilt, zuerst bei Aladin nachfragen.
