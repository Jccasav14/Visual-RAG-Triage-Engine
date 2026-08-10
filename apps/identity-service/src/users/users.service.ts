import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  async getProfile(id: string) {
    return {
      id,
      email: 'user@visual-rag.local',
      role: 'TRIAGE_OPERATOR',
      fullName: 'Operator User',
    };
  }
}
