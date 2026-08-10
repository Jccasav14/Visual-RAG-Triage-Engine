import { AuditService } from './audit.service';

describe('AuditService', () => {
  it('should search logs', async () => {
    const mockEs = { search: async () => ({ hits: { total: { value: 1 } } }) };
    const service = new AuditService(mockEs as any);
    const res = await service.search('query');
    expect(res.hits.total.value).toBe(1);
  });
});
