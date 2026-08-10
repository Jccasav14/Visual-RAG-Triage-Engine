import { ContextBuilderService } from './context-builder.service';

describe('ContextBuilderService', () => {
  it('should build context summary', async () => {
    const service = new ContextBuilderService();
    const ctx = await service.buildContext('u1', 'c1');
    expect(ctx.userId).toBe('u1');
  });
});
