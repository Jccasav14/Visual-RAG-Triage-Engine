import { Injectable } from '@nestjs/common';

@Injectable()
export class PostHogService {
  captureEvent(distinctId: string, eventName: string, properties: Record<string, any>) {
    console.log(`[POSTHOG TELEMETRY] Event "${eventName}" recorded for ${distinctId}`, properties);
    return true;
  }
}
