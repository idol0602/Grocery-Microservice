import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoriesService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('PRODUCT_SERVICE_HOST', 'product-service');
    const port = this.configService.get<string>('PRODUCT_SERVICE_PORT', '4001');
    this.baseUrl = `http://${host}:${port}/categories`;
  }

  async getCategories() {
    try {
      const { data } = await this.httpService.axiosRef.get(this.baseUrl);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch categories from product-service');
    }
  }

  async getById(id: number) {
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch category from product-service');
    }
  }

  async createCategory(categoryData: any) {
    try {
      const { data } = await this.httpService.axiosRef.post(this.baseUrl, categoryData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot create category in product-service');
    }
  }

  async updateCategory(id: number, categoryData: any) {
    try {
      const { data } = await this.httpService.axiosRef.patch(`${this.baseUrl}/${id}`, categoryData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot update category in product-service');
    }
  }

  async deleteCategory(id: number) {
    try {
      const { data } = await this.httpService.axiosRef.delete(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete category from product-service');
    }
  }
}
