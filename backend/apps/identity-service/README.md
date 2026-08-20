# Identity and Access Management Service

[![Service](https://img.shields.io/badge/Service-Identity%20Service-blue.svg)](#)
[![Port](https://img.shields.io/badge/Port-3001-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-NestJS%2010-red.svg)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2015%20(TypeORM)-purple.svg)](#)

The **Identity Service** manages authentication, cryptographic authorization tokens (JWT), user registration, Role-Based Access Control (RBAC), and physician-patient assignment mappings across the Visual-RAG Ecosystem.

---

## Architecture and Responsibilities

- **Authentication**: Validates user credentials with case-insensitive email parsing and salted bcrypt hash comparison.
- **Token Minting**: Issues cryptographically signed JWT access tokens containing user claims (`sub`, `email`, `role`).
- **Role-Based Access Control**: Differentiates capabilities between `DOCTOR` (Surgeon) and `PATIENT` roles.
- **Patient Relationship Management**: Handles doctor-patient associations (`doctorId` foreign keys) and search queries by national ID (Cédula), Name, or Email.

---

## REST API Endpoints

### Authentication Routes (`/auth`)
- `POST /auth/login` - Authenticates user with `{ email, password }` and returns `{ access_token, user }`.
- `POST /auth/register` - Registers a new user with role and profile metadata.

### User and Directory Routes (`/users`)
- `GET /users/patients` - Retrieves all registered postoperative patients.
- `GET /users/search-patients?q=:query` - Searches patients by national ID (Cédula), name, or email.
- `GET /users/doctor-patients/:doctorId` - Retrieves patients currently assigned to a given surgeon.
- `POST /users/assign-patient` - Assigns a patient to a doctor `{ patientId, doctorId }`.
- `POST /users/unassign-patient` - Unbinds a patient from a doctor's active watchlist `{ patientId }`.
- `GET /users/:id` - Fetches comprehensive clinical profile of a user by UUID.
- `POST /users/profile/:id` - Updates clinical and contact credentials (phone, specialty, license number, hospital).

---

## Configuration and Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `IDENTITY_SERVICE_PORT` | `3001` | HTTP port where the service listens. |
| `DB_HOST` | `localhost` | PostgreSQL host. |
| `DB_PORT` | `5432` | PostgreSQL port. |
| `DB_USERNAME` | `postgres` | Database username. |
| `DB_PASSWORD` | `1234` | Database password. |
| `DB_DATABASE` | `visual_rag_db` | Target PostgreSQL database name. |
| `JWT_SECRET` | `secret` | Secret key for signing and verifying JWT tokens. |

---

## Running the Service

```bash
# Development mode
npm run start:identity:dev

# Production build
npm run build identity-service
node dist/identity-service/src/main.js
```
