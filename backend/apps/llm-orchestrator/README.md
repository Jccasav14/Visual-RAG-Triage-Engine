# 🧠 LLM Orchestrator Service (Visual-RAG Pipeline)

[![Service](https://img.shields.io/badge/Service-LLM%20Orchestrator-blue.svg)](#)
[![Port](https://img.shields.io/badge/Port-3003-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-NestJS%2010-red.svg)](#)
[![LLM](https://img.shields.io/badge/Model-Gemini%202.5%20Flash%20%7C%20Groq%20Llama%203.3-orange.svg)](#)

The **LLM Orchestrator** is the intelligence engine of the platform. It implements a specialized **Medical Visual-RAG (Retrieval-Augmented Generation)** pipeline that combines visual wound classification, patient recovery day, reported symptoms, and surgeon restrictions into actionable clinical guidance.

---

## 🧬 Visual-RAG Pipeline Workflow

```mermaid
sequenceDiagram
    participant Client as 📱 Mobile / Web
    participant VisionAI as 👁️ Vision AI (Port 8000)
    participant TriageCore as 📋 Triage Core (Port 3002)
    participant Orchestrator as 🧠 LLM Orchestrator (Port 3003)
    participant Gemini as ☁️ Gemini 2.5 Flash / Groq

    Client->>VisionAI: 1. Upload Wound Photo
    VisionAI-->>Client: 2. Return Class & Severity
    Client->>Orchestrator: 3. Request Plan (Class, Symptoms, Day N)
    Orchestrator->>TriageCore: 4. Retrieve Active Restrictions & Directives
    TriageCore-->>Orchestrator: 5. Return Restrictions (Prohibitions, Care, Alerts)
    Orchestrator->>Gemini: 6. Synthesize Clinical Context & Medical Prompt
    Gemini-->>Orchestrator: 7. Return Structured Clinical Plan
    Orchestrator-->>Client: 8. Deliver Doctor Virtual Report
```

---

## 📡 REST API Endpoints

- `POST /llm/generate-personalized-plan`
  - Generates a day-specific, restriction-aware clinical report.
  - **Payload:**
    ```json
    {
      "patientId": "66666666-7777-8888-9999-000000000000",
      "classificationResult": "Cicatrización Normal",
      "severity": "LOW",
      "symptoms": "Slight localized tension, no fever",
      "recoveryDay": 3,
      "dayAssessmentNote": "Day 3 within expected healing timeline"
    }
    ```
  - **Response:**
    ```json
    {
      "patientId": "66666666-7777-8888-9999-000000000000",
      "recoveryDay": 3,
      "doctorVirtualPlan": "ESTADO DE LA HERIDA (DÍA 3):\n...",
      "source": "Gemini 2.5 Flash IA",
      "severity": "LOW",
      "generatedAt": "2026-08-20T00:30:00.000Z"
    }
    ```

---

## ⚙️ Configuration & Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `LLM_ORCHESTRATOR_PORT` | `3003` | HTTP port where the service listens. |
| `GEMINI_API_KEY` | *(Secret)* | Google Gemini AI API key. |
| `GROQ_API_KEY` | *(Secret)* | Groq Cloud API key (for high-speed Llama 3.3 fallback). |
| `TRIAGE_SERVICE_URL` | `http://localhost:3002` | Internal URL to Triage Core Service for context retrieval. |

---

## 🚀 Running the Service

```bash
# Development mode
npm run start:llm:dev

# Production build
npm run build llm-orchestrator
node dist/llm-orchestrator/src/main.js
```
