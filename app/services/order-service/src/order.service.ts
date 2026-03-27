import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';
import { ApiResponse, STATUS_CODE } from '../../../../lib/common/response.util';
import { OrderRow } from '../../../../lib/common/src/types/order.type';

@Injectable()
export class OrderService implements OnModuleInit {
  private supabase: any;
  private tableName = 'orders';

  onModuleInit() {
    const url = process.env.SUPABASE_URL_ORDER;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_ORDER;
    if (!url || !serviceRoleKey) {
      throw new InternalServerErrorException(
        'Supabase configuration is missing for order-service',
      );
    }
    this.supabase = getSupabaseClient(url, serviceRoleKey);
  }

  async findAll(): Promise<ApiResponse<OrderRow[]>> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        return new ApiResponse<OrderRow[]>(
          [],
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          'Lỗi truy vấn dữ liệu',
        );
      }
      return new ApiResponse<OrderRow[]>(
        data as OrderRow[],
        STATUS_CODE.OK,
        'Lấy danh sách đơn hàng thành công',
      );
    } catch (err) {
      return new ApiResponse<OrderRow[]>(
        [],
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'Lỗi hệ thống',
      );
    }
  }

  async findById(id: string): Promise<ApiResponse<OrderRow>> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        return new ApiResponse<OrderRow>(
          null as any,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          'Lỗi truy vấn dữ liệu',
        );
      }
      if (!data) {
        return new ApiResponse<OrderRow>(
          null as any,
          STATUS_CODE.NOT_FOUND,
          `Không tìm thấy đơn hàng với id ${id}`,
        );
      }
      return new ApiResponse<OrderRow>(
        data as OrderRow,
        STATUS_CODE.OK,
        'Lấy đơn hàng thành công',
      );
    } catch (err) {
      return new ApiResponse<OrderRow>(
        null as any,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'Lỗi hệ thống',
      );
    }
  }

  async create(orderData: OrderRow): Promise<ApiResponse<OrderRow>> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(orderData)
        .select()
        .single();
      if (error) {
        return new ApiResponse<OrderRow>(
          null as any,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          'Lỗi tạo đơn hàng',
        );
      }
      return new ApiResponse<OrderRow>(
        data as OrderRow,
        STATUS_CODE.CREATED,
        'Tạo đơn hàng thành công',
      );
    } catch (err) {
      return new ApiResponse<OrderRow>(
        null as any,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'Lỗi hệ thống',
      );
    }
  }

  async update(id: string, orderData: OrderRow): Promise<ApiResponse<OrderRow>> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(orderData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        return new ApiResponse<OrderRow>(
          null as any,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          'Lỗi cập nhật đơn hàng',
        );
      }
      return new ApiResponse<OrderRow>(
        data as OrderRow,
        STATUS_CODE.OK,
        'Cập nhật đơn hàng thành công',
      );
    } catch (err) {
      return new ApiResponse<OrderRow>(
        null as any,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'Lỗi hệ thống',
      );
    }
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      if (error) {
        return new ApiResponse<null>(
          null,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          'Lỗi xóa đơn hàng',
        );
      }
      return new ApiResponse<null>(
        null,
        STATUS_CODE.OK,
        'Xóa đơn hàng thành công',
      );
    } catch (err) {
      return new ApiResponse<null>(
        null,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'Lỗi hệ thống',
      );
    }
  }
}
