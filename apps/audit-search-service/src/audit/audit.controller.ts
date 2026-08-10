import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('search')
  async searchLogs(@Query('q') query: string) {
    return this.auditService.search(query);
  }
}
