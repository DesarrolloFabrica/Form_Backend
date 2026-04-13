import 'reflect-metadata';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  const defaultCorsOrigin = 'http://localhost:5173';
  const corsOriginEnv = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: corsOriginEnv
      ? corsOriginEnv.split(',').map((o) => o.trim())
      : defaultCorsOrigin,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT ?? 8080);
  await app.listen(port, '0.0.0.0');
  // Mensaje solicitado para levantar en local.
  console.log(`🚀 Backend escuchando en puerto ${port}`);
}

void bootstrap();
