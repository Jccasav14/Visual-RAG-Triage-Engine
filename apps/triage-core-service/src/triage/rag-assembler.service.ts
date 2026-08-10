import { Injectable } from '@nestjs/common';

@Injectable()
export class RagAssemblerService {
  assemblePrompt(classification: any, historyContext: any): string {
    return `Given visual classification ${classification.primaryClass} with confidence ${classification.confidenceScore} and user context ${historyContext.summary}, recommend triage action plan.`;
  }
}
