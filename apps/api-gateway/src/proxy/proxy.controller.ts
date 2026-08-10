import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RateLimiterGuard } from '../guards/rate-limiter.guard';

@Controller('v1')
@UseGuards(RateLimiterGuard)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('identity/*')
  async proxyIdentity(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'http://identity-service:3001');
  }

  @All('triage/*')
  @UseGuards(JwtAuthGuard)
  async proxyTriage(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward(req, res, 'http://triage-core-service:3002');
  }
}
