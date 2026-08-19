import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LlmService } from '../services/llm.service';
import { GeneratePlanDto } from '../dto/generate-plan.dto';
import { GeneratePersonalizedPlanDto } from '../dto/generate-personalized-plan.dto';

@ApiTags('Doctor Virtual & LLM RAG Orchestrator')
@ApiBearerAuth()
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate-plan')
  @ApiOperation({ summary: 'Generar plan de acción genérico de triaje asistido por IA' })
  @ApiResponse({ status: 200, description: 'Plan de acción generado' })
  async generatePlan(@Body() dto: GeneratePlanDto) {
    return this.llmService.generateTriagePlan(dto);
  }

  @Post('generate-personalized-plan')
  @ApiOperation({ summary: 'Generar orientación de Doctor Virtual RAG cruzando restricciones del médico tratante y triaje visual' })
  @ApiResponse({ status: 200, description: 'Informe personalizado de Doctor Virtual para el paciente postoperado' })
  async generatePersonalizedPlan(@Body() dto: GeneratePersonalizedPlanDto) {
    return this.llmService.generatePersonalizedTriagePlan(dto);
  }
}
