import { Injectable } from '@nestjs/common';

@Injectable()
export class RagBuilderService {
  buildActionPlan(ticketId: string, rawText: string) {
    return {
      planId: `plan_${Date.now()}`,
      ticketId,
      summary: 'Immediate action plan generated based on local visual classification and secure history.',
      recommendedSteps: [
        { stepNumber: 1, actionTitle: 'Isolate Area', description: 'Contain affected component or area immediately.', urgency: 'IMMEDIATE' },
        { stepNumber: 2, actionTitle: 'Schedule Inspection', description: 'Request tier-2 specialist review within 24 hours.', urgency: 'WITHIN_24H' }
      ],
      disclaimer: 'AI-assisted triage output. Always verify with certified domain expert.',
      generatedAt: new Date().toISOString()
    };
  }
}
