import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Visual-RAG Triage Engine API Gateway')
    .setDescription(
      `Documentación Centralizada e Interactiva del Backend Visual-RAG Triage Engine.
      
      ### Módulos Disponibles:
      - **Identidad y Autenticación** (\`/v1/identity/auth/*\`): Google Sign-In, Registro y Login Local en PostgreSQL, JWT.
      - **Motor de Triaje** (\`/v1/triage/*\`): Registro de evaluaciones visuales y consulta de historial transaccional.
      - **Orquestador LLM RAG** (\`/v1/llm/*\`): Generación de planes de acción con IA.
      
      Para probar endpoints protegidos:
      1. Ejecuta \`/v1/identity/auth/google\` o \`/v1/identity/auth/register\`.
      2. Copia el token \`accessToken\` retornado.
      3. Haz clic en el botón verde **Authorize** arriba a la derecha e ingresa tu token.`
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3050;
  await app.listen(port);
  console.log(`=======================================================`);
  console.log(`🚀 API Gateway escuchando en: http://localhost:${port}`);
  console.log(`📚 Interfaz interactiva de Swagger UI: http://localhost:${port}/api/docs`);
  console.log(`=======================================================`);
}
bootstrap();
