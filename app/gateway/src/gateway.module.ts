import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthController } from './health.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('USER_SERVICE_HOST', 'user-service'),
            port: Number(config.get<string>('USER_SERVICE_PORT', '4002')),
          },
        }),
      },
      {
        name: 'ORDER_SERVICE',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('ORDER_SERVICE_HOST', 'order-service'),
            port: Number(config.get<string>('ORDER_SERVICE_PORT', '4003')),
          },
        }),
      },
    ]),
  ],
  controllers: [
    HealthController,
    ProductsController,
    CategoriesController,
    UsersController,
    OrdersController,
  ],
  providers: [ProductsService, CategoriesService, UsersService, OrdersService],
})
export class GatewayModule {}
