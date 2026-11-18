# AI-LOGIX — System Architecture Document (ARCHITECTURE.md)
**Project Title:** AI-Driven Multi-Modal Rural Logistics & Disaster Management Platform  
**Status:** Living System Architecture & Engineering Contract  
**Architectural Style:** Dual-Service Micro-Gateway with Offline Auto-Fallback

---

## 1. System Topology & Technology Stack

```
                    +------------------------------------------+
                    |           Client Browser (SPA)           |
                    |   React 18 + Vite 6 + Vanilla CSS Tokens |
                    |       Port: 5173 (Dev) / Production      |
                    +--------------------+---------------------+
                                         |
                                         | HTTP / JSON (CORS)
                                         v
                    +------------------------------------------+
                    |         Node.js API Gateway (Express)    |
                    |        Port: 5050 (Primary Entrypoint)   |
                    |  * Rate Limiting & Security Headers      |
                    |  * Single Data Layer & Shared Formatters |
                    |  * Offline Cached Fallback Engine        |
                    +---------+----------------------+---------+
                              |                      |
            Internal Proxy /  |                      | Local Ingestion /
            Graceful Fallback |                      | Sync Operations
                              v                      v
        +----------------------------+    +----------------------------+
        |   Python FastAPI (Port 8000) |    |        Data Assets         |
        | * Random Forest Disruption |    | * SQLite (shrug_keys.db &  |
        | * TreeSHAP Explainability  |    |   Audit / Weather Cache)   |
        | * 48h Weather Risk Forecast|    | * GeoJSON (srtm.geojson)   |
        | * NLP Distress SOS Parser  |    | * Thresholds JSON          |
        +----------------------------+    +----------------------------+
```

### 1.1 Technology Stack & Rationale
1. **Frontend:**
   * **React 18 + Vite 6:** Instant HMR, minimal bundle overhead, component modularity.
   * **Pure Vanilla CSS:** Tailored HSL/RGB design system with zero runtime CSS-in-JS performance penalty, perfect responsiveness from 360px to 1920px.
   * **Leaflet & Recharts:** High-performance, open-source mapping and SVG charting that function 100% offline without requiring paid API tokens.
2. **Gateway:**
   * **Node.js (v20+) & Express (v4.21):** Fast asynchronous I/O, lightweight gateway proxy, native SQLite access (`node:sqlite`), robust security headers, and request rate limiting.
3. **ML Microservice:**
   * **Python 3.10+ & FastAPI:** Exposes high-throughput endpoints on port `8000`. Houses Scikit-learn Random Forest model, SHAP TreeExplainer, and heuristic NLP parser with Pydantic validation.
4. **Data Persistence:**
   * **SQLite (WAL Mode):** Houses 585,179 SHRUG settlement records, live dispatch audit logs, weather snapshot caches, and application configurations.

---

## 2. Component Responsibilities & Data Flow

### 2.1 Component Breakdown
| Layer | Component | Core Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React Dashboard | State management, role switching, user inputs (weather/sliders), interactive charts, localized text rendering (EN/HI/KN), and offline notification banners. |
| **Gateway** | Express Server (`:5050`) | Serves as the single client entrypoint. Dispatches API routes, enforces rate limits, queries SQLite, proxies ML requests to Python (`:8000`), and automatically falls back to local heuristic algorithms if Python is offline. |
| **ML Engine** | FastAPI Server (`:8000`) | Computes disruption probabilities, extracts signed SHAP contributions, generates 48h confidence intervals, and calculates NLP triage entities. |
| **Storage** | SQLite & GeoJSON | Provides indexed settlement lookups, SRTM 30m elevation contours, and the append-only dispatch audit log. |

### 2.2 Graceful Gateway Fallback Mechanism
A core tenet of AI-LOGIX is **fault tolerance in disaster zones**:
1. When the client makes a request to `/api/risk/evaluate`, the Node gateway attempts to delegate the calculation to `http://localhost:8000/predict` and `http://localhost:8000/explain`.
2. If Python is unreachable (timeout $> 800\text{ms}$ or connection refused):
   * Node gateway catches the error.
   * Evaluates the risk using its internal deterministic geotechnical rule engine (`backend/services/riskEngine.js`).
   * Appends a header/property: `engine: "node-fallback-rule-based"`, `isFallback: true`.
   * UI displays a prominent warning badge: `⚠️ ML Microservice Offline: Running local geotechnical fallback model`.

---

## 3. Directory & Folder Structure

The project strictly follows the **improve-in-place** pattern, preserving existing folder hierarchies and extending them cleanly:

```
ai-logistics-platform/
├── backend/
│   ├── config/
│   │   └── thresholds.json        # Centralized hazard thresholds & limits
│   ├── routes/
│   │   ├── corridors.js           # Objective 06 Case-study corridors
│   │   ├── multimodal.js          # Objective 01 & 04 Transport modes & routing
│   │   ├── risk.js                # Objective 02 Risk evaluation & SHAP
│   │   ├── routing.js             # Objective 04 Route optimization
│   │   ├── villages.js            # Objective 03 Settlements & SHRUG pagination
│   │   ├── triage.js              # Objective 05 NLP distress parser & SOS queue
│   │   └── metrics.js             # Latency, accuracy, and telemetry endpoint
│   ├── services/
│   │   ├── db.js                  # Unified SQLite connection & audit logger
│   │   ├── weatherService.js      # Open-Meteo client with offline cache
│   │   ├── settlementRegistry.js  # SHRUG settlement repository & indexing
│   │   └── riskEngine.js          # Geotechnical rule engine (Gateway fallback)
│   ├── server.js                  # Gateway entrypoint (Port 5050)
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── images/                # Fallback visuals & HUD assets
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ElevationTransect.jsx # Objective 04 Dynamic elevation curve
│   │   │   ├── MLRiskSimulator.jsx   # Objective 02 Signed SHAP waterfall
│   │   │   ├── MultimodalPanel.jsx   # Objective 01 Transport comparison
│   │   │   ├── DisasterModePanel.jsx # Objective 05 Crisis HUD & SOS
│   │   │   ├── VillageTable.jsx      # Objective 03 Paginated SHRUG table
│   │   │   ├── CaseStudySelector.jsx # Objective 06 Corridor switcher
│   │   │   ├── Sidebar.jsx           # Responsive scrollable navigation
│   │   │   └── Toast.jsx             # Global alert & error toast system
│   │   ├── context/
│   │   │   ├── CommandRoleContext.jsx # 4 Perspective roles & permissions
│   │   │   └── LanguageContext.jsx    # English / Hindi / Kannada localization
│   │   ├── utils/
│   │   │   └── formatters.js         # Standard formatters (IST, ₹, km, m, kg)
│   │   ├── services/
│   │   │   └── api.js                # Client API connector with fallback states
│   │   ├── index.css                 # Master CSS Design System tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── ml-service/
│   ├── main.py                    # FastAPI server entrypoint (Port 8000)
│   ├── model.py                   # Random Forest + TreeSHAP pipeline
│   ├── triage_nlp.py              # Distress message parser
│   ├── requirements.txt           # Scikit-learn, FastAPI, Uvicorn, SHAP
│   └── data/                      # Training datasets & serialized model weights
│
├── data/
│   ├── shrug_keys.db              # 585,179 settlement keys SQLite database
│   └── srtm.geojson               # High-resolution SRTM 30m DEM elevation vectors
│
├── PRD.md                         # Product Requirements Document
├── DESIGN.md                      # UI/UX & Design Tokens Specification
├── ARCHITECTURE.md                # System Architecture & Technical Contract
├── DATABASE.md                    # Database Schemas & Data Model
├── API.md                         # REST API Specification
└── AGENTS.md                      # Agent Pair-Programming & Coding Discipline
```

---

## 4. Single Data Layer Architecture

To eliminate inconsistency across pages (Issue A7 and A8):
1. **Settlement Records:** A single SQLite table `settlements` (derived from `shrug_keys.db`) is the sole authority for names, populations, coordinates, elevation, and accessibility scores. No component or route may hardcode divergent village values.
2. **Thresholds & Limits:** All operational cutoffs (rainfall danger line, drone ceiling, river draft, wind limits) reside in `backend/config/thresholds.json`. Modifying a threshold instantly propagates to both Node and frontend.
3. **Audit Log:** Every emergency dispatch, mode override, and triage decision is written to the SQLite `dispatch_audit_log` table with an ISO UTC string and formatted in IST (`UTC+05:30`).

---

## 5. Security & Environment Configuration

1. **Secrets & Configurations:**
   * Handled via `backend/.env` (and documented in `backend/.env.example`).
   * Never hardcode API keys, host ports, or database paths.
2. **Security Headers:**
   * Enforced on all Gateway responses: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`.
3. **Input Sanitization & Validation:**
   * Express payload limit constrained to `1mb`.
   * Rate limiting: `150 requests / minute / IP`.
   * Pydantic validation on FastAPI rejecting out-of-bounds sensory values (e.g. slope $> 90^\circ$ or rainfall $< 0$).

---

## 6. Deployment & Single-Command Launch

### 6.1 Local Development (Single Command)
The root `package.json` configures `concurrently` to start all services simultaneously:
```bash
npm run dev
```
* Frontend starts on `http://localhost:5173`
* Node Gateway starts on `http://localhost:5050`
* Python FastAPI starts on `http://localhost:8000`

### 6.2 Docker Deployment
`docker-compose.yml` orchestrates three containerized services:
* `frontend`: Nginx serving production Vite build.
* `backend`: Node.js Alpine runtime with mounted SQLite volume.
* `ml-service`: Python 3.10 slim runtime with pre-loaded Scikit-learn model.

---

## 7. Assumptions & Approvals

### 7.1 Assumptions
* Node.js v20+ with built-in SQLite support (`node:sqlite`) is available on the host.
* Python 3.10+ is available locally for running `ml-service`.

### 7.2 Decisions Needing Approval
* [x] **Architecture Approved:** ARCHITECTURE.md established as system technical contract.
* [ ] **FastAPI Setup:** Confirm creating Python virtual environment in `ml-service/` for Scikit-learn and SHAP dependencies.
