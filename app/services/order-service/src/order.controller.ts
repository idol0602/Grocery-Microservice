import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRow } from '../../../../lib/common/src/types/order.type';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('health')
  health() {
    return {
      service: 'order-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Post()
  async create(@Body() orderData: OrderRow) {
    return this.orderService.create(orderData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() orderData: OrderRow) {
    return this.orderService.update(id, orderData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.orderService.delete(id);
  }
}
