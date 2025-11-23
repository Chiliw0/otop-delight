export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  province: string;
  community: string;
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}
