import { LlmService } from './llm.service';

describe('LLMService', () => {
  it('should generate plan', async () => {
    const mockSanitizer = { scrubSensitiveData: (t: string) => t };
    const mockProvider = { query: async () => 'raw output' };
    const mockRag = { buildActionPlan: () => ({ planId: 'p1' }) };

    const service = new LlmService(mockSanitizer as any, mockProvider as any, mockRag as any);
    const plan = await service.generateActionPlan({ ticketId: 't1', promptContext: 'hello' });
    expect(plan.planId).toBe('p1');
  });
});
