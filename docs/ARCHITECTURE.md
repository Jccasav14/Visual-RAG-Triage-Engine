# Architecture & Distributed Topology

## System Components & Interaction

1. **Client**: React Native mobile app captures visual inputs, runs local edge checks, submits via API Gateway.
2. **API Gateway**: Validates JWTs, enforces rate limits, routes requests to internal NestJS services.
3. **Triage Core**: Obtains historical context from Supabase, emits `IMAGE_UPLOADED_FOR_TRIAGE` event to Redis Streams.
4. **Vision AI Worker**: Python FastAPI service listens to Redis Streams, runs ML model classification, publishes `TRIAGE_CLASSIFIED`.
5. **LLM Orchestrator**: Receives prompt, scrubs PII, queries OpenAI/Gemini, builds structured RAG action plan.
6. **Notification Service**: Listens to Pub/Sub, dispatches alert emails via SendGrid and telemetry to PostHog.
7. **Audit Search Service**: Asynchronously indexes all logs and diagnostics to Elasticsearch cluster.
