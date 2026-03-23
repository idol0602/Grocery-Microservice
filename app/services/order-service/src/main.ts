import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrderModule } from './order.module';

async function bootstrap() {
  const host = process.env.ORDER_SERVICE_HOST ?? '0.0.0.0';
  const port = Number(process.env.ORDER_SERVICE_PORT ?? 4003);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrderModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  await app.listen();
}

void bootstrap();
