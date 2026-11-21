// Alle Ausflüge auf der Karte. Ein Eintrag pro Reel/Screenshot.
// Felder:
//   name, ort            Text (name muss eindeutig sein)
//   lat, lng             Koordinaten des Ziels (Dezimalgrad)
//   parkplatz            optional [lat, lng], wo man mit dem Auto hinfährt, wenn nicht direkt beim Ziel
//   halt                 optional, ÖV-Haltestelle wie im SBB-Fahrplan (sonst wird die nächste gesucht)
//   kategorie            wandern | see | wasserfall | aussicht | kultur | indoor
//   stunden              Dauer vor Ort in Stunden (ohne Anreise)
//   schwierigkeit        T1 | T2 | T3 | T4 | T5 | T6 | null (keine Wanderung)
//   saison               Liste aus: fruehling, sommer, herbst, winter
//   regen                true = geht auch bei schlechtem Wetter
//   beschreibung         1–2 Sätze
//   link                 Link zum Reel (optional)
//   beispiel             true = Beispiel-Eintrag, wird durch echte Reels ersetzt
//
// Nach dem Eintragen: node tools/anreise.mjs  (holt die echten Anreisezeiten)

window.AKTIVITAETEN = [
  {
    name: "Seealpsee", ort: "Wasserauen AI", lat: 47.2690, lng: 9.3990,
    parkplatz: [47.2862, 9.4157], halt: "Wasserauen",
    kategorie: "wandern", stunden: 3, schwierigkeit: "T2",
    saison: ["fruehling", "sommer", "herbst"], regen: false,
    beschreibung: "Kurze Wanderung von Wasserauen zum Bergsee, Rückweg über die Ebenalp mit der Seilbahn möglich.",
    beispiel: true
  },
  {
    name: "Oeschinensee", ort: "Kandersteg BE", lat: 46.4980, lng: 7.7270,
    parkplatz: [46.4930, 7.6830], halt: "Kandersteg",
    kategorie: "see", stunden: 4, schwierigkeit: "T2",
    saison: ["sommer", "herbst"], regen: false,
    beschreibung: "Mit der Gondel hoch, zum türkisblauen See laufen, Panoramaweg oberhalb für die beste Sicht.",
    beispiel: true
  },
  {
    name: "Creux du Van", ort: "Noiraigue NE", lat: 46.9330, lng: 6.7270,
    parkplatz: [46.9560, 6.7240], halt: "Noiraigue",
    kategorie: "aussicht", stunden: 4.5, schwierigkeit: "T2",
    saison: ["fruehling", "sommer", "herbst"], regen: false,
    beschreibung: "Riesiger Felsenkessel im Jura. Rundweg ab Noiraigue, oben oft Steinböcke.",
    beispiel: true
  },
  {
    name: "Caumasee", ort: "Flims GR", lat: 46.8190, lng: 9.2950,
    parkplatz: [46.8260, 9.2900], halt: "Flims Waldhaus, Caumasee",
    kategorie: "see", stunden: 3, schwierigkeit: "T1",
    saison: ["sommer", "herbst"], regen: false,
    beschreibung: "Waldsee mit sehr klarem Wasser, im Sommer zum Baden. Gut mit der Ruinaulta-Aussicht kombinierbar.",
    beispiel: true
  },
  {
    name: "Rheinfall", ort: "Neuhausen SH", lat: 47.6779, lng: 8.6153,
    parkplatz: [47.6770, 8.6180], halt: "Neuhausen Rheinfall",
    kategorie: "wasserfall", stunden: 2, schwierigkeit: "T1",
    saison: ["fruehling", "sommer", "herbst", "winter"], regen: true,
    beschreibung: "Grösster Wasserfall Europas. Mit dem Boot zum Felsen in der Mitte.",
    beispiel: true
  },
  {
    name: "Aletschgletscher", ort: "Riederalp VS", lat: 46.4060, lng: 8.0290,
    parkplatz: [46.3557, 8.0453], halt: "Riederalp Mitte",
    kategorie: "aussicht", stunden: 5, schwierigkeit: "T2",
    saison: ["sommer", "herbst"], regen: false,
    beschreibung: "Höhenweg von der Moosfluh mit Blick auf den längsten Gletscher der Alpen. Eher fürs Wochenende.",
    beispiel: true
  },
  {
    name: "Trümmelbachfälle", ort: "Lauterbrunnen BE", lat: 46.5640, lng: 7.9120,
    halt: "Lauterbrunnen, Trümmelbach",
    kategorie: "wasserfall", stunden: 1.5, schwierigkeit: "T1",
    saison: ["fruehling", "sommer", "herbst"], regen: true,
    beschreibung: "Gletscherwasserfälle im Berg drin, mit Lift erreichbar. Gut auch bei Regen.",
    beispiel: true
  },
  {
    name: "Verkehrshaus", ort: "Luzern LU", lat: 47.0527, lng: 8.3357,
    halt: "Luzern, Verkehrshaus",
    kategorie: "indoor", stunden: 4, schwierigkeit: null,
    saison: ["fruehling", "sommer", "herbst", "winter"], regen: true,
    beschreibung: "Museum für Verkehr und Raumfahrt, viel zum Ausprobieren. Ideal für einen Regentag.",
    beispiel: true
  }
];
