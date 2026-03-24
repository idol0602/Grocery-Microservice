import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { getSupabaseClient } from '../../../../lib/common/src/database/supabase.client';

type UserRow = {
    id : string,
    email : string,
    password : string,
    full_name : string,
    role : string,
    created_at : string
    is_active  : boolean
}

export class UserService implements OnModuleInit {
    private tableName = 'users';
}.