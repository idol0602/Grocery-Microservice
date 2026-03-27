import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CategoryRow } from '../../../../lib/common/src/types/product.type';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern({ cmd: 'categories.findAll' })
  async findAll() {
    return this.categoryService.findAll();
  }

  @MessagePattern({ cmd: 'category.findById' })
  async findById(data: { id: number }) {
    const { id } = data;
    return this.categoryService.findById(id);
  }

  @MessagePattern({ cmd: 'category.create' })
  async create(categoryData: CategoryRow) {
    return this.categoryService.create(categoryData);
  }

  @MessagePattern({ cmd: 'category.update' })
  async update(data: { id: number; categoryData: CategoryRow }) {
    const { id, categoryData } = data;
    return this.categoryService.update(id, categoryData);
  }

  @MessagePattern({ cmd: 'category.delete' })
  async delete(data: { id: number }) {
    const { id } = data;
    return this.categoryService.delete(id);
  }
}