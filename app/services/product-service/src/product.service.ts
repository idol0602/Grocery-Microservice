import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';
import { PRODUCT_SERVICE_TABLES } from './const/tables';
import {ProductRow} from './types/productType';

@Injectable()
export class ProductService implements OnModuleInit {
  private supabase : any;

  onModuleInit() {
    const url = process.env.SUPABASE_URL_PRODUCT;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_PRODUCT;
    if(!url || !serviceRoleKey) {
      throw new InternalServerErrorException('Supabase configuration is missing for product-service');
    }
    this.supabase = getSupabaseClient(url, serviceRoleKey);
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data as ProductRow[];
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as ProductRow;
  }
}