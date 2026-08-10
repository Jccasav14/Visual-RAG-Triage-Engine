import { HistoryService } from './history.service';

describe('HistoryService', () => {
  it('should fetch user history', async () => {
    const service = new HistoryService();
    const history = await service.fetchHistory('u1');
    expect(history.length).toBeGreaterThan(0);
  });
});
