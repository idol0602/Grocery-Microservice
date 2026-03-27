import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { ApiResponse } from '../../../lib/common/response.util';
import { UserRow } from '../../../lib/common/src/types/user.type';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userClient: ClientProxy,
  ) {}

  async getUsers() {
    try {
      const response = await firstValueFrom(
        this.userClient
          .send<ApiResponse<UserRow[]>>({ cmd: 'users.findAll' }, {})
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from user-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot fetch users from user-service: ${message}`);
    }
  }

  async getById(id: string) {
    try {
      const response = await firstValueFrom(
        this.userClient
          .send<ApiResponse<UserRow>>({ cmd: 'user.findById' }, { id })
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from user-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot fetch user from user-service: ${message}`);
    }
  }

  async createUser(userData: any) {
    try {
      const response = await firstValueFrom(
        this.userClient
          .send<ApiResponse<UserRow>>({ cmd: 'user.create' }, userData)
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from user-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot create user in user-service: ${message}`);
    }
  }

  async updateUser(id: string, userData: any) {
    try {
      const response = await firstValueFrom(
        this.userClient
          .send<ApiResponse<UserRow>>({ cmd: 'user.update' }, { id, userData })
          .pipe(timeout(5000)),
      );

      if (!response || !response.data) {
        throw new InternalServerErrorException('Invalid response from user-service');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot update user in user-service: ${message}`);
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await firstValueFrom(
        this.userClient
          .send<ApiResponse<null>>({ cmd: 'user.delete' }, { id })
          .pipe(timeout(5000)),
      );

      if (!response || response.statusCode >= 400) {
        throw new InternalServerErrorException('Failed to delete user');
      }

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Cannot delete user from user-service: ${message}`);
    }
  }
}
