export enum SeverityLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}

export interface TriageTicket {
  ticketId: string;
  userId: string;
  imageReferenceUrl: string;
  contextId: string;
  severity: SeverityLevel;
  status: 'PENDING' | 'CLASSIFIED' | 'PLAN_GENERATED' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}
