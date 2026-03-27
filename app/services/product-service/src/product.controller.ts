import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { ProductRow } from './types/product.type';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'products.findAll' })
  async findAll() {
    return this.productService.findAll();
  }

  @MessagePattern({ cmd: 'product.findById' })
  async findById(data: { id: string }) {
    const { id } = data;
    return this.productService.findById(id);
  }

  @MessagePattern({ cmd: 'product.create' })
  async create(productData: ProductRow) {
    return this.productService.create(productData);
  }

  @MessagePattern({ cmd: 'product.update' })
  async update(data: { id: string; productData: ProductRow }) {
    const { id, productData } = data;
    return this.productService.update(id, productData);
  }

  @MessagePattern({ cmd: 'product.delete' })
  async delete(data: { id: string }) {
    const { id } = data;
    return this.productService.delete(id);
  }

  @MessagePattern({ cmd: 'health' })
  health() {
    return {
      service: 'product-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
