# 🚪 API Gateway Service

[![Service](https://img.shields.io/badge/Service-API%20Gateway-blue.svg)](#)
[![Port](https://img.shields.io/badge/Port-3050-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-NestJS%2010-red.svg)](#)
[![Docs](https://img.shields.io/badge/Swagger-OpenAPI%203.0-purple.svg)](#)

The **API Gateway** acts as the single unified ingress point for external clients (Mobile Application and Web Portal), handling routing, reverse proxying, and Swagger API aggregation across all microservices.

---

## 🏗️ Architecture & Routing Table

All external HTTP requests are routed securely to internal downstream microservices:

| Incoming Path Prefix | Target Microservice | Destination Port |
| :--- | :--- | :--- |
| `/auth/*` | **Identity Service** | `http://localhost:3001` |
| `/users/*` | **Identity Service** | `http://localhost:3001` |
| `/triage/*` | **Triage Core Service** | `http://localhost:3002` |
| `/llm/*` | **LLM Orchestrator** | `http://localhost:3003` |
| `/vision/*` | **Vision AI Worker** | `http://localhost:8000` |

---

## 📚 Unified Swagger API Documentation

When running, the API Gateway exposes an aggregated interactive Swagger interface:
- **URL:** `http://localhost:3050/api/docs`

---

## ⚙️ Configuration & Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `API_GATEWAY_PORT` | `3050` | HTTP port where the Gateway listens. |
| `IDENTITY_SERVICE_URL` | `http://localhost:3001` | URL to downstream Identity Service. |
| `TRIAGE_SERVICE_URL` | `http://localhost:3002` | URL to downstream Triage Service. |
| `LLM_SERVICE_URL` | `http://localhost:3003` | URL to downstream LLM Service. |
| `VISION_SERVICE_URL` | `http://localhost:8000` | URL to downstream Vision AI Service. |

---

## 🚀 Running the Service

```bash
# Development mode
npm run start:gateway:dev

# Production build
npm run build api-gateway
node dist/api-gateway/src/main.js
```
