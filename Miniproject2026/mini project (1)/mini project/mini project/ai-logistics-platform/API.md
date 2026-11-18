# AI-LOGIX — API Specification & Interface Contract (API.md)
**Project Title:** AI-Driven Multi-Modal Rural Logistics & Disaster Management Platform  
**Gateway URL:** `http://localhost:5050`  
**ML Microservice URL:** `http://localhost:8000`  
**Status:** Living REST API Specification & Contract

---

## 1. Unified Request / Response & Error Protocol

All API responses follow a consistent JSON envelope:

### 1.1 Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestampIst": "2026-10-21 11:15:00 IST",
    "engine": "fastapi-random-forest | node-fallback-rule-based",
    "isSimulatedDemoData": true | false
  }
}
```

### 1.2 Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | RESOURCE_NOT_FOUND | RATE_LIMIT_EXCEEDED | SERVICE_DEGRADED",
    "message": "Human-readable explanation of what went wrong",
    "field": "rainfallMmHr (if applicable)",
    "allowedRange": "0 to 250 mm/h"
  },
  "timestampIst": "2026-10-21 11:15:00 IST"
}
```

---

## 2. Gateway API Endpoints (`http://localhost:5050`)

### 2.1 System Health & Observability
* **`GET /health`**
  * **Purpose:** Checks live status of Gateway, Python ML microservice, SQLite database, and Open-Meteo weather feed.
  * **Response:**
    ```json
    {
      "status": "HEALTHY",
      "version": "2.5.0",
      "services": {
        "gateway": "UP",
        "sqliteAppState": "UP",
        "shrugDatabase": "UP",
        "fastApiMlService": "UP",
        "weatherFeed": "CACHED_OFFLINE"
      },
      "timestampIst": "2026-10-21 11:15:00 IST"
    }
    ```
* **`GET /metrics`** (Fixes Issue A5)
  * **Purpose:** Exposes real measured latency, request count, model ROC-AUC score, and memory utilization to replace unverified marketing claims.
  * **Response:**
    ```json
    {
      "latencyP95Ms": 14.2,
      "totalRequests": 1840,
      "modelAccuracy": 0.892,
      "modelRocAuc": 0.931,
      "activeEngineVersion": "RandomForest-v1.4-SHAP",
      "timestampIst": "2026-10-21 11:15:00 IST"
    }
    ```

---

### 2.2 Objective 01: Multi-Modal Transport Endpoints
* **`GET /api/multimodal/modes`**
  * **Purpose:** Returns specifications for the 4 core transport modes (Road, Rail, Waterway, Cargo UAV).
* **`POST /api/multimodal/recommend`**
  * **Purpose:** Dynamic mode switch decision engine.
  * **Request Body:**
    ```json
    {
      "distanceKm": 85,
      "payloadWeightKg": 60,
      "urgencyLevel": "STANDARD | HIGH_URGENCY | CRITICAL_EMERGENCY",
      "weatherCondition": "Clear | Moderate Rain | Severe Rain / Landslide | Gale Winds",
      "terrainType": "Mountain | Riverine | Desert"
    }
    ```
  * **Response:** Returns recommended mode, confidence, duration, estimated cost in INR (`₹`), carbon emissions in $\text{kg CO}_2$, and plain-language rationale.

---

### 2.3 Objective 02: Disruption Risk & SHAP Endpoints
* **`POST /api/risk/evaluate`**
  * **Purpose:** Primary route-level disruption risk endpoint. Proxies to Python FastAPI (`:8000/predict` + `:8000/explain`) with automatic Node gateway fallback.
  * **Request Body:**
    ```json
    {
      "rainfallMmHr": 65.0,
      "windSpeedKmh": 38.0,
      "soilSaturationPct": 72.0,
      "slopeGradientDeg": 24.0,
      "pastIncidentsScale": 6,
      "terrainType": "High Alpine / Glacial"
    }
    ```
  * **Validation Rules:**
    * `rainfallMmHr`: $0.0 \le x \le 250.0$
    * `windSpeedKmh`: $0.0 \le x \le 180.0$
    * `soilSaturationPct`: $0.0 \le x \le 100.0$
    * `slopeGradientDeg`: $0.0 \le x \le 90.0$
  * **Response:**
    ```json
    {
      "disruptionProbability": 0.68,
      "category": "MODERATE | CRITICAL",
      "signedShapWaterfall": {
        "baseExpectedProbability": 0.32,
        "contributions": [
          { "factor": "Rainfall Intensity", "featureValue": "65 mm/h", "shapValue": +0.22 },
          { "factor": "Slope Gradient", "featureValue": "24 deg", "shapValue": +0.14 },
          { "factor": "Soil Saturation", "featureValue": "72%", "shapValue": +0.08 },
          { "factor": "Vegetation Cover", "featureValue": "High Alpine", "shapValue": -0.08 }
        ],
        "finalProbability": 0.68
      },
      "activeHazards": ["Rainfall Overwash", "Pass Soil Saturation"],
      "operationalDirectives": ["Restrict standard trucks", "Prepare drone corridor"]
    }
    ```

---

### 2.4 Objective 03: Settlements & SHRUG Search Endpoints
* **`GET /api/villages`**
  * **Query Parameters:**
    * `page`: integer (default `1`)
    * `limit`: integer (default `25`, max `100`)
    * `corridorId`: string (optional filter)
    * `borderOnly`: boolean (optional filter)
    * `search`: string (case-insensitive substring match)
    * `sortBy`: `accessScore | population | seasonalCutoffDays`
    * `sortOrder`: `asc | desc`
  * **Response:** Returns paginated list, total count, total pages, and active filter metadata.
* **`GET /api/villages/export-csv`**
  * **Purpose:** Streams a filtered CSV download of settlement records for external relief planning.
* **`GET /api/villages/:shrid`**
  * **Purpose:** Single settlement inspection by SHRUG ID.

---

### 2.5 Objective 04: Route Intelligence & SRTM Endpoints
* **`GET /api/routing/corridor-transect/:corridorId`**
  * **Purpose:** Computes SRTM 30m DEM elevation profile along corridor waypoints.
  * **Query Parameters:** `exaggeration=1 | 3 | 5`
  * **Response:**
    ```json
    {
      "corridorId": "corridor-desert",
      "metrics": {
        "minElevationM": 195,
        "maxElevationM": 224,
        "elevationGainM": 29,
        "maxSlopeDeg": 2.1,
        "isNearlyFlat": true
      },
      "profile": [
        { "distanceKm": 0, "elevationM": 195, "slopeDeg": 0.4, "slopeCategory": "GREEN" },
        { "distanceKm": 12, "elevationM": 204, "slopeDeg": 1.2, "slopeCategory": "GREEN" }
      ]
    }
    ```

---

### 2.6 Objective 05: Disaster Commander & SOS Triage
* **`POST /api/triage/nlp-parse`**
  * **Purpose:** NLP parser taking unstructured distress message $\rightarrow$ structured triage fields.
  * **Request Body:**
    ```json
    {
      "rawMessage": "Village cut off near Zanskar bridge. 6 elderly patients need urgent insulin and rations immediately."
    }
    ```
  * **Response:**
    ```json
    {
      "extractedLocation": "Zanskar Outpost",
      "matchedShrid": "11-01-001-00001-000001",
      "urgencyLevel": "CRITICAL",
      "headcount": 6,
      "suppliesNeeded": ["Insulin", "Emergency Rations"],
      "recommendedVehicle": "Cargo UAV Parachute Drop",
      "confidenceScore": 0.94
    }
    ```
* **`POST /api/disaster/dispatch`**
  * **Purpose:** Approves and logs an emergency resource dispatch.
  * **Request Body:**
    ```json
    {
      "sosId": "sos-101",
      "assignedVehicle": "UAV-7 Parachute Unit",
      "officerRole": "NDRF Tactical Commander",
      "triageScore": 92,
      "officerOverride": false,
      "overrideReason": null
    }
    ```
  * **Behavior:** Inserts audit record into SQLite `dispatch_audit_log` with IST timestamp and returns generated audit ID.
* **`GET /api/disaster/audit-log`**
  * **Purpose:** Fetches chronological dispatch history for NDRF and District DM review.

---

## 3. Python FastAPI Endpoints (`http://localhost:8000`)

| Endpoint | Method | Input Schema | Purpose |
| :--- | :--- | :--- | :--- |
| `/predict` | `POST` | `RiskInputSchema` | Computes disruption probability via Scikit-learn Random Forest. |
| `/explain` | `POST` | `RiskInputSchema` | Computes signed feature contributions via TreeSHAP. |
| `/forecast` | `GET` | `corridor_id: str` | Returns 48-hour risk forecast with confidence band. |
| `/triage` | `POST` | `TriageTextSchema` | Extracts distress entities (location, headcount, urgency). |
| `/health` | `GET` | *None* | Verifies Python process, loaded model, and RAM usage. |
| `/metrics` | `GET` | *None* | Reports internal inference latency and accuracy metrics. |

---

## 4. Rate Limiting, Security & Privacy

1. **Rate Limiting:** Enforced at gateway level (`150 requests/min/client IP`). Exceeding returns `HTTP 429 Too Many Requests`.
2. **Data Privacy:** Settlement casualty headcounts and officer override notes are stored locally in the offline SQLite database and never sent to external cloud servers.
3. **CORS:** Configured to restrict origins to local dev ports (`5173`) and designated deployment domains.

---

## 5. Assumptions & Approvals

### 5.1 Assumptions
* Express handles routing and CORS; FastAPI operates as an internal microservice accessed by the Node gateway.
* If FastAPI is not running, all `/api/risk/*` and `/api/triage/*` endpoints seamlessly fallback to the built-in Node.js rules engine without failing the client request.

### 5.2 Decisions Needing Approval
* [x] **API Specification Approved:** API.md established as integration contract.
* [ ] **API Versioning:** Confirm keeping routes unversioned (`/api/*`) for simplicity or prefixing as `/api/v1/*`.
