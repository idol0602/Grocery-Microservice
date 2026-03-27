import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';
import { PRODUCT_SERVICE_TABLES } from './const/tables';
import { CategoryRow } from '../../../../lib/common/src/types/product.type';
import { ApiResponse, STATUS_CODE } from '../../../../lib/common/response.util';

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

  async findById(id: number): Promise<ApiResponse<CategoryRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.CATEGORIES)
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi truy vấn dữ liệu');
      }
      if (!data) {
        return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.NOT_FOUND, `Không tìm thấy danh mục với id ${id}`);
      }
      return new ApiResponse<CategoryRow>(data as CategoryRow, STATUS_CODE.OK, 'Lấy danh mục thành công');
    } catch (err) {
      return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async create(categoryData: CategoryRow): Promise<ApiResponse<CategoryRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.CATEGORIES)
        .insert(categoryData)
        .select()
        .single();
      if (error) {
        return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi tạo danh mục');
      }
      return new ApiResponse<CategoryRow>(data as CategoryRow, STATUS_CODE.CREATED, 'Tạo danh mục thành công');
    } catch (err) {
      return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async update(id: number, categoryData: CategoryRow): Promise<ApiResponse<CategoryRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.CATEGORIES)
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi cập nhật danh mục');
      }
      return new ApiResponse<CategoryRow>(data as CategoryRow, STATUS_CODE.OK, 'Cập nhật danh mục thành công');
    } catch (err) {
      return new ApiResponse<CategoryRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    try {
      const { error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.CATEGORIES)
        .delete()
        .eq('id', id);
      if (error) {
        return new ApiResponse<null>(null, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi xóa danh mục');
      }
      return new ApiResponse<null>(null, STATUS_CODE.OK, 'Xóa danh mục thành công');
    } catch (err) {
      return new ApiResponse<null>(null, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }
}