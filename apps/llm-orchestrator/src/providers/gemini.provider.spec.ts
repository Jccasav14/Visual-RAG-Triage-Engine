import { GeminiProvider } from './gemini.provider';

describe('GeminiProvider', () => {
  it('should query gemini mock', async () => {
    const provider = new GeminiProvider();
    const res = await provider.queryGemini('test prompt');
    expect(res).toContain('Gemini');
  });
});
