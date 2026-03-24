export type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
  is_active: boolean;
};