# AI-LOGIX — Design System & UI/UX Specification (DESIGN.md)
**Project Title:** AI-Driven Multi-Modal Rural Logistics & Disaster Management Platform  
**Status:** Living Design Specification & Visual Source of Truth  
**Design Paradigm:** Tactical Command-Center · Cognitive Simplicity · 10-Second Officer Comprehension

---

## 1. Visual Direction & Design Principles

### 1.1 Core Principles
1. **10-Second Officer Comprehension:** Every panel must immediately convey the operational status to a non-technical officer (Sarpanch, District Collector, NDRF commander) within 10 seconds without cognitive fatigue.
2. **Never Color Alone:** Every status indicator, hazard flag, and alert must combine **Color + Icon + Explicit Text** (e.g., 🔴 ⚠ CRITICAL HAZARD), ensuring accessibility for color-blind officers and monochrome/print outputs.
3. **Data Authenticity & Badging:** Every displayed metric must carry a visible badge designating its origin:
   * `● REAL DATA` (computed from SRTM DEM, SHRUG SQLite keys, or live API).
   * `● SIMULATED DEMO DATA` (heuristic model output or calibrated simulation).
4. **Command-Center Density with Breathing Room:** Visual hierarchy uses subtle borders (`rgba(148, 163, 184, 0.12)`) and elevated slate containers rather than stark lines, keeping visual clutter to a minimum.

---

## 2. Color System & Typography

### 2.1 Theme Palettes (Dark Default & Light Mode)

| Token | Dark Mode (Default) | Light Mode | Functional Role |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#090d16` (Deep space navy) | `#f8fafc` (Slate 50) | Main application backdrop |
| `--bg-surface` | `#0f172a` (Slate 900) | `#ffffff` (Pure white) | Card and panel containers |
| `--bg-surface-elevated`| `#1e293b` (Slate 800) | `#f1f5f9` (Slate 100) | Dropdowns, table headers, hover states |
| `--border-subtle` | `rgba(148, 163, 184, 0.12)` | `#e2e8f0` (Slate 200) | Structural card separation |
| `--border-strong` | `rgba(148, 163, 184, 0.28)` | `#cbd5e1` (Slate 300) | Focused or emphasized borders |
| `--text-primary` | `#f8fafc` | `#0f172a` | Headers, primary data figures |
| `--text-secondary` | `#94a3b8` | `#475569` | Metric labels, descriptions |
| `--text-muted` | `#64748b` | `#94a3b8` | Footers, sub-labels, metadata |
| `--accent-primary` | `#0284c7` (Sky 600) | `#0284c7` | Interactive buttons, active links, primary charts |
| `--accent-emerald` | `#10b981` (Emerald 500) | `#10b981` | Safe operational state, low risk, high resilience |
| `--accent-amber` | `#f59e0b` (Amber 500) | `#f59e0b` | Cautionary hazard state, moderate risk, rerouting |
| `--accent-rose` | `#f43f5e` (Rose 500) | `#f43f5e` | Critical hazard, pass severed, emergency SOS triage |

### 2.2 Typography
* **Primary Sans Font:** `'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif`
  * Body text: 13px / 1.5 line-height.
  * Card title: 15px / 600 weight.
  * Section header: 18px / 700 weight.
  * KPI numerical value: 28px – 34px / 800 weight.
* **Monospace Font:** `'JetBrains Mono', monospace`
  * Coordinates (`33.512°N, 76.883°E`), SHRUG keys (`shrid`), elevation metrics (`4,120 m`), timecodes (`11:15:00 IST`).

---

## 3. Spacing, Responsive Breakpoints & Layout

### 3.1 Breakpoints
* **Mobile (< 640px):** Single-column stack, collapsed floating sidebar overlay, horizontally scrollable data tables with card-view toggle.
* **Tablet (640px – 1024px):** 2-column KPI grids, compact sidebar, stacked chart cards.
* **Desktop (1024px – 1440px):** Full dual-pane command view (60/40 split between Map/Visualization and Telemetry/Queue).
* **Wide Command Console (> 1440px):** 3-column layout with pinned KPI ribbon, geospatial HUD, and live SOS dispatch console.

### 3.2 Spacing System
* `var(--spacing-xs)`: 4px
* `var(--spacing-sm)`: 8px
* `var(--spacing-md)`: 16px
* `var(--spacing-lg)`: 24px
* `var(--spacing-xl)`: 32px

---

## 4. Reusable Component Design Tokens

### 4.1 KPI Card [Current + Enhanced]
* Elevated container with subtle top accent line:
  * Safe (Green), Caution (Amber), Emergency (Rose), Operations (Sky).
* Large numerical readout (e.g. `585,179`, `92%`, `14 mins`).
* Trend arrow indicator (`▲ +12% vs last week` or `▼ -4%`).
* One-line "What this means" subtext.
* Badge: `[● Simulated demo data]` or `[● Real data]`.

### 4.2 Status Chip (Color + Icon + Text) [Current + Enhanced]
* Format: `<span className="status-chip chip-critical">🔴 ⚠ CRITICAL RISK</span>`
* Never rely on background color alone; icon and uppercase label must always be visible.

### 4.3 Chart Card Container [Planned]
Every chart (Leaflet, Recharts, SVG) must be encapsulated in a standardized card containing:
1. **Header:** Title + Category Badge + Timeframe.
2. **Chart Viewport:** Fixed aspect ratio or minimum height (280px).
3. **Interactive Legend & Tooltip:** Cursor hover reveals exact numerical units.
4. **Caption Banner:** A one-line plain language explanation (e.g., *"What this means: Rain intensity above 60 mm/h causes exponential road cutoffs on 24° mountain slopes"*).
5. **Data Origin Pill:** `[Real SRTM DEM]` or `[Simulated Model]`.

### 4.4 Risk Gauge [Current + Enhanced]
* Semi-circular or linear segmented risk meter.
* 4 distinct bands:
  * Low (0–30%): 🟢 Normal Ground Convoy.
  * Moderate (31–60%): 🟡 High-Clearance 4x4 / Rail Feeder.
  * High (61–80%): 🟠 Amphibious / River Barge Priority.
  * Critical (81–100%): 🔴 Road Impassable • Cargo UAV Airlift Authorized.

### 4.5 Responsive Data Table with Mobile Card Fallback [Planned - Fixes A3]
* On screens $> 768\text{px}$: Clean table with sticky header, zebra striping, and sortable columns.
* On screens $< 768\text{px}$: Smooth transformation into individual stacked record cards so columns like "Resilience Index" are never cut off.

### 4.6 Global Toast Alert & Skeleton Loaders [Planned - Fixes A6]
* **Toast Notification:** Fixed bottom-right alert queue with auto-dismiss (5s) for dispatches, mode switches, and API warnings.
* **Skeleton Loader:** Pulsing slate rectangles (`rgba(148, 163, 184, 0.08)`) during data fetching; eliminates layout shifts.

### 4.7 Glossary Tooltip [Planned]
* Dotted underline for technical terms (`SHRUG`, `DEM`, `SHAP`, `NavIC`, `ITBP`).
* Hover or touch tap opens an uncluttered floating card with definition in non-technical terms.

---

## 5. Navigation & Multi-View Patterns

### 5.1 Sidebar Architecture [Current + Fixes A9]
* Fixed left width of `250px` on desktop; slide-out drawer on mobile.
* **Height Constraint Fix (A9):** Container styled with `overflow-y: auto`, `scrollbar-width: thin`, and compact item padding.
* All 6 Core Objectives plus Overview remain reachable even on low-height screens ($600\text{px}$).

### 5.2 Role-Based Perspectives Switcher [Current + Enhanced]
Top navigation bar houses a dedicated Role Switcher:
1. **NDRF Tactical Commander**
2. **District Collector / DM**
3. **UAV Logistics Pilot**
4. **Field Outpost / Sarpanch**
* Selecting a role adjusts card priority and displays a contextual header banner:
  > *"Viewing as NDRF Commander: Prioritizing emergency SOS tickets, drone air-drop coordinates, and road cutoffs. (Why am I seeing this?)"*

### 5.3 Simple vs Technical Mode Toggle [Planned]
A toggle switch positioned in the main header:
* **Simple Mode:** Replaces statistical terms ("Signed SHAP values", "Geotechnical factor of safety") with conversational terms ("Why the risk rose", "Slope stability estimate").
* **Technical Mode:** Displays raw feature contributions, model hyperparameters, confusion matrices, and ROC-AUC scores.

---

## 6. Animations, Motion & Accessibility

### 6.1 Reduced-Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.2 Focus States & Keyboard Accessibility
* All interactive controls (buttons, sliders, toggles, table rows) feature an explicit double-ring focus outline:
  `outline: 2px solid var(--accent-primary); outline-offset: 2px;`
* Tab order logically traverses Header $\rightarrow$ Role Switcher $\rightarrow$ Main Interactive Cards $\rightarrow$ Data Tables.

---

## 7. Assumptions & Approvals

### 7.1 Assumptions
* Dark theme remains the default command-center presentation; Light theme is fully switchable via the sidebar button and persists in `localStorage`.
* Charts will use lightweight, SVG/Canvas based libraries (**Recharts** and **Leaflet**) to preserve 100% offline functionality.

### 7.2 Decisions Needing Approval
* [x] **Design System Standards Approved:** DESIGN.md established as baseline UI/UX contract.
* [ ] **Map Library Confirmation:** Confirm usage of Leaflet with local OpenStreetMap/SRTM cached tile fallback for offline GIS mapping.
