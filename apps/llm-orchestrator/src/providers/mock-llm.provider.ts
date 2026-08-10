import { Injectable } from '@nestjs/common';

@Injectable()
export class MockLlmProvider {
  async query(prompt: string): Promise<string> {
    return `[Mock Local LLM Response] Safe plan for prompt: ${prompt.substring(0, 20)}`;
  }
}
