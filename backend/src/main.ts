import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Разрешаем запросы от frontend (React будет на другом порту)
  app.enableCors();

  // Настройка Swagger — автоматическая документация API
  const config = new DocumentBuilder()
    .setTitle('Corporate Messenger API')
    .setDescription('API для корпоративного мессенджера: каналы, сообщения, файлы, уведомления')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Backend запущен: http://localhost:3000');
  console.log('Swagger доступен: http://localhost:3000/api');
}
bootstrap();