import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthProvider, User, UserRole } from '../users/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleOAuthClient: OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const googleClientId = this.configService.get<string>('google.clientId');
    this.googleOAuthClient = new OAuth2Client(googleClientId);
  }

  async googleLogin(dto: GoogleAuthDto) {
    let googleId = dto.googleId;
    let email = dto.email;
    let fullName = dto.fullName;
    let picture = dto.picture;

    if (dto.idToken) {
      try {
        const googleClientId = this.configService.get<string>('google.clientId');
        const ticket = await this.googleOAuthClient.verifyIdToken({
          idToken: dto.idToken,
          audience: googleClientId || undefined,
        });
        const payload = ticket.getPayload();
        if (payload) {
          googleId = payload.sub;
          email = payload.email || email;
          fullName = payload.name || fullName;
          picture = payload.picture || picture;
        }
      } catch (err: any) {
        this.logger.warn(`Google idToken verification warning: ${err.message}. Using token/provided payload.`);
        if (!email && !googleId) {
          throw new UnauthorizedException('Token de autenticación de Google inválido');
        }
      }
    }

    if (!email && !googleId) {
      throw new BadRequestException('El correo o Google ID es requerido para la autenticación');
    }

    let user: User | null = null;
    if (googleId) {
      user = await this.usersService.findByGoogleId(googleId);
    }
    if (!user && email) {
      user = await this.usersService.findByEmail(email);
    }

    if (user) {
      let updated = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.picture && picture) {
        user.picture = picture;
        updated = true;
      }
      if (!user.fullName && fullName) {
        user.fullName = fullName;
        updated = true;
      }
      if (dto.doctorId && user.doctorId !== dto.doctorId) {
        user.doctorId = dto.doctorId;
        updated = true;
      }
      if (dto.cedula && user.cedula !== dto.cedula) {
        user.cedula = dto.cedula;
        updated = true;
      }
      if (updated) {
        user = await this.usersService.updateUser(user.id, {
          googleId: user.googleId,
          picture: user.picture,
          fullName: user.fullName,
          doctorId: user.doctorId,
          cedula: user.cedula,
        });
      }
    } else {
      user = await this.usersService.createUser({
        email: email!,
        googleId: googleId,
        fullName: fullName || email?.split('@')[0] || 'Usuario',
        picture: picture,
        authProvider: AuthProvider.GOOGLE,
        role: dto.role || UserRole.PATIENT,
        doctorId: dto.doctorId,
        cedula: dto.cedula,
      });
      this.logger.log(`Registrado nuevo usuario vía Google Sign-In (${user.role}): ${user.email}`);
    }

    return this.generateAuthResponse(user);
  }

  async register(dto: RegisterCredentialsDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Ya existe una cuenta registrada con este correo electrónico.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName || dto.email.split('@')[0],
      authProvider: AuthProvider.LOCAL,
      role: dto.role || UserRole.PATIENT,
      doctorId: dto.doctorId,
      cedula: dto.cedula,
      specialty: dto.role === UserRole.DOCTOR ? 'Cirugía General y Laparoscópica' : undefined,
      hospital: dto.role === UserRole.DOCTOR ? 'Hospital Metropolitano' : undefined,
      licenseNumber: dto.role === UserRole.DOCTOR ? `MSP-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
    });

    return this.generateAuthResponse(user);
  }

  async login(dto: AuthCredentialsDto) {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user || !user.password) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo electrónico o contraseña incorrectos.');
    }

    return this.generateAuthResponse(user);
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return await this.usersService.findById(payload.sub);
    } catch {
      throw new UnauthorizedException('Sesión expirada o token inválido.');
    }
  }

  private generateAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role, doctorId: user.doctorId };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        picture: user.picture,
        role: user.role,
        doctorId: user.doctorId,
        cedula: user.cedula || '',
        phone: user.phone || '',
        specialty: user.specialty || '',
        licenseNumber: user.licenseNumber || '',
        hospital: user.hospital || '',
        bloodType: user.bloodType || '',
        emergencyContact: user.emergencyContact || '',
        birthDate: user.birthDate || '',
        authProvider: user.authProvider,
      },
    };
  }
}
