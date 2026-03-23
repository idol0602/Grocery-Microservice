import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class OrderController {
  @MessagePattern({ cmd: 'orders.health' })
  health() {
    return {
      service: 'order-service',
      supabaseConfigured:
        Boolean(process.env.SUPABASE_URL_ORDER) &&
        Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY_ORDER),
      status: 'ok',
    };
  }
}
