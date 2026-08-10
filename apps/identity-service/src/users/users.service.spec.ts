import { UsersService } from './users.service';

describe('UsersService', () => {
  it('should return mock user profile', async () => {
    const service = new UsersService();
    const user = await service.getProfile('123');
    expect(user.id).toBe('123');
  });
});
