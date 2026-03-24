import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

type CategoryDto = {
  id: string;
  name: string;
  description: string | null;
};

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async getCategories(): Promise<CategoryDto[]> {
    try {
      return await firstValueFrom(
        this.productClient
          .send<CategoryDto[]>({ cmd: 'categories.findAll' }, {})
          .pipe(timeout(5000)),
      );
    } catch {
      throw new InternalServerErrorException(
        'Cannot fetch categories from product-service',
      );
    }
  }
}
