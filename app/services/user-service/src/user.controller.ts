import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRow } from '../../../../lib/common/src/types/user.type';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('health')
  health() {
    return {
      service: 'user-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() userData: UserRow) {
    return this.userService.create(userData);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userData: UserRow) {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
