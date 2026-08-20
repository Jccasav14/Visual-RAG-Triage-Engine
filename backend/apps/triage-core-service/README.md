# Triage Core Service

[![Service](https://img.shields.io/badge/Service-Triage%20Core%20Service-blue.svg)](#)
[![Port](https://img.shields.io/badge/Port-3002-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-NestJS%2010-red.svg)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2015%20(TypeORM)-purple.svg)](#)

The **Triage Core Service** is the central clinical repository of the Visual-RAG platform. It manages postoperative medical restriction files (Ficha Postoperatoria), patient daily clinical logs, triage event audits, and PDF document metadata.

---

## Architecture and Entities

- **Medical Restrictions (`medical_restrictions`)**:
  - Stores surgeon-authored recovery parameters: `surgeryType`, `startDate`, `endDate`, `restDays`, `prohibitions`, `allowedActions`, `emergencyThresholds`, `allergies`, and follow-up appointment dates.
- **Daily Reports (`daily_reports`)**:
  - Stores clinical evaluations, patient symptom logs, wound photos references, recovery day metrics, and AI recommendations.
- **Triage Records (`triage_records`)**:
  - Audit trail storing timestamps, triage priorities (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), and raw image reference URLs.

---

## REST API Endpoints

### Clinical Restrictions (`/triage/medical-restrictions`)
- `POST /triage/medical-restrictions` - Creates or updates a patient's post-op recovery directive ficha.
- `GET /triage/patient-restrictions/:patientId` - Retrieves active surgeon directives for a specific patient.

### Triage Evaluations and Daily Reports (`/triage/daily-reports`)
- `POST /triage/evaluate` - Logs a new triage evaluation with priority rating and image reference.
- `POST /triage/daily-reports` - Saves an evaluated daily clinical report (symptoms, classification, doctor virtual plan).
- `GET /triage/daily-reports/:patientId` - Retrieves all historical reports for a patient.
- `GET /triage/history` - Returns platform-wide triage event history.

---

## Configuration and Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `TRIAGE_SERVICE_PORT` | `3002` | HTTP port where the service listens. |
| `DB_HOST` | `localhost` | PostgreSQL host. |
| `DB_PORT` | `5432` | PostgreSQL port. |
| `DB_USERNAME` | `postgres` | Database username. |
| `DB_PASSWORD` | `1234` | Database password. |
| `DB_DATABASE` | `visual_rag_db` | Target PostgreSQL database name. |

---

## Running the Service

```bash
# Development mode
npm run start:triage:dev

# Production build
npm run build triage-core-service
node dist/triage-core-service/src/main.js
```
