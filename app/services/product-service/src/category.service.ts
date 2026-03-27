import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Paginated,
  PaginateQuery,
  FilterOperator,
  FilterSuffix,
} from 'nestjs-paginate';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  findMany(query: PaginateQuery): Promise<Paginated<Category>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'name', 'slug'],
      searchableColumns: ['name', 'slug'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
        slug: [FilterOperator.EQ],
      },
      defaultSortBy: [['id', 'ASC']],
      defaultLimit: 20,
      maxLimit: 100,
    });
  }

  findOne(id: number): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: Partial<Category>): Promise<Category> {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  async update(id: number, dto: Partial<Category>): Promise<Category | null> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}