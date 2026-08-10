export interface ImageUploadedEventPayload {
  eventId: string;
  eventType: 'IMAGE_UPLOADED_FOR_TRIAGE';
  timestamp: string;
  payload: {
    ticketId: string;
    userId: string;
    imageReferenceUrl: string;
    contextId: string;
    priority: string;
  };
}
