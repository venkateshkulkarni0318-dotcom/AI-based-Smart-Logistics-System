# AI-LOGIX — Agent Rules & Engineering Discipline (AGENTS.md)
**Project Title:** AI-Driven Multi-Modal Rural Logistics & Disaster Management Platform  
**Status:** Living Engineering Standard & AI Coding Contract  
**Authority:** Strict Pair-Programming Standard for All AI Agents and Developers

---

## 1. Global Operating Rules (Mandatory on Every Task)

Every agent working on AI-LOGIX must abide by the following non-negotiable rules:

1. **Inspect Before Modifying:** Always inspect the existing code before changing anything. Never guess variable names, CSS class names, or component props.
2. **Improve in Place:** AI-LOGIX is an existing, working codebase. Never redesign from scratch, never rewrite whole components unnecessarily, and preserve the established folder hierarchy.
3. **Never Invent Data:** Any number, coefficient, or threshold that is not computed from a verified empirical source (SRTM DEM, SHRUG SQLite keys, Open-Meteo) **must be visibly labelled as `"Simulated demo data"`** or `"Simulated demo values"`.
4. **Single Data Layer (No Hardcoded Numbers in UI):** All figures displayed on any page must originate from the centralized data layer (JSON configs or SQLite tables). Modifying a data point in the data layer must propagate across all views.
5. **Never Color Alone:** Every alert, hazard badge, or status indicator must combine **Color + Icon + Text** (e.g., 🔴 ⚠ CRITICAL).
6. **Standard Units & Indian Standard Time (IST):**
   * Distance: $\text{km}$ · Elevation: $\text{m}$ · Slope: $\text{degrees}$
   * Rainfall: $\text{mm/h}$ · Speed: $\text{km/h}$ · Mass: $\text{kg}$ (or $\text{tonne}$)
   * Freight: $\text{tonne-km}$ · Currency: $\text{₹ (INR)}$
   * All timestamps must be displayed in **IST ($\text{UTC}+05:30$)**.
7. **Zero Paid APIs & Offline Operation:** The entire platform must operate with zero internet connectivity. Never introduce dependencies on paid services (Google Maps, Mapbox, OpenAI, etc.).
8. **Never Expose Secrets:** Secrets, API ports, and database paths remain in `.env` and `.env.example`.
9. **Approval Gates:** Stop and request explicit approval before:
   * Changing the database schema or moving directories.
   * Replacing an existing library or framework.
   * Modifying an API response shape that the frontend already consumes.
   * Removing or merging any existing user-facing feature.

---

## 2. Code Quality, Naming & Structure Conventions

### 2.1 File & Directory Placement
* React components live in `frontend/src/components/`.
* React page containers live in `frontend/src/pages/`.
* State management & React contexts live in `frontend/src/context/`.
* Shared formatting and math utilities live in `frontend/src/utils/`.
* Express route handlers live in `backend/routes/`.
* Backend business logic and persistence live in `backend/services/`.
* Centralized configs and hazard thresholds live in `backend/config/`.
* Python ML microservice lives strictly inside `ml-service/`.

### 2.2 Naming Conventions
* **React Components:** PascalCase (`ElevationTransect.jsx`, `MLRiskSimulator.jsx`).
* **JavaScript Utilities & Routes:** camelCase (`formatters.js`, `settlementRegistry.js`, `routing.js`).
* **CSS Design Tokens:** kebab-case with `--` prefix (`--bg-surface`, `--accent-primary`, `--border-subtle`).
* **Database Columns:** snake_case (`seasonal_cutoff_days`, `elevation_m`, `access_score`).
* **API Fields:** camelCase (`rainfallMmHr`, `disruptionProbability`, `isSimulatedDemoData`).

---

## 3. Component & State Discipline

1. **Design System Reuse:**
   * Never write ad-hoc inline styles when existing CSS classes or variables exist (`.card-panel`, `.badge`, `.btn`, `.data-table`, `var(--text-primary)`).
   * Respect both Light and Dark mode variables defined in `index.css`.
2. **Error Boundaries & Fallbacks:**
   * All asynchronous data fetching must handle 4 states:
     1. **Loading State:** Render non-shifting skeleton loader.
     2. **Empty State:** Clean, helpful empty state card with guidance.
     3. **Error State:** User-friendly inline error notice with retry button.
     4. **Success State:** Render data with proper units and data origin badge.
3. **Gateway Fallback Resilience:**
   * Any client call to an ML or external service must assume the service might be offline and render the Node gateway fallback cleanly without crashing.

---

## 4. Phase-by-Phase Build Protocol

Work must be conducted phase-by-phase in strict order:
1. **Phase 1: Audit & Rectify (Issues A1 to A9)**
   * A1: Disaster HUD fallback graphic.
   * A2: Transect dynamic scaling and exaggeration toggle.
   * A3: Responsive transport comparison table.
   * A4: Signed SHAP waterfall chart.
   * A5: Real measurements via `/metrics`.
   * A6: Validation, toasts, skeletons, and gateway fallback.
   * A7: Unified settlement data consistency and IST formatters.
   * A8: Remove hardcoded numbers from UI.
   * A9: Scrollable sidebar for short screens ($600\text{px}$).
2. **Phase 2: Missing Cases Engine (T1 to T29)**
   * Hazard trigger logic, mode switch hierarchy (`Road → Rail → Waterway → Drone`), and impact telemetry.
3. **Phase 3: Visualizations & Charts**
   * Recharts/Leaflet integration with "What this means" captions.
4. **Phase 4: User Understanding & Perspectives**
   * Simple/Technical toggle, 4 role perspectives, English/Hindi/Kannada localization, Zanskar walkthrough.
5. **Phase 5: Python ML Microservice & SQLite Persistence**
   * FastAPI Scikit-learn + TreeSHAP endpoints on port 8000; SQLite audit log.
6. **Phase 6: Polish & Deployment**
   * Light/Dark toggle, responsive audit, Docker Compose, single-command launch (`npm run dev`).

---

## 5. Definition of Done (DoD) per Task

Before marking any task complete, the agent must verify:
- [ ] Code runs cleanly with no console errors or uncaught exceptions.
- [ ] Responsive behavior tested at both mobile ($360\text{px}$) and desktop ($1920\text{px}$).
- [ ] Works completely offline with cached fallbacks.
- [ ] Units match the standard units table and times are in IST.
- [ ] Data carries the `Simulated demo data` or `Real data` badge.
- [ ] Preserves all existing comments, docstrings, and unrelated features.
