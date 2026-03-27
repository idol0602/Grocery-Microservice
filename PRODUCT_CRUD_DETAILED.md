# Product Service - Chi tiết từng phần code

## 1. Entity (product.entity.ts)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')  // Tên table trong database
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;  // UUID tự sinh

  @Column({ type: 'int', nullable: true })
  category_id: number;  // Foreign key tới categories

  @Column({ type: 'varchar', length: 255 })
  name: string;  // Tên sản phẩm

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;  // Giá: 12 chữ số, 2 số thập phân (9999999.99)

  @Column({ type: 'int', default: 0 })
  stock: number;  // Tồn kho, mặc định 0

  @Column({ type: 'text', nullable: true })
  description: string;  // Mô tả, không bắt buộc

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string;  // URL hình ảnh

  @Column({ type: 'boolean', default: true })
  is_active: boolean;  // Trạng thái hoạt động

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;  // Tự động ghi nhận thời gian tạo

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;  // Tự động ghi nhận thời gian cập nhật
}
```

**Giải thích các decorator TypeORM:**
- `@Entity()`: Định nghĩa class là một entity tương ứng với table
- `@PrimaryGeneratedColumn()`: Cột khóa chính, tự động sinh UUID
- `@Column()`: Định nghĩa cột, có thể cấu hình type, length, nullable, default
- `@CreateDateColumn()`: Tự động ghi nhận lần đầu taoEntity
- `@UpdateDateColumn()`: Tự động ghi nhận mỗi lần cập nhật

---

## 2. Service (product.service.ts)

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo: Repository<Product>) {
    super(repo);  // TypeOrmCrudService cung cấp CRUD methods
  }
  
  // Thêm custom methods
  async findActive() {
    return this.repo.find({ where: { is_active: true } });
  }

  async findByCategory(categoryId: number) {
    return this.repo.find({ where: { category_id: categoryId } });
  }

  async updateStock(id: string, quantity: number) {
    await this.repo.update(id, { stock: quantity });
    return this.repo.findOne({ where: { id } });
  }
}
```

**Các methods có sẵn từ TypeOrmCrudService:**
- `find()` - Lấy nhiều
- `findOne()` - Lấy một
- `create()` - Tạo
- `update()` - Cập nhật
- `delete()` - Xóa
- `findAndCount()` - Lấy với tổng số

---

## 3. Controller (product.controller.ts)

```typescript
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Crud({
  model: { type: Product },  // Entity class
  
  // Routes cấu hình
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],  // Loại bỏ routes không cần
  },
  
  // Query parameters cấu hình
  query: {
    alwaysPaginate: true,  // Buộc phải phân trang
    limit: 10,             // Mặc định 10 items
    maxLimit: 100,         // Tối đa 100 items
    cache: 2000,           // Cache 2 giây
  },
  
  // Params cấu hình
  params: {
    id: {
      field: 'id',        // Tên field
      type: 'uuid',       // Loại dữ liệu
      primary: true,      // Là khóa chính
    },
  },
})
@Controller('products')  // Base path: /products
export class ProductController implements CrudController<Product> {
  constructor(public service: ProductService) {}
  
  // CrudController đã cung cấp tất cả methods
  // GET /products
  // GET /products/:id
  // POST /products
  // PATCH /products/:id
  // DELETE /products/:id
}
```

**Các routes tự động sinh ra:**

| Method | URL | Mục đích |
|--------|-----|---------|
| GET | `/products` | Lấy danh sách (phân trang) |
| GET | `/products/:id` | Lấy chi tiết |
| POST | `/products` | Tạo mới |
| PATCH | `/products/:id` | Cập nhật (partial) |
| PUT | `/products/:id` | Cập nhật (full) |
| DELETE | `/products/:id` | Xóa |

---

## 4. Module (product.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Đọc .env
    
    TypeOrmModule.forRootAsync({  // Config database
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),       // Từ .env
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Product],  // Entities sẽ dùng
        synchronize: config.get<boolean>('DB_SYNCHRONIZE'),  // Tự động tạo table
        logging: config.get<boolean>('DB_LOGGING'),
      }),
    }),
    
    TypeOrmModule.forFeature([Product]),  // Inject repository cho service
  ],
  
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
```

---

## 5. Main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProductModule } from './product.module';

async function bootstrap() {
  // Tạo HTTP server (không phải microservice)
  const app = await NestFactory.create(ProductModule);

  // Validation pipe để kiểm tra input
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Loại bỏ fields không định nghĩa
      transform: true,              // Chuyển kiểu tự động
      forbidNonWhitelisted: true,   // Reject nếu có fields lạ
    }),
  );

  const port = Number(process.env.PRODUCT_SERVICE_PORT ?? 4001);
  await app.listen(port, '0.0.0.0');
  console.log(`Product service running on port ${port}`);
}

void bootstrap();
```

---

## 6. Request/Response Examples

### Tạo sản phẩm

**Request:**
```http
POST /products HTTP/1.1
Content-Type: application/json

{
  "category_id": 1,
  "name": "Hạt cà phê",
  "price": 150000,
  "stock": 50,
  "description": "Cà phê arabica thơm ngon",
  "image_url": "https://example.com/coffee.jpg"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "category_id": 1,
  "name": "Hạt cà phê",
  "price": "150000.00",
  "stock": 50,
  "description": "Cà phê arabica thơm ngon",
  "image_url": "https://example.com/coffee.jpg",
  "is_active": true,
  "created_at": "2026-03-27T10:30:00.000Z",
  "updated_at": "2026-03-27T10:30:00.000Z"
}
```

### Lấy danh sách (phân trang)

**Request:**
```http
GET /products?page=1&limit=5 HTTP/1.1
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Hạt cà phê",
      "price": "150000.00",
      ...
    },
    ...
  ],
  "count": 5,
  "total": 23,
  "page": 1,
  "pageCount": 5
}
```

### Cập nhật sản phẩm

**Request:**
```http
PATCH /products/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Content-Type: application/json

{
  "price": 160000,
  "stock": 45
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "price": "160000.00",
  "stock": 45,
  "updated_at": "2026-03-27T10:35:00.000Z",
  ...
}
```

---

## 7. Lợi ích của kiến trúc này

1. **TypeORM Entity** - Định nghĩa database schema bằng code
2. **@nestjsx/crud** - Tự động sinh CRUD endpoints
3. **TypeOrmCrudService** - Cung cấp base CRUD methods
4. **CrudController** - Implement CrudController để tự động routing
5. **Phân trang tự động** - Không cần viết query pagination
6. **Query validation** - Tự động validate input từ client
7. **Caching** - Giảm load database
