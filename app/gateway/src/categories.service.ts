import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {ApiResponse} from "../../../lib/common/response.util"
import { CategoryRow } from '../../../lib/common/src/types/product.type';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async getCategories() {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<CategoryRow[]>>({ cmd: 'categories.findAll' }, {})
          .pipe(timeout(5000)),
      );
      
      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot fetch categories from product-service: ${message}`);
    }
  }

  async getById(id: number) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<CategoryRow>>({ cmd: 'category.findById' }, { id })
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot fetch category from product-service: ${message}`);
    }
  }

  async createCategory(categoryData: any) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<CategoryRow>>({ cmd: 'category.create' }, categoryData)
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot create category in product-service: ${message}`);
    }
  }

  async updateCategory(id: number, categoryData: any) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<CategoryRow>>({ cmd: 'category.update' }, { id, categoryData })
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot update category in product-service: ${message}`);
    }
  }

  async deleteCategory(id: number) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<null>>({ cmd: 'category.delete' }, { id })
          .pipe(timeout(5000)),
      );

      if (!response || response.statusCode >= 400) {
        throw new InternalServerErrorException('Failed to delete category');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot delete category from product-service: ${message}`);
    }
  }
}
