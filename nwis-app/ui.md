# NWIS (Nearby Wells Intelligence System) — UI Design System & Component Guide

> **Target Problem Statement:** SIH26121 — Nearby Wells Intelligence System (NWIS) for Oil India Limited (OIL)  
> **Aesthetic Archetype:** Modern, Clean, Minimalist Enterprise Dashboard (Inspired by shadcn/ui & Next-Gen Drilling Control Centers)  
> **Core Constraint:** **Zero neon, zero distracting glows.** Use subtle, refined, high-contrast, calm operational palettes that respect petroleum engineering and control room standards.

---

## 1. Design Philosophy

1. **Simple, Refined & Purpose-Built**: 
   - Clean floating cards (`rounded-2xl`), subtle hairline borders (`border-neutral-200` in light, `border-neutral-800` in dark), and soft tactile shadows.
   - Eliminates the outdated 1990s boxy government portal feel in favor of a modern, institutional digital-twin interface.
2. **No Neon / No Gimmicks**:
   - Avoid oversaturated neon greens, cyber cyans, or hot pinks.
   - Use natural earth/mineral geological tones for formations and controlled semantic colors for drilling hazards.
3. **Simultaneous Legibility**:
   - Drillers and operations managers must never have to tab back-and-forth between a map and a depth track. Map (horizontal proximity) and Stratigraphy (vertical depth) sit side-by-side.
4. **Equal Visual Weight for Disconfirming Evidence**:
   - A system that only displays red alerts causes drill-crew alert fatigue. Every hazard corridor explicitly balances historical incident counts against verified safe passes.

---

## 2. Color Palette & Theming

### 2.1 Base Neutrals (Light & Dark)

| Role | Light Mode | Dark Mode (Control Room) | Description |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `bg-neutral-50` (`#f8fafc`) | `bg-neutral-950` (`#0b0f17`) | Main application backdrop |
| **Card Surface** | `bg-white` (`#ffffff`) | `bg-neutral-900` (`#12161f`) | Primary card containers (`rounded-2xl`) |
| **Subtle Card Surface** | `bg-neutral-100/60` (`#f1f5f9`) | `bg-neutral-800/50` (`#1e2533`) | Secondary containers & table headers |
| **Borders** | `border-neutral-200` (`#e2e8f0`) | `border-neutral-800` (`#1e293b`) | Hairline structure dividers |
| **Primary Text** | `text-neutral-900` (`#0f172a`) | `text-neutral-50` (`#f8fafc`) | Main titles, readouts, high-contrast text |
| **Muted Text** | `text-neutral-500` (`#64748b`) | `text-neutral-400` (`#94a3b8`) | Secondary labels, units, timestamps |

---

### 2.2 Semantic & Operational Accents (Subtle & Functional)

| Semantic Purpose | Light Style | Dark Style | Usage in NWIS |
| :--- | :--- | :--- | :--- |
| **Primary Action / Identity** | `bg-indigo-600 text-white` | `bg-indigo-500 text-white` | Active well selection, primary CTA |
| **Hazard / Critical Kick** | `bg-rose-50 text-rose-700 border-rose-200` | `bg-rose-950/40 text-rose-300 border-rose-800/50` | Barail overpressure, kick alerts |
| **Caution / Mud Loss Advisory** | `bg-amber-50 text-amber-800 border-amber-200` | `bg-amber-950/40 text-amber-300 border-amber-800/50` | Tipam lost circulation corridor |
| **Safe Pass / Normal Flow** | `bg-emerald-50 text-emerald-700 border-emerald-200` | `bg-emerald-950/40 text-emerald-300 border-emerald-800/50` | Disconfirming safe offset well passes |
| **Archival / OCR Pedigree** | `bg-slate-100 text-slate-700 border-slate-300` | `bg-slate-800 text-slate-300 border-slate-700` | WCR / DDR provenance badges |

---

### 2.3 Geological Stratigraphic Palette (`src/data/formations.ts`)
Subtle, authentic earth tones for vertical depth tracks:
* **Alluvium** (0–200m): `#94a3b8` (Slate Muted)
* **Dihing Formation** (200–600m): `#818cf8` (Soft Indigo)
* **Namsang Formation** (600–1200m): `#6366f1` (Muted Cobalt)
* **Girujan Clay** (1200–1800m): `#06b6d4` (Deep Clay Teal)
* **Tipam Sandstone** (1800–2600m): `#ea580c` (Sandstone Ochre / Burnt Orange)
* **Barail Group** (2600–3500m): `#7c3aed` (Deep Organic Shale Violet)
* **Kopili Formation** (3500–4000m): `#be185d` (Overpressure Rose-Wine)
* **Sylhet Limestone** (4000–4300m): `#65a30d` (Olive Carbonate)

---

## 3. Typography & Sizing Standards

* **Font Family**: Modern clean sans-serif (`Inter`, `Plus Jakarta Sans`, or system sans).
* **Numerical Font**: Monospace (`font-mono`) for all measured depths (`MD`), true vertical depths (`TVD`), mud weights (`ppg`), torque (`kft-lb`), and ROP.
* **Heading Scale**:
  * Page Title: `text-2xl font-bold tracking-tight`
  * Section Title: `text-base font-semibold text-neutral-900 dark:text-neutral-100`
  * Card Label: `text-xs uppercase font-medium tracking-wider text-neutral-500`
  * Metric Value: `text-2xl font-bold font-mono tracking-tight`

---

## 4. shadcn/ui Component Setup & Catalog

The project is initialized with `components.json` using the **base-nova** style with **Tailwind v4** and CSS variables.

### Installed Primitives (`@/components/ui/*`)
```
src/components/ui/
├── button.tsx         ──► Buttons (default, secondary, outline, destructive, ghost)
├── card.tsx           ──► Rounded-2xl card wrappers, headers, descriptions, content
├── badge.tsx          ──► Status, risk-level, and OCR pedigree tags
├── tabs.tsx           ──► Segmented switchers (e.g., Distance vs Similarity)
├── table.tsx          ──► High-density semantic data tables for offset wells & DDRs
├── separator.tsx      ──► Subtle dividers between parameters
├── input.tsx          ──► Command bar & parameter filter fields
├── dialog.tsx         ──► Alert deep-dive & evidence inspection modals
├── tooltip.tsx        ──► Geological formation & WCR citation popovers
├── dropdown-menu.tsx  ──► Field selectors (Digboi, Geleki, Kharsang)
└── progress.tsx       ──► Memory Decay Index & telemetry progress indicators
```

---

## 5. Screen Layout & Component Blueprints

### 5.1 Global Top Ribbon (`GovHeader.tsx` / `TelemetryBar.tsx`)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ [OIL Logo] NWIS  |  eRTMAC Institutional Memory Companion     [Active: Geleki-14 ▼]  │
│                                                                                             │
│ [🟢 WITSML 380ms]   DEPTH: 2,165.4m MD   ROP: 14.8 m/h   TORQUE: 11.2 kft-lb   ECD: 10.2 ppg │
│                                                      [Search WCRs ⌘K]  [Theme 🌓] [Role 👤] │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```
* **Interactive Elements**:
  * Global Search Bar (`⌘K` modal trigger).
  * Active Well dropdown (switches context between `well-glk-14`, `well-dgb-09`, etc.).
  * Live status pill (displays mock WebSocket stream latency).

---

### 5.2 Operations Dashboard (`/dashboard`)
* **Top Metric Strip**: 4 rounded cards (`Card` from shadcn) displaying Active Rigs, Open High Advisories, Wells in Corridors, and Verified Safe Passes.
* **Middle Left: Active Wells Monitoring Register**:
  * Semantic table (`Table`) with live depth, formation badge, trajectory, and status.
* **Middle Right: Memory Decay Index Meter**:
  * Circular/bar progress indicators showing knowledge erosion per field:
    * Digboi: **88% Decay Risk** (58% paper-only)
    * Kharsang: **76% Decay Risk** (Thrust-belt unindexed notes)
    * Geleki: **68% Decay Risk** (Barail kicks in 1980s TIFFs)

---

### 5.3 Well Workspace (`/wells/[wellId]`)
* **Split Layout (7:5 or 6:6 grid)**:
  1. **Left: Offset Well Geospatial Map (Leaflet)**
     * Dark/clean slate tiles (`CartoDB Dark Matter` or muted OpenStreetMap).
     * Radius selector pill (`10 km`, `25 km`, `50 km`).
     * Markers color-coded by status (Cyan for active rig, Blue for completed offsets).
  2. **Right: Scaled SVG Stratigraphic Depth Track**
     * Vertical depth axis (0 to 4,000m).
     * Colored formation intervals labeled with lithology.
     * Animated live bit depth line with current MD/TVD readout.
     * Hatched hazard interval bands with a dashed "Trigger Horizon" line 75m ahead.
* **Bottom Section: Offset Well Comparison Register**
  * `Tabs` toggle: **Sort by Composite Similarity** vs **Sort by Map Distance (km)**.
  * Displays both values side-by-side on every row (`Dist: 3.2 km` | `Sim: 0.84`).
  * Expands to reveal casing program and past incident logs.

---

### 5.4 Proactive Alert Inspection (`/alerts/[alertId]` or Dialog)
* **The 3-Block Core Structure** (Mandated by PSU safety-case requirements):
  ```
  ┌────────────────────────────────────────────────────────────────────────────┐
  │ 📋 1. OBSERVED HISTORICAL FACT (White / Slate card)                        │
  │ "5 of 8 offset wells in Geleki encountering Upper Tipam experienced severe │
  │  lost circulation between 2,180m and 2,350m MD. Total NPT: 142 hours."    │
  │ Source: WCR-GLK-07-1996 (Page 19) [OCR-HIGH]                               │
  ├────────────────────────────────────────────────────────────────────────────┤
  │ ⚠️ 2. MODEL-ESTIMATED RISK (Muted Amber card)                             │
  │ "High probability (78%) of microfracture loss if ECD exceeds 10.4 ppg."    │
  ├────────────────────────────────────────────────────────────────────────────┤
  │ 💡 3. RECOMMENDED OPERATIONAL MITIGATION (Muted Indigo / Emerald card)      │
  │ "Pre-treat active mud system with 35 ppb mixed-fiber LCM prior to 2,150m.  │
  │  Cap ECD at 10.4 ppg. Stage LCM pill on stand-by."                         │
  ├────────────────────────────────────────────────────────────────────────────┤
  │ 🛡️ 4. DISCONFIRMING EVIDENCE (Muted Emerald card)                          │
  │ "3 offset wells (GLK-11, GLK-09) traversed safely with zero losses by      │
  │  capping ECD at 10.2 ppg."                                                 │
  └────────────────────────────────────────────────────────────────────────────┘
  ```
* **Action Buttons**: `[Acknowledge]`, `[Apply Mitigation]`, `[Reject / Flag Outlier]`.

---

### 5.5 Historical Replay Simulator (`/replay`)
* **Scrubber Deck**: Play/Pause button, speed selector (`2x`, `5x`, `15x`, `30x`), depth slider (`2,100m` → `2,350m`).
* **3-Point Comparison Gauge**:
  1. *Live Simulated Depth*: `2,165.4m MD`
  2. *Proactive Alert Trigger Horizon*: `2,205.0m MD` (Fired **75m ahead of incident**)
  3. *Historical Incident Depth*: `2,280.0m MD` (Where the real 1996 crew drilled blind and suffered total mud loss).

---

## 6. Mapping to `src/data/` Dummy Data Files

| UI Component | Backing Mock File in `src/data/` | Key Exported Symbols |
| :--- | :--- | :--- |
| **Telemetry Ribbon** | `src/data/live-state.ts` | `INITIAL_LIVE_TELEMETRY` |
| **Memory Decay Index** | `src/data/live-state.ts` | `MEMORY_DECAY_INDEX` |
| **Geological Formations** | `src/data/formations.ts` | `FORMATIONS`, `FORMATION_SYNONYMS` |
| **Offset Wells & Casing** | `src/data/wells.ts` | `WELLS`, `haversineDistance()`, `computeSimilarity()` |
| **Risk Corridors & Alerts** | `src/data/risk-corridors.ts` | `RISK_CORRIDORS` |
| **Historical Incident Logs** | `src/data/events.ts` | `EVENTS`, `getEventsByWell()` |

---

## 7. Rules for Future Code Changes

1. **Always use `@/components/ui/*` primitives** for cards, buttons, badges, tables, and dialogs.
2. **Never hardcode hex colors inline** in components; use Tailwind semantic classes (`bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`) or geological constants from `formations.ts`.
3. **Keep corners consistent**: `rounded-2xl` for outer cards, `rounded-xl` for nested modules, `rounded-lg` for controls.
4. **Preserve accessibility**: All interactive elements must maintain clear focus rings (`focus-visible:ring-2 focus-visible:ring-ring`).
