import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
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
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
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
