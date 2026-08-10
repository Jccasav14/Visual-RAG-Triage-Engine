import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivacySanitizerService {
  scrubSensitiveData(text: string): string {
    return text
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]')
      .replace(/\b\d{10,12}\b/g, '[REDACTED_ID]');
  }
}
