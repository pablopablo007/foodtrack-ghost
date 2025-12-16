import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { seedProducts } from './seeds/product.seed';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure CORS for production
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Serve static files from uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Seed default products
  const dataSource = app.get(DataSource);
  await seedProducts(dataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
