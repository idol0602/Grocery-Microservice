import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

type ProductDto = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
};

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async getProducts(): Promise<ProductDto[]> {
    try {
      return await firstValueFrom(
        this.productClient
          .send<ProductDto[]>({ cmd: 'products.findAll' }, {})
          .pipe(timeout(5000)),
      );
    } catch {
      throw new InternalServerErrorException(
        'Cannot fetch products from product-service',
      );
    }
  }
}
