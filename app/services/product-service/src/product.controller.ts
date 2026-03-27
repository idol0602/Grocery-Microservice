import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

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

  @MessagePattern({ cmd: 'health' })
  health() {
    return {
      service: 'product-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
