import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Visual-RAG LLM Orchestrator Service')
    .setDescription('Orquestador de Asistente Virtual Generativo y Estructuración RAG')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.LLM_SERVICE_PORT || 3003;
  await app.listen(port);
  console.log(`🚀 LLM Orchestrator Service ejecutándose en http://localhost:${port}`);
  console.log(`📚 Documentación Swagger en http://localhost:${port}/api/docs`);
}
bootstrap();
