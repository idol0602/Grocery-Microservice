export type UserRole = 'ADMIN' | 'CUSTOMER' | 'STAFF';

export type UserRow = {
  id?: string; // UUID
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
};
