export const REDIS_STREAMS = {
  IMAGE_TRIAGE_STREAM: 'stream:image:triage',
  CLASSIFICATION_STREAM: 'stream:triage:classified',
  RAG_PLAN_STREAM: 'stream:rag:plan'
} as const;

export const REDIS_PUBSUB_CHANNELS = {
  CRITICAL_ALERTS: 'channel:alerts:critical',
  AUDIT_EVENTS: 'channel:audit:events'
} as const;
