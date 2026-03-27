export type ProductRow = {
  id?: string; // UUID
  category_id: number; // INT
  name: string;
  price: number; // DECIMAL
  stock: number; // INT
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  is_active?: boolean;
};

export type CategoryRow = {
  id?: number; // SERIAL INT PRIMARY KEY
  name: string;
  slug: string;
};