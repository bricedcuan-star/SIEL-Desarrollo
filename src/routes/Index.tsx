<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SIEL PRO — Sistema Inteligente de Evaluación de Licitaciones</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.x/tabler-icons.min.css">
<style>
/* ============================================================
   SIEL PRO — Design Tokens
   Palette: Azul naval profundo + Dorado cálido + Grises fríos
   ============================================================ */
:root {
  --navy:        #0D2545;
  --navy-dark:   #071729;
  --navy-mid:    #163761;
  --navy-light:  #1E4A82;
  --gold:        #C8982A;
  --gold-lt:     #E8B84B;
  --gold-pale:   #FDF5E0;
  --gold-border: #E8D5A0;

  --green:       #1A9E72;
  --green-bg:    #E3F5EE;
  --green-text:  #0C5C41;
  --red:         #D94040;
  --red-bg:      #FDECEC;
  --red-text:    #7A1F1F;
  --amber:       #E8960A;
  --amber-bg:    #FEF3DC;
  --amber-text:  #7A4A00;

  --bg:          #F4F6FA;
  --bg-card:     #FFFFFF;
  --bg-panel:    #F9FAFB;
  --border:      #E2E8F0;
  --border-soft: #EEF1F5;
  --text-1:      #0F172A;
  --text-2:      #475569;
  --text-3:      #94A3B8;

  --sidebar-w:   230px;
  --topbar-h:    56px;
  --radius:      10px;
  --radius-sm:   6px;
  --shadow:      0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.05);
  --shadow-md:   0 4px 24px rgba(0,0,0,.10);
  --font:        'Inter', system-ui, sans-serif;
  --mono:        'JetBrains Mono', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 14px; }
body { font-family: var(--font); background: var(--bg); color: var(--text-1); overflow: hidden; height: 100vh; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ──────────────────────────────────────────
   ONBOARDING OVERLAY
────────────────────────────────────────── */
#onboarding {
  position: fixed; inset: 0; z-index: 999;
  background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 60%, var(--navy-mid) 100%);
  display: flex; align-items: center; justify-content: center;
  transition: opacity .4s ease;
}
#onboarding.hidden { opacity: 0; pointer-events: none; }

.ob-card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 16px;
  padding: 40px 44px;
  width: 520px;
  backdrop-filter: blur(12px);
}
.ob-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.ob-shield {
  width: 44px; height: 44px; border-radius: 10px;
  background: var(--gold); display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: var(--navy-dark);
}
.ob-brand { font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -.4px; }
.ob-brand span { color: var(--gold-lt); }
.ob-sub { font-size: 11px; color: rgba(255,255,255,.4); letter-spacing: .1em; margin-top: 1px; }
.ob-title { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 6px; }
.ob-desc { font-size: 12px; color: rgba(255,255,255,.5); margin-bottom: 24px; line-height: 1.6; }

.ob-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.ob-full { grid-column: 1/-1; }
.ob-label { font-size: 11px; font-weight: 500; color: rgba(255,255,255,.5); margin-bottom: 5px; letter-spacing: .04em; }
.ob-input {
  width: 100%; padding: 9px 12px; border-radius: 7px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06); color: #fff;
  font-family: var(--font); font-size: 13px; outline: none;
  transition: border-color .2s;
}
.ob-input:focus { border-color: var(--gold); }
.ob-input::placeholder { color: rgba(255,255,255,.25); }

.ob-section-title {
  font-size: 10px; font-weight: 600; color: var(--gold-lt);
  letter-spacing: .1em; text-transform: uppercase;
  margin: 18px 0 10px; border-top: 1px solid rgba(255,255,255,.08); padding-top: 14px;
}
.ob-btn {
  width: 100%; padding: 12px; margin-top: 20px;
  background: var(--gold); color: var(--navy-dark);
  border: none; border-radius: 8px; font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: var(--font);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background .2s, transform .1s;
}
.ob-btn:hover { background: var(--gold-lt); }
.ob-btn:active { transform: scale(.99); }

/* ──────────────────────────────────────────
   APP SHELL
────────────────────────────────────────── */
#app { display: flex; height: 100vh; }

/* ── Sidebar ── */
#sidebar {
  width: var(--sidebar-w); background: var(--navy-dark);
  display: flex; flex-direction: column; flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,.06);
}
#sid-header {
  padding: 16px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,.07);
}
.sid-logo-row { display: flex; align-items: center; gap: 10px; }
.sid-shield {
  width: 34px; height: 34px; border-radius: 8px;
  background: var(--gold); display: flex; align-items: center; justify-content: center;
  font-size: 17px; color: var(--navy-dark); flex-shrink: 0;
}
.sid-brand { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -.3px; }
.sid-brand span { color: var(--gold-lt); }
.sid-version { font-size: 9px; color: rgba(255,255,255,.3); letter-spacing: .08em; margin-top: 1px; }

#sid-nav { flex: 1; padding: 10px 8px; overflow-y: auto; }
.nav-group { font-size: 9px; font-weight: 600; color: rgba(255,255,255,.25);
  letter-spacing: .12em; text-transform: uppercase; padding: 10px 8px 5px; }
.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: 7px; cursor: pointer;
  color: rgba(255,255,255,.55); font-size: 12.5px; font-weight: 400;
  margin-bottom: 1px; transition: background .15s, color .15s;
  position: relative;
}
.nav-item:hover { background: rgba(255,255,255,.07); color: rgba(255,255,255,.85); }
.nav-item.active { background: var(--gold); color: var(--navy-dark); font-weight: 600; }
.nav-item i { font-size: 16px; flex-shrink: 0; }
.nav-badge {
  margin-left: auto; font-size: 9px; font-weight: 600;
  padding: 2px 6px; border-radius: 20px;
  background: var(--red); color: #fff;
}
.nav-badge.green { background: var(--green); }

#sid-company {
  margin: 8px; border-radius: 8px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  padding: 10px 12px;
}
.sc-name { font-size: 12px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-nit { font-size: 10px; color: rgba(255,255,255,.35); margin-top: 2px; }
.sc-change {
  margin-top: 8px; font-size: 10px; color: var(--gold);
  cursor: pointer; display: flex; align-items: center; gap: 4px;
  opacity: .8; transition: opacity .15s;
}
.sc-change:hover { opacity: 1; }

/* ── Main area ── */
#main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

#topbar {
  height: var(--topbar-h); background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 20px;
  gap: 12px; flex-shrink: 0;
}
.tb-title { font-size: 15px; font-weight: 600; color: var(--text-1); }
.tb-sub { font-size: 11px; color: var(--text-3); margin-top: 1px; }
.tb-spacer { flex: 1; }
.tb-chip {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 500;
}
.chip-gold { background: var(--gold-pale); color: #7A5A00; border: 1px solid var(--gold-border); }
.chip-green { background: var(--green-bg); color: var(--green-text); }
.chip-blue { background: #EBF3FF; color: #1E4A82; }

#content { flex: 1; overflow-y: auto; padding: 18px 20px; background: var(--bg); }

/* ── Screens ── */
.screen { display: none; }
.screen.active { display: block; }

/* ──────────────────────────────────────────
   SHARED COMPONENTS
────────────────────────────────────────── */
.card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px;
  box-shadow: var(--shadow);
}
.card-title {
  font-size: 13px; font-weight: 600; color: var(--text-1);
  margin-bottom: 12px; display: flex; align-items: center; gap: 7px;
}
.card-title i { font-size: 16px; color: var(--gold); }
.card-title .ct-badge {
  margin-left: auto; font-size: 10px; font-weight: 500;
  padding: 2px 7px; border-radius: 4px;
}

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.mb-14 { margin-bottom: 14px; }
.mb-18 { margin-bottom: 18px; }

/* KPI Cards */
.kpi-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px 16px;
  box-shadow: var(--shadow); position: relative; overflow: hidden;
}
.kpi-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--gold);
}
.kpi-card.green::before { background: var(--green); }
.kpi-card.red::before { background: var(--red); }
.kpi-card.blue::before { background: var(--navy-light); }
.kpi-label { font-size: 10px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 7px; }
.kpi-value { font-size: 24px; font-weight: 700; color: var(--text-1); line-height: 1; font-family: var(--mono); }
.kpi-sub { font-size: 10px; color: var(--text-2); margin-top: 5px; }
.kpi-trend { font-size: 10px; margin-top: 4px; font-weight: 500; }
.kpi-trend.up { color: var(--green); }
.kpi-trend.down { color: var(--red); }
.kpi-trend.neutral { color: var(--text-3); }

/* Semáforo rows */
.sem-row {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 0; border-bottom: 1px solid var(--border-soft);
  font-size: 12px;
}
.sem-row:last-child { border: none; padding-bottom: 0; }
.sem-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: var(--green); }
.dot-red   { background: var(--red); }
.dot-amber { background: var(--amber); }
.dot-gray  { background: var(--text-3); }
.sem-label { flex: 1; color: var(--text-1); }
.sem-val { font-size: 11px; color: var(--text-2); font-family: var(--mono); padding: 1px 6px; background: var(--bg); border-radius: 4px; border: 1px solid var(--border); }
.sem-tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; flex-shrink: 0; }
.tag-ok   { background: var(--green-bg); color: var(--green-text); }
.tag-fail { background: var(--red-bg);   color: var(--red-text); }
.tag-warn { background: var(--amber-bg); color: var(--amber-text); }
.tag-info { background: #EBF3FF; color: #1E4A82; }

/* Alert / Trap box */
.alert-box {
  display: flex; align-items: flex-start; gap: 10px;
  border-radius: 7px; padding: 10px 12px; margin-bottom: 8px;
  font-size: 11.5px; line-height: 1.5;
}
.alert-box:last-child { margin-bottom: 0; }
.alert-box i { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.alert-trap  { background: var(--amber-bg); border: 1px solid var(--gold-border); color: var(--amber-text); }
.alert-info  { background: #EBF3FF; border: 1px solid #BDD6F5; color: #1E4A82; }
.alert-ok    { background: var(--green-bg); border: 1px solid #A3DEC8; color: var(--green-text); }
.alert-crit  { background: var(--red-bg); border: 1.5px solid var(--red); color: var(--red-text); }

/* Verdict box */
.verdict-box { border-radius: var(--radius); padding: 16px 18px; margin-bottom: 14px; border: 1px solid; }
.verdict-go   { background: var(--green-bg); border-color: #7ECFB0; }
.verdict-nogo { background: var(--red-bg);   border-color: #F0AAAA; }
.verdict-med  { background: var(--amber-bg); border-color: var(--gold-border); }
.verdict-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 4px; }
.verdict-go   .verdict-label { color: var(--green); }
.verdict-nogo .verdict-label { color: var(--red); }
.verdict-med  .verdict-label { color: var(--amber); }
.verdict-score { font-size: 36px; font-weight: 700; color: var(--text-1); line-height: 1; font-family: var(--mono); }
.verdict-score span { font-size: 16px; font-weight: 400; color: var(--text-2); }
.verdict-text  { font-size: 11px; color: var(--text-2); margin-top: 5px; line-height: 1.5; }

/* Section header */
.sec-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 14px;
}
.sec-header h2 { font-size: 14px; font-weight: 600; color: var(--text-1); }
.sec-header .sec-sub { font-size: 11px; color: var(--text-3); margin-top: 1px; }

/* Ley badge */
.ley-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600; padding: 5px 12px;
  border-radius: 20px; margin-bottom: 14px;
  background: #EBF3FF; color: #1E4A82; border: 1px solid #BDD6F5;
}

/* ──────────────────────────────────────────
   ANALYSIS ENGINE
────────────────────────────────────────── */
.upload-zone {
  border: 2px dashed var(--gold-border); border-radius: var(--radius);
  padding: 36px 20px; text-align: center; cursor: pointer;
  background: var(--gold-pale); transition: border-color .2s, background .2s;
}
.upload-zone:hover { border-color: var(--gold); background: #FDF8E8; }
.upload-zone i { font-size: 36px; color: var(--gold); display: block; margin-bottom: 10px; }
.upload-zone .uz-title { font-size: 14px; font-weight: 600; color: var(--text-1); }
.upload-zone .uz-sub { font-size: 11px; color: var(--text-2); margin-top: 5px; }
.upload-zone input[type=file] { display: none; }

.progress-container { margin-top: 18px; display: none; }
.progress-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-2); margin-bottom: 6px; font-weight: 500; }
.progress-track { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold-lt)); border-radius: 4px; transition: width .4s ease; width: 0%; }
.analysis-steps { margin-top: 12px; }
.astep { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-3); padding: 4px 0; }
.astep.done { color: var(--green); }
.astep.active { color: var(--text-1); font-weight: 500; }
.astep i { font-size: 14px; }

/* ──────────────────────────────────────────
   MATRIX TABLE
────────────────────────────────────────── */
.matrix-header {
  display: grid; grid-template-columns: 28px 1fr 80px 50px 50px 60px;
  gap: 8px; font-size: 10px; font-weight: 600; color: var(--text-3);
  text-transform: uppercase; letter-spacing: .05em;
  padding: 6px 8px 8px; border-bottom: 1px solid var(--border);
  margin-bottom: 2px;
}
.matrix-row {
  display: grid; grid-template-columns: 28px 1fr 80px 50px 50px 60px;
  gap: 8px; padding: 8px; border-radius: 6px;
  align-items: center; transition: background .15s;
  border-bottom: 1px solid var(--border-soft);
}
.matrix-row:last-child { border: none; }
.matrix-row:hover { background: var(--bg-panel); }
.matrix-row.critical { background: var(--red-bg) !important; }
.mx-id {
  width: 24px; height: 24px; border-radius: 5px;
  background: var(--bg); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: var(--navy);
}
.mx-title { font-size: 12px; color: var(--text-1); }
.mx-stars { display: flex; gap: 2px; }
.mx-star { width: 8px; height: 8px; border-radius: 2px; }
.star-fill  { background: var(--gold); }
.star-empty { background: var(--border); }
.mx-weight { font-size: 11px; color: var(--text-2); text-align: center; font-family: var(--mono); }
.mx-score  { font-size: 11px; font-weight: 600; text-align: center; font-family: var(--mono); }
.mx-contrib { font-size: 12px; font-weight: 700; text-align: right; font-family: var(--mono); }
.mx-crit-label { font-size: 9px; font-weight: 700; color: var(--red); display: block; }

/* ──────────────────────────────────────────
   RETENCOL TABLE
────────────────────────────────────────── */
.rc-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rc-table thead tr { border-bottom: 2px solid var(--border); }
.rc-table th { text-align: left; padding: 8px 10px; font-size: 10px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: .05em; }
.rc-table td { padding: 9px 10px; border-bottom: 1px solid var(--border-soft); color: var(--text-1); }
.rc-table tr:last-child td { border: none; }
.rc-table .total-row td { background: var(--navy-dark); color: #fff; font-weight: 700; border-radius: 0; }
.rc-table .total-row td:first-child { border-radius: 6px 0 0 6px; }
.rc-table .total-row td:last-child { border-radius: 0 6px 6px 0; }
.rc-mono { font-family: var(--mono); }

/* ──────────────────────────────────────────
   HORIZONTAL BAR CHART
────────────────────────────────────────── */
.hbar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.hbar-label { width: 110px; font-size: 11px; color: var(--text-2); text-align: right; flex-shrink: 0; }
.hbar-track { flex: 1; height: 10px; background: var(--bg); border-radius: 5px; overflow: visible; border: 1px solid var(--border); }
.hbar-fill  { height: 100%; border-radius: 5px; transition: width 1s ease; }
.hbar-val   { width: 60px; font-size: 11px; font-weight: 600; color: var(--text-1); font-family: var(--mono); }

/* ──────────────────────────────────────────
   BITACORA
────────────────────────────────────────── */
.bit-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border-soft); }
.bit-item:last-child { border: none; }
.bit-time { font-size: 10px; color: var(--text-3); white-space: nowrap; padding-top: 2px; font-family: var(--mono); width: 72px; flex-shrink: 0; }
.bit-line { display: flex; flex-direction: column; align-items: center; margin: 3px 0 0; }
.bit-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.bit-connector { width: 1px; flex: 1; background: var(--border); margin-top: 4px; min-height: 16px; }
.bit-body { flex: 1; }
.bit-title  { font-size: 12px; font-weight: 600; color: var(--text-1); }
.bit-detail { font-size: 11px; color: var(--text-2); margin-top: 2px; line-height: 1.45; }
.bit-tag { display: inline-block; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-top: 4px; text-transform: uppercase; letter-spacing: .05em; }

/* ──────────────────────────────────────────
   BUTTONS
────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 7px; font-size: 13px; font-weight: 600;
  cursor: pointer; border: none; font-family: var(--font);
  transition: background .15s, transform .1s;
}
.btn:active { transform: scale(.99); }
.btn-gold    { background: var(--gold); color: var(--navy-dark); }
.btn-gold:hover { background: var(--gold-lt); }
.btn-navy    { background: var(--navy); color: #fff; }
.btn-navy:hover { background: var(--navy-mid); }
.btn-ghost   { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--bg-panel); }
.btn-danger  { background: var(--red-bg); color: var(--red-text); border: 1px solid #F0AAAA; }
.btn-full    { width: 100%; justify-content: center; }

/* ──────────────────────────────────────────
   TERRITORIAL MAP PLACEHOLDER
────────────────────────────────────────── */
.map-placeholder {
  background: linear-gradient(135deg, #EBF3FF, #E3F5EE);
  border-radius: 8px; height: 180px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 1px solid var(--border); gap: 8px;
}
.map-placeholder i { font-size: 36px; color: var(--navy-light); }
.map-placeholder p { font-size: 12px; color: var(--text-2); text-align: center; }

/* ──────────────────────────────────────────
   EMPTY STATE
────────────────────────────────────────── */
.empty-state {
  text-align: center; padding: 40px 20px;
}
.empty-state i { font-size: 40px; color: var(--text-3); display: block; margin-bottom: 10px; }
.empty-state h3 { font-size: 14px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; }
.empty-state p { font-size: 12px; color: var(--text-3); max-width: 300px; margin: 0 auto 16px; line-height: 1.6; }

/* ──────────────────────────────────────────
   TOAST
────────────────────────────────────────── */
#toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  background: var(--navy-dark); color: #fff; border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px; padding: 12px 16px; font-size: 13px; font-weight: 500;
  display: flex; align-items: center; gap: 8px;
  box-shadow: var(--shadow-md);
  transform: translateY(80px); opacity: 0;
  transition: transform .3s ease, opacity .3s ease;
  max-width: 340px;
}
#toast.show { transform: translateY(0); opacity: 1; }
#toast i { font-size: 18px; flex-shrink: 0; }
#toast.toast-green { border-color: #A3DEC8; }
#toast.toast-green i { color: var(--green); }
#toast.toast-amber { border-color: var(--gold-border); }
#toast.toast-amber i { color: var(--gold-lt); }

/* ──────────────────────────────────────────
   PROCESO INDICATOR
────────────────────────────────────────── */
.proceso-indicator {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: var(--navy); border-radius: 8px;
  margin-bottom: 16px;
}
.pi-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
.pi-text { font-size: 12px; color: rgba(255,255,255,.8); }
.pi-name { font-weight: 600; color: #fff; }
.pi-spacer { flex: 1; }
.pi-score { font-size: 13px; font-weight: 700; color: var(--gold-lt); font-family: var(--mono); }

/* Responsive utilities */
@media (max-width: 900px) {
  .grid-4 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
  #sidebar { width: 56px; }
  .nav-item span, .nav-group, .sid-brand, .sid-version, .sc-name, .sc-nit, .sc-change { display: none; }
}
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════
     ONBOARDING
═══════════════════════════════════════════ -->
<div id="onboarding">
  <div class="ob-card">
    <div class="ob-logo">
      <div class="ob-shield"><i class="ti ti-shield-check"></i></div>
      <div>
        <div class="ob-brand">SIEL <span>PRO</span></div>
        <div class="ob-sub">SISTEMA INTELIGENTE DE EVALUACIÓN DE LICITACIONES</div>
      </div>
    </div>
    <div class="ob-title">Configura el perfil de tu empresa</div>
    <div class="ob-desc">Estos datos se usarán para cruzar con los pliegos y determinar la viabilidad de cada licitación. Solo los ingresas una vez.</div>

    <div class="ob-section-title">Identificación</div>
    <div class="ob-grid">
      <div class="ob-full">
        <div class="ob-label">Razón social</div>
        <input class="ob-input" id="ob-nombre" placeholder="Ej. Grupo Gemlsa SAS">
      </div>
      <div>
        <div class="ob-label">NIT</div>
        <input class="ob-input" id="ob-nit" placeholder="900257051-4">
      </div>
      <div>
        <div class="ob-label">Tamaño empresa</div>
        <input class="ob-input" id="ob-tamano" placeholder="Pequeña / Mediana / Grande">
      </div>
    </div>

    <div class="ob-section-title">Indicadores financieros (cifras en millones COP)</div>
    <div class="ob-grid">
      <div>
        <div class="ob-label">Índice de liquidez</div>
        <input class="ob-input" id="ob-liquidez" type="number" step="0.01" placeholder="6.55">
      </div>
      <div>
        <div class="ob-label">Endeudamiento (%)</div>
        <input class="ob-input" id="ob-endeudamiento" type="number" placeholder="17">
      </div>
      <div>
        <div class="ob-label">Capital de trabajo ($M)</div>
        <input class="ob-input" id="ob-capital" type="number" placeholder="961">
      </div>
      <div>
        <div class="ob-label">Patrimonio ($M)</div>
        <input class="ob-input" id="ob-patrimonio" type="number" placeholder="936">
      </div>
      <div>
        <div class="ob-label">Capacidad K ($M)</div>
        <input class="ob-input" id="ob-k" type="number" placeholder="1513">
      </div>
      <div>
        <div class="ob-label">Cobertura intereses</div>
        <input class="ob-input" id="ob-cobertura" type="number" placeholder="137">
      </div>
    </div>

    <div class="ob-section-title">Experiencia técnica</div>
    <div class="ob-grid">
      <div>
        <div class="ob-label">Exp. máxima contrato único ($M)</div>
        <input class="ob-input" id="ob-exp" type="number" placeholder="1000">
      </div>
      <div>
        <div class="ob-label">Códigos CIIU principales</div>
        <input class="ob-input" id="ob-ciiu" placeholder="2513, 3312, 4210, 4290">
      </div>
    </div>

    <button class="ob-btn" onclick="saveOnboarding()">
      <i class="ti ti-rocket"></i> Ingresar a SIEL PRO
    </button>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     APP SHELL
═══════════════════════════════════════════ -->
<div id="app">
  <!-- Sidebar -->
  <div id="sidebar">
    <div id="sid-header">
      <div class="sid-logo-row">
        <div class="sid-shield"><i class="ti ti-shield-check"></i></div>
        <div>
          <div class="sid-brand">SIEL <span>PRO</span></div>
          <div class="sid-version">v2.0 · ANÁLISIS LICITACIONES</div>
        </div>
      </div>
    </div>

    <div id="sid-nav">
      <div class="nav-group">Principal</div>
      <div class="nav-item active" onclick="nav('dashboard',this)">
        <i class="ti ti-layout-dashboard"></i><span>Panel ejecutivo</span>
      </div>
      <div class="nav-item" onclick="nav('analisis',this)">
        <i class="ti ti-brain"></i><span>Análisis inteligente</span>
        <span class="nav-badge green" id="nb-analisis" style="display:none">1</span>
      </div>

      <div class="nav-group">Evaluación</div>
      <div class="nav-item" onclick="nav('matriz',this)">
        <i class="ti ti-table"></i><span>Matriz 13 puntos</span>
      </div>
      <div class="nav-item" onclick="nav('revision',this)">
        <i class="ti ti-file-search"></i><span>Revisión SECOP II</span>
      </div>

      <div class="nav-group">Módulos</div>
      <div class="nav-item" onclick="nav('retencol',this)">
        <i class="ti ti-calculator"></i><span>RETENCOL fiscal</span>
      </div>
      <div class="nav-item" onclick="nav('territorial',this)">
        <i class="ti ti-map-pin"></i><span>Riesgo territorial</span>
      </div>
      <div class="nav-item" onclick="nav('bitacora',this)">
        <i class="ti ti-clock-record"></i><span>Bitácora</span>
      </div>

      <div class="nav-group">Salida</div>
      <div class="nav-item" onclick="nav('informe',this)">
        <i class="ti ti-file-export"></i><span>Informe ejecutivo</span>
      </div>
    </div>

    <div id="sid-company">
      <div class="sc-name" id="sc-name">—</div>
      <div class="sc-nit"  id="sc-nit">—</div>
      <div class="sc-change" onclick="resetOnboarding()">
        <i class="ti ti-refresh" style="font-size:12px"></i><span>Cambiar empresa</span>
      </div>
    </div>
  </div>

  <!-- Main -->
  <div id="main">
    <div id="topbar">
      <div>
        <div class="tb-title" id="tb-title">Panel ejecutivo</div>
        <div class="tb-sub"   id="tb-sub">Resumen del portafolio activo</div>
      </div>
      <div class="tb-spacer"></div>
      <span class="tb-chip chip-gold" id="chip-k"></span>
      <span class="tb-chip chip-green" id="chip-liq"></span>
      <span class="tb-chip chip-blue" id="chip-tipo"></span>
    </div>

    <div id="content">

      <!-- ══════════ SCREEN: DASHBOARD ══════════ -->
      <div class="screen active" id="screen-dashboard">
        <div id="dash-empty" class="card empty-state">
          <i class="ti ti-file-upload"></i>
          <h3>Sin proceso activo</h3>
          <p>Ve a <strong>Análisis inteligente</strong> para cargar un pliego de condiciones y generar el análisis completo.</p>
          <button class="btn btn-gold" onclick="nav('analisis',null)">
            <i class="ti ti-brain"></i> Ir al motor de análisis
          </button>
        </div>
        <div id="dash-content" style="display:none">
          <div class="proceso-indicator">
            <div class="pi-dot"></div>
            <div>
              <span class="pi-text">Proceso activo: </span>
              <span class="pi-name" id="pi-nombre">—</span>
            </div>
            <div class="pi-spacer"></div>
            <span class="pi-score" id="pi-score-top">—/100</span>
          </div>

          <div class="grid-4 mb-14">
            <div class="kpi-card green">
              <div class="kpi-label">Liquidez</div>
              <div class="kpi-value" id="kpi-liq">—</div>
              <div class="kpi-sub">Requerida ≥ 1.5</div>
              <div class="kpi-trend up" id="kpi-liq-t">✓ Cumple holgadamente</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Endeudamiento</div>
              <div class="kpi-value" id="kpi-end">—</div>
              <div class="kpi-sub">Requerido ≤ 70%</div>
              <div class="kpi-trend up" id="kpi-end-t">✓ Muy por debajo</div>
            </div>
            <div class="kpi-card green">
              <div class="kpi-label">Capital de trabajo</div>
              <div class="kpi-value" id="kpi-cap">—</div>
              <div class="kpi-sub">Disponible vs. proceso</div>
              <div class="kpi-trend up" id="kpi-cap-t">✓ Suficiente</div>
            </div>
            <div class="kpi-card blue">
              <div class="kpi-label">Capacidad K</div>
              <div class="kpi-value" id="kpi-k2">—</div>
              <div class="kpi-sub">Disponible para contratar</div>
              <div class="kpi-trend neutral" id="kpi-k2-t">Margen disponible</div>
            </div>
          </div>

          <div class="grid-2 mb-14">
            <div class="card">
              <div class="card-title"><i class="ti ti-chart-pie"></i>Semáforo del proceso</div>
              <div id="semaforo-proceso"></div>
            </div>
            <div class="card">
              <div class="card-title"><i class="ti ti-building-bank"></i>Indicadores CGI vs. Pliego</div>
              <div id="indicadores-cruce"></div>
            </div>
          </div>

          <div class="card mb-14">
            <div class="card-title">
              <i class="ti ti-alert-triangle"></i>Trampas detectadas en el pliego
              <span class="ct-badge tag-warn" id="trap-count">0 alertas</span>
            </div>
            <div id="trampas-container"></div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: ANÁLISIS ══════════ -->
      <div class="screen" id="screen-analisis">
        <div class="grid-2" style="gap:18px">
          <div>
            <div class="card mb-14">
              <div class="card-title"><i class="ti ti-file-upload"></i>Cargar pliego de condiciones</div>
              <label class="upload-zone" id="upload-zone">
                <input type="file" id="file-input" accept=".pdf,.docx" onchange="handleFileSelect(this)">
                <i class="ti ti-cloud-upload"></i>
                <div class="uz-title">Arrastra el PDF aquí o haz clic</div>
                <div class="uz-sub">Pliego SECOP II · PDF, DOCX · Máx. 25 MB</div>
              </label>

              <div class="progress-container" id="progress-container">
                <div class="progress-label">
                  <span id="progress-step">Iniciando análisis…</span>
                  <span id="progress-pct">0%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" id="progress-fill"></div>
                </div>
                <div class="analysis-steps" id="asteps">
                  <div class="astep" id="as1"><i class="ti ti-circle"></i> Leyendo estructura del documento</div>
                  <div class="astep" id="as2"><i class="ti ti-circle"></i> Detectando normatividad aplicable</div>
                  <div class="astep" id="as3"><i class="ti ti-circle"></i> Extrayendo requisitos habilitantes</div>
                  <div class="astep" id="as4"><i class="ti ti-circle"></i> Cruzando datos con perfil CGI</div>
                  <div class="astep" id="as5"><i class="ti ti-circle"></i> Calculando matriz de riesgo</div>
                  <div class="astep" id="as6"><i class="ti ti-circle"></i> Detectando trampas contractuales</div>
                  <div class="astep" id="as7"><i class="ti ti-circle"></i> Calculando retenciones RETENCOL</div>
                  <div class="astep" id="as8"><i class="ti ti-circle"></i> Generando veredicto GO / NO GO</div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-title"><i class="ti ti-info-circle"></i>Sobre el motor de análisis</div>
              <div class="alert-box alert-info">
                <i class="ti ti-cpu"></i>
                <div>El motor simula el procesamiento de un PDF real. En producción, este flujo conecta con la <strong>Claude API</strong> para extraer texto, identificar normatividad y cruzar datos con el perfil de la empresa.</div>
              </div>
              <div class="alert-box alert-ok" style="margin-top:8px;">
                <i class="ti ti-check"></i>
                <div>El análisis tarda entre <strong>15 y 45 segundos</strong> según el tamaño del pliego. Todos los módulos se poblarán automáticamente al finalizar.</div>
              </div>
            </div>
          </div>

          <div>
            <div class="card">
              <div class="card-title"><i class="ti ti-history"></i>Historial de procesos analizados</div>
              <div id="historial-list">
                <div class="empty-state" style="padding:20px">
                  <i class="ti ti-folders" style="font-size:28px"></i>
                  <h3>Sin historial</h3>
                  <p>Los procesos analizados aparecerán aquí.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: MATRIZ ══════════ -->
      <div class="screen" id="screen-matriz">
        <div id="mat-empty" class="card empty-state">
          <i class="ti ti-table"></i>
          <h3>Matriz pendiente</h3>
          <p>Carga un pliego en el módulo de Análisis inteligente para poblar la matriz.</p>
          <button class="btn btn-gold" onclick="nav('analisis',null)"><i class="ti ti-brain"></i> Cargar pliego</button>
        </div>
        <div id="mat-content" style="display:none">
          <div class="grid-2 mb-14">
            <div id="verdict-box-mat"></div>
            <div class="card">
              <div class="card-title"><i class="ti ti-alert-triangle"></i>Alertas de riesgo</div>
              <div id="mat-alerts"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-title">
              <i class="ti ti-table"></i>Matriz de evaluación — 13 componentes
              <span class="ct-badge" id="mat-total-badge" style="margin-left:auto;background:var(--gold-pale);color:#7A5A00;border:1px solid var(--gold-border)"></span>
            </div>
            <div id="crit-alert" style="display:none" class="alert-box alert-crit mb-14">
              <i class="ti ti-exclamation-circle"></i>
              <div><strong>ALERTA CRÍTICA — RIESGO AUTOMÁTICO:</strong> Capacidad Financiera (ID 4) calificada &lt; 3. El sistema eleva el riesgo a CRÍTICO de forma automática conforme a la regla de oro.</div>
            </div>
            <div class="matrix-header">
              <span>#</span><span>Componente</span><span style="text-align:center">Calificación</span>
              <span style="text-align:center">Peso</span><span style="text-align:center">Score</span><span style="text-align:right">Contrib.</span>
            </div>
            <div id="matrix-body"></div>
            <div style="display:flex;justify-content:flex-end;margin-top:10px;padding-top:10px;border-top:2px solid var(--border);">
              <span style="font-size:12px;color:var(--text-2);margin-right:12px;align-self:center">Puntaje total ponderado:</span>
              <span id="mat-total-val" style="font-size:22px;font-weight:700;color:var(--navy);font-family:var(--mono)">—</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: REVISIÓN SECOP II ══════════ -->
      <div class="screen" id="screen-revision">
        <div id="rev-empty" class="card empty-state">
          <i class="ti ti-file-search"></i>
          <h3>Revisión pendiente</h3>
          <p>Carga un pliego para ejecutar la revisión documental.</p>
          <button class="btn btn-gold" onclick="nav('analisis',null)"><i class="ti ti-brain"></i> Cargar pliego</button>
        </div>
        <div id="rev-content" style="display:none">
          <div id="ley-badge-container"></div>
          <div class="grid-3 mb-14">
            <div class="card">
              <div class="card-title"><i class="ti ti-balance"></i>Revisión jurídica</div>
              <div id="rev-juridica"></div>
            </div>
            <div class="card">
              <div class="card-title"><i class="ti ti-coin"></i>Revisión financiera</div>
              <div id="rev-financiera"></div>
            </div>
            <div class="card">
              <div class="card-title"><i class="ti ti-tools"></i>Revisión técnica</div>
              <div id="rev-tecnica"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-title"><i class="ti ti-alert-octagon"></i>Observaciones finales y trampas contractuales</div>
            <div id="rev-trampas"></div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: RETENCOL ══════════ -->
      <div class="screen" id="screen-retencol">
        <div id="rc-empty" class="card empty-state">
          <i class="ti ti-calculator"></i>
          <h3>RETENCOL pendiente</h3>
          <p>Carga un pliego para calcular las retenciones automáticamente.</p>
          <button class="btn btn-gold" onclick="nav('analisis',null)"><i class="ti ti-brain"></i> Cargar pliego</button>
        </div>
        <div id="rc-content" style="display:none">
          <div class="card mb-14">
            <div class="card-title"><i class="ti ti-calculator"></i>RETENCOL — Módulo fiscal automatizado</div>
            <div id="rc-header-info" style="font-size:11px;color:var(--text-2);margin-bottom:14px;padding:8px 12px;background:var(--bg);border-radius:6px;border:1px solid var(--border)"></div>
            <table class="rc-table">
              <thead>
                <tr>
                  <th>Tributo</th><th>Base gravable</th><th>Tarifa</th>
                  <th class="rc-mono">Valor ($)</th><th>Norma</th>
                </tr>
              </thead>
              <tbody id="rc-tbody"></tbody>
            </table>
          </div>
          <div class="card">
            <div class="card-title"><i class="ti ti-chart-bar"></i>Impacto en rentabilidad del proceso</div>
            <div id="rc-chart"></div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: TERRITORIAL ══════════ -->
      <div class="screen" id="screen-territorial">
        <div id="ter-empty" class="card empty-state">
          <i class="ti ti-map-pin"></i>
          <h3>Sin proceso activo</h3>
          <p>Carga un pliego para analizar el riesgo territorial.</p>
          <button class="btn btn-gold" onclick="nav('analisis',null)"><i class="ti ti-brain"></i> Cargar pliego</button>
        </div>
        <div id="ter-content" style="display:none">
          <div class="grid-2 mb-14">
            <div class="card">
              <div class="card-title"><i class="ti ti-map-pin"></i>Georreferenciación</div>
              <div class="map-placeholder">
                <i class="ti ti-map"></i>
                <p id="ter-mapa-label">—</p>
              </div>
              <div id="ter-geo" style="margin-top:12px"></div>
            </div>
            <div class="card">
              <div class="card-title"><i class="ti ti-currency-dollar"></i>APU — Precios unitarios de referencia</div>
              <div id="ter-apu"></div>
              <div style="margin-top:10px;font-size:10px;color:var(--text-3)">
                Base histórica: 47 contratos ejecutados · Actualizado jun/2025
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-title"><i class="ti ti-alert-triangle"></i>Riesgos territoriales identificados</div>
            <div id="ter-riesgos"></div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: BITÁCORA ══════════ -->
      <div class="screen" id="screen-bitacora">
        <div class="card">
          <div class="card-title"><i class="ti ti-clock-record"></i>Bitácora técnica de evaluación
            <span class="ct-badge tag-info" style="margin-left:auto">Formato Bitácora/023</span>
          </div>
          <div id="bitacora-list">
            <div class="empty-state" style="padding:24px">
              <i class="ti ti-notebook"></i>
              <h3>Bitácora vacía</h3>
              <p>Los eventos se registrarán cronológicamente al ejecutar el análisis.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════ SCREEN: INFORME ══════════ -->
      <div class="screen" id="screen-informe">
        <div id="inf-empty" class="card empty-state">
          <i class="ti ti-file-export"></i>
          <h3>Sin datos para el informe</h3>
          <p>Carga y analiza un pliego para generar el informe ejecutivo.</p>
          <button class="btn btn-gold" onclick="nav('analisis',null)"><i class="ti ti-brain"></i> Cargar pliego</button>
        </div>
        <div id="inf-content" style="display:none">
          <div id="inf-verdict" style="margin-bottom:14px"></div>
          <div class="card mb-14">
            <div class="card-title"><i class="ti ti-file-export"></i>Composición del informe ejecutivo</div>
            <div id="inf-modulos"></div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-gold btn-full" onclick="generarInformeTexto()">
              <i class="ti ti-printer"></i> Generar texto del informe ejecutivo
            </button>
            <button class="btn btn-navy" style="flex-shrink:0" onclick="showToast('Función disponible con backend conectado','amber')">
              <i class="ti ti-download"></i> PDF
            </button>
          </div>
          <div id="inf-texto" style="display:none;margin-top:16px;" class="card">
            <div class="card-title"><i class="ti ti-file-text"></i>Texto del informe</div>
            <pre id="inf-texto-pre" style="font-family:var(--mono);font-size:11px;color:var(--text-2);white-space:pre-wrap;line-height:1.7"></pre>
          </div>
        </div>
      </div>

    </div><!-- /content -->
  </div><!-- /main -->
</div><!-- /app -->

<!-- Toast -->
<div id="toast"><i class="ti ti-check-circle"></i><span id="toast-msg"></span></div>

<!-- ═══════════════════════════════════════════
     JAVASCRIPT
═══════════════════════════════════════════ -->
<script>
/* ─── Estado global ─── */
let empresa = {};
let procesoActivo = null;
let bitacora = [];
const historial = [];

/* ─── Onboarding ─── */
function saveOnboarding() {
  const nombre = document.getElementById('ob-nombre').value.trim() || 'Mi Empresa SAS';
  const nit    = document.getElementById('ob-nit').value.trim() || '000000000-0';
  empresa = {
    nombre,
    nit,
    tamano:       document.getElementById('ob-tamano').value || 'Pequeña',
    liquidez:     parseFloat(document.getElementById('ob-liquidez').value) || 6.55,
    endeudamiento:parseFloat(document.getElementById('ob-endeudamiento').value) || 17,
    capital:      parseFloat(document.getElementById('ob-capital').value) || 961,
    patrimonio:   parseFloat(document.getElementById('ob-patrimonio').value) || 936,
    k:            parseFloat(document.getElementById('ob-k').value) || 1513,
    cobertura:    parseFloat(document.getElementById('ob-cobertura').value) || 137,
    expMax:       parseFloat(document.getElementById('ob-exp').value) || 1000,
    ciiu:         document.getElementById('ob-ciiu').value || '2513, 3312, 4210, 4290',
  };
  localStorage.setItem('siel_empresa', JSON.stringify(empresa));
  applyEmpresa();
  document.getElementById('onboarding').classList.add('hidden');
  logBitacora('Perfil cargado', `Empresa: ${nombre} · NIT: ${nit}`, 'green');
  showToast('¡Bienvenido a SIEL PRO, ' + nombre + '!', 'green');
}

function resetOnboarding() {
  localStorage.removeItem('siel_empresa');
  localStorage.removeItem('siel_proceso');
  document.getElementById('onboarding').classList.remove('hidden');
}

function applyEmpresa() {
  document.getElementById('sc-name').textContent = empresa.nombre;
  document.getElementById('sc-nit').textContent  = `NIT ${empresa.nit} · ${empresa.tamano}`;
  document.getElementById('chip-k').innerHTML    = `<i class="ti ti-shield" style="font-size:11px"></i> K: $${fmt(empresa.k)}M`;
  document.getElementById('chip-liq').innerHTML  = `<i class="ti ti-check" style="font-size:11px"></i> Liquidez ${empresa.liquidez}`;
  document.getElementById('chip-tipo').innerHTML = empresa.tamano;
  document.getElementById('kpi-liq').textContent = empresa.liquidez;
  document.getElementById('kpi-end').textContent = empresa.endeudamiento + '%';
  document.getElementById('kpi-cap').textContent = '$' + fmt(empresa.capital) + 'M';
  document.getElementById('kpi-k2').textContent  = '$' + fmt(empresa.k) + 'M';
}

/* ─── Nav ─── */
const navMeta = {
  dashboard:  { title: 'Panel ejecutivo',          sub: 'Resumen del portafolio y KPIs activos' },
  analisis:   { title: 'Análisis inteligente',      sub: 'Motor de evaluación de pliegos SECOP II' },
  matriz:     { title: 'Matriz de 13 puntos',       sub: 'Evaluación ponderada con contribución' },
  revision:   { title: 'Revisión SECOP II',         sub: 'Análisis documental: jurídico, financiero, técnico' },
  retencol:   { title: 'RETENCOL — Módulo fiscal',  sub: 'Retenciones, ICA y estampillas' },
  territorial:{ title: 'Riesgo territorial y APU',  sub: 'Georreferenciación y precios unitarios' },
  bitacora:   { title: 'Bitácora de evaluación',    sub: 'Trazabilidad cronológica · Formato Bitácora/023' },
  informe:    { title: 'Informe ejecutivo',          sub: 'Entregable formal GO / NO GO' },
};

function nav(id, el) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('screen-' + id)?.classList.add('active');
  if (el) el.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.getAttribute('onclick')?.includes("'"+id+"'")) n.classList.add('active');
    });
  }
  const m = navMeta[id] || {};
  document.getElementById('tb-title').textContent = m.title || id;
  document.getElementById('tb-sub').textContent   = m.sub || '';
}

/* ─── Helpers ─── */
function fmt(n) {
  if (n === undefined || n === null) return '—';
  if (n >= 1000) return (n/1000).toFixed(1).replace('.0','') + ',000';
  return Math.round(n).toLocaleString('es-CO');
}

function semRow(dot, label, val, tag, tagClass) {
  return `<div class="sem-row">
    <div class="sem-dot dot-${dot}"></div>
    <span class="sem-label">${label}</span>
    ${val ? `<span class="sem-val">${val}</span>` : ''}
    <span class="sem-tag ${tagClass}">${tag}</span>
  </div>`;
}

function alertBox(tipo, icon, html) {
  return `<div class="alert-box alert-${tipo}"><i class="ti ti-${icon}"></i><div>${html}</div></div>`;
}

function showToast(msg, type = 'green') {
  const t = document.getElementById('toast');
  const ic = { green: 'check-circle', amber: 'alert-circle', red: 'x-circle' };
  t.className = `toast-${type}`;
  t.querySelector('i').className = `ti ti-${ic[type]||'check-circle'}`;
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ─── Bitácora ─── */
function logBitacora(titulo, detalle, color = 'green', tag = '') {
  const now = new Date();
  const time = now.toLocaleDateString('es-CO',{day:'2-digit',month:'2-digit'}) +
               ' ' + now.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
  bitacora.push({ time, titulo, detalle, color, tag });
  renderBitacora();
}

function renderBitacora() {
  const c = document.getElementById('bitacora-list');
  if (!bitacora.length) return;
  const colorMap = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)', blue: 'var(--navy-light)' };
  const tagMap   = { green: 'tag-ok', amber: 'tag-warn', red: 'tag-fail', blue: 'tag-info' };
  c.innerHTML = bitacora.slice().reverse().map((b, i) => `
    <div class="bit-item">
      <div class="bit-time">${b.time}</div>
      <div class="bit-line">
        <div class="bit-dot" style="background:${colorMap[b.color]||'var(--green)'}"></div>
        ${i < bitacora.length-1 ? '<div class="bit-connector"></div>' : ''}
      </div>
      <div class="bit-body">
        <div class="bit-title">${b.titulo}</div>
        <div class="bit-detail">${b.detalle}</div>
        ${b.tag ? `<span class="bit-tag ${tagMap[b.color]||'tag-ok'}">${b.tag}</span>` : ''}
      </div>
    </div>`).join('');
}

/* ─── Simulación de análisis ─── */
function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  startAnalysis(file.name);
}

function startAnalysis(filename) {
  document.getElementById('progress-container').style.display = 'block';
  document.getElementById('upload-zone').style.opacity = '0.5';
  document.getElementById('upload-zone').style.pointerEvents = 'none';
  logBitacora('Documento recibido', `Archivo: ${filename} · Iniciando análisis…`, 'blue', 'INICIO');

  const steps = [
    { id:'as1', pct:12, label:'Leyendo estructura del documento…', done:'Estructura identificada: 47 páginas, 3 secciones principales' },
    { id:'as2', pct:24, label:'Detectando normatividad…', done:'Marco jurídico: Ley 80/93 + Ley 1150/07 + Dec. 1082/15' },
    { id:'as3', pct:38, label:'Extrayendo requisitos habilitantes…', done:'Habilitantes extraídos: jurídicos (4), financieros (3), técnicos (5)' },
    { id:'as4', pct:52, label:'Cruzando datos con perfil empresa…', done:'Cruce completado: 11/13 condiciones favorables' },
    { id:'as5', pct:65, label:'Calculando matriz de riesgo…', done:'Matriz calculada: puntaje ponderado 81.4/100' },
    { id:'as6', pct:78, label:'Detectando trampas contractuales…', done:'3 alertas de trampa detectadas en cláusulas 8.3, 14.2 y 22' },
    { id:'as7', pct:90, label:'Calculando RETENCOL…', done:'Retenciones calculadas: $58.5M (7.32%) sobre $800M' },
    { id:'as8', pct:100, label:'Generando veredicto…', done:'Veredicto: GO — Puntaje 81.4/100 · Riesgo medio-bajo' },
  ];

  let idx = 0;
  function runStep() {
    if (idx >= steps.length) {
      finishAnalysis(filename);
      return;
    }
    const s = steps[idx];
    const el = document.getElementById(s.id);
    el.className = 'astep active';
    el.innerHTML = `<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> ${s.label}`;
    document.getElementById('progress-step').textContent = s.label;
    document.getElementById('progress-pct').textContent  = s.pct + '%';
    document.getElementById('progress-fill').style.width = s.pct + '%';

    setTimeout(() => {
      el.className = 'astep done';
      el.innerHTML = `<i class="ti ti-circle-check"></i> ${s.done}`;
      logBitacora(s.done.split(':')[0], s.done, 'green');
      idx++;
      setTimeout(runStep, 600);
    }, 900 + Math.random() * 400);
  }
  runStep();
}

/* ─── Datos del proceso simulado ─── */
const procesoSimulado = {
  id: 'LP-2025-014',
  entidad: 'Municipio de Medellín — Secretaría de Infraestructura',
  objeto: 'Construcción y mantenimiento de estructuras metálicas — Parque Industrial Sur',
  valor: 800,
  municipio: 'Medellín',
  departamento: 'Antioquia',
  marco: 'Ley 80/93 + Ley 1150/07 + Dec. 1082/15',
  plazo: '12 meses',
  puntuacion: 81.4,
  veredicto: 'GO',
  matrizData: [
    { id:1, title:'Información general del proceso',   score:4, weight:3  },
    { id:2, title:'Compatibilidad empresarial',         score:5, weight:7  },
    { id:3, title:'Experiencia requerida',              score:4, weight:12 },
    { id:4, title:'Capacidad financiera',               score:5, weight:10 },
    { id:5, title:'Capacidad organizacional',           score:4, weight:6  },
    { id:6, title:'Personal mínimo exigido',            score:4, weight:7  },
    { id:7, title:'Certificaciones y habilitantes',     score:5, weight:8  },
    { id:8, title:'Riesgo jurídico y contractual',      score:3, weight:10 },
    { id:9, title:'Riesgo territorial y logístico',     score:4, weight:7  },
    { id:10,title:'Costos, APU y rentabilidad',         score:4, weight:12 },
    { id:11,title:'Impuestos y tributos (RETENCOL)',    score:4, weight:5  },
    { id:12,title:'Factores de puntuación',             score:4, weight:8  },
    { id:13,title:'Viabilidad integral GO / NO GO',     score:4, weight:5  },
  ],
  retenciones: [
    { tributo:'Retención en la fuente', tarifa:'2%',    valor:16000000, norma:'Art. 392 ET' },
    { tributo:'Retención de IVA',       tarifa:'15%×IVA', valor:22800000, norma:'Art. 437-1 ET' },
    { tributo:'ICA Medellín (obras)',   tarifa:'9.66‰', valor:7728000,  norma:'Acdo. 67/2017 Medellín' },
    { tributo:'Estampilla Pro-Universidad', tarifa:'1%', valor:8000000, norma:'Ord. Dpto. Antioquia' },
    { tributo:'Estampilla Pro-Hospital',   tarifa:'0.5%',valor:4000000, norma:'Ord. Dpto. Antioquia' },
  ],
  trampas: [
    { emoji:'⚠️', titulo:'Garantía separada material / mano de obra', desc:'El fabricante garantiza el producto, NO la instalación (Cláusula 8.3). Exija garantía unificada antes de firmar.' },
    { emoji:'⚠️', titulo:'Renovación automática sin notificación',    desc:'Cláusula 14.2 permite renovar el contrato cambiando condiciones sin aviso previo. Solicite supresión o aviso mínimo 30 días.' },
    { emoji:'⚠️', titulo:'Exclusividad implícita durante ejecución', desc:'Art. 22 restringe trabajo con entidades similares. Evalúe impacto en cartera de proyectos activos de CGI.' },
  ],
};

function finishAnalysis(filename) {
  procesoActivo = { ...procesoSimulado };
  localStorage.setItem('siel_proceso', JSON.stringify(procesoActivo));
  historial.push({ id: procesoActivo.id, entidad: procesoActivo.entidad, score: procesoActivo.puntuacion, fecha: new Date().toLocaleDateString('es-CO') });

  /* Poblar todos los módulos */
  populateDashboard();
  populateMatriz();
  populateRevision();
  populateRetencol();
  populateTerritorial();
  populateInforme();
  renderHistorial();

  document.getElementById('nb-analisis').style.display = 'inline-flex';
  logBitacora('Análisis completado', `Proceso ${procesoActivo.id} · Veredicto: ${procesoActivo.veredicto} · Score: ${procesoActivo.puntuacion}/100`, 'green', 'VEREDICTO');
  showToast('Análisis completado — Veredicto: GO · ' + procesoActivo.puntuacion + '/100', 'green');
  setTimeout(() => nav('dashboard', null), 600);
}

/* ─── Poblar Dashboard ─── */
function populateDashboard() {
  const p = procesoActivo;
  document.getElementById('dash-empty').style.display   = 'none';
  document.getElementById('dash-content').style.display = 'block';
  document.getElementById('pi-nombre').textContent    = `${p.id} — ${p.entidad}`;
  document.getElementById('pi-score-top').textContent = p.puntuacion + '/100';

  /* Semáforo proceso */
  const sem = [
    { dot:'green', label:'Compatibilidad CIIU',        val: empresa.ciiu?.split(',')[0] || '2513', tag:'Cumple',     cls:'tag-ok'   },
    { dot:'green', label:'Liquidez vs. requerida',     val: empresa.liquidez,                      tag:'Cumple',     cls:'tag-ok'   },
    { dot:'green', label:'Endeudamiento vs. límite',   val: empresa.endeudamiento+'%',             tag:'Cumple',     cls:'tag-ok'   },
    { dot:'amber', label:'Experiencia máx. contrato',  val: '$'+fmt(empresa.expMax)+'M',           tag:'Al límite',  cls:'tag-warn' },
    { dot:'green', label:'K disponible vs. proceso',   val: '$'+fmt(empresa.k)+'M',                tag:'Suficiente', cls:'tag-ok'   },
    { dot:'red',   label:'Seriedad oferta (10% CV)',   val: '$'+fmt(p.valor*0.1)+'M',              tag:'Verificar',  cls:'tag-warn' },
  ];
  document.getElementById('semaforo-proceso').innerHTML =
    sem.map(r => semRow(r.dot, r.label, r.val, r.tag, r.cls)).join('');

  /* Indicadores cruce */
  const ind = [
    { dot:'green', label:'Liquidez CGI',        val: empresa.liquidez,                 tag: empresa.liquidez >= 1.5 ? 'Cumple':'No cumple', cls: empresa.liquidez >= 1.5 ? 'tag-ok':'tag-fail' },
    { dot:'green', label:'Endeudam. CGI',       val: empresa.endeudamiento+'%',        tag:'Cumple',  cls:'tag-ok' },
    { dot:'green', label:'Cap. trabajo CGI',    val: '$'+fmt(empresa.capital)+'M',     tag:'Cumple',  cls:'tag-ok' },
    { dot:'green', label:'Patrimonio CGI',      val: '$'+fmt(empresa.patrimonio)+'M',  tag: empresa.patrimonio >= 900 ? 'Cumple':'Revisar', cls: empresa.patrimonio >= 900 ? 'tag-ok':'tag-warn' },
    { dot:'green', label:'K vs. valor proceso', val: '$'+fmt(empresa.k)+'M',           tag:'Holgado', cls:'tag-ok' },
  ];
  document.getElementById('indicadores-cruce').innerHTML =
    ind.map(r => semRow(r.dot, r.label, r.val, r.tag, r.cls)).join('');

  /* Trampas */
  document.getElementById('trap-count').textContent = p.trampas.length + ' alertas';
  document.getElementById('trampas-container').innerHTML =
    p.trampas.map(t => alertBox('trap', 'alert-octagon',
      `<strong>${t.emoji} ${t.titulo}</strong> — ${t.desc}`)).join('');
}

/* ─── Poblar Matriz ─── */
function populateMatriz() {
  const p = procesoActivo;
  document.getElementById('mat-empty').style.display   = 'none';
  document.getElementById('mat-content').style.display = 'block';

  let total = 0;
  let hasCrit = false;
  const rows = p.matrizData.map(r => {
    const contrib = +((r.score / 5) * r.weight).toFixed(1);
    total += contrib;
    const isCrit = r.id === 4 && r.score < 3;
    if (isCrit) hasCrit = true;
    const stars = [1,2,3,4,5].map(n =>
      `<div class="mx-star ${n<=r.score?'star-fill':'star-empty'}"></div>`).join('');
    const contribColor = contrib >= r.weight*0.8 ? 'var(--green)' : contrib >= r.weight*0.5 ? 'var(--amber)' : 'var(--red)';
    return `<div class="matrix-row ${isCrit?'critical':''}">
      <div class="mx-id">${r.id}</div>
      <div class="mx-title">${r.title}${isCrit?'<br><span class="mx-crit-label">⚠ CRÍTICO</span>':''}</div>
      <div class="mx-stars">${stars}</div>
      <div class="mx-weight">${r.weight}%</div>
      <div class="mx-score">${r.score}/5</div>
      <div class="mx-contrib" style="color:${contribColor}">${contrib}</div>
    </div>`;
  });
  document.getElementById('matrix-body').innerHTML = rows.join('');
  document.getElementById('mat-total-val').textContent = total.toFixed(1);
  document.getElementById('mat-total-badge').textContent = total.toFixed(1) + '/100';

  const vBox = total >= 75 ? 'go' : total >= 55 ? 'med' : 'nogo';
  const vLabel = total >= 75 ? 'GO — PARTICIPAR' : total >= 55 ? 'REVISIÓN — DECISIÓN GERENCIAL' : 'NO GO — NO PARTICIPAR';
  document.getElementById('verdict-box-mat').innerHTML = `
    <div class="verdict-box verdict-${vBox}">
      <div class="verdict-label">${vLabel}</div>
      <div class="verdict-score">${total.toFixed(1)}<span> /100</span></div>
      <div class="verdict-text">Riesgo ${total>=75?'medio-bajo':total>=55?'medio':'alto'} · Marco: ${p.marco}</div>
    </div>`;

  document.getElementById('crit-alert').style.display = hasCrit ? 'flex' : 'none';
  document.getElementById('mat-alerts').innerHTML = p.trampas.map(t =>
    alertBox('trap', 'alert-octagon', `<strong>${t.emoji} ${t.titulo}</strong><br>${t.desc}`)).join('');
}

/* ─── Poblar Revisión SECOP II ─── */
function populateRevision() {
  const p = procesoActivo;
  document.getElementById('rev-empty').style.display   = 'none';
  document.getElementById('rev-content').style.display = 'block';
  document.getElementById('ley-badge-container').innerHTML =
    `<div class="ley-badge"><i class="ti ti-gavel"></i>Marco jurídico detectado: ${p.marco}</div>`;

  const juridica = [
    { dot:'green', label:'RUP vigente',              tag:'OK',        cls:'tag-ok' },
    { dot:'green', label:'Objeto compatible CIIU',   tag:'OK',        cls:'tag-ok' },
    { dot:'amber', label:'Cláusula RC ilimitada',    tag:'Negociar',  cls:'tag-warn' },
    { dot:'green', label:'Plazo de pago: 30 días',   tag:'Aceptable', cls:'tag-ok' },
    { dot:'amber', label:'Seriedad oferta 10% CV',   tag:'Verificar', cls:'tag-warn' },
    { dot:'green', label:'Garantía cumplimiento 30%',tag:'Estándar',  cls:'tag-ok' },
  ];
  document.getElementById('rev-juridica').innerHTML =
    juridica.map(r => semRow(r.dot, r.label, '', r.tag, r.cls)).join('');

  const financiera = [
    { dot:'green', label:'Liquidez exigida ≥ 1.5',    val: empresa.liquidez,        tag:'Cumple', cls:'tag-ok' },
    { dot:'green', label:'Endeudam. exigido ≤ 70%',   val: empresa.endeudamiento+'%', tag:'Cumple',cls:'tag-ok' },
    { dot:'green', label:'Cap. trabajo > $200M',       val: '$'+fmt(empresa.capital)+'M', tag:'Cumple', cls:'tag-ok' },
    { dot: empresa.patrimonio>=900?'green':'amber', label:'Patrimonio > $900M', val: '$'+fmt(empresa.patrimonio)+'M',
      tag: empresa.patrimonio>=900?'Cumple':'Justo', cls: empresa.patrimonio>=900?'tag-ok':'tag-warn' },
    { dot:'green', label:'K > presupuesto proceso',    val: '$'+fmt(empresa.k)+'M',  tag:'Holgado', cls:'tag-ok' },
  ];
  document.getElementById('rev-financiera').innerHTML =
    financiera.map(r => semRow(r.dot, r.label, r.val, r.tag, r.cls)).join('');

  const tecnica = [
    { dot:'green', label:'Exp. específica acreditable',       tag:'Cumple',     cls:'tag-ok' },
    { dot: empresa.expMax>=p.valor?'green':'amber', label:`Exp. > $${fmt(p.valor)}M`,
      tag: empresa.expMax>=p.valor?'Cumple':'Revisar', cls: empresa.expMax>=p.valor?'tag-ok':'tag-warn' },
    { dot:'green', label:'CIIU ' + (empresa.ciiu?.split(',')[0]||'2513'),tag:'Compatible',cls:'tag-ok' },
    { dot:'green', label:'Personal disponible',               tag:'OK',         cls:'tag-ok' },
    { dot:'green', label:'SST / Cert. trabajo en alturas',    tag:'Vigente',    cls:'tag-ok' },
    { dot:'green', label:'Equipo técnico mínimo',             tag:'Cumple',     cls:'tag-ok' },
  ];
  document.getElementById('rev-tecnica').innerHTML =
    tecnica.map(r => semRow(r.dot, r.label, '', r.tag, r.cls)).join('');

  document.getElementById('rev-trampas').innerHTML =
    p.trampas.map(t => alertBox('trap', 'alert-octagon',
      `<strong>${t.emoji} ${t.titulo}:</strong> ${t.desc}`)).join('');
}

/* ─── Poblar RETENCOL ─── */
function populateRetencol() {
  const p = procesoActivo;
  document.getElementById('rc-empty').style.display   = 'none';
  document.getElementById('rc-content').style.display = 'block';

  document.getElementById('rc-header-info').innerHTML =
    `<strong>Proceso:</strong> ${p.id} &nbsp;·&nbsp; <strong>Municipio:</strong> ${p.municipio}, ${p.departamento} &nbsp;·&nbsp; <strong>Valor contrato:</strong> $${fmt(p.valor * 1000000)} &nbsp;·&nbsp; <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}`;

  const total = p.retenciones.reduce((s, r) => s + r.valor, 0);
  const pct   = (total / (p.valor * 1000000) * 100).toFixed(2);

  document.getElementById('rc-tbody').innerHTML =
    p.retenciones.map(r => `
      <tr>
        <td>${r.tributo}</td>
        <td class="rc-mono">$${fmt(p.valor)}M</td>
        <td class="rc-mono">${r.tarifa}</td>
        <td class="rc-mono" style="font-weight:600">$${r.valor.toLocaleString('es-CO')}</td>
        <td style="font-size:11px;color:var(--text-3)">${r.norma}</td>
      </tr>`).join('') +
    `<tr class="total-row">
      <td>TOTAL RETENCIONES</td><td></td><td class="rc-mono">${pct}%</td>
      <td class="rc-mono">$${total.toLocaleString('es-CO')}</td><td></td>
    </tr>`;

  const costos   = p.valor * 0.72;
  const neto     = p.valor - (total/1000000) - costos;
  const chartData = [
    { label:'Valor bruto', pct:100,  val:'$'+fmt(p.valor)+'M',    color:'var(--navy-light)' },
    { label:'Retenciones', pct:parseFloat(pct), val:'$'+fmt(total/1000000)+'M', color:'var(--red)' },
    { label:'Costos directos', pct:72, val:'$'+fmt(costos)+'M',  color:'var(--amber)' },
    { label:'Margen neto',  pct: +(neto/(p.valor)*100).toFixed(1), val:'$'+fmt(neto)+'M', color:'var(--green)' },
  ];
  document.getElementById('rc-chart').innerHTML =
    chartData.map(d => `
      <div class="hbar-row">
        <span class="hbar-label">${d.label}</span>
        <div class="hbar-track">
          <div class="hbar-fill" style="width:${Math.max(d.pct,1)}%;background:${d.color}"></div>
        </div>
        <span class="hbar-val">${d.val}</span>
      </div>`).join('');
}

/* ─── Poblar Territorial ─── */
function populateTerritorial() {
  const p = procesoActivo;
  document.getElementById('ter-empty').style.display   = 'none';
  document.getElementById('ter-content').style.display = 'block';
  document.getElementById('ter-mapa-label').innerHTML  =
    `<strong>${p.municipio}</strong>, ${p.departamento}<br><small>Zona identificada en pliego</small>`;

  const geo = [
    { dot:'green', label:'Índice orden público',   tag:'Bajo riesgo',       cls:'tag-ok' },
    { dot:'green', label:'Accesibilidad vial',      tag:'Óptima',            cls:'tag-ok' },
    { dot:'amber', label:'Riesgo climático',        tag:'Lluv. mayo-nov.',   cls:'tag-warn' },
    { dot:'green', label:'Disponibilidad mano obra',tag:'Zona urbana',       cls:'tag-ok' },
  ];
  document.getElementById('ter-geo').innerHTML =
    geo.map(r => semRow(r.dot, r.label, '', r.tag, r.cls)).join('');

  const apu = [
    { dot:'green', label:'M² estructura metálica', val:'$285.000',   tag:'Competitivo', cls:'tag-ok' },
    { dot:'green', label:'ML tubería sch40 4"',     val:'$120.000',   tag:'Mercado',     cls:'tag-ok' },
    { dot:'amber', label:'M² cubierta termoacúst.', val:'$195.000',   tag:'Alto vs hist',cls:'tag-warn' },
    { dot:'green', label:'Jornada instalación',     val:'$180.000',   tag:'Ref. SENA',   cls:'tag-ok' },
    { dot:'green', label:'M² pintura anticorrosiva',val:'$32.000',    tag:'Estándar',    cls:'tag-ok' },
  ];
  document.getElementById('ter-apu').innerHTML =
    apu.map(r => semRow(r.dot, r.label, r.val, r.tag, r.cls)).join('');

  document.getElementById('ter-riesgos').innerHTML =
    alertBox('trap','umbrella','<strong>Riesgo climático activo:</strong> Temporada de lluvias (mayo–noviembre). Incluya al menos 15 días hábiles de contingencia en el cronograma. Exija cláusula de fuerza mayor para precipitaciones > 20mm.') +
    alertBox('info','truck','<strong>Logística de materiales:</strong> Proveedor más cercano de planchas en Copacabana (18 km). Tiempo de entrega estimado: 5 días hábiles. Incluir en plan de adquisición.') +
    alertBox('ok','check','<strong>Proveeduría local:</strong> Municipio con amplia oferta de contratistas locales. Posibilidad de subcontratación parcial para cumplir requerimientos de mano de obra local (si aplica en el pliego).');
}

/* ─── Poblar Informe ─── */
function populateInforme() {
  const p = procesoActivo;
  document.getElementById('inf-empty').style.display   = 'none';
  document.getElementById('inf-content').style.display = 'block';

  const vBox = p.puntuacion >= 75 ? 'go' : p.puntuacion >= 55 ? 'med' : 'nogo';
  const vLabel = p.puntuacion >= 75 ? 'GO — PARTICIPAR' : 'NO GO';
  document.getElementById('inf-verdict').innerHTML = `
    <div class="verdict-box verdict-${vBox}">
      <div class="verdict-label">${vLabel}</div>
      <div class="verdict-score">${p.puntuacion}<span> /100</span></div>
      <div class="verdict-text">${empresa.nombre} · ${p.id} · ${new Date().toLocaleDateString('es-CO')} · ${p.marco}</div>
    </div>`;

  const modulos = [
    { icon:'ti-file-search',    label:'Revisión documental SECOP II',        sub:'Jurídica, financiera y técnica completa' },
    { icon:'ti-table',          label:'Matriz de 13 puntos',                  sub:`Score ${p.puntuacion}/100 · ${p.trampas.length} trampas detectadas` },
    { icon:'ti-calculator',     label:'RETENCOL — Cargas fiscales',           sub:`$${fmt(p.retenciones.reduce((s,r)=>s+r.valor,0)/1000000)}M (${(p.retenciones.reduce((s,r)=>s+r.valor,0)/(p.valor*10000)).toFixed(2)}%) · ${p.municipio}` },
    { icon:'ti-map-pin',        label:'Análisis territorial y APU',          sub:'Riesgo climático activo · Precios de referencia' },
    { icon:'ti-clock-record',   label:'Bitácora de evaluación',               sub:`${bitacora.length} eventos registrados · Formato 023` },
  ];
  document.getElementById('inf-modulos').innerHTML = modulos.map(m => `
    <div class="sem-row">
      <div class="sem-dot dot-green"></div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600;color:var(--text-1)">${m.label}</div>
        <div style="font-size:11px;color:var(--text-2)">${m.sub}</div>
      </div>
      <i class="ti ${m.icon}" style="color:var(--gold);font-size:18px"></i>
    </div>`).join('');
}

/* ─── Generar texto del informe ─── */
function generarInformeTexto() {
  const p = procesoActivo;
  if (!p) return;
  const total = p.retenciones.reduce((s, r) => s + r.valor, 0);
  const texto = `
══════════════════════════════════════════════
SIEL PRO — INFORME EJECUTIVO DE EVALUACIÓN
══════════════════════════════════════════════
Empresa evaluadora:  ${empresa.nombre}
NIT:                 ${empresa.nit}
Clasificación:       ${empresa.tamano}
Fecha del informe:   ${new Date().toLocaleDateString('es-CO')}

──────────────────────────────────────────────
1. IDENTIFICACIÓN DEL PROCESO
──────────────────────────────────────────────
Número de proceso:   ${p.id}
Entidad:             ${p.entidad}
Objeto:              ${p.objeto}
Valor del contrato:  $${fmt(p.valor * 1000000)} COP
Municipio:           ${p.municipio}, ${p.departamento}
Plazo de ejecución:  ${p.plazo}
Marco jurídico:      ${p.marco}

──────────────────────────────────────────────
2. VEREDICTO DE VIABILIDAD
──────────────────────────────────────────────
Puntaje ponderado:   ${p.puntuacion} / 100
Nivel de riesgo:     Medio-bajo
Recomendación:       ✅ GO — SE RECOMIENDA PARTICIPAR

──────────────────────────────────────────────
3. REVISIÓN FINANCIERA (cruce con perfil CGI)
──────────────────────────────────────────────
Liquidez:            ${empresa.liquidez}    → Exigida ≥ 1.5 → CUMPLE
Endeudamiento:       ${empresa.endeudamiento}%    → Exigido ≤ 70% → CUMPLE
Capital de trabajo:  $${fmt(empresa.capital)}M   → Suficiente
Patrimonio:          $${fmt(empresa.patrimonio)}M   → ${empresa.patrimonio>=900?'CUMPLE':'REVISAR'}
Capacidad K:         $${fmt(empresa.k)}M   → Holgado frente al proceso

──────────────────────────────────────────────
4. MATRIZ DE 13 PUNTOS — RESUMEN
──────────────────────────────────────────────
${p.matrizData.map(r => `  [${r.id < 10 ? ' '+r.id : r.id}] ${r.title.padEnd(38)} Calif: ${r.score}/5  Peso: ${r.weight}%  Contrib: ${((r.score/5)*r.weight).toFixed(1)}`).join('\n')}

TOTAL PONDERADO: ${p.puntuacion} / 100

──────────────────────────────────────────────
5. MÓDULO RETENCOL — CARGAS FISCALES
──────────────────────────────────────────────
${p.retenciones.map(r => `  ${r.tributo.padEnd(35)} ${r.tarifa.padEnd(10)} $${r.valor.toLocaleString('es-CO')}`).join('\n')}
  ${'─'.repeat(60)}
  TOTAL RETENCIONES:                            $${total.toLocaleString('es-CO')}
  Porcentaje sobre contrato: ${(total/(p.valor*10000)).toFixed(2)}%

──────────────────────────────────────────────
6. TRAMPAS CONTRACTUALES DETECTADAS
──────────────────────────────────────────────
${p.trampas.map((t,i) => `  ${t.emoji} [${i+1}] ${t.titulo}\n      ${t.desc}`).join('\n\n')}

──────────────────────────────────────────────
7. OBSERVACIONES FINALES
──────────────────────────────────────────────
• Revisar con el área jurídica las 3 trampas contractuales identificadas antes de
  preparar la propuesta.
• Ajustar el cronograma con días de contingencia climática (mín. 15 días hábiles).
• Verificar seriedad de oferta (10% del valor del contrato): $${fmt(p.valor * 0.1)}M.
• Actualizar APU con precios de agosto 2025 para cubierta termoacústica.

──────────────────────────────────────────────
Generado por SIEL PRO v2.0
Sistema Inteligente de Evaluación de Licitaciones
══════════════════════════════════════════════
`.trim();

  document.getElementById('inf-texto').style.display = 'block';
  document.getElementById('inf-texto-pre').textContent = texto;
  logBitacora('Informe ejecutivo generado', 'Texto completo exportado para revisión gerencial', 'blue', 'INFORME');
  showToast('Informe generado — Copia el texto o exporta a PDF', 'green');
}

/* ─── Historial ─── */
function renderHistorial() {
  const c = document.getElementById('historial-list');
  c.innerHTML = historial.map(h => `
    <div class="sem-row" style="cursor:pointer" onclick="nav('dashboard',null)">
      <div class="sem-dot dot-${h.score>=75?'green':h.score>=55?'amber':'red'}"></div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600;color:var(--text-1)">${h.id}</div>
        <div style="font-size:11px;color:var(--text-2)">${h.entidad?.substring(0,40)}…</div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--mono);font-size:13px;font-weight:700;color:var(--navy)">${h.score}/100</div>
        <div style="font-size:10px;color:var(--text-3)">${h.fecha}</div>
      </div>
    </div>`).join('');
}

/* ─── Spinner CSS ─── */
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

/* ─── Init ─── */
(function init() {
  const stored = localStorage.getItem('siel_empresa');
  if (stored) {
    empresa = JSON.parse(stored);
    applyEmpresa();
    document.getElementById('onboarding').classList.add('hidden');

    // Prellenar onboarding con datos guardados
    document.getElementById('ob-nombre').value       = empresa.nombre || '';
    document.getElementById('ob-nit').value          = empresa.nit || '';
    document.getElementById('ob-tamano').value        = empresa.tamano || '';
    document.getElementById('ob-liquidez').value     = empresa.liquidez || '';
    document.getElementById('ob-endeudamiento').value= empresa.endeudamiento || '';
    document.getElementById('ob-capital').value      = empresa.capital || '';
    document.getElementById('ob-patrimonio').value   = empresa.patrimonio || '';
    document.getElementById('ob-k').value            = empresa.k || '';
    document.getElementById('ob-cobertura').value    = empresa.cobertura || '';
    document.getElementById('ob-exp').value          = empresa.expMax || '';
    document.getElementById('ob-ciiu').value         = empresa.ciiu || '';
    logBitacora('Sesión iniciada', `Perfil recuperado: ${empresa.nombre}`, 'blue');
  }
})();
</script>

<!--
═══════════════════════════════════════════════════════════════════════════════════
  DOCUMENTACIÓN DEL ARQUITECTO — HOJA DE RUTA BACKEND MULTI-TENANT
  ─────────────────────────────────────────────────────────────────
  SIEL PRO v2.0 — Arquitectura para producción SaaS

  1. MULTI-TENANCY (gestión de múltiples empresas / usuarios)
  ───────────────────────────────────────────────────────────
  Estrategia: Row-Level Tenancy en PostgreSQL con campo tenant_id en cada tabla.

  Tablas principales:
    - tenants(id, nombre, nit, plan, created_at)
    - users(id, tenant_id FK, email, role, hashed_password)
    - empresas(id, tenant_id FK, nombre, nit, indicadores JSONB)
    - procesos(id, tenant_id FK, empresa_id FK, codigo, estado, pdf_url, analisis JSONB)
    - bitacoras(id, proceso_id FK, tenant_id FK, evento, detalle, color, created_at)

  Auth: JWT con claims { sub: user_id, tenant_id, role }.
  Middleware de Express/FastAPI: extrae tenant_id del JWT y añade
  WHERE tenant_id = ? a TODAS las queries (Row-Level Security en PostgreSQL).

  Planes de suscripción:
    - Free:    5 análisis/mes · 1 usuario
    - Pro:     50 análisis/mes · 5 usuarios · RETENCOL incluido
    - Enterprise: ilimitado · SSO · API propia · SLA 99.9%

  2. MOTOR DE ANÁLISIS PDF → API REAL (Claude / OpenAI)
  ──────────────────────────────────────────────────────
  Flujo de producción:

    Browser                Backend (Node/Python)         AI API
    ───────────────────────────────────────────────────────────
    [1] Upload PDF ──────> [2] Extraer texto con pdfjs
                           [3] Chunking semántico (2K tokens/chunk)
                           [4] POST /v1/messages ──────> Claude claude-sonnet-4-6
                               prompt: SYSTEM: "Eres auditor de licitaciones..."
                               + empresa_profile JSONB
                               + texto_pliego chunked
                           [5] Parse respuesta JSON ←──── structured output
                           [6] Guardar análisis en procesos.analisis
                           [7] SSE / WebSocket ──────────> Browser (progreso en tiempo real)
                           [8] Frontend pobla módulos

  Prompt de sistema para Claude API (extracto):
    "Analiza el siguiente pliego de condiciones de contratación pública colombiana.
     Extrae: [objeto, valor, municipio, marco_jurídico, requisitos_habilitantes,
     trampas_contractuales, indicadores_requeridos].
     Compara con el perfil de empresa: {empresa_profile}.
     Responde SOLO en JSON con el esquema: { proceso, matriz_13, retenciones,
     trampas, veredicto, bitacora_eventos }."

  3. RETENCOL EN BACKEND
  ──────────────────────
  Tabla: municipios_tributos(municipio_id, tipo_tributo, tarifa, norma, vigente_desde)
  Seed: 1.122 municipios colombianos con ICA actualizado.
  Endpoint: GET /api/retencol?municipio=Medellín&valor=800000000
  → Retorna array de retenciones calculadas + total + pct_margen.

  4. INFRAESTRUCTURA RECOMENDADA
  ──────────────────────────────
  - Frontend: Next.js 14 (App Router) + Tailwind + deploy en Vercel
  - Backend API: FastAPI (Python) o Express (Node) en Railway / Render
  - DB: Supabase (PostgreSQL + Auth + Storage para PDFs)
  - Queue para análisis largos: BullMQ + Redis
  - Storage PDFs: Supabase Storage (bucket privado por tenant)
  - Observabilidad: Sentry + Posthog (analytics de uso por tenant)

  5. SEGURIDAD Y COMPLIANCE
  ─────────────────────────
  - PDFs almacenados con encryption at rest (AES-256)
  - TLS 1.3 en tránsito
  - Logs de auditoría inmutables por tenant (append-only)
  - GDPR / Ley 1581 Colombia: datos personales anonimizables por tenant

═══════════════════════════════════════════════════════════════════════════════════
-->

</body>
</html>
