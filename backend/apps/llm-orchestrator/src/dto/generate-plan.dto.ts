import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GeneratePlanDto {
  @ApiProperty({
    description: 'Diagnóstico o resultado de visión por computadora',
    example: 'Herida postoperatoria con signos levemente eritematosos en bordes',
  })
  @IsString()
  @IsNotEmpty()
  classificationResult!: string;

  @ApiProperty({
    description: 'Nivel de severidad (LOW, MEDIUM, HIGH, CRITICAL)',
    example: 'HIGH',
  })
  @IsString()
  @IsNotEmpty()
  severity!: string;

  @ApiPropertyOptional({
    description: 'Contexto adicional o prompt del usuario',
    example: 'Paciente refiere dolor 6/10 desde hace 2 horas',
  })
  @IsString()
  @IsOptional()
  userContext?: string;
}
