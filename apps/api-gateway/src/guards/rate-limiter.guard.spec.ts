import { RateLimiterGuard } from './rate-limiter.guard';

describe('RateLimiterGuard', () => {
  it('should allow initial requests', () => {
    const guard = new RateLimiterGuard();
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({ ip: '127.0.0.1' }) })
    };
    expect(guard.canActivate(context)).toBe(true);
  });
});
