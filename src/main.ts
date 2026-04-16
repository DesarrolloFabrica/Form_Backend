import 'reflect-metadata';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  const corsRaw =
    process.env.CORS_ORIGINS ?? process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  const corsOrigins = corsRaw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
=======
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  const defaultCorsOrigin = 'http://localhost:5173';
  const corsOriginEnv = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: corsOriginEnv
      ? corsOriginEnv.split(',').map((o) => o.trim())
      : defaultCorsOrigin,
>>>>>>> e472bb6b20173aa49faa7b6655436bbbcc783de4
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

<<<<<<< HEAD
  const port = Number(process.env.PORT ?? 3001);
=======
  const port = Number(process.env.PORT ?? 8080);
>>>>>>> e472bb6b20173aa49faa7b6655436bbbcc783de4
  await app.listen(port, '0.0.0.0');
  // Mensaje solicitado para levantar en local.
  console.log(`🚀 Backend escuchando en puerto ${port}`);
}

void bootstrap();