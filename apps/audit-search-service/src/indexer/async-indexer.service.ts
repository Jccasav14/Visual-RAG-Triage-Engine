import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class AsyncIndexerService {
  constructor(private readonly esService: ElasticsearchService) {}

  async processLogEvent(event: any) {
    return this.esService.indexDocument('triage-audit-logs', event);
  }
}
