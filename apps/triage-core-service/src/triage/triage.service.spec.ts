import { TriageService } from './triage.service';

describe('TriageService', () => {
  it('should process triage and return queued status', async () => {
    const redisMock = { publishImageUploadedEvent: jest.fn() };
    const contextMock = { buildContext: jest.fn().mockResolvedValue({ summary: 'ok' }) };
    const service = new TriageService(redisMock as any, contextMock as any);

    const res = await service.processTriage({ userId: 'u1', imageReferenceUrl: 'http://img.jpg', contextId: 'ctx1' });
    expect(res.status).toBe('QUEUED_FOR_VISION_AI');
  });
});
