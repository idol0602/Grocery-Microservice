import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryRow } from '../../../lib/common/src/types/product.type';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Query() query: any) {
    return this.categoriesService.getCategories(query);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getById(parseInt(id, 10));
  }

  @Post()
  async createCategory(@Body() categoryData: CategoryRow) {
    return this.categoriesService.createCategory(categoryData);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() categoryData: CategoryRow) {
    return this.categoriesService.updateCategory(parseInt(id, 10), categoryData);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(parseInt(id, 10));
  }
}
