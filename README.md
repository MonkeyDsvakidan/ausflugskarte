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

- 3D-Karte (MapLibre) mit swisstopo-Vektorkarte, Landeskarte, Luftbild und Nachtkarte; Wanderwege als Ebene; 3D-Gelände und 3D-Rundflug ums Ziel
- Schwebendes Glas-Panel am Computer, ziehbares Bottom-Sheet auf dem Handy
- «Ich habe … am …» als Hauptfrage, Tipp als gelber Wegweiser, «Überrasch mich» mit Fallblatt-Animation (Taste Z)
- Suche (Taste /), Filter, Start ab Geroldswil, Portein oder dem eigenen Standort
- Detailansicht: Wetter der Woche, Sonnenuntergang mit «losfahren bis», Reel direkt abspielen, Route, ÖV-Fahrplan, Teilen-Link (#name)
- Merkliste, «Gemacht» und Fortschrittsring, gespeichert im jeweiligen Browser
- Hell, dunkel oder wie das Gerät; als App auf den Startbildschirm legbar

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
