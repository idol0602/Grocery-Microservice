# Product Service - TypeORM + @nestjsx/crud CRUD

## 📚 Hướng dẫn sử dụng @nestjsx/crud

### 1. **Cấu trúc project**

```
product-service/src/
├── entities/               # TypeORM entities
│   ├── product.entity.ts
│   └── category.entity.ts
├── product.service.ts     # Extend TypeOrmCrudService
├── product.controller.ts  # Implement CrudController
├── product.module.ts      # Import TypeOrmModule
└── main.ts                # HTTP server (NestFactory.create)
```

### 2. **Thiết lập Database**

Copy `.env.product.example` thành `.env.product` và cấu hình:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=grocery_product
DB_SYNCHRONIZE=true  # Tự động khởi tạo table từ entity
```

### 3. **API Endpoints (Tự động sinh ra bởi @nestjsx/crud)**

#### **Products**

```bash
# GET - Lấy danh sách với phân trang (mặc định 10 items/trang)
GET http://localhost:4001/products
GET http://localhost:4001/products?page=1&limit=5

# GET - Chi tiết sản phẩm theo ID
GET http://localhost:4001/products/:id

# POST - Tạo sản phẩm mới
POST http://localhost:4001/products
Content-Type: application/json

{
  "category_id": 1,
  "name": "Táo Mỹ",
  "price": 35000,
  "stock": 100,
  "description": "Táo Mỹ nhập khẩu",
  "image_url": "https://...",
  "is_active": true
}

# PATCH - Cập nhật sản phẩm (partial update)
PATCH http://localhost:4001/products/:id
Content-Type: application/json

{
  "name": "Táo Mỹ (cập nhật)",
  "price": 36000
}

# DELETE - Xóa sản phẩm
DELETE http://localhost:4001/products/:id
```

#### **Categories**

```bash
# GET - Lấy danh sách danh mục
GET http://localhost:4001/categories
GET http://localhost:4001/categories?page=1&limit=20

# GET - Chi tiết danh mục
GET http://localhost:4001/categories/:id

# POST - Tạo danh mục
POST http://localhost:4001/categories
{
  "name": "Trái cây",
  "slug": "trai-cay"
}

# PATCH - Cập nhật danh mục
PATCH http://localhost:4001/categories/:id
{
  "name": "Trái cây tươi"
}

# DELETE - Xóa danh mục
DELETE http://localhost:4001/categories/:id
```

### 4. **Query Parameters (Phân trang & Tìm kiếm)**

```bash
# Phân trang
GET /products?page=2&limit=5

# Sắp xếp
GET /products?sort=-price    # Giảm dần theo giá
GET /products?sort=name      # Tăng dần theo tên

# Lọc
GET /products?filter=is_active||eq||true
GET /products?filter=price||gte||30000   # Giá >= 30000

# Joining (nếu có relations)
GET /products?join=category

# Select fields
GET /products?select=id,name,price
```

### 5. **Cấu hình CRUD trong Controller**

```typescript
@Crud({
  model: { type: Product },           // Entity để sử dụng
  query: {
    alwaysPaginate: true,             // Luôn phân trang
    limit: 10,                        // Giới hạn mặc định
    maxLimit: 100,                    // Giới hạn tối đa
    cache: 2000,                      // Cache 2000ms
  },
  routes: {
    exclude: ['replaceOneBase'],      // Loại bỏ routes không cần
  },
})
```

### 6. **Service - Extend TypeOrmCrudService**

```typescript
@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) repo: Repository<Product>) {
    super(repo);
  }
  
  // Có thể thêm methods custom
  async customMethod() {
    return this.repo.find({ where: { is_active: true } });
  }
}
```

### 7. **Chạy Service**

```bash
# Development
npm run start:dev:product

# Production
npm run start:product
```

### 8. **Lợi ích của @nestjsx/crud**

✅ **Tự động sinh CRUD endpoints** - Không cần viết GET, POST, PATCH, DELETE  
✅ **Phân trang tự động** - Mặc định 10 items/trang  
✅ **Sorting & Filtering** - Query parameters tự động  
✅ **Validation** - Tích hợp class-validator  
✅ **TypeORM integration** - Kết nối trực tiếp database  
✅ **Caching** - Giảm load database  

### 9. **Test API với cURL**

```bash
# Tạo sản phẩm
curl -X POST http://localhost:4001/products \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "name": "Chuối Tây",
    "price": 15000,
    "stock": 50,
    "description": "Chuối Tây tươi ngon"
  }'

# Lấy danh sách (trang 1, 5 items)
curl "http://localhost:4001/products?page=1&limit=5"

# Cập nhật
curl -X PATCH http://localhost:4001/products/<id> \
  -H "Content-Type: application/json" \
  -d '{"price": 16000}'

# Xóa
curl -X DELETE http://localhost:4001/products/<id>
```

---

**Lưu ý:** 
- @nestjsx/crud tự động format response theo format chuẩn
- Nếu cần custom response, override methods trong service
- Phân trang hoạt động với `?page=` (1-indexed) và `?limit=`
