# AI-LOGIX: Multi-Modal Rural Logistics & Disaster Management Platform

## 🚀 Quick Start (How to Run)

All microservices (Node.js Gateway, Python ML Service with TreeSHAP, and React/Vite Frontend) have been configured and verified for your system.

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

| Service | Port | Endpoint |
| :--- | :--- | :--- |
| **Frontend Web Console** | `:5173` | [http://localhost:5173/](http://localhost:5173/) |
| **Node.js Logistics Gateway** | `:5050` | [http://localhost:5050/](http://localhost:5050/) |
| **Gateway Health Check** | `:5050` | [http://localhost:5050/health](http://localhost:5050/health) |
| **Python ML Microservice (FastAPI)** | `:8000` | [http://localhost:8000/health](http://localhost:8000/health) |

---

## 🧪 Testing & Verification

To run the automated backend test suite (13 integration tests):
```bash
npm test
```

To build the frontend for production:
```bash
npm run build
```

