import { RedisProducerService } from './redis-producer.service';

describe('RedisProducerService', () => {
  it('should publish event', async () => {
    const service = new RedisProducerService();
    const result = await service.publishImageUploadedEvent({});
    expect(result).toBe(true);
  });
});
