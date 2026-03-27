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
        host: config.get<string>('PRODUCT_DB_HOST'),
        port: config.get<number>('PRODUCT_DB_PORT'),
        username: config.get<string>('PRODUCT_DB_USER'),
        password: config.get<string>('PRODUCT_DB_PASSWORD'),
        database: config.get<string>('PRODUCT_DB_NAME'),
        entities: [Product, Category],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
        logging: config.get<boolean>('DB_LOGGING'),
        ssl: true,
        extra: {
          sslmode: 'require',
        },
      }),
    }),
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
