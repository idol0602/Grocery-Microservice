import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('ORDER_SERVICE_HOST', 'order-service');
    const port = this.configService.get<string>('ORDER_SERVICE_PORT', '4003');
    this.baseUrl = `http://${host}:${port}/orders`;
  }

  async getOrders(query?: any) {
    try {
      const { data } = await this.httpService.axiosRef.get(this.baseUrl, { params: query });
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch orders from order-service');
    }
  }

  async getById(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch order from order-service');
    }
  }

  async createOrder(orderData: any) {
    try {
      const { data } = await this.httpService.axiosRef.post(this.baseUrl, orderData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot create order in order-service');
    }
  }

  async updateOrder(id: string, orderData: any) {
    try {
      const { data } = await this.httpService.axiosRef.patch(`${this.baseUrl}/${id}`, orderData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot update order in order-service');
    }
  }

  async deleteOrder(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.delete(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete order from order-service');
    }
  }
}
