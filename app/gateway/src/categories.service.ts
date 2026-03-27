import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import {ApiResponse} from "../../../lib/common/response.util"
import { CategoryDto } from './types/category.type';

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
          .send<ApiResponse<CategoryDto[]>>({ cmd: 'categories.findAll' }, {})
          .pipe(timeout(5000)),
      );
      
      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }
      
      return response;
    } catch {
      throw new InternalServerErrorException(
        'Cannot fetch categories from product-service',
      );
    }
  }
}
