import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GeneratePersonalizedPlanDto {
  @ApiProperty({
    description: 'ID del paciente postoperado',
    example: 'pat_uuid_112233',
  })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({
    description: 'Resultado de la visión por computadora sobre la herida',
    example: 'Sutura abdominal con ligero eritema localizado en zona inferior',
  })
  @IsString()
  @IsNotEmpty()
  classificationResult!: string;

  @ApiProperty({
    description: 'Nivel de severidad clasificado (LOW, MEDIUM, HIGH, CRITICAL)',
    example: 'MEDIUM',
  })
  @IsString()
  @IsNotEmpty()
  severity!: string;

  @ApiPropertyOptional({
    description: 'Síntomas manifestados por el paciente',
    example: 'Paciente siente ardor 3/10 y ligera molestia al inclinarse',
  })
  @IsString()
  @IsOptional()
  symptoms?: string;

  @ApiPropertyOptional({
    description: 'Restricciones o prohibiciones médicas dictadas por su Doctor (opcional si ya fueron registradas)',
    example: 'PROHIBIDO: Mojar la herida antes del día 3. PROHIBIDO: Levantar más de 3kg. ALERGIAS: Penicilina.',
  })
  @IsString()
  @IsOptional()
  medicalRestrictions?: string;

  @ApiPropertyOptional({
    description: 'Día postoperatorio en curso del paciente (ej: Día 3)',
    example: 3,
  })
  @IsOptional()
  recoveryDay?: number;

  @ApiPropertyOptional({
    description: 'Evaluación de compatibilidad con el día postoperatorio emitida por el modelo de visión',
    example: 'Fase Inflamatoria Temprana: Eritema leve es esperado en las primeras 72h',
  })
  @IsString()
  @IsOptional()
  dayAssessmentNote?: string;
}

