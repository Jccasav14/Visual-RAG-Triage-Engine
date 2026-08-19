import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TriagePriority } from '../entities/triage-record.entity';

export class CreateTriageDto {
  @ApiProperty({
    description: 'URL o ruta de la imagen capturada para triaje',
    example: '/local/storage/path/img_xyz.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageReferenceUrl!: string;

  @ApiPropertyOptional({
    description: 'Identificador del contexto (ej: paciente, componente mecánico)',
    example: 'ctx_med_001',
  })
  @IsString()
  @IsOptional()
  contextId?: string;

  @ApiPropertyOptional({
    enum: TriagePriority,
    description: 'Prioridad inicial estimada',
    example: TriagePriority.HIGH,
  })
  @IsEnum(TriagePriority)
  @IsOptional()
  priority?: TriagePriority;
}
