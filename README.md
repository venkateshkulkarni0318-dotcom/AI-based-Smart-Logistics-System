# AI-LOGIX: Multi-Modal Rural Logistics & Disaster Management Platform

> **Dept. of Computer Science & Engineering, NCET**  
> An offline-first, dual-engine AI platform engineered for complex rural terrain, disaster response, and resilient multi-modal supply chain dispatch.

---

## ⚡ Quick Start (How to Run in 1 Click)

All microservices (Node.js Express Gateway, Python ML Service with TreeSHAP, and React/Vite Frontend) have been configured and verified for your system.

### Option 1: 1-Click Launch (Windows)
Double-click `start.bat` in this folder or in PowerShell run:
```powershell
.\launch.ps1
```

### Option 2: Using npm
From this directory, run:
```bash
npm start
```

---

## 🌐 Live System URLs

Once started, the services will be accessible at:

| Service | Port | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Frontend Web Console** | `:5173` | [http://localhost:5173/](http://localhost:5173/) | Interactive GIS map, triage console & routing HUD |
| **Node.js Logistics Gateway** | `:5050` | [http://localhost:5050/](http://localhost:5050/) | Express API routing, SHRUG/SRTM geospatial provider |
| **Gateway Health Check** | `:5050` | [http://localhost:5050/health](http://localhost:5050/health) | API gateway health & feature verification |
| **Python ML Microservice** | `:8000` | [http://localhost:8000/health](http://localhost:8000/health) | Random Forest surrogate model with TreeSHAP explainability |

---

## 🧪 Testing & Verification

To run the automated backend test suite (14 end-to-end integration tests):
```bash
npm test
```

To build the frontend for production:
```bash
npm run build
```

---

## 📁 Project Architecture & Layout

- **`frontend/`**: Vite + React 18 + Tailwind CSS + Lucide Icons + Leaflet GIS HUD
- **`backend/`**: Node.js Express Gateway with SHRUG settlement data & SRTM elevation engine
- **`ml-service/`**: Python 3.13 microservice with Random Forest surrogate & TreeSHAP explainability engine
- **`docs/`**: Technical specification, PRD, Architecture, and Viva Voce Guide
