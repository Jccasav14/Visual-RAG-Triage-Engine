import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus() {
    return {
      status: 'UP',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
