import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { ApiResponse } from '../../../lib/common/response.util';
import { OrderRow } from '../../../lib/common/src/types/order.type';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_SERVICE')
    private readonly orderClient: ClientProxy,
  ) {}

  async getOrders() {
    try {
      const response = await firstValueFrom(
        this.orderClient
          .send<ApiResponse<OrderRow[]>>({ cmd: 'orders.findAll' }, {})
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from order-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot fetch orders from order-service: ${message}`);
    }
  }

  async getById(id: string) {
    try {
      const response = await firstValueFrom(
        this.orderClient
          .send<ApiResponse<OrderRow>>({ cmd: 'order.findById' }, { id })
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from order-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot fetch order from order-service: ${message}`);
    }
  }

  async createOrder(orderData: any) {
    try {
      const response = await firstValueFrom(
        this.orderClient
          .send<ApiResponse<OrderRow>>({ cmd: 'order.create' }, orderData)
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from order-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot create order in order-service: ${message}`);
    }
  }

  async updateOrder(id: string, orderData: any) {
    try {
      const response = await firstValueFrom(
        this.orderClient
          .send<ApiResponse<OrderRow>>({ cmd: 'order.update' }, { id, orderData })
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from order-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot update order in order-service: ${message}`);
    }
  }

  async deleteOrder(id: string) {
    try {
      const response = await firstValueFrom(
        this.orderClient
          .send<ApiResponse<null>>({ cmd: 'order.delete' }, { id })
          .pipe(timeout(5000)),
      );

      if (!response || response.statusCode >= 400) {
        throw new InternalServerErrorException('Failed to delete order');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot delete order from order-service: ${message}`);
    }
  }
}
