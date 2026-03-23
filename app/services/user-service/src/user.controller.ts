import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  @MessagePattern({ cmd: 'users.health' })
  health() {
    return {
      service: 'user-service',
      supabaseConfigured:
        Boolean(process.env.SUPABASE_URL_USER) &&
        Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY_USER),
      status: 'ok',
    };
  }
}
