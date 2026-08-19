import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { TriageRecord, TriagePriority } from '../entities/triage-record.entity';
import { MedicalRestriction } from '../entities/medical-restriction.entity';
import { DailyReport } from '../entities/daily-report.entity';
import { CreateTriageDto } from '../dto/create-triage.dto';
import { CreateMedicalRestrictionDto } from '../dto/create-medical-restriction.dto';

@Injectable()
export class TriageService {
  private readonly logger = new Logger(TriageService.name);
  private redisClient: Redis;

  constructor(
    @InjectRepository(TriageRecord)
    private readonly triageRepo: Repository<TriageRecord>,
    @InjectRepository(MedicalRestriction)
    private readonly restrictionRepo: Repository<MedicalRestriction>,
    @InjectRepository(DailyReport)
    private readonly dailyReportRepo: Repository<DailyReport>,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    this.redisClient = new Redis({ host, port, retryStrategy: () => 5000 });
    this.redisClient.on('error', () => {
      // Quietly handle Redis status
    });
  }

  async evaluateTriage(userId: string, dto: CreateTriageDto): Promise<TriageRecord> {
    const record = this.triageRepo.create({
      userId,
      imageReferenceUrl: dto.imageReferenceUrl,
      contextId: dto.contextId,
      priority: dto.priority || TriagePriority.MEDIUM,
      status: 'PROCESSING',
    });

    const savedRecord = await this.triageRepo.save(record);

    const redisEvent = {
      eventId: `evt_${Date.now()}`,
      eventType: 'IMAGE_UPLOADED_FOR_TRIAGE',
      timestamp: new Date().toISOString(),
      payload: {
        triageRecordId: savedRecord.id,
        userId: savedRecord.userId,
        imageReferenceUrl: savedRecord.imageReferenceUrl,
        contextId: savedRecord.contextId || 'N/A',
        priority: savedRecord.priority,
      },
    };

    try {
      await this.redisClient.publish('triage:events', JSON.stringify(redisEvent));
      this.logger.log(`Publicado evento de triaje en Redis [${redisEvent.eventId}] para usuario ${userId}`);
    } catch {
      this.logger.warn(`Publicación Redis diferida para evento [${redisEvent.eventId}]`);
    }

    return savedRecord;
  }

  async getHistory(userId: string): Promise<TriageRecord[]> {
    return this.triageRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string): Promise<TriageRecord | null> {
    return this.triageRepo.findOne({ where: { id } });
  }

  async saveMedicalRestriction(doctorId: string, dto: CreateMedicalRestrictionDto): Promise<MedicalRestriction> {
    let restriction = await this.restrictionRepo.findOne({ where: { patientId: dto.patientId } });

    if (restriction) {
      restriction.doctorId = doctorId;
      restriction.surgeryType = dto.surgeryType;
      restriction.surgeryDate = dto.surgeryDate || restriction.surgeryDate;
      restriction.prohibitions = dto.prohibitions;
      restriction.allowedActions = dto.allowedActions || restriction.allowedActions;
      restriction.allergies = dto.allergies || restriction.allergies;
      restriction.emergencyThresholds = dto.emergencyThresholds || restriction.emergencyThresholds;
      restriction.notes = dto.notes || restriction.notes;
      restriction.startDate = dto.startDate || restriction.startDate;
      restriction.endDate = dto.endDate || restriction.endDate;
      restriction.restDays = dto.restDays !== undefined ? dto.restDays : restriction.restDays;
      restriction.followupAppointmentDate = dto.followupAppointmentDate || restriction.followupAppointmentDate;
      restriction.status = dto.status || restriction.status;
    } else {
      restriction = this.restrictionRepo.create({
        patientId: dto.patientId,
        doctorId,
        surgeryType: dto.surgeryType,
        surgeryDate: dto.surgeryDate,
        prohibitions: dto.prohibitions,
        allowedActions: dto.allowedActions,
        allergies: dto.allergies,
        emergencyThresholds: dto.emergencyThresholds,
        notes: dto.notes,
        startDate: dto.startDate,
        endDate: dto.endDate,
        restDays: dto.restDays,
        followupAppointmentDate: dto.followupAppointmentDate,
        status: dto.status || 'ACTIVE',
      });
    }

    const saved = await this.restrictionRepo.save(restriction);
    this.logger.log(`Guardadas restricciones médicas creadas por el Doctor ${doctorId} para el Paciente ${dto.patientId}`);
    return saved;
  }

  async getMedicalRestrictionByPatient(patientId: string): Promise<MedicalRestriction | null> {
    return this.restrictionRepo.findOne({ where: { patientId } });
  }

  async saveDailyReport(patientId: string, data: any): Promise<DailyReport> {
    const report = this.dailyReportRepo.create({
      folioId: data.id || `REP-${Date.now().toString().slice(-6)}`,
      patientId,
      recoveryDay: data.recoveryDay || 1,
      date: data.date || new Date().toLocaleDateString('es-ES'),
      time: data.time || new Date().toLocaleTimeString('es-ES'),
      surgeryType: data.surgeryType || 'Cirugía General',
      classification: data.classification || 'Cicatrización Normal',
      severity: data.severity || 'LOW',
      confidence: data.confidence || 95.0,
      symptoms: data.symptoms || '',
      plan: data.plan || '',
      imageUris: JSON.stringify(data.imageUris || []),
    });

    const saved = await this.dailyReportRepo.save(report);
    this.logger.log(`Guardado reporte clínico ${saved.folioId} para paciente ${patientId} en base de datos.`);
    return saved;
  }

  async getDailyReportsByPatient(patientId: string): Promise<any[]> {
    const reports = await this.dailyReportRepo.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });

    return reports.map((r) => ({
      id: r.folioId,
      dbId: r.id,
      recoveryDay: r.recoveryDay,
      date: r.date,
      time: r.time,
      surgeryType: r.surgeryType,
      classification: r.classification,
      severity: r.severity,
      confidence: r.confidence,
      symptoms: r.symptoms,
      plan: r.plan,
      imageUris: JSON.parse(r.imageUris || '[]'),
      createdAt: r.createdAt,
    }));
  }
}
