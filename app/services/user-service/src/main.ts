import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const host = process.env.USER_SERVICE_HOST ?? '0.0.0.0';
  const port = Number(process.env.USER_SERVICE_PORT ?? 4002);

  const app = await NestFactory.create(UserModule);

  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`User service running on http://${host}:${port}`);
}

void bootstrap();
