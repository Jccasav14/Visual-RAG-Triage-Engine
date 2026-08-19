import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterCredentialsDto {
  @ApiProperty({
    description: 'Correo electrónico para la cuenta',
    example: 'doctor.velasquez@hospital.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña para la cuenta (mínimo 6 caracteres)',
    example: 'MiPasswordSeguro123',
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Dr. Jean Carlos Velásquez',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Rol asignado (PATIENT, DOCTOR, AUDITOR, ADMIN)',
    example: UserRole.DOCTOR,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'ID del Doctor asignado (si la cuenta pertenece a un paciente)',
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
