# Ausflugskarte

Interaktive Karte der Schweiz mit gesammelten Wanderungen und Ausflügen aus Reels. Filter nach freier Zeit (halber Tag, ganzer Tag, Wochenende), Startort (Geroldswil oder Portein), Verkehrsmittel, Anreisezeit, Kategorie, Jahreszeit und Wetter.

## Ausflüge eintragen

Alle Orte stehen in [`aktivitaeten.js`](aktivitaeten.js). Die Felder sind oben in der Datei erklärt. Einträge mit `beispiel: true` sind Platzhalter.

Danach die echten Anreisezeiten holen (Auto über OpenStreetMap-Routing, ÖV über den SBB-Fahrplan von transport.opendata.ch, Samstag 08:00):

```
node tools/anreise.mjs
```

Das schreibt `anreise.js`. Ausflüge ohne Eintrag dort werden über die Luftlinie geschätzt und mit «ca.» angezeigt.

App-Icons und Vorschaubild neu erzeugen: `python tools/bilder.py`

## Funktionen

- Wetter pro Ausflug für heute, morgen und das Wochenende (Open-Meteo, ohne Schlüssel, 1 h zwischengespeichert)
- Tipp des Tages: bestes Wetter, Merkliste und kurze Anreise zuerst
- Merkliste und «Gemacht», gespeichert im jeweiligen Browser
- Kann auf dem Handy wie eine App auf den Startbildschirm gelegt werden

## Lokal ansehen

```
python -m http.server 8137
```

Dann http://localhost:8137 öffnen.

## Karten

- Landeskarte, Luftbild und Wanderwege: swisstopo (geo.admin.ch), frei nutzbar mit Quellenangabe
- OpenStreetMap als Alternative

## Design-Brief

- **Zielgruppe:** Aladin und Freunde, die spontan einen Ausflug suchen, oft auf dem Handy
- **Ton:** kurz, praktisch, Schweizer Deutsch («ss»)
- **Farben:** Gelb der Wanderweg-Wegweiser als einzige Akzentfarbe; Rot-Weiss und Blau-Weiss nur für die Schwierigkeit (wie die Wegmarkierung); kühle neutrale Töne
- **Schriften:** Archivo (Titel), Figtree (Text)
- **Vorbilder:** die Wegweiser der Schweizer Wanderwege, die Landeskarte von swisstopo
