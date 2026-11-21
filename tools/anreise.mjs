// Holt echte Anreisezeiten für alle Ausflüge und schreibt sie in anreise.js.
//   node tools/anreise.mjs          nur Ausflüge ohne Zeiten
//   node tools/anreise.mjs --alle   alles neu berechnen
// Auto: OSRM (OpenStreetMap-Routing), ÖV: transport.opendata.ch (Fahrplan SBB), Samstag 08:00.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import vm from "node:vm";

const ROOT = new URL("../", import.meta.url);
const lade = (datei, name) => {
  const pfad = new URL(datei, ROOT);
  if (!existsSync(pfad)) return undefined;
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(pfad, "utf8"), ctx);
  return ctx.window[name];
};

const STARTS = {
  geroldswil: { lat: 47.4217, lng: 8.4106, halt: "Geroldswil, Zentrum" },
  portein:    { lat: 46.7119, lng: 9.4072, halt: null } // nächste Haltestelle wird gesucht
};

const pause = ms => new Promise(r => setTimeout(r, ms));
async function json(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": "ausflugskarte-anreise" } });
      if (r.ok) return await r.json();
      if (r.status === 429) { await pause(3000); continue; }
      throw new Error(`HTTP ${r.status}`);
    } catch (e) { if (i === 2) throw e; await pause(1500); }
  }
}
const runde5 = m => Math.max(5, Math.round(m / 5) * 5);
const minuten = d => { const m = /(\d+)d(\d+):(\d+)/.exec(d || ""); return m ? +m[1] * 1440 + +m[2] * 60 + +m[3] : null; };

async function autoMin(von, nach) {
  const d = await json(`https://router.project-osrm.org/route/v1/driving/${von.lng},${von.lat};${nach.lng},${nach.lat}?overview=false`);
  const s = d?.routes?.[0]?.duration;
  return Number.isFinite(s) ? runde5(s / 60 + 5) : null; // + 5 min Parkplatz
}
async function haltBeiName(name) {
  const d = await json(`https://transport.opendata.ch/v1/locations?type=station&query=${encodeURIComponent(name)}`);
  return d?.stations?.find(s => s.id) || null;
}
async function haltBeiOrt(lat, lng) {
  const d = await json(`https://transport.opendata.ch/v1/locations?type=station&x=${lat}&y=${lng}`);
  const s = d?.stations?.find(s => s.id);
  return s ? { ...s, distance: s.distance ?? 0 } : null;
}
function naechsterSamstag() {
  const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().slice(0, 10);
}
async function oevMin(vonId, nachId) {
  const d = await json(`https://transport.opendata.ch/v1/connections?from=${vonId}&to=${nachId}&date=${naechsterSamstag()}&time=08:00&limit=4`);
  const dauern = (d?.connections || []).map(c => minuten(c.duration)).filter(Number.isFinite);
  return dauern.length ? Math.min(...dauern) : null;
}

const daten = lade("aktivitaeten.js", "AKTIVITAETEN") || [];
const alle = process.argv.includes("--alle");
const alt = (!alle && lade("anreise.js", "ANREISE")) || {};
const neu = {};

for (const [k, s] of Object.entries(STARTS)) {
  s.station = s.halt ? await haltBeiName(s.halt) : await haltBeiOrt(s.lat, s.lng);
  console.log(`Start ${k}: ÖV ab ${s.station?.name ?? "?"}`);
}

for (const a of daten) {
  if (alt[a.name]) { neu[a.name] = alt[a.name]; continue; }
  const ziel = a.parkplatz ? { lat: a.parkplatz[0], lng: a.parkplatz[1] } : a;
  let halt = a.halt ? await haltBeiName(a.halt) : await haltBeiOrt(a.lat, a.lng);
  const fuss = !a.halt && halt ? Math.round(halt.distance / 1000 * 1.3 / 4 * 60) : 0;
  const eintrag = {};
  for (const [k, s] of Object.entries(STARTS)) {
    const auto = await autoMin(s, ziel).catch(() => null); await pause(400);
    let oev = null;
    if (halt && s.station) { const m = await oevMin(s.station.id, halt.id).catch(() => null); if (m != null) oev = runde5(m + fuss); await pause(400); }
    eintrag[k] = { auto, oev };
  }
  eintrag.halt = halt?.name ?? null;
  if (fuss >= 10) eintrag.fuss = fuss;
  neu[a.name] = eintrag;
  console.log(`${a.name.padEnd(24)} Geroldswil ${eintrag.geroldswil.auto}/${eintrag.geroldswil.oev}  Portein ${eintrag.portein.auto}/${eintrag.portein.oev}  (${eintrag.halt})`);
}

const kopf = `// Automatisch erzeugt von tools/anreise.mjs am ${new Date().toISOString().slice(0, 10)}. Nicht von Hand ändern.\n// Minuten pro Startort: auto (inkl. 5 min Parkplatz), oev (Samstag 08:00, inkl. Fussweg ab Haltestelle).\n`;
writeFileSync(new URL("anreise.js", ROOT), kopf + "window.ANREISE = " + JSON.stringify(neu, null, 2) + ";\n");
console.log(`anreise.js geschrieben (${Object.keys(neu).length} Ausflüge).`);
