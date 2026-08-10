import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAIProvider {
  async queryOpenAI(prompt: string) {
    return `[OpenAI GPT-4o Response] Action Plan generated for context: ${prompt.substring(0, 30)}...`;
  }
}
