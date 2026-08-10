import { Injectable } from '@nestjs/common';

@Injectable()
export class ElasticsearchService {
  async indexDocument(index: string, document: any) {
    console.log(`[ELASTICSEARCH INDEXER] Indexed doc into "${index}":`, document);
    return { result: 'created', _id: `doc_${Date.now()}` };
  }

  async search(index: string, query: any) {
    return { hits: { total: { value: 1 }, hits: [{ _source: { eventType: 'TRIAGE_LOG' } }] } };
  }
}
