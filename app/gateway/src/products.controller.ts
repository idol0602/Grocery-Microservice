import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductRow } from '../../../lib/common/src/types/product.type';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: any) {
    return this.productsService.getProducts(query);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @Post()
  async createProduct(@Body() productData: ProductRow) {
    return this.productsService.createProduct(productData);
  }

  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() productData: ProductRow) {
    return this.productsService.updateProduct(id, productData);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
