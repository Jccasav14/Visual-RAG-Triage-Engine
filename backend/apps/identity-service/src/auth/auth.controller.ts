import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@ApiTags('Auth & Identity')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('google')
  @ApiOperation({ summary: 'Autenticación / Registro con Google (Google Sign-In)' })
  @ApiResponse({ status: 200, description: 'Autenticación de Google exitosa, retorna JWT' })
  @ApiResponse({ status: 400, description: 'Datos de Google requeridos o inválidos' })
  async googleLogin(@Body() dto: GoogleAuthDto) {
    return this.authService.googleLogin(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro local con email y contraseña' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente en PostgreSQL' })
  @ApiResponse({ status: 400, description: 'El correo electrónico ya existe' })
  async register(@Body() dto: RegisterCredentialsDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión local con email y contraseña' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() dto: AuthCredentialsDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario actualmente autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 401, description: 'Token de acceso no proporcionado o inválido' })
  async getMe(@Headers('authorization') authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Encabezado Authorization Bearer requerido');
    }
    const token = authHeader.split(' ')[1];
    const user = await this.authService.validateToken(token);
    return this.usersService.getProfile(user.id);
  }
}
