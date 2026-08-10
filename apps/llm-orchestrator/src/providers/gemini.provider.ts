import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiProvider {
  async queryGemini(prompt: string) {
    return `[Google Gemini 1.5 Pro Response] Action Plan generated for context: ${prompt.substring(0, 30)}...`;
  }
}
