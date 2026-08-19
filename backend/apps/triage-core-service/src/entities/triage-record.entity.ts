import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TriagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('triage_records')
export class TriageRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 500 })
  imageReferenceUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contextId?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: TriagePriority.MEDIUM,
  })
  priority: TriagePriority;

  @Column({ type: 'varchar', length: 255, nullable: true })
  severityClassification?: string;

  @Column({ type: 'text', nullable: true })
  aiDiagnosis?: string;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
