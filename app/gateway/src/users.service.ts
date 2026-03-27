import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('USER_SERVICE_HOST', 'user-service');
    const port = this.configService.get<string>('USER_SERVICE_PORT', '4002');
    this.baseUrl = `http://${host}:${port}/users`;
  }

  async getUsers(query?: any) {
    try {
      const { data } = await this.httpService.axiosRef.get(this.baseUrl, { params: query });
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch users from user-service');
    }
  }

  async getById(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot fetch user from user-service');
    }
  }

  async createUser(userData: any) {
    try {
      const { data } = await this.httpService.axiosRef.post(this.baseUrl, userData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot create user in user-service');
    }
  }

  async updateUser(id: string, userData: any) {
    try {
      const { data } = await this.httpService.axiosRef.patch(`${this.baseUrl}/${id}`, userData);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot update user in user-service');
    }
  }

  async deleteUser(id: string) {
    try {
      const { data } = await this.httpService.axiosRef.delete(`${this.baseUrl}/${id}`);
      return data;
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete user from user-service');
    }
  }
}
