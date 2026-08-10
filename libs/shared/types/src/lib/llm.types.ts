export interface ActionStep {
  stepNumber: number;
  actionTitle: string;
  description: string;
  urgency: 'IMMEDIATE' | 'WITHIN_24H' | 'ROUTINE';
}

export interface LLMActionPlan {
  planId: string;
  ticketId: string;
  summary: string;
  recommendedSteps: ActionStep[];
  disclaimer: string;
  modelUsed: string;
  generatedAt: string;
}
