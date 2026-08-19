import { Controller, Post, Get, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TriageService } from '../services/triage.service';
import { CreateTriageDto } from '../dto/create-triage.dto';
import { CreateMedicalRestrictionDto } from '../dto/create-medical-restriction.dto';

@ApiTags('Triage & Medical Portal')
@ApiBearerAuth()
@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post('evaluate')
  @ApiOperation({ summary: 'Iniciar evaluación de triaje visual con IA (Paciente)' })
  @ApiResponse({ status: 201, description: 'Registro de triaje creado y enviado a la cola Redis' })
  async evaluate(
    @Headers('x-user-id') headerUserId: string,
    @Body() dto: CreateTriageDto,
  ) {
    const userId = headerUserId || 'usr_patient_demo';
    return this.triageService.evaluateTriage(userId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial transaccional de triajes del paciente' })
  @ApiResponse({ status: 200, description: 'Historial de triajes' })
  async getHistory(@Headers('x-user-id') headerUserId: string) {
    const userId = headerUserId || 'usr_patient_demo';
    return this.triageService.getHistory(userId);
  }

  @Post('medical-restrictions')
  @ApiOperation({ summary: 'Registrar o actualizar ficha de restricciones médicas del paciente (Portal Doctor)' })
  @ApiResponse({ status: 201, description: 'Restricciones clínicas guardadas en el historial postoperatorio' })
  async saveMedicalRestrictions(
    @Headers('x-user-id') headerUserId: string,
    @Body() dto: CreateMedicalRestrictionDto,
  ) {
    const doctorId = headerUserId || 'doc_demo_999';
    return this.triageService.saveMedicalRestriction(doctorId, dto);
  }

  @Get('patient-restrictions/:patientId')
  @ApiOperation({ summary: 'Consultar ficha de restricciones clínicas postoperatorias de un paciente' })
  @ApiResponse({ status: 200, description: 'Ficha médica y restricciones del paciente' })
  async getPatientRestrictions(@Param('patientId') patientId: string) {
    return this.triageService.getMedicalRestrictionByPatient(patientId);
  }

  @Post('daily-reports')
  @ApiOperation({ summary: 'Guardar reporte clínico diario generado para el paciente' })
  @ApiResponse({ status: 201, description: 'Reporte clínico diario persistido en base de datos' })
  async saveDailyReport(
    @Headers('x-user-id') headerUserId: string,
    @Body() body: any,
  ) {
    const patientId = body.patientId || headerUserId || 'usr_patient_demo';
    return this.triageService.saveDailyReport(patientId, body);
  }

  @Get('daily-reports/:patientId')
  @ApiOperation({ summary: 'Obtener lista de reportes clínicos diarios guardados del paciente' })
  @ApiResponse({ status: 200, description: 'Lista histórica de reportes diarios' })
  async getDailyReports(@Param('patientId') patientId: string) {
    return this.triageService.getDailyReportsByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un triaje específico' })
  @ApiResponse({ status: 200, description: 'Detalles del registro de triaje' })
  async getById(@Param('id') id: string) {
    return this.triageService.getById(id);
  }
}
