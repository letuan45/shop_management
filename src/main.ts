import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcExceptionFilter } from './common/fitlers/rpc-exception.filter';

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
    .addTag('Category')
    .addTag('Product')
    .addTag('Cart')
    .addTag('Supplier')
    .addBearerAuth()
    .addServer(process.env.API_BASE_PREFIX)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix(process.env.API_BASE_PREFIX);
  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen(8080);
}
bootstrap();
