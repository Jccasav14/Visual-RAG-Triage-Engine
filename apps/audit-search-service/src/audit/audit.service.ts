import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class AuditService {
  constructor(private readonly esService: ElasticsearchService) {}

  async search(queryStr: string) {
    return this.esService.search('triage-audit-logs', { match: { message: queryStr } });
  }
}
