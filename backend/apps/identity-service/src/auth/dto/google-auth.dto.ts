import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class GoogleAuthDto {
  @ApiPropertyOptional({
    description: 'Token ID entregado por Google OAuth (Google Sign-In)',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
  })
  @IsString()
  @IsOptional()
  idToken?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del usuario de Google',
    example: 'paciente.postoperado@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo obtenido de Google',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'URL de foto de perfil de Google',
    example: 'https://lh3.googleusercontent.com/a/default-user',
  })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiPropertyOptional({
    description: 'ID de usuario de Google (sub)',
    example: '10928374650192837465',
  })
  @IsString()
  @IsOptional()
  googleId?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Rol del usuario (PATIENT, DOCTOR, AUDITOR, ADMIN)',
    example: UserRole.PATIENT,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'ID del Doctor asignado (si el usuario es paciente)',
    example: 'doc_uuid_998877',
  })
  @IsString()
  @IsOptional()
  doctorId?: string;

  @ApiPropertyOptional({
    description: 'Número de Cédula o Documento de Identidad',
    example: '1712345678',
  })
  @IsString()
  @IsOptional()
  cedula?: string;
}
