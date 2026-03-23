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

  @MessagePattern({ cmd: 'health' })
  health() {
    return {
      service: 'product-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
