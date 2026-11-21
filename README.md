# Ausflugskarte

Interaktive Karte der Schweiz mit gesammelten Wanderungen und Ausflügen aus Reels. Filter nach freier Zeit (halber Tag, ganzer Tag, Wochenende), Startort (Geroldswil oder Portein), Verkehrsmittel, Anreisezeit, Kategorie, Jahreszeit und Wetter.

## Ausflüge eintragen

Alle Orte stehen in [`aktivitaeten.js`](aktivitaeten.js). Die Felder sind oben in der Datei erklärt. Einträge mit `beispiel: true` sind Platzhalter.

Die Anreise wird über die Luftlinie grob geschätzt. Wer die genaue Zeit kennt, trägt sie unter `anreise` ein.

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
