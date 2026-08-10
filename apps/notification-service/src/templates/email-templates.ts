export const EmailTemplates = {
  CRITICAL_ALERT: (ticketId: string, severity: string) => `
    <h1>Urgent Triage Alert</h1>
    <p>Ticket ID <strong>${ticketId}</strong> evaluated with severity <strong>${severity}</strong>.</p>
  `
};
