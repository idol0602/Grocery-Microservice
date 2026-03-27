import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';

async function bootstrap() {
  const host = process.env.ORDER_SERVICE_HOST ?? '0.0.0.0';
  const port = Number(process.env.ORDER_SERVICE_PORT ?? 4003);

  const app = await NestFactory.create(OrderModule);

  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`Order service running on http://${host}:${port}`);
}

void bootstrap();
