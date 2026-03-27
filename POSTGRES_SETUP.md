# PostgreSQL Setup for Product Service

## Vấn đề
Product Service sử dụng TypeORM + PostgreSQL nhưng docker-compose chưa có PostgreSQL database. Service kết nối rejected.

## Giải pháp

### 1. Docker Compose (Khuyên dùng)

Đã cập nhật `docker-compose.yml` để thêm PostgreSQL service:

```yaml
postgres:
  image: postgres:15-alpine
  container_name: grocery-postgres
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: grocery_db
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

**Chạy lệnh:**
```bash
docker-compose up -d postgres
# Chờ 10 giây để database sẵn sàng
docker-compose up -d
```

**Xác nhận database sẵn sàng:**
```bash
docker-compose ps
# grocery-postgres phải có status "Up" hoặc "(healthy)"
```

### 2. Local PostgreSQL

Nếu chạy local mà không dùng Docker:

**Windows (PostGIS installer):**
```bash
# Download từ https://www.postgresql.org/download/windows/
# Cài đặt, chọn port 5432
psql -U postgres -c "CREATE DATABASE grocery_db;"
```

**Cập nhật .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=grocery_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

**Chạy service:**
```bash
npm run start:dev:product
```

### 3. Environment Variables

**docker-compose.yml** đã cập nhật:
- `DB_HOST=postgres` (container name)
- `DB_PORT=5432`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=grocery_db`

**Product Service** tự động:
1. Đợi PostgreSQL sẵn sàng (healthcheck)
2. Kết nối đến database
3. Tạo tables tự động (synchronize: true)

### 4. Verify Connection

**Kiểm tra logs:**
```bash
docker-compose logs -f grocery-product-service
# Nên thấy: "Product service running on port 4001"
```

**Test API:**
```bash
curl http://localhost:4001/products
```

### 5. Database Schema

TypeORM sẽ tự động tạo:

**products table:**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**categories table:**
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL
);
```

### 6. Troubleshooting

**Error: ECONNREFUSED localhost:5432**
- PostgreSQL không chạy hoặc chưa sẵn sàng
- Kiểm tra: `docker-compose ps` hoặc `psql --version`

**Error: database grocery_db does not exist**
- Database chưa được tạo
- Chạy: `docker-compose exec postgres psql -U postgres -c "CREATE DATABASE grocery_db;"`

**Port 5432 đã bị dùng**
- Thay đổi port trong docker-compose.yml: `"5433:5432"`
- Cập nhật DB_PORT=5433

### Next Steps
1. Cập nhật user-service và order-service tương tự
2. Thay đổi gateway để gọi HTTP endpoints thay vì microservice RPC
