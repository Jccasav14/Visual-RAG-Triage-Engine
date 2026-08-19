import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  picture?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId?: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: AuthProvider.LOCAL,
  })
  authProvider: AuthProvider;

  @Column({
    type: 'varchar',
    length: 50,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  doctorId?: string; // Doctor asignado al paciente

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  cedula?: string; // Cédula o DNI

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string; // Teléfono de contacto

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialty?: string; // Especialidad médica (Cirujano)

  @Column({ type: 'varchar', length: 100, nullable: true })
  licenseNumber?: string; // Número de registro médico / Colegiatura

  @Column({ type: 'varchar', length: 255, nullable: true })
  hospital?: string; // Hospital o Clínica

  @Column({ type: 'varchar', length: 20, nullable: true })
  bloodType?: string; // Tipo de sangre (Paciente)

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContact?: string; // Contacto de emergencia (Paciente)

  @Column({ type: 'varchar', length: 50, nullable: true })
  birthDate?: string; // Fecha de nacimiento (Paciente)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
