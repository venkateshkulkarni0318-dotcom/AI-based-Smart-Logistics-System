# AI-LOGIX — Product Requirements Document (PRD)
**Project Title:** AI-Driven Multi-Modal Rural Logistics & Disaster Management Platform  
**Version:** 1.0.0 (Improve-in-Place)  
**Status:** Baseline Specification & Source of Truth  
**Target Roles:** NDRF Commander · District Magistrate (DM) · UAV Pilot · Field Outpost / Sarpanch

---

## 1. Problem Statement & Value Proposition

### 1.1 Problem Statement
Rural, tribal, and border settlements across India (specifically in high alpine zones like Ladakh, braided river deltas like the Brahmaputra, and arid borderlands like the Thar Desert) suffer from extreme transport vulnerability. Monsoons, avalanches, flash floods, and sandstorms regularly cut off road transit for weeks or months at a time. Traditional emergency logistics platforms rely on proprietary, fee-heavy cloud APIs, depend on constant internet access, lack multi-modal fallback intelligence (combining Road, Rail, Inland Waterways, and Cargo UAVs), and produce black-box risk scores without explainability.

### 1.2 Value Proposition
**AI-LOGIX** is a unified command-center platform engineered to be understood in **10 seconds** by non-technical administrative and disaster officers. It:
1. Orchestrates **multi-modal logistics** across four channels (Road, Rail, Waterway, Drone) to ensure life-saving goods reach isolated settlements when primary arteries collapse.
2. Predicts **route-level disruption risk** using a transparent Machine Learning ensemble backed by signed **SHAP explainability** and geotechnical physics.
3. Ingests real socio-spatial datasets (585,179 settlement keys from **SHRUG** and 30m **SRTM DEM** elevation data).
4. Delivers an **offline-first**, zero-cost architecture utilizing open-source geospatial tools, local rule-based failover, and cached telemetry.

---

## 2. Target Users & Role Perspectives

| Role Perspective | Primary Goal | Key Concerns | Cognitive Need in 10s |
| :--- | :--- | :--- | :--- |
| **NDRF Commander** | Tactical search, rescue, and emergency cargo air-drops in crisis areas. | Road cutoffs, helicopter/drone weather windows, survivor headcount. | Real-time SOS triage queue, immediate UAV deployment clearance, route blockage map. |
| **District Magistrate (DM)** | Strategic civil administration, inter-agency coordination, and depot stockpiles. | Resource shortages, budget/cost per tonne-km, civilian isolation duration. | Executive situation briefing, district stockpile depletion curves, cross-modal cost breakdown. |
| **UAV Pilot / Air Ops** | Safe and precise flight path navigation for autonomous delivery drones. | Wind shear, ridge elevation ceilings, battery reserve, GPS/NavIC locks. | Elevation transect with drone ceiling overlay, wind gust thresholds, payload vs range limits. |
| **Field Outpost / Sarpanch** | Local outpost resupply, village accessibility awareness, and medical requisition. | Medical stock-outs, pass opening dates, seasonal isolation windows. | Village accessibility score, nearest staged medical caches, simple emergency request status. |

---

## 3. Core User Journeys & End-to-End Scenarios

### 3.1 Primary Walkthrough: The Zanskar Pass Avalanche Cutoff
1. **Trigger:** Fresh snowfall of 45 cm combined with rising temperatures on the Western Himalayan Corridor triggers a critical avalanche hazard at Zanskar Pass.
2. **Detection:** The ML Disruption Risk Engine elevates route disruption probability from 28% to 92% (Risk Category: **CRITICAL**). Signed SHAP waterfall identifies `Rainfall/Snow +38%` and `Slope Gradient +24%` as the dominant drivers.
3. **Automatic Mode Switch:** The Route Intelligence Engine detects that Road transit is severed. It executes the fallback hierarchy:
   $$\text{Road (Blocked)} \longrightarrow \text{Rail (Unavailable in pass)} \longrightarrow \text{Waterway (Frozen)} \longrightarrow \text{Cargo UAV (Recommended)}$$
4. **SOS Triage:** An SOS message from Zanskar Outpost arrives (`"Avalanche has blocked main road pass. 4 critical patients require insulin, blood plasma, and thermal blankets."`). The NLP Triage parser flags urgency as `CRITICAL`, allocates priority score `94/100`, and selects UAV-7 Parachute Airlift.
5. **Execution & Audit Log:** NDRF Commander approves dispatch. The action is recorded with an IST timestamp into the immutable SQLite dispatch audit log.
6. **Delivery Confirmation:** ETA countdown timer activates (14 minutes). The village isolation indicator updates to show active airborne lifeline.

---

## 4. Functional Requirements by Objective

### Objective 01: Multi-Modal Transport Model
* **FR-1.1 [Current]:** Unified transport data schema comparing Road, Rail, Inland Waterway, and Autonomous Cargo UAV.
* **FR-1.2 [Current]:** Mode specification cards displaying speed, payload ceiling, cost per tonne-km, carbon intensity, and resilience index.
* **FR-1.3 [Planned]:** Dynamic mode switch recommendation engine with fallback hierarchy (`Road → Rail → Waterway → Drone`).
* **FR-1.4 [Planned]:** Multi-modal radar chart and payload/distance break-even chart (identifying exact crossover distance where drone beats ground transport).
* **FR-1.5 [Planned]:** Fully responsive transport comparison table with horizontal scroll and mobile card layout (fixing issue A3).

### Objective 02: ML Risk Predictor & Explainability
* **FR-2.1 [Current]:** Interactive risk simulation sliders for precipitation, wind speed, soil saturation, slope gradient, and historical incidents.
* **FR-2.2 [Current]:** Disruption probability gauge with categorized hazard states (LOW, MODERATE, HIGH, CRITICAL).
* **FR-2.3 [Planned]:** True signed SHAP waterfall visualization displaying base risk value ($\mathbb{E}[f(x)]$) and additive positive/negative feature contributions totaling the final probability (fixing issue A4).
* **FR-2.4 [Planned]:** Dual-axis 48-hour forecast with shaded uncertainty band and 7-day weather outlook.
* **FR-2.5 [Planned]:** Transparent model comparison card comparing Random Forest, XGBoost, Logistic Regression, and rule-based baseline on ROC-AUC, precision/recall, and calibration.

### Objective 03: Settlement Accessibility & SHRUG Database
* **FR-3.1 [Current]:** Settlement registry displaying population, elevation, isolation window (cutoff days/yr), and accessibility index (0–100).
* **FR-3.2 [Current]:** Border outpost and tribal settlement filtering.
* **FR-3.3 [Planned]:** Server-side pagination, search, and CSV export for 585,179 records loaded from `data/shrug_keys.db`.
* **FR-3.4 [Planned]:** Single source of truth across all pages: every settlement displays identical population, coordinates, elevation, and score (fixing issue A7).
* **FR-3.5 [Planned]:** Interactive settlement choropleth/scatter map and monthly isolation calendar heatmap.

### Objective 04: Route Intelligence & Terrain Elevation
* **FR-4.1 [Current]:** Route comparison table with haversine distance and transit metrics.
* **FR-4.2 [Current]:** SRTM elevation transect visualization along corridor waypoints.
* **FR-4.3 [Planned]:** Dynamic Y-axis auto-scaling per corridor with vertical exaggeration toggle ($1\times / 3\times / 5\times$) and `"Terrain is nearly flat"` low-relief indicator for Thar Desert (fixing issue A2).
* **FR-4.4 [Planned]:** Slope gradient classification on transect:
  * 🟢 Green: $<8^\circ$ (Standard ground vehicle)
  * 🟡 Amber: $8^\circ - 12^\circ$ (Heavy 4x4 / all-terrain clearance)
  * 🔴 Red: $>12^\circ$ (Heavy convoy limit / blockage risk)
  * ✈️ Cyan dashed line: Autonomous drone service ceiling (4,200 m).
* **FR-4.5 [Planned]:** Alternate route generation: Fastest, Safest, Cheapest, and Greenest options with cost and carbon differences.

### Objective 05: Disaster Commander & SOS Triage Console
* **FR-5.1 [Current]:** Disaster Mode emergency toggle activating crisis HUD.
* **FR-5.2 [Current]:** SOS triage queue for stranded villages and simulated asset dispatch buttons.
* **FR-5.3 [Planned]:** Replace broken/missing HUD imagery with an inline SVG/canvas emergency aerial HUD (fixing issue A1).
* **FR-5.4 [Planned]:** NLP Distress Message Triage Console: paste unstructured distress text $\rightarrow$ auto-extract location, urgency, headcount, and recommended vehicle with editable confidence chips.
* **FR-5.5 [Planned]:** Resource allocation visualizer (drones, barges, 6x6 convoys) and live ETA countdown timers.
* **FR-5.6 [Planned]:** One-page Executive Situation Briefing exportable as a clean PDF.
* **FR-5.7 [Planned]:** Immutable SQLite dispatch audit log capturing officer overrides with IST timestamps.

### Objective 06: Contrasting Case-Study Corridors
* **FR-6.1 [Current]:** Three geographic case studies: Ladakh Alpine (Mountain Pass), Brahmaputra Riverine (Floodplain Delta), and Thar Desert (Arid Frontier).
* **FR-6.2 [Planned]:** Side-by-side radar and matrix comparison evaluating transport resilience across all three corridors.
* **FR-6.3 [Planned]:** Historical disruption timeline and field-tested "Lessons Learned" cards.

---

## 5. Phase 2 Edge Cases & Operational Scenarios

All thresholds are centralized in `config/thresholds.json` and badged `"Simulated demo values"`.

### 5.1 Weather & Disaster Hazards (T1–T12)
1. **Cloudburst (T1):** Extreme rainfall ($>100\text{ mm/h}$) $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Switch: $\text{Road} \to \text{Drone}$. Action: *Move to higher ground. Urgent medical air-drop.*
2. **Flash Flood (T2):** River gauge above danger mark, soil moisture $>80\%$ $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Switch: $\text{Waterway off; Road} \to \text{Rail} \to \text{Drone}$. Action: *Avoid river crossings. Stay off low roads.*
3. **GLOF (Glacial Lake Outburst) (T3):** Lake moraine breach alert $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Switch: Valley modes suspended $\to$ $\text{Rail/Drone}$ on high ridges. Action: *Evacuate downstream settlements immediately.*
4. **Avalanche (T4):** Heavy snow ($>40\text{ cm}$), slope $>25^\circ$, warming temperature $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Switch: $\text{Road} \to \text{Drone}$. Action: *Pass closed. Do not proceed. Urgent air drops only.*
5. **Landslide (T5):** ML probability threshold breach $\rightarrow$ Risk: **HIGH–CRITICAL** $\rightarrow$ Switch: $\text{Road} \to \text{Rail} \to \text{Drone}$. Action: *Take marked bypass route on GIS map.*
6. **River Bank Erosion (T6):** Sustained flood discharge $\rightarrow$ Risk: **HIGH** $\rightarrow$ Switch: $\text{Waterway} \to \text{Road}$. Action: *Reroute barge to secondary reinforced jetty.*
7. **Cyclone (T7):** Wind speed $>65\text{ km/h}$ $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Switch: All modes suspended $\to$ $\text{Rail} \to \text{Road}$ post-event. Action: *Shelter in place. Resume only after clearance.*
8. **Heatwave / Sandstorm (T8):** Temp $>45^\circ\text{C}$ or visibility $<500\text{ m}$ $\rightarrow$ Risk: **HIGH** $\rightarrow$ Switch: Drone grounded; Road at night. Action: *Night convoys only. Carry auxiliary water.*
9. **Dense Fog (T9):** Visibility $<200\text{ m}$ $\rightarrow$ Risk: **MODERATE–HIGH** $\rightarrow$ Switch: Ground slowed; Drone grounded. Action: *Reduce convoy speed to 25 km/h.*
10. **Snowfall Pass Closure (T10):** Snow depth $>50\text{ cm}$ $\rightarrow$ Risk: **HIGH** $\rightarrow$ Switch: $\text{Road} \to \text{Drone}$. Action: *Pass blocked for season. Deploy cargo UAV corridor.*
11. **Earthquake (T11):** Magnitude $>5.5$ on Richter scale $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Switch: Hold Road/Rail until bridge scan $\to$ Drone first. Action: *Hold convoys. Conduct aerial bridge inspection.*
12. **Forest Fire (T12):** Fire thermal hotspot within 5 km $\rightarrow$ Risk: **HIGH** $\rightarrow$ Switch: Road detour; Drone no-fly near smoke. Action: *Divert convoy via designated perimeter bypass.*

### 5.2 Operational & Supply Chain Edge Cases (T13–T23)
13. **All Modes Unavailable (T13):** Road, Rail, River, Drone blocked $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Action: *Stage depot supplies. Escalate to State/Army Aviation command.*
14. **Drone Grounded (T14):** Wind $>55\text{ km/h}$, low battery, or NavIC satellite loss $\rightarrow$ Risk: **MODERATE** $\rightarrow$ Switch: $\text{Drone} \to \text{Road/Rail}$. Action: *Air space unsafe. Switch to ground transport.*
15. **Barge Stranded (T15):** River draft $<1.2\text{ m}$ $\rightarrow$ Risk: **MODERATE** $\rightarrow$ Switch: $\text{Waterway} \to \text{Road}$. Action: *Cargo offloaded at nearest ghat and shifted to trucks.*
16. **Rail Line Breached (T16):** Track ballast washout $\rightarrow$ Risk: **HIGH** $\rightarrow$ Switch: $\text{Rail} \to \text{Road} \to \text{Drone}$. Action: *Rail traffic stopped. Road convoy deployed.*
17. **Fuel Shortage (T17):** Depot diesel reserve $<3\text{ days}$ $\rightarrow$ Risk: **HIGH** $\rightarrow$ Switch: Prefer Rail/Drone; consolidate loads. Action: *Combine trip manifests to conserve fuel.*
18. **Convoy Breakdown (T18):** Telemetry ping lost $>45\text{ mins}$ $\rightarrow$ Risk: **MODERATE** $\rightarrow$ Action: *Dispatch relief utility vehicle to last known GPS waypoint.*
19. **Communication Blackout (T19):** Cellular network blackout $\rightarrow$ Risk: **HIGH** $\rightarrow$ Action: *Activate pre-planned route protocol and NavIC satellite text packets.*
20. **Multiple Simultaneous SOS (T20):** Distress queue exceeds fleet capacity $\rightarrow$ Risk: **HIGH** $\rightarrow$ Action: *Triage algorithm assigns scarce assets by highest vulnerability score.*
21. **Conflicting Priorities (T21):** Two outposts request identical vehicle $\rightarrow$ Risk: **HIGH** $\rightarrow$ Action: *Higher triage score wins. Officer override recorded in audit log.*
22. **Partial Delivery (T22):** Demand exceeds payload capacity $\rightarrow$ Risk: **MODERATE** $\rightarrow$ Action: *Split manifest: life-saving cargo via Drone now, bulk via convoy next trip.*
23. **Depot Stock-out (T23):** Critical medical stockpile reaches zero $\rightarrow$ Risk: **CRITICAL** $\rightarrow$ Action: *Automated mutual-aid requisition sent to adjacent district depot.*

### 5.3 Data Edge Cases (T24–T29)
24. **Missing DEM Tile (T24):** Display `"Terrain elevation data unavailable"`, fall back to coarse estimate, label as approximate.
25. **Unknown SHRUG Key (T25):** Return friendly rejection message, suggest nearest matching settlement, never crash.
26. **Duplicate Settlements (T26):** Detect duplicate records in data ingestion, merge or flag in data layer, display warning count.
27. **Outdated Weather Feed (T27):** Display `"Weather data is X hours old"` warning banner and switch to local offline cached forecast.
28. **Sensor Outlier (T28):** Identify values outside physical reality (e.g. rainfall $>400\text{ mm/h}$), flag as suspect, exclude from model.
29. **Impossible Input Values (T29):** Inline form validation blocking negative rainfall, negative distance, or slope $>90^\circ$.

---

## 6. Non-Functional Requirements

1. **Offline Demonstration:** The entire platform must run with zero internet connection. All weather, terrain, and ML features must fall back gracefully to local SQLite/JSON caches.
2. **Zero Paid APIs:** Only 100% free and open-source tools (Open-Meteo free tier, Leaflet, Chart.js/Recharts, SQLite, Python scikit-learn). No Google Maps, Mapbox, or OpenAI paid API keys.
3. **Accessibility & Usability:**
   * WCAG AA contrast ratios across both light and dark modes.
   * Every status indicator must utilize **Color + Icon + Text** (never color alone).
   * Full keyboard navigation support and ARIA labels on all interactive controls.
4. **Multilingual Architecture:** Built-in instant switching between **English**, **Hindi (हिन्दी)**, and **Kannada (ಕನ್ನಡ)**.
5. **Responsive Design:** Fluid layout adapting from **360px** (mobile smartphone) to **1920px** (large command-center projector screen).
6. **Standard Units & Timezone:**
   * Distance: $\text{km}$ · Elevation: $\text{m}$ · Slope: $\text{degrees}$ · Rainfall: $\text{mm/h}$ · Speed: $\text{km/h}$
   * Freight work: $\text{tonne-km}$ · Money: $\text{₹ (INR)}$
   * All timestamps formatted in Indian Standard Time: **IST ($\text{UTC}+05:30$)**.

---

## 7. Assumptions & Approvals

### 7.1 Assumptions
* The primary operational deployment runs locally on standard workstation laptops or offline district servers.
* The SHRUG dataset contains 585,179 settlement keys which can be efficiently indexed and queried using SQLite with WAL mode.
* When the Python FastAPI machine learning microservice is offline, the Node.js Express gateway seamlessly takes over with a local rule-based heuristic model.

### 7.2 Decisions Needing User Approval (Approval Gates)
* [x] **Document Approval:** PRD.md established as baseline source of truth.
* [ ] **ML Training Dataset Decision:** Confirm whether the Random Forest model will be trained on documented synthetic data calibrated to IMD benchmarks or public historical landslide/rainfall records.
* [ ] **Dual-Stack Run Workflow:** Confirm starting both Frontend (`5173`), Node Gateway (`5050`), and Python FastAPI (`8000`) via a single `npm run dev` script using `concurrently`.
