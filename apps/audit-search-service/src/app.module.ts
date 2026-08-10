import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';
import { AsyncIndexerService } from './indexer/async-indexer.service';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  controllers: [AuditController],
  providers: [ElasticsearchService, AsyncIndexerService, AuditService],
})
export class AppModule {}
