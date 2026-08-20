# Web Portal (React 18 and Vite)

[![Client](https://img.shields.io/badge/Client-Web%20Portal-blue.svg)](#)
[![Port](https://img.shields.io/badge/Port-5173-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-React%2018%20%7C%20Vite-cyan.svg)](#)
[![Icons](https://img.shields.io/badge/Icons-Lucide%20React-orange.svg)](#)

The **Web Portal** is a responsive web application designed for hospital workstations, desktop browsers, and tablets. It provides distinct interfaces for surgeons and patients.

---

## User Dashboards

### 1. Surgeon Clinical Dashboard (`DoctorDashboard.tsx`)
- **Assigned Patients Manager**: View active surgical recovery patients, search by National ID (Cédula) or name, and manage assignments.
- **Ficha Postoperatoria Editor**: Author and customize procedural guidelines, prohibition lists, allowed hygiene actions, and emergency alarm thresholds.
- **Vision AI Telemetry Console**: Monitor real-time CNN model metrics (97.4% precision, ~42ms latency) and explore all 10 wound healing classifications.
- **Professional Profile Settings**: Update medical registration numbers (MSP), surgical specialties, and hospital credentials.

### 2. Patient Telemedicine Dashboard (`PatientDashboard.tsx`)
- **Multimodal Photo Evaluator**: Upload wound photographs directly from disk or trigger device webcams.
- **Virtual Doctor Assistant (Visual-RAG)**: Receive day-specific recovery plans synthesized by Google Gemini 2.5 Flash and Groq Llama 3.3.
- **Dynamic Recovery Timeline**: Visual countdown of recovery days (`Day N of M`) and upcoming suture removal appointments.

---

## Configuration

Environment configurations are defined in `frontend/.env`:

```env
VITE_API_URL=http://localhost:3050
VITE_IDENTITY_URL=http://localhost:3001
VITE_TRIAGE_URL=http://localhost:3002
VITE_LLM_URL=http://localhost:3003
VITE_VISION_URL=http://localhost:8000
```

---

## Running the Web Portal

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
