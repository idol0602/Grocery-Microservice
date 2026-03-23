import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';

type ProductRow = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

@Injectable()
export class ProductService implements OnModuleInit {
  private tableName = 'products';

  onModuleInit() {
    this.tableName = process.env.SUPABASE_PRODUCTS_TABLE ?? 'products';
  }

  async findAll() {
    const url = process.env.SUPABASE_URL_PRODUCT;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_PRODUCT;

    if (!url || !serviceRoleKey) {
      throw new InternalServerErrorException(
        'SUPABASE_URL_PRODUCT or SUPABASE_SERVICE_ROLE_KEY_PRODUCT is missing',
      );
    }

    const supabase = getSupabaseClient(url, serviceRoleKey);

    const { data, error } = await supabase
      .from(this.tableName)
      .select('id,name,price,image_url')
      .order('name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data as ProductRow[]).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url ?? undefined,
    }));
  }
}
