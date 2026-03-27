import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PRODUCT_SERVICE_HOST', 'product-service');
    const port = this.configService.get<string>('PRODUCT_SERVICE_PORT', '4001');
    this.baseUrl = `http://${host}:${port}/products`;
  }

  async getProducts() {
    try {
      const { data } = await this.httpService.axiosRef.get(this.baseUrl);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch products from product-service');
    }
  }

  async getById(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch product from product-service');
    }
  }

  async createProduct(productData: any) {
    try {
      const { data } = await this.httpService.axiosRef.post(this.baseUrl, productData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot create product in product-service');
    }
  }

  async updateProduct(id: string, productData: any) {
    try {
      const { data } = await this.httpService.axiosRef.patch(`${this.baseUrl}/${id}`, productData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot update product in product-service');
    }
  }

  async deleteProduct(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.delete(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete product in product-service');
    }
  }
}
