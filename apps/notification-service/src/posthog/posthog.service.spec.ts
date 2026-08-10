import { PostHogService } from './posthog.service';

describe('PostHogService', () => {
  it('should capture telemetry event', () => {
    const service = new PostHogService();
    const res = service.captureEvent('u1', 'TriageSubmitted', { score: 0.9 });
    expect(res).toBe(true);
  });
});
