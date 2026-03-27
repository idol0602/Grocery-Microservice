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
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('health')
  health() {
    return { service: 'category', status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get()
  findMany(@Paginate() query: PaginateQuery) {
    return this.categoryService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(Number(id));
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  @Post()
  create(@Body() dto: Partial<Category>) {
    return this.categoryService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<Category>) {
    const category = await this.categoryService.update(Number(id), dto);
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(Number(id));
  }
}