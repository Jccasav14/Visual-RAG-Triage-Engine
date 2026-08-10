import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private requests = new Map<string, number[]>();

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60000;
    const limit = 100;

    const timestamps = (this.requests.get(ip) || []).filter(t => now - t < windowMs);
    if (timestamps.length >= limit) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }
    timestamps.push(now);
    this.requests.set(ip, timestamps);
    return true;
  }
}
