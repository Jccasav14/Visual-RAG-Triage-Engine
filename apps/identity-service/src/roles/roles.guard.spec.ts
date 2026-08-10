import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    const guard = new RolesGuard({ get: () => null } as any);
    expect(guard).toBeDefined();
  });
});
