import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should throw if authorization header is missing', () => {
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({ headers: {} }) })
    };
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should pass if bearer token exists', () => {
    const context: any = {
      switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: 'Bearer mock-token' } }) })
    };
    expect(guard.canActivate(context)).toBe(true);
  });
});
