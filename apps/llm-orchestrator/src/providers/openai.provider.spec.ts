import { OpenAIProvider } from './openai.provider';

describe('OpenAIProvider', () => {
  it('should query openai mock', async () => {
    const provider = new OpenAIProvider();
    const res = await provider.queryOpenAI('test prompt');
    expect(res).toContain('OpenAI');
  });
});
