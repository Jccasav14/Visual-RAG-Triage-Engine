import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('daily_reports')
export class DailyReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'folio_id' })
  folioId!: string;

  @Column({ name: 'patient_id' })
  patientId!: string;

  @Column({ name: 'recovery_day', type: 'int', default: 1 })
  recoveryDay!: number;

  @Column({ name: 'date_str' })
  date!: string;

  @Column({ name: 'time_str' })
  time!: string;

  @Column({ name: 'surgery_type', default: 'Cirugía General' })
  surgeryType!: string;

  @Column({ name: 'classification' })
  classification!: string;

  @Column({ name: 'severity', default: 'LOW' })
  severity!: string;

  @Column({ name: 'confidence', type: 'float', default: 95.0 })
  confidence!: number;

  @Column({ name: 'symptoms', type: 'text', default: '' })
  symptoms!: string;

  @Column({ name: 'plan', type: 'text', default: '' })
  plan!: string;

  @Column({ name: 'image_uris', type: 'text', default: '[]' })
  imageUris!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
