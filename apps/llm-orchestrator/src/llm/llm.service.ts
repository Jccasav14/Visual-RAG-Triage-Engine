import { Injectable } from '@nestjs/common';
import { PrivacySanitizerService } from '../sanitizer/privacy-sanitizer.service';
import { MockLlmProvider } from '../providers/mock-llm.provider';
import { RagBuilderService } from '../rag/rag-builder.service';
import { RagRequestDto } from './dto/rag-request.dto';

@Injectable()
export class LlmService {
  constructor(
    private readonly sanitizer: PrivacySanitizerService,
    private readonly llmProvider: MockLlmProvider,
    private readonly ragBuilder: RagBuilderService
  ) {}

  async generateActionPlan(dto: RagRequestDto) {
    const sanitizedPrompt = this.sanitizer.scrubSensitiveData(dto.promptContext);
    const rawLlmResponse = await this.llmProvider.query(sanitizedPrompt);
    return this.ragBuilder.buildActionPlan(dto.ticketId, rawLlmResponse);
  }
}
