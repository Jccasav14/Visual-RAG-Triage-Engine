export enum UserRole {
  ADMIN = 'ADMIN',
  TRIAGE_OPERATOR = 'TRIAGE_OPERATOR',
  AUDITOR = 'AUDITOR',
  END_USER = 'END_USER'
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
