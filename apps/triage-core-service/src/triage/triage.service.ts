import { Injectable } from '@nestjs/common';
import { RedisProducerService } from '../redis/redis-producer.service';
import { ContextBuilderService } from '../context/context-builder.service';
import { CreateTriageDto } from './dto/create-triage.dto';

@Injectable()
export class TriageService {
  constructor(
    private readonly redisProducer: RedisProducerService,
    private readonly contextBuilder: ContextBuilderService
  ) {}

  async processTriage(dto: CreateTriageDto) {
    const context = await this.contextBuilder.buildContext(dto.userId, dto.contextId);
    const ticketId = `tkt_${Date.now()}`;
    await this.redisProducer.publishImageUploadedEvent({
      ticketId,
      userId: dto.userId,
      imageReferenceUrl: dto.imageReferenceUrl,
      contextId: dto.contextId,
      priority: dto.priority || 'HIGH'
    });
    return { ticketId, status: 'QUEUED_FOR_VISION_AI', contextSummary: context.summary };
  }

  async getTicketById(id: string) {
    return { ticketId: id, status: 'PROCESSED', severity: 'HIGH' };
  }
}
