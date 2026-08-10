import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextBuilderService {
  async buildContext(userId: string, contextId: string) {
    return {
      userId,
      contextId,
      summary: 'Historical record retrieved: No previous critical anomalies recorded.',
      recentEntriesCount: 3
    };
  }
}
