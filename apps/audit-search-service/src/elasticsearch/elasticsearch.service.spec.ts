import { ElasticsearchService } from './elasticsearch.service';

describe('ElasticsearchService', () => {
  it('should index doc', async () => {
    const service = new ElasticsearchService();
    const res = await service.indexDocument('idx', { test: true });
    expect(res.result).toBe('created');
  });
});
