import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../services/proxy.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('API Gateway Proxy')
@Controller('v1')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('identity/*')
  async proxyIdentity(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'http://localhost:3001');
  }