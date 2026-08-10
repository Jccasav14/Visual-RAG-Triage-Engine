import { PrivacySanitizerService } from './privacy-sanitizer.service';

describe('PrivacySanitizerService', () => {
  it('should scrub email addresses', () => {
    const sanitizer = new PrivacySanitizerService();
    const result = sanitizer.scrubSensitiveData('Contact user@example.com for info');
    expect(result).toContain('[REDACTED_EMAIL]');
    expect(result).not.toContain('user@example.com');
  });
});
