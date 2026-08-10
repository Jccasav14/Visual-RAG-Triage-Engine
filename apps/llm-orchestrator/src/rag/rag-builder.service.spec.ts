import { RagBuilderService } from './rag-builder.service';

describe('RagBuilderService', () => {
  it('should build structured action plan', () => {
    const builder = new RagBuilderService();
    const plan = builder.buildActionPlan('tkt_1', 'raw text');
    expect(plan.ticketId).toBe('tkt_1');
    expect(plan.recommendedSteps.length).toBe(2);
  });
});
