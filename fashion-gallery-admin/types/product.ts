export interface ProductImage {
  url: string;
  public_id: string;
}

export interface StockItem {
  size: string;
  color: string;
  quantity: number;
}

export interface Product {
  id: string; // Document ID
  title: string;
  description: string;
  category: string;
  price: number;
  costPrice: number; // Admin only, hidden from staff usually
  discountPrice?: number;
  images: ProductImage[];
  stock: StockItem[];
  status: 'active' | 'draft' | 'archived';
  createdAt: number;
  updatedAt: number;
}
