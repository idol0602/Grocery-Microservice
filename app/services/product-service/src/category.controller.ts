import { Controller, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
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
@UseInterceptors(CrudRequestInterceptor)
export class CategoryController implements CrudController<Category> {
  constructor(public service: CategoryService) {}
}