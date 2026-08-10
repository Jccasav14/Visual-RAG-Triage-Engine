import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { LlmController } from './llm/llm.controller';
import { LlmService } from './llm/llm.service';
import { PrivacySanitizerService } from './sanitizer/privacy-sanitizer.service';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';
import { RagBuilderService } from './rag/rag-builder.service';
import { MockLlmProvider } from './providers/mock-llm.provider';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration], isGlobal: true })],
  controllers: [LlmController],
  providers: [LlmService, PrivacySanitizerService, OpenAIProvider, GeminiProvider, RagBuilderService, MockLlmProvider],
})
export class AppModule {}
