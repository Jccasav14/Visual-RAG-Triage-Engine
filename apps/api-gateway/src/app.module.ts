import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { ProxyController } from './proxy/proxy.controller';
import { ProxyService } from './proxy/proxy.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
  ],
  controllers: [HealthController, ProxyController],
  providers: [HealthService, ProxyService],
})
export class AppModule {}
