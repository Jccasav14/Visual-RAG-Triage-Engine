export interface AuditLogEntry {
  auditId: string;
  serviceName: string;
  eventType: string;
  userId?: string;
  details: Record<string, any>;
  timestamp: string;
}
