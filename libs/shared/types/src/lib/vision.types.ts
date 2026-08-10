export interface VisualClassificationResult {
  ticketId: string;
  primaryClass: string;
  confidenceScore: number;
  detectedFeatures: string[];
  suggestedSeverity: string;
  processedTimestamp: string;
}
