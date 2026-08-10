import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TriageService } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';

@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post('submit')
  async submitTriage(@Body() dto: CreateTriageDto) {
    return this.triageService.processTriage(dto);
  }

  @Get('ticket/:id')
  async getTicket(@Param('id') id: string) {
    return this.triageService.getTicketById(id);
  }
}
