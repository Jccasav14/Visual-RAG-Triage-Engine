import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TriageController } from './triage/triage.controller';
import { TriageService } from './triage/triage.service';
import { RedisProducerService } from './redis/redis-producer.service';
import { ContextBuilderService } from './context/context-builder.service';
import { HistoryService } from './history/history.service';
import { RagAssemblerService } from './triage/rag-assembler.service';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  controllers: [TriageController],
  providers: [TriageService, RedisProducerService, ContextBuilderService, HistoryService, RagAssemblerService],
})
export class AppModule {}
