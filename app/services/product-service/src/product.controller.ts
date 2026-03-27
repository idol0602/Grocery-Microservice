import { Controller, UseInterceptors } from '@nestjs/common';
import { Crud, CrudController, CrudRequestInterceptor } from '@nestjsx/crud';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Crud({
  model: { type: Product },
  routes: {
    exclude: ['replaceOneBase', 'createManyBase'],
  },
  query: {
    alwaysPaginate: true,
    limit: 10,
    maxLimit: 100,
    cache: 2000, // cache 2 giây
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@Controller('products')
@UseInterceptors(CrudRequestInterceptor)
export class ProductController implements CrudController<Product> {
  constructor(public service: ProductService) {}
}
