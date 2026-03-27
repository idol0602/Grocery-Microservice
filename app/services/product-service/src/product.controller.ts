import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('health')
  health() {
    return { service: 'product-service', status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get()
  findMany(@Paginate() query: PaginateQuery) {
    return this.productService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  @Post()
  create(@Body() dto: Partial<Product>) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<Product>) {
    const product = await this.productService.update(id, dto);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
