import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user.module';

async function bootstrap() {
  const host = process.env.USER_SERVICE_HOST ?? '0.0.0.0';
  const port = Number(process.env.USER_SERVICE_PORT ?? 4002);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
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
