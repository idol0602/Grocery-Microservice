# Grocery Microservices (NestJS + Supabase + Nginx + Docker)

## 1. Kien truc tong quan

- Lop 1: `Nginx` nhan HTTP request (port `8080` local, `80` production).
- Lop 2: `NestJS Gateway` nhan route `/api/*`, sau do goi sang microservice noi bo.
- 3 microservice:
  - `product-service` -> Supabase DB Product.
  - `user-service` -> Supabase DB User.
  - `order-service` -> Supabase DB Order.

Luong goi API:

`Client -> Nginx -> Gateway (/api/products) -> product-service (TCP) -> Supabase`

## 2. Cai thu vien bat buoc

Neu ban dang o thu muc goc du an:

```bash
npm install
```

Neu ban muon cai thu cong (tham khao):

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/microservices @nestjs/config @supabase/supabase-js class-validator class-transformer reflect-metadata rxjs bcrypt
npm install -D typescript ts-node ts-node-dev @types/node @types/bcrypt
```

## 3. Cau hinh bien moi truong

Sao chep file mau:

```bash
cp .env.example .env
```

Dien thong tin Supabase cho 3 database:

- `SUPABASE_URL_PRODUCT`
- `SUPABASE_SERVICE_ROLE_KEY_PRODUCT`
- `SUPABASE_URL_USER`
- `SUPABASE_SERVICE_ROLE_KEY_USER`
- `SUPABASE_URL_ORDER`
- `SUPABASE_SERVICE_ROLE_KEY_ORDER`

Bang du lieu product mac dinh la `products`, co the doi qua `SUPABASE_PRODUCTS_TABLE`.

## 4. Code service Product

API can goi:

- Endpoint public qua gateway: `GET /api/products`
- Gateway route file: `app/gateway/src/products.controller.ts`
- Microservice handler file: `app/services/product-service/src/product.controller.ts`
- Supabase query file: `app/services/product-service/src/product.service.ts`

Query hien tai:

- Doc cac cot: `id, name, price, image_url`
- Sort theo `name` tang dan

## 5. Chay local voi Docker

```bash
docker compose up -d --build
```

Test API:

```bash
curl http://localhost:8080/api/products
```

Kiem tra health gateway:

```bash
curl http://localhost:8080/api/health
```

## 6. CI/CD voi GitHub Actions

Workflow: `.github/workflows/deploy.yml`

Moi lan push nhanh `main` se:

1. Build va push 5 image len GHCR:
   - `grocery-nginx`
   - `grocery-gateway`
   - `grocery-product-service`
   - `grocery-user-service`
   - `grocery-order-service`
2. SSH vao VPS Oracle Cloud va chay `docker compose pull && up -d`.

### GitHub Secrets can tao

- `VPS_HOST`: IP public VPS Oracle.
- `VPS_USER`: user SSH (vd: `ubuntu` hoac `opc`).
- `VPS_SSH_KEY`: private key SSH.
- `VPS_APP_DIR`: thu muc deploy tren VPS (vd: `/opt/grocery`).
- `GHCR_USERNAME`: username GitHub co quyen pull package.
- `GHCR_PAT`: Personal Access Token co quyen `read:packages` (va `write:packages` neu can).

## 7. Deploy len Oracle Cloud VPS (lan dau)

SSH vao VPS:

```bash
ssh ubuntu@<VPS_HOST>
```

Cai Docker + Compose plugin (Ubuntu):

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

Tao thu muc app:

```bash
sudo mkdir -p /opt/grocery
sudo chown -R $USER:$USER /opt/grocery
```

Tao file `/opt/grocery/.env`:

```env
SUPABASE_URL_PRODUCT=...
SUPABASE_SERVICE_ROLE_KEY_PRODUCT=...
SUPABASE_PRODUCTS_TABLE=products

SUPABASE_URL_USER=...
SUPABASE_SERVICE_ROLE_KEY_USER=...

SUPABASE_URL_ORDER=...
SUPABASE_SERVICE_ROLE_KEY_ORDER=...
```

Mo firewall Oracle Cloud Security List:

- Inbound TCP `80` (public)
- Inbound TCP `22` (SSH)

Sau khi push code len nhanh `main`, workflow se tu deploy.

## 8. Lenh debug nhanh

Xem log:

```bash
docker compose logs -f gateway
docker compose logs -f product-service
```

Restart:

```bash
docker compose restart
```
