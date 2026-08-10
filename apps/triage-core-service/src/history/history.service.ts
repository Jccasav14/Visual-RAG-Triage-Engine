import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoryService {
  async fetchHistory(userId: string) {
    return [
      { ticketId: 'tkt_001', date: '2026-08-01', severity: 'LOW' },
      { ticketId: 'tkt_002', date: '2026-08-05', severity: 'MEDIUM' }
    ];
  }
}
