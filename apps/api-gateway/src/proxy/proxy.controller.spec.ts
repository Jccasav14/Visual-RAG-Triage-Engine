import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

describe('ProxyController', () => {
  let controller: ProxyController;
  let service: ProxyService;

  beforeEach(() => {
    service = new ProxyService();
    controller = new ProxyController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
