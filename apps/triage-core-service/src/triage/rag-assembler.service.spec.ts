import { RagAssemblerService } from './rag-assembler.service';

describe('RagAssemblerService', () => {
  it('should assemble prompt string', () => {
    const service = new RagAssemblerService();
    const prompt = service.assemblePrompt({ primaryClass: 'Fracture', confidenceScore: 0.95 }, { summary: 'Patient profile' });
    expect(prompt).toContain('Fracture');
  });
});
