import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserRow } from '../../../../lib/common/src/types/user.type';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'users.findAll' })
  async findAll() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'user.findById' })
  async findById(data: { id: string }) {
    const { id } = data;
    return this.userService.findById(id);
  }

  @MessagePattern({ cmd: 'user.create' })
  async create(userData: UserRow) {
    return this.userService.create(userData);
  }

  @MessagePattern({ cmd: 'user.update' })
  async update(data: { id: string; userData: UserRow }) {
    const { id, userData } = data;
    return this.userService.update(id, userData);
  }

  @MessagePattern({ cmd: 'user.delete' })
  async delete(data: { id: string }) {
    const { id } = data;
    return this.userService.delete(id);
  }

  @MessagePattern({ cmd: 'users.health' })
  health() {
    return {
      service: 'user-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
