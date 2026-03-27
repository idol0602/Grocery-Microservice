import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRow } from '../../../lib/common/src/types/order.type';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getOrders(@Query() query: any) {
    return this.ordersService.getOrders(query);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }

  @Post()
  async createOrder(@Body() orderData: OrderRow) {
    return this.ordersService.createOrder(orderData);
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() orderData: OrderRow) {
    return this.ordersService.updateOrder(id, orderData);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
