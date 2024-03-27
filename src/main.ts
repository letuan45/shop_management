import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { ParseFormDataJsonPipe } from './common/pipes/parse-form-data.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Shop Management APIs')
    .setDescription('List of APIs use for Shop Management app')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('User')
    .addTag('Employee')
    .addBearerAuth()
    .addServer('api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('api/v1');

  await app.listen(8080);
}
bootstrap();
