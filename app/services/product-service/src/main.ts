import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PRODUCT_SERVICE_PORT ?? 4001);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`Product service running on port ${port}`);
}

void bootstrap();
