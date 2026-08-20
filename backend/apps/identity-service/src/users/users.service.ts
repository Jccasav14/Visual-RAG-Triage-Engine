import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const query = this.userRepository.createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: normalizedEmail });
    if (includePassword) {
      query.addSelect('user.password');
    }
    return query.getOne();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  async getProfile(id: string) {
    const user = await this.findById(id);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      picture: user.picture,
      role: user.role,
      doctorId: user.doctorId,
      cedula: user.cedula || '',
      phone: user.phone || '',
      specialty: user.specialty || '',
      licenseNumber: user.licenseNumber || '',
      hospital: user.hospital || '',
      bloodType: user.bloodType || '',
      emergencyContact: user.emergencyContact || '',
      birthDate: user.birthDate || '',
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(id: string, updateData: Partial<User>) {
    await this.userRepository.update(id, updateData);
    return this.getProfile(id);
  }

  async getDoctorPatients(doctorId: string) {
    this.logger.log(`Fetching patients for doctor: ${doctorId}`);

    const patients = await this.userRepository.createQueryBuilder('user')
      .where('user.doctorId = :doctorId', { doctorId })
      .andWhere('user.role = :role', { role: UserRole.PATIENT })
      .getMany();

    return patients.map(p => ({
      id: p.id,
      email: p.email,
      fullName: p.fullName || p.email.split('@')[0],
      cedula: p.cedula || '',
      phone: p.phone || '',
      bloodType: p.bloodType || '',
      emergencyContact: p.emergencyContact || '',
      birthDate: p.birthDate || '',
      role: p.role,
      picture: p.picture,
      createdAt: p.createdAt,
    }));
  }

  async getAllPatients() {
    const patients = await this.userRepository.find({ where: { role: UserRole.PATIENT } });
    return patients.map(p => ({
      id: p.id,
      email: p.email,
      fullName: p.fullName || p.email.split('@')[0],
      cedula: p.cedula || '',
      phone: p.phone || '',
      bloodType: p.bloodType || '',
      emergencyContact: p.emergencyContact || '',
      birthDate: p.birthDate || '',
      role: p.role,
      doctorId: p.doctorId,
      picture: p.picture,
      createdAt: p.createdAt,
    }));
  }

  async searchPatients(query: string) {
    const qb = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.PATIENT });

    if (query) {
      qb.andWhere('(LOWER(user.email) LIKE :q OR LOWER(user.fullName) LIKE :q OR user.cedula LIKE :q OR user.id LIKE :q)', { q: `%${query.toLowerCase()}%` });
    }

    const patients = await qb.getMany();
    return patients.map(p => ({
      id: p.id,
      email: p.email,
      fullName: p.fullName || p.email.split('@')[0],
      cedula: p.cedula || '',
      phone: p.phone || '',
      bloodType: p.bloodType || '',
      emergencyContact: p.emergencyContact || '',
      birthDate: p.birthDate || '',
      role: p.role,
      doctorId: p.doctorId,
      createdAt: p.createdAt,
    }));
  }

  async assignPatientToDoctor(patientId: string, doctorId: string) {
    this.logger.log(`Assigning patient ${patientId} to doctor ${doctorId}`);
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ doctorId })
      .where('id = :id', { id: patientId })
      .execute();
    return this.findById(patientId);
  }

  async unassignPatient(patientId: string) {
    this.logger.log(`Unassigning patient ${patientId} from doctor`);
    await this.userRepository.createQueryBuilder()
      .update(User)
      .set({ doctorId: () => 'NULL' })
      .where('id = :id', { id: patientId })
      .execute();
    return { status: 'success', message: 'Paciente desvinculado exitosamente' };
  }
}
