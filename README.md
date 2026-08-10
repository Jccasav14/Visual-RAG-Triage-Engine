# Visual-RAG Triage Engine

Visual-RAG Triage Engine is an enterprise Edge-AI assisted visual assessment platform designed under an event-driven architecture and Edge Computing model.

## Monorepo Layout & Topology

- `apps/api-gateway`: NestJS API Gateway (JWT, Rate Limiting, Proxying)
- `apps/identity-service`: NestJS Supabase Auth wrapper & RBAC Profile Manager
- `apps/triage-core-service`: NestJS Core Logic & Context Orchestrator
- `apps/vision-ai-worker`: FastAPI Python ML computer vision worker consuming Redis Streams
- `apps/llm-orchestrator`: NestJS External AI (Gemini/OpenAI) adapter & Privacy PII Filter
- `apps/notification-service`: NestJS SendGrid & PostHog async notification engine
- `apps/audit-search-service`: NestJS Elasticsearch async audit indexer
- `apps/mobile-app`: React Native Edge visual triage mobile client
- `k8s/`: GitOps ArgoCD & Kubernetes (K3s/K3d) manifests

## Quickstart

```bash
docker-compose -f docker/docker-compose.yml up -d
npm install
npm run start
```
