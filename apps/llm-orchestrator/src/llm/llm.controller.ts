import { Controller, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';
import { RagRequestDto } from './dto/rag-request.dto';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate-plan')
  async generatePlan(@Body() dto: RagRequestDto) {
    return this.llmService.generateActionPlan(dto);
  }
}
