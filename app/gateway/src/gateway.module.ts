import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthController } from './health.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('PRODUCT_SERVICE_HOST', 'product-service'),
            port: Number(config.get<string>('PRODUCT_SERVICE_PORT', '4001')),
          },
        }),
      },
    ]),
  ],
  controllers: [HealthController, ProductsController],
  providers: [ProductsService],
})
export class GatewayModule {}
