import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'Correo electrónico registrado',
    example: 'usuario@visual-rag.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 6 caracteres)',
    example: 'Password123!',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
