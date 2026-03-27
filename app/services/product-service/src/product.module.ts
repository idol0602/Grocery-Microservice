import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'grocery_product'),
        entities: [Product, Category],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
        logging: config.get<boolean>('DB_LOGGING', false),
      }),
    }),
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
