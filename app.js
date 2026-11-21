// Ausflugskarte – App-Logik
(() => {
  "use strict";

  // ================= Grunddaten =================
  const STARTS = {
    geroldswil: { name: "Geroldswil", lat: 47.4217, lng: 8.4106, extra: 0, halt: "Geroldswil, Zentrum" },
    portein:    { name: "Portein",    lat: 46.7119, lng: 9.4072, extra: 15, halt: "Sarn, Sendas" },
    hier:       null // wird per Standort gesetzt
  };
  const ZEIT_MAX = { halb: 5.5, ganz: 11, wochenende: Infinity };
  const ZEIT_NAME = { halb: "halben Tag", ganz: "ganzen Tag", wochenende: "Wochenende" };
  const KAT_NAME = { wandern: "Wandern", see: "See & Baden", wasserfall: "Wasserfall", aussicht: "Aussicht", kultur: "Stadt & Kultur", indoor: "Drinnen" };
  const SAISON = m => ["winter", "winter", "fruehling", "fruehling", "fruehling", "sommer", "sommer", "sommer", "herbst", "herbst", "herbst", "winter"][m];
  const SAISON_NAME = { fruehling: "Frühling", sommer: "Sommer", herbst: "Herbst", winter: "Winter" };
  const FARBE = { schiefer: "#242a34", gelb: "#f2cf3c", weiss: "#ffffff" };

  const I = (p, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${p}</svg>`;
  const ICONS = {
    wandern:    '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    see:        '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    wasserfall: '<path d="M7 16.3c2.2 0 4-1.8 4-4 0-1.2-.6-2.3-1.8-3.2C8 8.1 7.4 6.8 7 5.4c-.3 1.4-1 2.7-2.2 3.7C3.6 10 3 11.1 3 12.3c0 2.2 1.8 4 4 4z"/><path d="M12.6 6.6A11 11 0 0 0 14 3c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.9 4.9"/>',
    aussicht:   '<path d="M12 2v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="M20 12h2"/><path d="m19.1 4.9-1.4 1.4"/><path d="M2 12h2"/><path d="M16 12a4 4 0 0 0-8 0"/><path d="M2 20h20"/><path d="m8 16 4-4 4 4"/>',
    kultur:     '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="m12 2 8 5H4z"/>',
    indoor:     '<path d="M3 10.2 12 3l9 7.2V21H3z"/><path d="M9 21v-6h6v6"/>'
  };
  const UI = {
    play:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
    route:  I('<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>'),
    zug:    I('<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16M8 21l2-4M16 21l-2-4"/><circle cx="8.5" cy="14" r=".5"/><circle cx="15.5" cy="14" r=".5"/>'),
    star:   I('<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>'),
    starF:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
    check:  I('<path d="M20 6 9 17l-5-5"/>', ' stroke-width="3"'),
    checkN: I('<path d="M20 6 9 17l-5-5"/>'),
    back:   I('<path d="m15 18-6-6 6-6"/>'),
    share:  I('<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>'),
    orbit:  I('<path d="M12 3a9 4 0 1 0 9 4"/><path d="m18 3 3 4-4 1"/><path d="m8 18 4-8 4 8z"/>'),
    sunset: I('<path d="M12 10V2M5.2 11.2l1.4 1.4M2 18h2M20 18h2M17.4 12.6l1.4-1.4M22 22H2M16 18a4 4 0 0 0-8 0"/><path d="m16 6-4 4-4-4"/>'),
    ext:    I('<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    sonne:  I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>'),
    mond:   I('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>'),
    auto:   I('<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>')
  };
  const WX = {
    sonne:  '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    teils:  '<path d="M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4"/><path d="M15.9 13A4 4 0 0 0 8.1 11"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z"/>',
    wolke:  '<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z"/>',
    nebel:  '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 17H7M17 21H9"/>',
    regen:  '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 14v6M8 14v6M12 16v6"/>',
    schnee: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/>',
    gewitter: '<path d="M6 16.3A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 .5 9"/><path d="m13 12-3 5h4l-3 5"/>'
  };

  // ================= Helfer =================
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = u => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : null; } catch { return null; } };
  const fmtMin = m => m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? " " + (m % 60) + " min" : ""}`;
  const fmtKurz = m => m < 60 ? `${m}′` : `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
  const fmtStd = h => (Math.round(h * 2) / 2).toString().replace(".", ",") + " h";
  const fmtUhr = d => d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const mq = q => matchMedia(q).matches;
  const istHandy = () => mq("(max-width: 860px)");
  const ruhig = () => mq("(prefers-reduced-motion: reduce)");
  const isoTag = d => d.toLocaleDateString("sv-SE");
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const slug = s => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const norm = s => slug(String(s || "")).replace(/-/g, " ");
  function toast(text) {
    $$(".toast").forEach(t => t.remove());
    const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = text;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
  }

  // ================= Tage =================
  const heute = new Date(); heute.setHours(12, 0, 0, 0);
  const TAGE = [...Array(7)].map((_, i) => { const d = new Date(heute); d.setDate(d.getDate() + i); return d; });
  const kurzTag = i => i === 0 ? "Heute" : i === 1 ? "Morgen" : TAGE[i].toLocaleDateString("de-CH", { weekday: "short" }).replace(".", "") + " " + TAGE[i].getDate() + ".";
  const tagName = i => i === 0 ? "heute" : i === 1 ? "morgen" : "am " + TAGE[i].toLocaleDateString("de-CH", { weekday: "long" });
  function tagOptionen() {
    const o = [0, 1];
    for (const wd of [6, 0]) { const i = TAGE.findIndex(d => d.getDay() === wd); if (i > 1) o.push(i); }
    if (!o.includes(state.tag)) o.push(state.tag);
    return o.sort((a, b) => a - b);
  }

  // ================= Daten =================
  const ANREISE = window.ANREISE || {};
  const roh = Array.isArray(window.AKTIVITAETEN) ? window.AKTIVITAETEN : null;
  const daten = (roh || []).filter(a => Number.isFinite(a?.lat) && Number.isFinite(a?.lng) && a.name)
    .map((a, i) => ({ ...a, id: i, slug: slug(a.name), kategorie: ICONS[a.kategorie] ? a.kategorie : "wandern", stunden: Number(a.stunden) || 3, saison: Array.isArray(a.saison) ? a.saison : [] }));
  const nachSlug = new Map(daten.map(a => [a.slug, a]));

  function km(a, b) {
    const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function anreise(a, startKey = state.start, mode = state.mode) {
    const exakt = ANREISE[a.name]?.[startKey]?.[mode];
    if (Number.isFinite(exakt)) return { min: exakt, geschaetzt: false, halt: ANREISE[a.name].halt || null };
    const s = STARTS[startKey] || STARTS.geroldswil, d = km(s, a) * 1.35;
    const auto = d / (d < 40 ? 50 : 72) * 60 + 10 + s.extra;
    const min = mode === "auto" ? auto : auto * 1.5 + 15;
    return { min: Math.max(10, Math.round(min / 5) * 5), geschaetzt: true, halt: ANREISE[a.name]?.halt || null };
  }

  // ================= Zustand =================
  const state = Object.assign({
    zeit: "ganz", tag: 1, start: "geroldswil", mode: "auto", max: 180, kat: [], zeigen: "alle",
    wetter: true, saison: true, basis: "auto", wege: true, drei: false, theme: "system"
  }, store.get("ausflug-v3") || {});
  if (state.start === "hier") state.start = "geroldswil"; // Standort wird nie gespeichert
  if (!(state.tag >= 0 && state.tag < 7)) state.tag = 1;
  state.q = ""; state.detail = null;
  let markiert = store.get("ausflug-markiert") || {};
  const speichern = () => { const { q, detail, ...rest } = state; store.set("ausflug-v3", rest); };

  // ================= Farbschema =================
  const dunkel = () => state.theme === "dark" || (state.theme === "system" && mq("(prefers-color-scheme: dark)"));
  function themeAnwenden() {
    if (state.theme === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = state.theme;
    const btn = $("#theme");
    btn.innerHTML = state.theme === "light" ? UI.sonne : state.theme === "dark" ? UI.mond : UI.auto;
    btn.setAttribute("aria-label", `Farbschema: ${state.theme === "light" ? "hell" : state.theme === "dark" ? "dunkel" : "wie das Gerät"}. Wechseln`);
    btn.title = btn.getAttribute("aria-label");
    stilAnwenden();
  }
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => state.theme === "system" && themeAnwenden());

  // ================= Wetter =================
  const wetter = { status: "lädt", proOrt: new Map(), fehler: "" };
  const wetterKlasse = (code, prob) => (code >= 95 || (code >= 61 && code !== 80 && prob >= 50) || prob >= 70) ? "schlecht" : (code <= 2 && prob < 35) ? "gut" : "mittel";
  const wetterIcon = c => c <= 1 ? WX.sonne : c === 2 ? WX.teils : c === 3 ? WX.wolke : (c === 45 || c === 48) ? WX.nebel : ((c >= 71 && c <= 77) || c === 85 || c === 86) ? WX.schnee : c >= 95 ? WX.gewitter : WX.regen;
  const WX_TEXT = c => c <= 1 ? "sonnig" : c === 2 ? "teils bewölkt" : c === 3 ? "bewölkt" : (c === 45 || c === 48) ? "Nebel" : (c >= 71 && c <= 77) || c === 85 || c === 86 ? "Schnee" : c >= 95 ? "Gewitter" : (c >= 51 && c <= 57) ? "Niesel" : "Regen";
  function wetterFuer(a, tag = state.tag) {
    const w = wetter.proOrt.get(a.id); if (!w) return null;
    const i = w.time.indexOf(isoTag(TAGE[tag])); if (i < 0) return null;
    const code = w.weather_code[i], prob = w.precipitation_probability_max[i] ?? 0;
    return { code, prob, t: Math.round(w.temperature_2m_max[i]), tmin: Math.round(w.temperature_2m_min?.[i] ?? NaN), klasse: wetterKlasse(code, prob), sunset: w.sunset?.[i], sunrise: w.sunrise?.[i] };
  }
  const wxHtml = w => w ? `<span class="wx ${w.klasse}" title="${esc(WX_TEXT(w.code))}, Regenrisiko ${w.prob} %">${I(wetterIcon(w.code))}${w.t}°</span>` : wetter.status === "lädt" ? '<span class="skel" aria-hidden="true"></span>' : "";

  async function ladeWetter(neu = false) {
    if (!daten.length) return;
    wetter.status = "lädt"; renderAlles();
    const lat = daten.map(a => a.lat.toFixed(3)).join(","), lng = daten.map(a => a.lng.toFixed(3)).join(",");
    const cache = store.get("ausflug-wetter2");
    let liste = (!neu && cache && cache.sig === lat + lng && Date.now() - cache.zeit < 3600e3) ? cache.daten : null;
    if (!liste) {
      try {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 12000);
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=Europe%2FZurich&forecast_days=7`, { signal: ctrl.signal });
        clearTimeout(t);
        if (!r.ok) throw new Error(`Open-Meteo meldet Fehler ${r.status}.`);
        const j = await r.json();
        liste = (Array.isArray(j) ? j : [j]).map(x => x.daily);
        store.set("ausflug-wetter2", { sig: lat + lng, zeit: Date.now(), daten: liste });
      } catch (e) {
        wetter.status = "fehler";
        wetter.fehler = e.name === "AbortError" ? "Der Wetterdienst antwortet nicht." : e instanceof TypeError ? "Keine Verbindung zum Wetterdienst (Open-Meteo)." : e.message;
        renderAlles(); return;
      }
    }
    daten.forEach((a, i) => liste[i] && wetter.proOrt.set(a.id, liste[i]));
    wetter.status = "ok"; renderAlles();
  }

  // ================= Filter =================
  function gefiltert() {
    const saison = SAISON(TAGE[state.tag].getMonth()), q = norm(state.q);
    return daten.map(a => ({ a, r: anreise(a), w: wetterFuer(a) }))
      .filter(({ a, r, w }) =>
        (!q || norm(a.name + " " + a.ort + " " + KAT_NAME[a.kategorie]).includes(q)) &&
        r.min <= state.max &&
        a.stunden + 2 * r.min / 60 <= ZEIT_MAX[state.zeit] &&
        (!state.kat.length || state.kat.includes(a.kategorie)) &&
        (!state.saison || !a.saison.length || a.saison.includes(saison)) &&
        (!state.wetter || !w || a.regen || w.klasse !== "schlecht") &&
        (state.zeigen === "alle" || (state.zeigen === "merk" ? markiert[a.name] === "will" : markiert[a.name] !== "gemacht")))
      .sort((x, y) => x.r.min - y.r.min);
  }
  function tippAus(liste) {
    const score = ({ a, r, w }) => (w ? { gut: 3, mittel: 1, schlecht: -2 }[w.klasse] : 0) + (markiert[a.name] === "will" ? 2 : 0) + (markiert[a.name] === "gemacht" ? -3 : 0) - r.min / 90;
    return liste.slice().sort((x, y) => score(y) - score(x))[0] || null;
  }

  // ================= Karte =================
  const WMTS = (layer, ext) => `https://wmts.geo.admin.ch/1.0.0/${layer}/default/current/3857/{z}/{x}/{y}.${ext}`;
  const ATTR = '<a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noopener">© swisstopo</a>';
  const rasterStil = (tiles, paint = {}, hintergrund = "#f2f3f5", maxzoom = 18) => ({
    version: 8,
    sources: { basis: { type: "raster", tiles: [tiles], tileSize: 256, maxzoom, attribution: ATTR } },
    layers: [{ id: "hintergrund", type: "background", paint: { "background-color": hintergrund } }, { id: "basis", type: "raster", source: "basis", paint }]
  });
  const BASEN = {
    hell: "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json",
    karte: rasterStil(WMTS("ch.swisstopo.pixelkarte-farbe", "jpeg")),
    luftbild: rasterStil(WMTS("ch.swisstopo.swissimage", "jpeg"), {}, "#2c3a2e", 19),
    nacht: rasterStil(WMTS("ch.swisstopo.pixelkarte-grau", "jpeg"), { "raster-brightness-min": 0.92, "raster-brightness-max": 0.14, "raster-contrast": 0.1, "raster-saturation": -0.3 }, "#1a1f27")
  };
  const effBasis = () => state.basis === "auto" ? (dunkel() ? "nacht" : "hell") : state.basis;

  const glOk = (() => { try { const c = document.createElement("canvas"); return !!window.maplibregl && !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } })();
  let map = null, aktuellerStil = null, stilGeladen = false, kachelFehler = 0, kartenBereit = false;
  const marker = new Map(); // key -> { m, el }
  let homeMarker = null, cluster = null, routeDaten = { type: "FeatureCollection", features: [] }, dashTimer = null, orbit = null, ersteMarker = true;

  function kartenFehler(text, knopf = true) {
    const box = $("#map-error"); box.hidden = false;
    box.innerHTML = `<div class="notice" role="alert"><strong>Die Karte lässt sich gerade nicht laden.</strong><span>${esc(text)}</span>${knopf ? '<button type="button" class="btn klein gelb" id="reload">Seite neu laden</button>' : ""}</div>`;
    $("#reload")?.addEventListener("click", () => location.reload());
  }

  function camPad() {
    if (istHandy()) return { top: 70, left: 40, right: 70, bottom: Math.max(60, innerHeight - sheet.y + 24) };
    return { top: 60, left: $("#panel").offsetWidth + 56, right: 90, bottom: 60 };
  }

  function stilAnwenden() {
    if (!map) return;
    const b = effBasis(); if (b === aktuellerStil) return;
    aktuellerStil = b; stilGeladen = false;
    map.setStyle(BASEN[b], { diff: false });
    $$("#basen .basis").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.v === state.basis)));
  }

  function overlaysHinzu() {
    if (!map.getSource("dem")) map.addSource("dem", { type: "raster-dem", tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"], encoding: "terrarium", tileSize: 256, maxzoom: 14, attribution: 'Gelände: <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank" rel="noopener">Mapzen Terrain Tiles</a>' });
    map.addSource("wege", { type: "raster", tiles: [WMTS("ch.swisstopo.swisstlm3d-wanderwege", "png")], tileSize: 256, maxzoom: 18, attribution: ATTR });
    map.addLayer({ id: "wege", type: "raster", source: "wege", minzoom: 11, paint: { "raster-opacity": 0.7 }, layout: { visibility: state.wege ? "visible" : "none" } });
    map.addSource("route", { type: "geojson", data: routeDaten });
    const nacht = aktuellerStil === "nacht" || aktuellerStil === "luftbild";
    map.addLayer({ id: "route-halo", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": nacht ? FARBE.schiefer : FARBE.weiss, "line-width": 8, "line-opacity": 0.85 } });
    map.addLayer({ id: "route", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": nacht ? FARBE.gelb : FARBE.schiefer, "line-width": 3.5, "line-dasharray": [0, 4, 3] } });
    terrainAnwenden(false);
  }

  function terrainAnwenden(kamera = true) {
    if (!map || !stilGeladen) return;
    $("#drei").setAttribute("aria-pressed", String(state.drei));
    $("#sw-drei").checked = state.drei;
    if (state.drei) {
      map.setTerrain({ source: "dem", exaggeration: 1.3 });
      try { map.setSky({ "sky-color": dunkel() ? "#0e1420" : "#9fc3ea", "horizon-color": dunkel() ? "#283447" : "#eef3f8", "fog-color": dunkel() ? "#1a1f27" : "#e9eef4", "sky-horizon-blend": 0.6, "horizon-fog-blend": 0.6, "fog-ground-blend": 0.2 }); } catch {}
      if (kamera && map.getPitch() < 30) map.easeTo({ pitch: 60, duration: ruhig() ? 0 : 1000 });
    } else {
      map.setTerrain(null);
      if (kamera && map.getPitch() > 0) map.easeTo({ pitch: 0, bearing: 0, duration: ruhig() ? 0 : 800 });
    }
  }

  function initKarte() {
    if (!glOk) {
      document.body.insertAdjacentHTML("afterbegin", '<div class="map-fallback"><p>Dein Browser kann die Karte nicht anzeigen (WebGL fehlt).<br>Die Liste und alle Details funktionieren trotzdem.</p></div>');
      $("#ctrl").hidden = true; return;
    }
    aktuellerStil = effBasis();
    map = new maplibregl.Map({
      container: "map", style: BASEN[aktuellerStil], bounds: [[5.96, 45.82], [10.49, 47.81]], fitBoundsOptions: { padding: camPad() },
      maxPitch: 75, canvasContextAttributes: { preserveDrawingBuffer: true }, preserveDrawingBuffer: true, attributionControl: { compact: true }, dragRotate: true, cooperativeGestures: false, fadeDuration: 150
    });
    $$("#basen .basis").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.v === state.basis)));
    map.once("idle", () => { kartenBereit = true; });
    map.on("style.load", () => { stilGeladen = true; overlaysHinzu(); map.once("idle", () => map.triggerRepaint()); });
    map.on("error", e => {
      const istKachel = !!(e?.tile || e?.sourceId);
      if (!stilGeladen && aktuellerStil === "hell") { // Vektorstil nicht erreichbar → Landeskarte
        aktuellerStil = null; state.basis = "karte"; stilAnwenden(); toast("Die helle Karte lädt nicht. Ich zeige die Landeskarte."); return;
      }
      if (istKachel && ++kachelFehler === 12) kartenFehler("Die Kartenbilder kommen nicht an. Prüfe die Verbindung oder wähle einen anderen Kartenstil.");
    });
    map.on("data", e => { if (e.dataType === "source" && e.tile) { kachelFehler = 0; $("#map-error").hidden = true; } });
    map.on("moveend", markerAktualisieren);
    map.on("rotate", () => { $("#kompass svg").style.transform = `rotate(${-map.getBearing()}deg)`; });
    map.on("pitchend", () => { if (map.getPitch() > 20 && !state.drei) { state.drei = true; terrainAnwenden(false); speichern(); } });
    map.on("movestart", e => { if (e.originalEvent) orbitStopp(); });
    map.on("click", () => $("#ebenen").hidden || ebenenZu());
    cluster = new Supercluster({ radius: 52, maxZoom: 10 });
  }

  function markerAktualisieren() {
    if (!map || !cluster) return;
    const z = Math.floor(map.getZoom());
    const items = cluster.getClusters([-180, -85, 180, 85], z);
    const tipp = aktuellerTipp?.a.id;
    const neu = new Set();
    items.forEach((f, idx) => {
      const [lng, lat] = f.geometry.coordinates;
      if (f.properties.cluster) {
        const key = "c" + f.properties.cluster_id + "-" + f.properties.point_count;
        neu.add(key);
        if (!marker.has(key)) {
          const el = document.createElement("div"); el.className = "ck";
          const n = f.properties.point_count;
          el.innerHTML = `<button type="button" class="cluster" style="--sz:${Math.min(64, 38 + n * 3)}px" aria-label="${n} Ausflüge, hineinzoomen">${n}</button>`;
          el.firstChild.addEventListener("click", ev => {
            ev.stopPropagation();
            map.easeTo({ center: [lng, lat], zoom: Math.min(cluster.getClusterExpansionZoom(f.properties.cluster_id) + .3, 14), padding: camPad(), duration: ruhig() ? 0 : 700 });
          });
          marker.set(key, { m: new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map), el });
        }
      } else {
        const id = f.properties.id, a = daten[id], key = "p" + id;
        neu.add(key);
        let rec = marker.get(key);
        if (!rec) {
          const el = document.createElement("div"); el.className = "mk enter";
          el.style.setProperty("--d", ersteMarker ? idx * 45 + "ms" : "0ms");
          el.innerHTML = `<button type="button" class="mk-in" aria-label="${esc(a.name)} öffnen"><span class="pin">${I(ICONS[a.kategorie])}</span></button>`;
          el.firstChild.addEventListener("click", ev => { ev.stopPropagation(); oeffneDetail(id); });
          el.addEventListener("mouseenter", () => $(`.item[data-id="${id}"]`)?.classList.add("hl"));
          el.addEventListener("mouseleave", () => $(`.item[data-id="${id}"]`)?.classList.remove("hl"));
          setTimeout(() => el.classList.remove("enter"), 1200);
          rec = { m: new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([lng, lat]).addTo(map), el };
          marker.set(key, rec);
        }
        rec.el.classList.toggle("active", state.detail === id);
        rec.el.classList.toggle("tipp", tipp === id && state.detail == null);
        rec.el.classList.toggle("gemacht", markiert[a.name] === "gemacht");
      }
    });
    for (const [key, rec] of marker) if (!neu.has(key)) { rec.m.remove(); marker.delete(key); }
    ersteMarker = false;

    const s = STARTS[state.start] || STARTS.geroldswil;
    if (!homeMarker) {
      const el = document.createElement("div"); el.className = "home"; el.title = "Start";
      homeMarker = new maplibregl.Marker({ element: el }).setLngLat([s.lng, s.lat]).addTo(map);
    } else homeMarker.setLngLat([s.lng, s.lat]);
    homeMarker.getElement().title = "Start: " + s.name;
  }

  function markerDaten(liste) {
    if (!cluster) return;
    const ids = liste.map(({ a }) => a.id);
    if (state.detail != null && !ids.includes(state.detail)) ids.push(state.detail); // geöffneter Ausflug bleibt sichtbar
    cluster.load(ids.map(id => ({ type: "Feature", properties: { id }, geometry: { type: "Point", coordinates: [daten[id].lng, daten[id].lat] } })));
    // Ausgewählter Ausflug bleibt sichtbar, auch wenn ein Filter ihn ausblendet
    markerAktualisieren();
  }

  function bogen(s, z) {
    const n = 48, dx = z.lng - s.lng, dy = z.lat - s.lat, len = Math.hypot(dx, dy);
    const cx = (s.lng + z.lng) / 2 - dy * 0.18, cy = (s.lat + z.lat) / 2 + dx * 0.18 * (len ? 1 : 0);
    return [...Array(n + 1)].map((_, i) => { const t = i / n, u = 1 - t; return [u * u * s.lng + 2 * u * t * cx + t * t * z.lng, u * u * s.lat + 2 * u * t * cy + t * t * z.lat]; });
  }
  function routeZeigen(a) {
    const s = STARTS[state.start] || STARTS.geroldswil;
    routeDaten = a ? { type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: bogen(s, a) } }] } : { type: "FeatureCollection", features: [] };
    map?.getSource("route")?.setData(routeDaten);
    clearInterval(dashTimer);
    if (a && map && !ruhig()) {
      const seq = [[0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5], [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2], [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5]];
      let i = 0;
      dashTimer = setInterval(() => { if (map.getLayer("route")) map.setPaintProperty("route", "line-dasharray", seq[i = (i + 1) % seq.length]); }, 60);
    }
  }

  function orbitStopp() { if (orbit) { cancelAnimationFrame(orbit); orbit = null; $("#rundflug")?.setAttribute("aria-pressed", "false"); } }
  function rundflug(a) {
    if (!map) return;
    if (orbit) { orbitStopp(); return; }
    if (!state.drei) { state.drei = true; terrainAnwenden(false); speichern(); }
    $("#rundflug")?.setAttribute("aria-pressed", "true");
    map.flyTo({ center: [a.lng, a.lat], zoom: 13.3, pitch: 64, bearing: map.getBearing() - 40, padding: camPad(), duration: ruhig() ? 0 : 3200, essential: true });
    if (ruhig()) return;
    map.once("moveend", () => {
      let t0 = null;
      const dreh = ts => { if (t0 == null) t0 = ts; map.rotateTo((map.getBearing() + 0.12) % 360, { duration: 0 }); orbit = requestAnimationFrame(dreh); };
      orbit = requestAnimationFrame(dreh);
    });
  }

  // ================= Bottom-Sheet (Handy) =================
  const panel = $("#panel");
  const sheet = { y: innerHeight * 0.6, snap: "peek" };
  const snaps = () => { const H = innerHeight; return { full: 48, half: Math.round(H * 0.4), peek: Math.round(H - Math.min(360, H * 0.46)) }; };
  function setY(y) { sheet.y = y; panel.style.setProperty("--y", y + "px"); panel.style.setProperty("--vis", (innerHeight - y) + "px"); }
  function setSnap(name) { sheet.snap = name; if (istHandy()) setY(snaps()[name]); }
  (function ziehen() {
    let start = null;
    const darfZiehen = t => istHandy() && (t.closest("#grab") || (t.closest(".drag") && !t.closest("button, input, a, .seg")));
    panel.addEventListener("pointerdown", e => {
      if (!darfZiehen(e.target)) return;
      start = { y: e.clientY, sy: sheet.y, t: performance.now(), last: e.clientY, lt: performance.now(), moved: false };
      panel.classList.add("dragging");
      panel.setPointerCapture(e.pointerId);
    });
    panel.addEventListener("pointermove", e => {
      if (!start) return;
      const dy = e.clientY - start.y; if (Math.abs(dy) > 6) start.moved = true;
      setY(Math.max(snaps().full, Math.min(innerHeight - 90, start.sy + dy)));
      start.v = (e.clientY - start.last) / Math.max(1, performance.now() - start.lt); start.last = e.clientY; start.lt = performance.now();
    });
    const ende = e => {
      if (!start) return;
      panel.classList.remove("dragging");
      const s = snaps(), order = ["full", "half", "peek"];
      if (!start.moved) { if (e.target.closest("#grab")) setSnap(sheet.snap === "peek" ? "half" : sheet.snap === "half" ? "full" : "peek"); else setY(start.sy); start = null; return; }
      let ziel;
      if ((start.v || 0) < -0.45) ziel = order[Math.max(0, order.indexOf(sheet.snap) - 1)];
      else if ((start.v || 0) > 0.45) ziel = order[Math.min(2, order.indexOf(sheet.snap) + 1)];
      else ziel = order.reduce((b, k) => Math.abs(s[k] - sheet.y) < Math.abs(s[b] - sheet.y) ? k : b, "peek");
      setSnap(ziel); start = null;
    };
    panel.addEventListener("pointerup", ende);
    panel.addEventListener("pointercancel", ende);
    addEventListener("resize", () => istHandy() ? setSnap(sheet.snap) : panel.style.removeProperty("--y"));
  })();

  // ================= Liste rendern =================
  let aktuellerTipp = null, letzteListe = "";
  function renderListe() {
    speichern();
    const saison = SAISON(TAGE[state.tag].getMonth());
    $("#f-tag").innerHTML = tagOptionen().map(i => `<button type="button" data-v="${i}" aria-pressed="${i === state.tag}">${kurzTag(i)}</button>`).join("");
    for (const [grp, key] of [["f-zeit", "zeit"], ["f-start", "start"], ["f-mode", "mode"], ["f-zeigen", "zeigen"]])
      $$(`#${grp} button`).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === state[key])));
    $$("#f-kat button").forEach(b => b.setAttribute("aria-pressed", String(state.kat.includes(b.dataset.v))));
    $("#f-max").value = state.max; $("#o-max").textContent = fmtMin(+state.max);
    $("#f-saison").checked = state.saison; $("#f-wetter").checked = state.wetter; $("#f-wetter").disabled = wetter.status !== "ok";
    $("#t-saison").textContent = `Passt zum ${SAISON_NAME[saison]}`;
    const s = STARTS[state.start] || STARTS.geroldswil;
    $("#sub").textContent = `Ab ${s.name} · ${state.mode === "auto" ? "Auto" : "ÖV"}`;
    const teile = [`${state.mode === "auto" ? "Auto" : "ÖV"} ab ${s.name}`, `bis ${fmtMin(+state.max)}`];
    if (state.kat.length) teile.push(state.kat.map(k => KAT_NAME[k]).join(", "));
    if (state.zeigen !== "alle") teile.push(state.zeigen === "merk" ? "Merkliste" : "noch nicht gemacht");
    $("#sum").textContent = teile.join(" · ");

    // Fortschritt
    const gemacht = daten.filter(a => markiert[a.name] === "gemacht").length;
    $("#ring-fg").style.strokeDashoffset = String(119.4 * (1 - (daten.length ? gemacht / daten.length : 0)));
    $("#ring-txt").textContent = gemacht;
    $("#ring").title = `${gemacht} von ${daten.length} Ausflügen gemacht`;

    const liste = gefiltert();
    $("#count").innerHTML = `${liste.length} ${liste.length === 1 ? "Ausflug passt" : "Ausflüge passen"}<small>für einen ${ZEIT_NAME[state.zeit]} ${tagName(state.tag)}, von ${daten.length}</small>`;
    $("#surprise").disabled = liste.length < 1;

    aktuellerTipp = tippAus(liste);
    const t = aktuellerTipp;
    $("#tipp").innerHTML = t ? `<button type="button" class="tipp-btn" data-id="${t.a.id}" aria-label="Tipp öffnen: ${esc(t.a.name)}">
        ${signHtml(t.a, t.r, `Tipp für ${tagName(state.tag).replace(/^am /, "")}`)}
        <span class="plate">${t.w ? `${wxHtml(t.w)}<span>${esc(WX_TEXT(t.w.code))}</span>` : ""}<span>${esc(t.a.ort)}</span><span>Total <b>${fmtStd(t.a.stunden + 2 * t.r.min / 60)}</b></span></span>
      </button>` : `<div class="sign" style="opacity:.6"><span class="eyebrow">Kein Tipp</span><span class="sign-name">Filter lockern</span><span class="sign-time"></span></div>`;

    const ul = $("#list");
    const html = !daten.length ? `<li class="empty">Noch keine Ausflüge eingetragen. Neue Orte kommen in die Datei aktivitaeten.js.</li>`
      : !liste.length ? `<li class="empty">${state.q ? `Nichts gefunden für «${esc(state.q)}».` : "Nichts passt zu diesen Filtern."}<br>Erhöhe die maximale Anreise oder nimm einen Filter weg.</li>`
      : liste.map(({ a, r, w }) => {
        const mk = markiert[a.name];
        return `<li><button type="button" class="item${mk === "gemacht" ? " gemacht" : ""}" data-id="${a.id}">
          <span class="ico">${I(ICONS[a.kategorie])}${mk === "will" ? `<span class="badge" title="Auf der Merkliste">${UI.starF}</span>` : mk === "gemacht" ? `<span class="badge done" title="Schon gemacht">${UI.check}</span>` : ""}</span>
          <span class="item-main">
            <span class="item-name">${esc(a.name)}${a.beispiel ? '<span class="tag">Beispiel</span>' : ""}</span>
            <span class="item-meta">${esc(a.ort)} · ${fmtStd(a.stunden)} ${diffHtml(a.schwierigkeit)}</span>
          </span>
          <span class="item-side"><span class="item-time">${r.geschaetzt ? "ca. " : ""}${fmtKurz(r.min)}</span>${wxHtml(w)}</span>
        </button></li>`;
      }).join("");
    const sig = liste.map(x => x.a.id).join(",");
    ul.innerHTML = html;
    if (sig !== letzteListe && !ruhig()) { ul.classList.remove("fade"); void ul.offsetWidth; ul.classList.add("fade"); }
    letzteListe = sig;

    const n = [];
    if (!roh) n.push(`<div class="notice" role="alert"><strong>Die Liste der Ausflüge fehlt.</strong><span>Die Datei aktivitaeten.js wurde nicht gefunden oder hat einen Fehler.</span><button type="button" class="btn klein gelb" data-act="reload">Seite neu laden</button></div>`);
    if (wetter.status === "fehler") n.push(`<div class="notice" role="alert"><strong>Das Wetter kommt gerade nicht an.</strong><span>Die Ausflüge werden ohne Wetter angezeigt. ${esc(wetter.fehler)}</span><button type="button" class="btn klein gelb" data-act="wetter">Wetter nochmals laden</button></div>`);
    if (state.start === "hier") n.push(`<div class="notice leise">Ab deinem Standort ist die Anreise grob geschätzt.</div>`);
    if (daten.some(a => a.beispiel)) n.push(`<div class="notice leise">Mit «Beispiel» markierte Orte sind Platzhalter, bis deine Reels eingetragen sind.</div>`);
    $("#notice").innerHTML = n.join("");

    markerDaten(liste);
  }

  function signHtml(a, r, eyebrow, gross = false) {
    return `<div class="sign">${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}<span class="sign-name"><span>${esc(a.name)}</span></span><span class="sign-time">${r.geschaetzt ? "ca. " : ""}${fmtMin(r.min)}</span></div>`;
  }
  function diffHtml(t) {
    const n = /^T([1-6])$/.exec(t || ""); if (!n) return "";
    const c = n[1] === "1" ? "t1" : n[1] <= "3" ? "t2" : "t4";
    return `<span class="diff ${c}" title="${c === "t1" ? "Wanderweg" : c === "t2" ? "Bergwanderweg" : "Alpinwanderweg"}"><i aria-hidden="true"></i>${esc(t)}</span>`;
  }

  // ================= Detail =================
  function reelEmbed(url) {
    const u = safeUrl(url); if (!u) return null;
    let m;
    if ((m = /instagram\.com\/(?:[\w.]+\/)?(?:reel|reels|p|tv)\/([\w-]+)/.exec(u))) return { src: `https://www.instagram.com/reel/${m[1]}/embed/`, dienst: "Instagram" };
    if ((m = /tiktok\.com\/.*\/video\/(\d+)/.exec(u))) return { src: `https://www.tiktok.com/embed/v2/${m[1]}`, dienst: "TikTok" };
    if ((m = /youtube\.com\/shorts\/([\w-]+)/.exec(u) || /youtu\.be\/([\w-]+)/.exec(u))) return { src: `https://www.youtube-nocookie.com/embed/${m[1]}`, dienst: "YouTube" };
    return null;
  }

  function renderDetail() {
    const v = $("#view-detail"), a = daten[state.detail];
    if (!a) return;
    const r = anreise(a), s = STARTS[state.start] || STARTS.geroldswil, w = wetterFuer(a);
    const total = a.stunden + 2 * r.min / 60, mk = markiert[a.name], reel = safeUrl(a.link), emb = reelEmbed(a.link);
    const ziel = a.parkplatz ? a.parkplatz.join(",") : `${a.lat},${a.lng}`;
    const origin = state.start === "hier" ? `${s.lat},${s.lng}` : `${s.name}, Schweiz`;
    const gmaps = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${ziel}&travelmode=${state.mode === "auto" ? "driving" : "transit"}`;
    const fahrplan = `https://search.ch/fahrplan/?${state.start !== "hier" ? "from=" + encodeURIComponent(s.halt) + "&" : ""}to=${encodeURIComponent(r.halt || a.ort)}`;

    // Sonnenuntergang & Abfahrt
    let sun = "";
    if (w?.sunset) {
      const su = new Date(w.sunset);
      if (a.kategorie === "indoor") sun = `<div class="sun">${UI.sunset}<span>Sonnenuntergang ${tagName(state.tag)} um <b>${fmtUhr(su)}</b>. Drinnen spielt das zum Glück keine Rolle.</span></div>`;
      else {
        const los = new Date(su.getTime() - (a.stunden * 60 + r.min) * 60e3);
        const frueh = los.getHours() < 6;
        const zuSpaet = state.tag === 0 && los < new Date();
        sun = `<div class="sun">${UI.sunset}<span>${frueh ? `Mit Tageslicht wird das knapp: Sonnenuntergang um <b>${fmtUhr(su)}</b>. Eher übernachten.`
          : zuSpaet ? `Für heute ist es zu spät, die Sonne geht um <b>${fmtUhr(su)}</b> unter. Lieber an einem anderen Tag.`
          : `Losfahren bis <b>${fmtUhr(los)}</b>, dann bist du vor Sonnenuntergang (<b>${fmtUhr(su)}</b>) fertig.`}</span></div>`;
      }
    }
    const week = wetter.proOrt.get(a.id) ? `<div><p class="h2">Wetter vor Ort</p><div class="week" role="group" aria-label="Tag wählen">${TAGE.map((_, i) => {
      const x = wetterFuer(a, i); if (!x) return "";
      return `<button type="button" class="day ${x.klasse}" data-tag="${i}" aria-pressed="${i === state.tag}" title="${esc(WX_TEXT(x.code))}, Regenrisiko ${x.prob} %"><small>${i === 0 ? "Heute" : TAGE[i].toLocaleDateString("de-CH", { weekday: "short" }).replace(".", "")}</small>${I(wetterIcon(x.code))}<b>${x.t}°</b><small>${x.prob} %</small></button>`;
    }).join("")}</div></div>` : wetter.status === "lädt" ? '<div><p class="h2">Wetter vor Ort</p><span class="skel" style="width:100%;height:72px"></span></div>' : "";

    v.innerHTML = `
      <header class="d-hero contour pad drag">
        <div class="d-bar">
          <button type="button" class="d-back" data-act="zurueck">${UI.back} Alle Ausflüge</button>
          <span class="grow"></span>
          <button type="button" class="icon-btn" data-act="teilen" aria-label="${esc(a.name)} teilen">${UI.share}</button>
        </div>
        <div class="d-cat">${esc(KAT_NAME[a.kategorie])} · ${esc(a.ort)} ${diffHtml(a.schwierigkeit)} ${a.beispiel ? '<span class="tag">Beispiel</span>' : ""}</div>
        <svg class="d-big" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${ICONS[a.kategorie]}</svg>
      </header>
      <div class="d-sign pad">
        ${signHtml(a, r, `${state.mode === "auto" ? "Mit dem Auto" : "Mit dem ÖV"} ab ${s.name}`)}
        <div class="plate">${w ? `${wxHtml(w)}<span>${esc(WX_TEXT(w.code))} ${tagName(state.tag)}</span>` : ""}<span>Total <b>${fmtStd(total)}</b></span></div>
      </div>
      <div class="d-body pad">
        ${a.beschreibung ? `<p class="d-desc">${esc(a.beschreibung)}</p>` : ""}
        <div class="facts">
          <div class="fact"><span>Vor Ort</span><b>${fmtStd(a.stunden)}</b></div>
          <div class="fact"><span>Anreise</span><b>${fmtKurz(r.min)}</b></div>
          <div class="fact"><span>Total</span><b>${fmtStd(total)}</b></div>
        </div>
        ${sun}
        ${week}
        ${emb ? `<div><p class="h2">Reel</p><div class="reel" id="reel"><button type="button" class="reel-start" data-act="reel"><span class="play">${UI.play}</span><b>Reel hier abspielen</b><small>Lädt ${emb.dienst}</small></button></div></div>` : ""}
        <div class="actions">
          <button type="button" class="btn leise" data-act="merk" aria-pressed="${mk === "will"}">${mk === "will" ? UI.starF : UI.star} ${mk === "will" ? "Gemerkt" : "Merken"}</button>
          <button type="button" class="btn leise" data-act="gemacht" aria-pressed="${mk === "gemacht"}">${UI.checkN} ${mk === "gemacht" ? "Gemacht" : "Schon gemacht?"}</button>
          <a class="btn" href="${esc(gmaps)}" target="_blank" rel="noopener">${UI.route} Route</a>
          <a class="btn" href="${esc(fahrplan)}" target="_blank" rel="noopener">${UI.zug} ÖV-Fahrplan</a>
          ${map ? `<button type="button" class="btn gelb" id="rundflug" data-act="rundflug" aria-pressed="false">${UI.orbit} 3D-Rundflug</button>` : ""}
          ${reel ? `<a class="btn leise" href="${esc(reel)}" target="_blank" rel="noopener">${UI.ext} Original öffnen</a>` : ""}
        </div>
        <p class="hint">${r.geschaetzt ? "Anreise grob geschätzt. Die genaue Zeit siehst du über «Route»." : `Anreise ${state.mode === "oev" ? `bis ${esc(r.halt || a.ort)}, Samstagmorgen, inkl. Fussweg` : "ohne Verkehr, plus 5 min Parkieren"}.`}</p>
      </div>`;
  }

  let pushedDetail = false;
  function oeffneDetail(id, { push = true, kamera = true } = {}) {
    const a = daten[id]; if (!a) return;
    orbitStopp();
    const warOffen = state.detail != null;
    state.detail = id;
    renderDetail();
    const vl = $("#view-liste"), vd = $("#view-detail");
    vl.hidden = true; vd.hidden = false;
    if (!warOffen && !ruhig()) { vd.classList.remove("in", "in-back"); void vd.offsetWidth; vd.classList.add("in"); }
    $("#scroll").scrollTop = 0;
    if (push) { const url = "#" + a.slug; if (location.hash !== url) { history.pushState({ d: id }, "", url); pushedDetail = true; } }
    document.title = `${a.name} · Ausflugskarte`;
    if (istHandy() && sheet.snap === "peek") setSnap("half");
    if (map) {
      routeZeigen(a); markerDaten(gefiltert());
      if (kamera) {
        let gefahren = false;
        const fahre = () => { if (gefahren || state.detail !== id) return; gefahren = true;
          const s = STARTS[state.start] || STARTS.geroldswil;
          const b = new maplibregl.LngLatBounds([a.lng, a.lat], [a.lng, a.lat]).extend([s.lng, s.lat]);
          map.fitBounds(b, { padding: camPad(), maxZoom: 11.5, pitch: state.drei ? 50 : 0, duration: ruhig() ? 0 : 1400 });
        };
        if (kartenBereit) fahre();
        else { map.once("idle", fahre); setTimeout(fahre, 4000); } // beim direkten Öffnen per Link erst, wenn die Karte fertig geladen ist
      }
    }
  }
  function schliesseDetail({ fromPop = false } = {}) {
    if (state.detail == null) return;
    orbitStopp();
    state.detail = null;
    const vl = $("#view-liste"), vd = $("#view-detail");
    vd.hidden = true; vd.innerHTML = ""; vl.hidden = false;
    if (!ruhig()) { vl.classList.remove("in", "in-back"); void vl.offsetWidth; vl.classList.add("in-back"); }
    document.title = "Ausflugskarte Schweiz";
    if (!fromPop) { if (pushedDetail) { pushedDetail = false; history.back(); } else history.replaceState(null, "", location.pathname + location.search); }
    if (map) { routeZeigen(null); markerDaten(gefiltert()); }
  }
  addEventListener("popstate", () => {
    const a = nachSlug.get(decodeURIComponent(location.hash.slice(1)));
    if (a) oeffneDetail(a.id, { push: false }); else { pushedDetail = false; schliesseDetail({ fromPop: true }); }
  });

  function toggleMark(id, art) {
    const name = daten[id].name;
    if (markiert[name] === art) delete markiert[name]; else markiert[name] = art;
    store.set("ausflug-markiert", markiert);
    if (markiert[name] === "gemacht") toast("Abgehakt. Schön!");
    if (markiert[name] === "will") toast("Auf der Merkliste");
    renderAlles();
  }
  async function teilen(a) {
    const url = location.origin + location.pathname + "#" + a.slug;
    const text = `${a.name} (${a.ort}): Ausflug auf der Ausflugskarte`;
    if (navigator.share) { try { await navigator.share({ title: a.name, text, url }); return; } catch (e) { if (e.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(url); toast("Link kopiert"); }
    catch { toast("Kopieren ging nicht. Link: " + url); }
  }

  // ================= Überrasch mich (Fallblatt) =================
  let wuerfelt = false;
  async function ueberrasch() {
    const liste = gefiltert(); if (!liste.length || wuerfelt) return;
    const kandidaten = liste.length > 1 ? liste.filter(x => x.a.id !== state.detail) : liste;
    const ziel = kandidaten[Math.floor(Math.random() * kandidaten.length)];
    if (state.detail != null) schliesseDetail();
    const nameEl = $("#tipp .sign-name"), timeEl = $("#tipp .sign-time"), eyeEl = $("#tipp .eyebrow");
    if (nameEl && !ruhig()) {
      wuerfelt = true;
      if (istHandy()) setSnap("peek");
      $("#scroll").scrollTo({ top: 0, behavior: "smooth" });
      if (eyeEl) eyeEl.textContent = "Würfle …";
      const pool = daten.map(a => a.name);
      for (let i = 0; i < 16; i++) {
        const n = i === 15 ? ziel.a.name : pool[Math.floor(Math.random() * pool.length)];
        nameEl.innerHTML = `<span>${esc(n)}</span>`;
        nameEl.classList.remove("flap"); void nameEl.offsetWidth; nameEl.classList.add("flap");
        if (timeEl) timeEl.textContent = i === 15 ? fmtMin(ziel.r.min) : fmtMin(5 * Math.floor(Math.random() * 40 + 4));
        if ("vibrate" in navigator && i % 3 === 0) navigator.vibrate?.(4);
        await sleep(45 + i * i * 1.6);
      }
      if (eyeEl) eyeEl.textContent = "Zufallstreffer";
      await sleep(450);
      wuerfelt = false;
    }
    oeffneDetail(ziel.a.id);
  }

  // ================= Alles rendern =================
  function renderAlles() {
    renderListe();
    if (state.detail != null) {
      const offenReel = $("#reel iframe"); // ein laufendes Reel nicht neu laden
      if (!offenReel) renderDetail();
    }
  }

  // ================= Bedienung =================
  $("#f-kat").innerHTML = Object.keys(KAT_NAME).filter(k => daten.some(a => a.kategorie === k))
    .map(k => `<button type="button" class="chip" data-v="${k}" aria-pressed="false">${I(ICONS[k])}${KAT_NAME[k]}</button>`).join("");
  for (const [grp, key] of [["f-zeit", "zeit"], ["f-mode", "mode"], ["f-zeigen", "zeigen"], ["f-tag", "tag"]])
    $("#" + grp).addEventListener("click", e => { const b = e.target.closest("button"); if (b) { state[key] = key === "tag" ? +b.dataset.v : b.dataset.v; renderAlles(); } });
  $("#f-start").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.v !== "hier") { state.start = b.dataset.v; renderAlles(); if (state.detail != null) routeZeigen(daten[state.detail]); return; }
    if (!navigator.geolocation) { toast("Dein Browser kann den Standort nicht bestimmen."); return; }
    b.textContent = "Suche …";
    navigator.geolocation.getCurrentPosition(pos => {
      STARTS.hier = { name: "deinem Standort", lat: pos.coords.latitude, lng: pos.coords.longitude, extra: 0 };
      b.textContent = "Mein Standort"; state.start = "hier"; renderAlles();
      map?.easeTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: Math.max(map.getZoom(), 8), padding: camPad() });
    }, err => {
      b.textContent = "Mein Standort";
      toast(err.code === 1 ? "Standort nicht erlaubt. Du kannst ihn in den Browser-Einstellungen freigeben." : "Standort gerade nicht verfügbar.");
    }, { timeout: 10000, maximumAge: 600000 });
  });
  $("#f-kat").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const v = b.dataset.v; state.kat = state.kat.includes(v) ? state.kat.filter(x => x !== v) : [...state.kat, v]; renderAlles();
  });
  $("#f-max").addEventListener("input", e => { state.max = +e.target.value; renderAlles(); });
  $("#f-saison").addEventListener("change", e => { state.saison = e.target.checked; renderAlles(); });
  $("#f-wetter").addEventListener("change", e => { state.wetter = e.target.checked; renderAlles(); });
  $("#q").addEventListener("input", e => { state.q = e.target.value; renderListe(); });
  $("#q").addEventListener("focus", () => istHandy() && sheet.snap !== "full" && setSnap("full"));

  const liste = $("#list");
  liste.addEventListener("click", e => { const b = e.target.closest(".item"); if (b) oeffneDetail(+b.dataset.id); });
  liste.addEventListener("mouseover", e => { const b = e.target.closest(".item"); marker.get("p" + b?.dataset.id)?.el.classList.add("hl"); });
  liste.addEventListener("mouseout", e => { const b = e.target.closest(".item"); marker.get("p" + b?.dataset.id)?.el.classList.remove("hl"); });
  $("#tipp").addEventListener("click", e => { const b = e.target.closest("[data-id]"); if (b && !wuerfelt) oeffneDetail(+b.dataset.id); });
  $("#surprise").addEventListener("click", ueberrasch);
  $("#notice").addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (!b) return; b.dataset.act === "reload" ? location.reload() : ladeWetter(true); });

  $("#view-detail").addEventListener("click", e => {
    const tag = e.target.closest("[data-tag]");
    if (tag) { state.tag = +tag.dataset.tag; renderAlles(); return; }
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = daten[state.detail];
    switch (b.dataset.act) {
      case "zurueck": schliesseDetail(); break;
      case "teilen": teilen(a); break;
      case "merk": toggleMark(a.id, "will"); break;
      case "gemacht": toggleMark(a.id, "gemacht"); break;
      case "rundflug": rundflug(a); break;
      case "reel": {
        const emb = reelEmbed(a.link); if (!emb) break;
        $("#reel").innerHTML = `<iframe src="${esc(emb.src)}" title="Reel: ${esc(a.name)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
        if (istHandy()) setSnap("full");
        break;
      }
    }
  });

  $("#theme").addEventListener("click", () => {
    state.theme = { system: "light", light: "dark", dark: "system" }[state.theme];
    themeAnwenden(); speichern();
    toast(state.theme === "system" ? "Farbschema wie das Gerät" : state.theme === "light" ? "Helles Farbschema" : "Dunkles Farbschema");
  });

  // Kartensteuerung
  $("#z-in").addEventListener("click", () => map?.zoomIn());
  $("#z-out").addEventListener("click", () => map?.zoomOut());
  $("#kompass").addEventListener("click", () => map?.easeTo({ bearing: 0, pitch: state.drei ? map.getPitch() : 0 }));
  $("#drei").addEventListener("click", () => { state.drei = !state.drei; terrainAnwenden(); speichern(); });
  $("#sw-drei").addEventListener("change", e => { state.drei = e.target.checked; terrainAnwenden(); speichern(); });
  $("#sw-wege").checked = state.wege;
  $("#sw-wege").addEventListener("change", e => { state.wege = e.target.checked; speichern(); if (map?.getLayer("wege")) map.setLayoutProperty("wege", "visibility", state.wege ? "visible" : "none"); });
  const ebenenZu = () => { $("#ebenen").hidden = true; $("#ebenen-btn").setAttribute("aria-expanded", "false"); };
  $("#ebenen-btn").addEventListener("click", () => { const zu = !$("#ebenen").hidden; $("#ebenen").hidden = zu; $("#ebenen-btn").setAttribute("aria-expanded", String(!zu)); });
  $("#basen").addEventListener("click", e => { const b = e.target.closest(".basis"); if (!b) return; state.basis = b.dataset.v; speichern(); $$("#basen .basis").forEach(x => x.setAttribute("aria-pressed", String(x === b))); stilAnwenden(); });

  // Tastatur
  addEventListener("keydown", e => {
    const imFeld = e.target.matches("input, textarea, select");
    if (e.key === "Escape") {
      if (!$("#ebenen").hidden) ebenenZu();
      else if (imFeld) e.target.blur();
      else if (state.detail != null) schliesseDetail();
      return;
    }
    if (imFeld || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "/") { e.preventDefault(); if (state.detail != null) schliesseDetail(); $("#q").focus(); }
    else if (e.key === "z" || e.key === "Z") ueberrasch();
    else if (e.key === "3" && map) { state.drei = !state.drei; terrainAnwenden(); speichern(); }
  });

  // ================= Start =================
  $("#more").open = !istHandy();
  if (istHandy()) setSnap("peek");
  initKarte();
  themeAnwenden();
  renderListe();
  const start = nachSlug.get(decodeURIComponent(location.hash.slice(1)));
  if (start) { pushedDetail = false; history.replaceState(null, "", location.pathname + "#" + start.slug); oeffneDetail(start.id, { push: false }); }
  ladeWetter();
})();
