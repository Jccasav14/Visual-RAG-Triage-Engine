import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisHealthIndicator {
  isHealthy(): boolean {
    return true;
  }
}
