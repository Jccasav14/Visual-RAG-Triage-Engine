import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('should be defined', () => {
    const service = new AuthService({ getClient: () => ({}) } as any);
    expect(service).toBeDefined();
  });
});
