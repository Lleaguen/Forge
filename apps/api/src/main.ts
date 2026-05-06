import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/errors/http-exception.filter';
import { ValidationPipe } from './shared/errors/validation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body parsing for webhooks
  });
  
  // Enable cookie parsing
  app.use(cookieParser());
  
  // Global error handling
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  
  app.enableCors({
    origin: ['http://localhost:3001',
            'https://wall-receptors-december-apparatus.trycloudflare.com']
    ,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.setGlobalPrefix('api'); 

  await app.listen(3000, '0.0.0.0');
}
bootstrap();