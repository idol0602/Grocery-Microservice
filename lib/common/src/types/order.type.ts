export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';
export type TransportStatus = 'PREPARING' | 'SHIPPING' | 'DELIVERED';

export type OrderRow = {
  id?: string; // UUID
  user_id: string; // UUID
  total_price: number; // DECIMAL
  status: OrderStatus;
  transport: TransportStatus;
  address: string;
  created_at?: string;
};

export type OrderItem = {
  id?: string; // UUID
  order_id: string; // UUID
  product_id: string; // UUID
  quantity: number; // INT
  price_at_purchase: number; // DECIMAL
  product_name_at_purchase: string;
};

export type CartRow = {
  id?: string; // UUID
  user_id: string; // UUID
  product_id: string; // UUID
  quantity: number; // INT
};
