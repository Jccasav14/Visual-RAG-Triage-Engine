import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmService } from './services/llm.service';
import { LlmController } from './controllers/llm.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [LlmController],
  providers: [LlmService],
})
export class AppModule {}
