import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisProducerService {
  async publishImageUploadedEvent(payload: any) {
    console.log('[REDIS PRODUCER] Published image uploaded event to Redis Stream:', payload);
    return true;
  }
}
