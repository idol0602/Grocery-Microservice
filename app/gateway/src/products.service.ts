import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductRow } from '../../../lib/common/src/types/product.type';

// Reusing the ApiResponse concept since original TCP service used it
// even though @nestjsx/crud returns raw data. We will wrap the response.
@Injectable()
export class ProductsService {
  private readonly productUrl: string;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('PRODUCT_SERVICE_HOST', 'product-service');
    const port = this.configService.get<string>('PRODUCT_SERVICE_PORT', '4001');
    this.productUrl = `http://${host}:${port}/products`;
  }

  private wrapResponse(data: any, defaultMessage: string = 'Success') {
    return {
      data: data,
      statusCode: 200,
      message: defaultMessage,
    };
  }

  async getProducts() {
    try {
      const res = await fetch(this.productUrl);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const rawData = await res.json();
      // @nestjsx/crud returns { data: [], total: number, ... } for paginated
      return this.wrapResponse(rawData, 'Lấy danh sách sản phẩm thành công');
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch products from product-service');
    }
  }

  async getById(id: string) {
    try {
      const res = await fetch(`${this.productUrl}/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const rawData = await res.json();
      return this.wrapResponse(rawData, 'Lấy sản phẩm thành công');
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch product from product-service');
    }
  }

  async createProduct(productData: any) {
    try {
      const res = await fetch(this.productUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const rawData = await res.json();
      return this.wrapResponse(rawData, 'Tạo sản phẩm thành công');
    } catch (error) {
      throw new InternalServerErrorException('Cannot create product in product-service');
    }
  }

  async updateProduct(id: string, productData: any) {
    try {
      // @nestjsx/crud uses PATCH for updates
      const res = await fetch(`${this.productUrl}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const rawData = await res.json();
      return this.wrapResponse(rawData, 'Cập nhật sản phẩm thành công');
    } catch (error) {
      throw new InternalServerErrorException('Cannot update product in product-service');
    }
  }

  async deleteProduct(id: string) {
    try {
      const res = await fetch(`${this.productUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return this.wrapResponse(null, 'Xóa sản phẩm thành công');
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete product in product-service');
    }
  }
}
