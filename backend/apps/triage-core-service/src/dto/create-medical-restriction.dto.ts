import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMedicalRestrictionDto {
  @ApiProperty({
    description: 'ID del paciente postoperado',
    example: 'pat_uuid_112233',
  })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({
    description: 'Tipo de cirugía realizada',
    example: 'Apendicectomía Laparoscópica / Herida Postoperatoria Abdominal',
  })
  @IsString()
  @IsNotEmpty()
  surgeryType!: string;

  @ApiPropertyOptional({
    description: 'Fecha de la intervención quirúrgica',
    example: '2026-08-08',
  })
  @IsString()
  @IsOptional()
  surgeryDate?: string;

  @ApiProperty({
    description: 'Actividades o elementos prohibidos por el médico tratante',
    example: 'Prohibido mojar la herida las primeras 48h. Prohibido levantar objetos mayores a 3kg. Prohibido esfuerzo físico abdominal.',
  })
  @IsString()
  @IsNotEmpty()
  prohibitions!: string;

  @ApiPropertyOptional({
    description: 'Cuidados y actividades permitidas',
    example: 'Limpieza superficial con agua hervida/suero fisiológico y gasa estéril cada 12 horas. Caminatas suaves de 5 min.',
  })
  @IsString()
  @IsOptional()
  allowedActions?: string;

  @ApiPropertyOptional({
    description: 'Alergias o contraindicaciones médicas',
    example: 'Alergia a la Penicilina y AINEs (Ibuprofeno/Naproxeno)',
  })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({
    description: 'Criterios o umbrales de alerta médica urgente',
    example: 'Fiebre superior a 38°C, sangrado continuo o pus con mal olor',
  })
  @IsString()
  @IsOptional()
  emergencyThresholds?: string;

  @ApiPropertyOptional({
    description: 'Notas u observaciones adicionales del médico tratante',
    example: 'Paciente con evolución favorable en día 2 postquirúrgico.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio del reposo', example: '2026-08-10' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Fecha de término del reposo', example: '2026-08-24' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Días de reposo asignados', example: 14 })
  @IsOptional()
  restDays?: number;

  @ApiPropertyOptional({ description: 'Fecha de cita de control / retiro de puntos', example: '2026-08-24' })
  @IsString()
  @IsOptional()
  followupAppointmentDate?: string;

  @ApiPropertyOptional({ description: 'Estado del plan (ACTIVE, COMPLETED, EXPIRED)', example: 'ACTIVE' })
  @IsString()
  @IsOptional()
  status?: string;
}
