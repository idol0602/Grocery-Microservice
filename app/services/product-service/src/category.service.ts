import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';
import { PRODUCT_SERVICE_TABLES } from './const/tables';
import { CategoryRow } from './types/category.type';
import { ApiResponse, STATUS_CODE } from '@/lib/common/response.util';

@Injectable()
export class CategoryService implements OnModuleInit {
  private supabase: any;

  onModuleInit() {
    const url = process.env.SUPABASE_URL_PRODUCT;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_PRODUCT;
    if (!url || !serviceRoleKey) {
      throw new InternalServerErrorException('Supabase configuration is missing for product-service');
    }
    this.supabase = getSupabaseClient(url, serviceRoleKey);
  }

  async findAll(): Promise<ApiResponse<CategoryRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.CATEGORIES)
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return new ApiResponse<CategoryRow[]>([], STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi truy vấn dữ liệu');
      }
      return new ApiResponse<CategoryRow[]>(data as CategoryRow[], STATUS_CODE.OK, 'Lấy danh sách danh mục thành công');
    } catch (err) {
      return new ApiResponse<CategoryRow[]>([], STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }
}