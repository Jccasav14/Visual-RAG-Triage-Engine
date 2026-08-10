import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthService } from '../supabase/supabase-auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseAuth: SupabaseAuthService) {}

  async login(dto: AuthCredentialsDto) {
    const { data, error } = await this.supabaseAuth.getClient().auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async register(dto: AuthCredentialsDto) {
    const { data, error } = await this.supabaseAuth.getClient().auth.signUp({
      email: dto.email,
      password: dto.password,
    });
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }
}
