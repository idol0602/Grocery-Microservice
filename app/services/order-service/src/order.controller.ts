import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { OrderRow } from '../../../../lib/common/src/types/order.type';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'orders.findAll' })
  async findAll() {
    return this.orderService.findAll();
  }

  @MessagePattern({ cmd: 'order.findById' })
  async findById(data: { id: string }) {
    const { id } = data;
    return this.orderService.findById(id);
  }

  @MessagePattern({ cmd: 'order.create' })
  async create(orderData: OrderRow) {
    return this.orderService.create(orderData);
  }

  @MessagePattern({ cmd: 'order.update' })
  async update(data: { id: string; orderData: OrderRow }) {
    const { id, orderData } = data;
    return this.orderService.update(id, orderData);
  }

  @MessagePattern({ cmd: 'order.delete' })
  async delete(data: { id: string }) {
    const { id } = data;
    return this.orderService.delete(id);
  }

  @MessagePattern({ cmd: 'orders.health' })
  health() {
    return {
      service: 'order-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
