import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { ProductDto } from './types/product.type';
import {ApiResponse} from "../../../lib/common/response.util"

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async getProducts() {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<ProductDto[]>>({ cmd: 'products.findAll' }, {})
          .pipe(timeout(5000)),
      );
      
      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }
      
      return response;
    } catch {
      throw new InternalServerErrorException(
        'Cannot fetch products from product-service',
      );
    }
  }

  async getById(id: string) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<ProductDto>>({ cmd: 'product.findById' }, { id })
          .pipe(timeout(5000)),
      );
      
      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot fetch product from product-service',
      );
    }
  }

  async createProduct(productData: any) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<ProductDto>>({ cmd: 'product.create' }, productData)
          .pipe(timeout(5000)),
      );
      
      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot create product in product-service',
      );
    }
  }

  async updateProduct(id: string, productData: any) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<ProductDto>>({ cmd: 'product.update' }, { id, productData })
          .pipe(timeout(5000)),
      );
      
      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from product-service');
      }
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot update product in product-service',
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      const response = await firstValueFrom(
        this.productClient
          .send<ApiResponse<any>>({ cmd: 'product.delete' }, { id })
          .pipe(timeout(5000)),
      );
      
      if (!response || response.statusCode >= 400) {
        throw new InternalServerErrorException('Failed to delete product');
      }
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot delete product in product-service',
      );
    }
  }
}
