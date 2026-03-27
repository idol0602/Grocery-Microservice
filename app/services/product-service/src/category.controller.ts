import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';

@Crud({
  model: { type: Category },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    alwaysPaginate: true,
    limit: 20,
    maxLimit: 100,
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
})
@Controller('categories')
export class CategoryController implements CrudController<Category> {
  constructor(public service: CategoryService) {}
}