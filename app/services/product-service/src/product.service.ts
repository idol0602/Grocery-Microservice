import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';
import { PRODUCT_SERVICE_TABLES } from './const/tables';
import { ApiResponse, STATUS_CODE } from '../../../../lib/common/response.util';
import {ProductRow} from '../../../../lib/common/src/types/product.type';

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

  async findAll(): Promise<ApiResponse<ProductRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
        .select('*')
        .order('name', { ascending: true });
      if (error) {
        return new ApiResponse<ProductRow[]>([], STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi truy vấn dữ liệu');
      }
      return new ApiResponse<ProductRow[]>(data as ProductRow[], STATUS_CODE.OK, 'Lấy danh sách sản phẩm thành công');
    } catch (err) {
      return new ApiResponse<ProductRow[]>([], STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async findById(id: string): Promise<ApiResponse<ProductRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi truy vấn dữ liệu');
      }
      if (!data) {
        return new ApiResponse<ProductRow>(null as any, STATUS_CODE.NOT_FOUND, `Không tìm thấy sản phẩm với id ${id}`);
      }
      return new ApiResponse<ProductRow>(data as ProductRow, STATUS_CODE.OK, 'Lấy sản phẩm thành công');
    } catch (err) {
      return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async create(productData: ProductRow): Promise<ApiResponse<ProductRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
        .insert(productData)
        .select()
        .single();
      if (error) {
        return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi tạo sản phẩm');
      }
      return new ApiResponse<ProductRow>(data as ProductRow, STATUS_CODE.CREATED, 'Tạo sản phẩm thành công');
    } catch (err) {
      return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async update(id: string, productData: ProductRow): Promise<ApiResponse<ProductRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi cập nhật sản phẩm');
      }
      return new ApiResponse<ProductRow>(data as ProductRow, STATUS_CODE.OK, 'Cập nhật sản phẩm thành công');
    } catch (err) {
      return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }

  async delete(id: string): Promise<ApiResponse<ProductRow>> {
    try {
      const { data, error } = await this.supabase
        .from(PRODUCT_SERVICE_TABLES.PRODUCTS)
        .delete()
        .eq('id', id);
      if (error) {
        return new ApiResponse<ProductRow>(null as any, STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi xóa sản phẩm');
      }
      return new ApiResponse<ProductRow>(null as any, STATUS_CODE.OK, 'Xóa sản phẩm thành công');
    } catch (err) {
      return new ApiResponse<ProductRow>([], STATUS_CODE.INTERNAL_SERVER_ERROR, 'Lỗi hệ thống');
    }
  }
}