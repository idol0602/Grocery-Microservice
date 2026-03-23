import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './product.module';

async function bootstrap() {
  const host = process.env.PRODUCT_SERVICE_HOST ?? '0.0.0.0';
  const port = Number(process.env.PRODUCT_SERVICE_PORT ?? 4001);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  await app.listen();
  // eslint-disable-next-line no-console
  console.log(`Product service listening on ${host}:${port}`);
}

void bootstrap();
