export interface EmailNotificationPayload {
  toEmail: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
}

export interface TelemetryEventPayload {
  distinctId: string;
  eventName: string;
  properties: Record<string, any>;
}
