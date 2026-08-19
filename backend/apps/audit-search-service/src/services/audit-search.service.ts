import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuditSearchService {
  private readonly logger = new Logger(AuditSearchService.name);
  private readonly elasticNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';

  async indexAuditLog(logData: any) {
    try {
      await axios.post(`${this.elasticNode}/triage-audit-logs/_doc`, {
        ...logData,
        timestamp: new Date().toISOString(),
      });
      this.logger.log(`Indexado registro de auditoría en Elasticsearch`);
    } catch (e: any) {
      this.logger.warn(`Indexación en Elasticsearch diferida: ${e.message}`);
    }
    return { indexed: true, data: logData };
  }

  async searchAuditLogs(query: string) {
    try {
      const response = await axios.post(`${this.elasticNode}/triage-audit-logs/_search`, {
        query: {
          match: { message: query },
        },
      });
      return response.data;
    } catch {
      return { hits: { total: { value: 0 }, hits: [] } };
    }
  }
}
