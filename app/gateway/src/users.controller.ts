import { Controller, Get, Param, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRow } from '../../../lib/common/src/types/user.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: any) {
    return this.usersService.getUsers(query);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  async createUser(@Body() userData: UserRow) {
    return this.usersService.createUser(userData);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UserRow) {
    return this.usersService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
