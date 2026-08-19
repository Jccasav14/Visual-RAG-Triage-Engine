import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('patients')
  @ApiOperation({ summary: 'Obtener lista de todos los pacientes postoperados' })
  async getAllPatients() {
    return this.usersService.getAllPatients();
  }

  @Get('search-patients')
  @ApiOperation({ summary: 'Buscar paciente por Cédula, Correo o Nombre' })
  async searchPatients(@Query('q') query: string) {
    return this.usersService.searchPatients(query);
  }

  @Post('assign-patient')
  @ApiOperation({ summary: 'Asignar un paciente a un médico tratante' })
  async assignPatient(@Body() body: { patientId: string; doctorId: string }) {
    return this.usersService.assignPatientToDoctor(body.patientId, body.doctorId);
  }

  @Post('unassign-patient')
  @ApiOperation({ summary: 'Desvincular o eliminar un paciente del cuidado del médico' })
  async unassignPatient(@Body() body: { patientId: string }) {
    return this.usersService.unassignPatient(body.patientId);
  }

  @Get('doctor-patients/:doctorId')
  @ApiOperation({ summary: 'Obtener pacientes asignados a un médico tratante' })
  async getDoctorPatients(@Param('doctorId') doctorId: string) {
    return this.usersService.getDoctorPatients(doctorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Perfil de usuario obtenido con éxito' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Post('profile/:id')
  @ApiOperation({ summary: 'Actualizar perfil del usuario (Cédula, Nombre Completo)' })
  async updateProfile(@Param('id') id: string, @Body() body: { fullName?: string; cedula?: string }) {
    return this.usersService.updateProfile(id, body);
  }
}
