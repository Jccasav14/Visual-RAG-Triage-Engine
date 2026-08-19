import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('medical_restrictions')
export class MedicalRestriction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  patientId: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  doctorId: string;

  @Column({ type: 'varchar', length: 255 })
  surgeryType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  surgeryDate?: string;

  @Column({ type: 'text' })
  prohibitions: string; // Ej: "Prohibido mojar la herida las primeras 48h, prohibido levantar objetos mayores a 3kg"

  @Column({ type: 'text', nullable: true })
  allowedActions?: string; // Ej: "Limpieza suave con gasa estéril cada 12 horas"

  @Column({ type: 'text', nullable: true })
  allergies?: string; // Ej: "Alergia a la Penicilina y AINEs"

  @Column({ type: 'text', nullable: true })
  emergencyThresholds?: string; // Ej: "Fiebre mayor a 38°C o sangrado activo"

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  startDate?: string; // Fecha de inicio de reposo

  @Column({ type: 'varchar', length: 100, nullable: true })
  endDate?: string; // Fecha de fin de reposo

  @Column({ type: 'int', default: 14 })
  restDays?: number; // Días de reposo asignados

  @Column({ type: 'varchar', length: 100, nullable: true })
  followupAppointmentDate?: string; // Fecha de cita para retiro de puntos

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status?: string; // ACTIVE, COMPLETED, EXPIRED

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
