# AI-Driven Multi-Modal Rural Logistics & Disaster Management Platform (AI-LOGIX)

**Mini Project | Department of Computer Science & Engineering, NCET**

[![Architecture: Dual-Service](<https://img.shields.io/badge/Architecture-Dual--Service%20(Node%20%2B%20FastAPI)-blue>)](file:///./ARCHITECTURE.md)
[![Data: 100% Offline](<https://img.shields.io/badge/Data-100%25%20Offline%20(Zero%20Paid%20APIs)-emerald>)](file:///./PRD.md)
[![Explainability: TreeSHAP](https://img.shields.io/badge/Explainability-Exact%20TreeSHAP%20Additivity-purple)](file:///./API.md)
[![Database: SQLite WAL](https://img.shields.io/badge/Database-SQLite3%20WAL-orange)](file:///./DATABASE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](file:///./LICENSE)

An intelligent, risk-aware multi-modal logistics orchestration platform designed for rural connectivity, high-altitude border settlements, and emergency disaster relief operations across India.

---

## 🌐 Live System Endpoints

| Service                         | Port    | Local Endpoint                                                           | Description                                  |
| :------------------------------ | :------ | :----------------------------------------------------------------------- | :------------------------------------------- |
| **Frontend Web Console**        | `:5173` | [http://localhost:5173/](http://localhost:5173/)                         | React 18 + Vite Command Dashboard            |
| **Node.js Logistics Gateway**   | `:5050` | [http://localhost:5050/](http://localhost:5050/)                         | Express API Gateway & SQLite Audit Layer     |
| **System Health & Metrics**     | `:5050` | [http://localhost:5050/health](http://localhost:5050/health)             | Measured Telemetry & Latency Metrics         |
| **Python ML Microservice**      | `:8000` | [http://localhost:8000/health](http://localhost:8000/health)             | Scikit-learn Random Forest & TreeSHAP Engine |
| **Case Engine & Contingencies** | `:5050` | [http://localhost:5050/api/cases](http://localhost:5050/api/cases)       | 29 Hazard Scenarios (T1–T29)                 |
| **Settlement Registry (SHRUG)** | `:5050` | [http://localhost:5050/api/villages](http://localhost:5050/api/villages) | Remote & Border Outpost Database             |

---

## 🚀 Quick Start (Single Command)

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **npm**

### Option A: Windows 1-Click Launcher (Recommended for Windows)

Simply double-click [`start.bat`](file:///./start.bat) in File Explorer or run in terminal:

```bat
start.bat
# Or in PowerShell:
.\launch.ps1
```

_Automatically validates Node.js & Python environments, installs any missing dependencies, boots all 3 services concurrently, and opens the console in your default web browser._

### Option B: Node CLI Unified Launcher

```bash
# Launch all 3 services concurrently
npm start
```

_Frontend will open at [http://localhost:5173/](http://localhost:5173/)_

### Option B: Docker Compose

```bash
docker-compose up --build
```

### Option C: Independent Terminal Windows

```bash
# Terminal 1: Backend Gateway (:5050)
cd backend && node server.js

# Terminal 2: Python ML Microservice (:8000)
cd ml-service && python main.py

# Terminal 3: Frontend Dev Server (:5173)
cd frontend && npm run dev
```

---

## 🧪 Automated Testing & Validation

Run the complete backend integration test suite (13 automated test assertions):

```bash
npm test
# Or directly:
cd backend && node test_api.js
```

Validate frontend production build:

```bash
npm run build
```

---

## 🎯 The 6 Core Objectives Implementation

### [Objective 01: Multi-Modal Transport Optimization](file:///./frontend/src/pages/MultimodalPage.jsx)

- **Unified Transport Channels**: Road (4WD/6x6), Rail (Mountain feeder), Inland Waterway (River barge), and Aerial (Autonomous heavy-lift cargo UAV).
- **Spider Radar Chart**: Multi-dimensional capability comparison across Speed, Payload, Cost, Carbon, and Climate Resilience.
- **Break-Even Crossover Curve**: Identifies exact distance thresholds ($< 65\text{ km}$) where cargo drones surpass surface road convoys.
- **Cost vs Time Bubble Matrix**: Cost vs Transit Duration vs Carbon intensity with bubble radius proportional to payload capacity.
- **Mobile-Responsive Table**: Viewport-adaptive specification matrix with an instant Table View / Card View toggle readable at 360px.

### [Objective 02: ML Disruption Risk Predictor](file:///./frontend/src/pages/MLRiskPage.jsx)

- **Multi-Factor Predictive Vectors**: Precipitation intensity ($\text{mm/h}$), Peak wind shear velocity ($\text{km/h}$), Subsurface soil moisture saturation ($\%$) and SRTM 30m DEM slope gradient ($^\circ$).
- **True Signed TreeSHAP Explainability**: $\text{Base Value (32.0\%)} + \sum \phi_i = \text{Final Risk}$ with real-time auditability.
- **2D Vulnerability Heatmap**: Rainfall $\times$ Soil Saturation operational matrix identifying road failure boundaries.
- **48-Hour Disruption Forecast**: Predictive timeline with a shaded $90\%$ confidence envelope and 7-day corridor mobility index.
- **Model Benchmark Matrix**: Empirical validation comparing Random Forest, XGBoost, Logistic Regression, and IMD rules with confusion matrix and ROC-AUC metrics.

### [Objective 03: Settlement Accessibility Registry](file:///./frontend/src/pages/VillagesPage.jsx)

- **SHRUG v2.2 Integration**: Socioeconomic village linkage mapped to demographic census populations and health center distances.
- **12-Month Isolation Calendar Heatmap**: Monthly cut-off tracking for Himalayan snowbound settlements (Padum, Kaza, Kibber) and riverine delta floodplains (Majuli).
- **Population vs Cutoff Quadrant Scatter**: Maps vulnerable population clusters to prioritize pre-positioning depots before winter pass closures.

### [Objective 04: Route Intelligence & Optimization](file:///./frontend/src/pages/RoutesPage.jsx)

- **Geospatial Waypoint Routing**: Risk-aware waypoint routing using 3D DEM distance calculation.
- **Interactive UAV Flight Range & Battery Margin Ring**: Dynamic circular flight envelope that scales with payload weight (5kg - 25kg) and marks safe battery return-to-base boundaries.
- **Offline GeoJSON Export**: 1-click download of all corridor waypoints and risk metadata into standard `.geojson` format for QGIS, NavIC, and GPS devices.
- **Multi-Criteria Optimization Weights**: 3-way trade-off slider and presets (Emergency Air, Maximum Safety, Lowest Freight Cost, Eco Hybrid) with automatic path recommendation.
- **SRTM 30m DEM Elevation Transect**: Point-to-point elevation profile with $1\times/3\times/5\times$ relief exaggeration, auto-scaling Y-axis, cumulative ascent tracking, and low-relief status badging.

### [Objective 05: Disaster Management Center](file:///./frontend/src/pages/DisasterPage.jsx)

- **Executive Commander SITREP**: One-page printable briefing for District Magistrates and NDRF leadership (`window.print()` optimized).
- **Tactical Audio-Visual Alert System**: Procedural military-grade Web Audio sound synthesizer with crisis klaxon and dispatch chirps (100% offline, 0 audio assets).
- **ISRO NavIC Satellite Text & QR Packet Generator**: Encodes emergency manifests into compressed 140-character NavIC MSS telemetry telegrams and scannable offline QR patterns for total cellular blackout zones.
- **Tactical Mission Timeline (Gantt)**: Active multi-modal sortie tracking with real-time NavIC GPS coordinates, progress bars, and an IST "NOW" timeline marker.
- **AI Distress Message Parser (NLP Triage)**: Unstructured radio/SMS SOS message parser with automatic entity extraction and confidence chips.
- **Contingency Rule Engine (T1–T29)**: Complete 29-hazard automated case engine driven by `backend/config/thresholds.json`.

### Settlement Database & ML Enhancements

- **Medical & Rations Burn-Rate Depletion Predictor**: Computes daily consumption and exhaustion dates for insulin, blood units, grain, and antivenom against winter cutoff windows.
- **Counterfactual "What-If" Risk Mitigation**: Mathematical inverse-inference calculating exact threshold drops (rainfall, slope) required to reduce disruption probability below 40%.
- **Examiner / Viva Challenge Panel**: 1-click evaluator test harness simulating Zanskar Avalanches, Brahmaputra Monsoon Floods, and Thar Desert Dust Storms for project viva presentations.

### [Objective 06: Contrasting Case-Study Corridors](file:///./frontend/src/pages/CaseStudiesPage.jsx)

- **Cross-Regional Generalization**:
  1. _Western Himalayan Highland_ (Kargil to Padum / NH-301) — $3,657\text{m}$ ASL, $35^\circ$ slope, winter snowpack.
  2. _Brahmaputra Riverine Delta_ (Jorhat to Majuli Island) — Seasonal monsoon inundation, shallow barge lifelines.
  3. _Western Thar Desert_ (Jaisalmer to Longewala) — Low relief ($200\text{m}$), shifting sand dunes, thermal convoy limits.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["React 18 SPA (Vite :5173)"]
    Gateway["Node.js Express Gateway (:5050)"]
    FastAPI["Python ML Service (FastAPI :8000)"]
    DB[("SQLite 3 (WAL Mode)")]
    GeoData["Local Spatial Data (SRTM DEM 30m + SHRUG GeoJSON)"]

    Client -->|HTTP / JSON Envelopes| Gateway
    Gateway -->|Inference Query (:8000)| FastAPI
    FastAPI -.->|Timeout / Offline Fallback| Gateway
    Gateway -->|Read / Write Audit Log| DB
    Gateway -->|Local Geo Queries| GeoData
```

---

## 💡 Living Documentation & Blueprint Artifacts

- [PRD.md](file:///./PRD.md) — Comprehensive Product Requirements Document & Zanskar pass scenario.
- [DESIGN.md](file:///./DESIGN.md) — Design system, color tokens, typography, and dark/light mode rules.
- [ARCHITECTURE.md](file:///./ARCHITECTURE.md) — Dual-service topology, gateway fallback, and single data layer.
- [DATABASE.md](file:///./DATABASE.md) — SQLite schema, Mermaid ER diagram, and audit log specification.
- [API.md](file:///./API.md) — Complete REST API specification with request/response envelopes.
- [AGENTS.md](file:///./AGENTS.md) — Engineering guidelines, standard SI units, and change discipline.
- [VIVA_GUIDE.md](file:///./VIVA_GUIDE.md) — 20 Anticipated viva questions, elevator pitch, and live demo script.

---

## 🛡️ Key Non-Negotiable Standards Followed

1. **Zero Paid APIs / 100% Offline**: Open-source libraries only (Leaflet, SVG vectors, Open-Meteo offline SQLite cache).
2. **True Explainability**: Verified signed TreeSHAP values where Base Value + Contributions = Final Risk score.
3. **Data Integrity**: Real measured telemetry labeled with `[● Real Data / Measured Telemetry]`; hypothetical demo data labeled with `[● Simulated demo data]`.
4. **Standard Units**: All metrics formatted in SI units ($\text{km}$, $\text{m}$, $\text{mm/h}$, $\text{km/h}$, $\text{₹}$, $\text{kg}$, $\text{t-km}$) and timestamps in Indian Standard Time ($\text{IST, UTC+05:30}$).
5. **Human-Centric UX**: Simple/Technical view mode toggle and instant English / Hindi / Kannada localization.

---

## 👥 Authors

- **Dept. of Computer Science & Engineering, Nagarjuna College of Engineering & Technology (NCET)**
- Mini Project Academic Year 2026
