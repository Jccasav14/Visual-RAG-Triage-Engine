export default () => ({
  port: parseInt(process.env.PORT || '3003', 10),
  openaiKey: process.env.OPENAI_API_KEY || 'sk-mock-key',
  geminiKey: process.env.GEMINI_API_KEY || 'mock-key',
});
