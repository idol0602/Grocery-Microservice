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
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findMany(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate(query, this.repo, {
      sortableColumns: ['id', 'name', 'price', 'stock', 'created_at'],
      searchableColumns: ['name', 'description'],
      filterableColumns: {
        category_id: [FilterOperator.EQ, FilterOperator.IN],
        is_active: [FilterOperator.EQ],
        price: [FilterOperator.GTE, FilterOperator.LTE, FilterOperator.BTW],
        stock: [FilterOperator.GTE, FilterOperator.LTE],
        name: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
      },
      defaultSortBy: [['created_at', 'DESC']],
      defaultLimit: 10,
      maxLimit: 100,
    });
  }

  findOne(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(dto: Partial<Product>): Promise<Product> {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async update(id: string, dto: Partial<Product>): Promise<Product | null> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}