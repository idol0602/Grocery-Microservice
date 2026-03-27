import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRow } from '../../../lib/common/src/types/order.type';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }

  @Post()
  async createOrder(@Body() orderData: OrderRow) {
    return this.ordersService.createOrder(orderData);
  }

  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() orderData: OrderRow) {
    return this.ordersService.updateOrder(id, orderData);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
