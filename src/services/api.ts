import { Product } from "@/types/product";

// ----------------------------
//  ดึงสินค้าจาก Backend จริง
// ----------------------------
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("http://localhost:4000/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`http://localhost:4000/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
};

// ----------------------------
// Utility: หมวดหมู่และจังหวัด
// ----------------------------
export const getCategories = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.category))];
};

export const getProvinces = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.province))].sort();
};

// ----------------------------
// Order Type
// ----------------------------
export interface OrderData {
  customer: {
    name: string;
    phone: string;
    address: string;
    province: string;
    zipcode: string;
    shippingMethod: string;
  };
  items: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  date: string;
}

// ----------------------------
// ส่งคำสั่งซื้อเข้าฐานข้อมูลจริง
// ----------------------------
export const createOrder = async (orderData: OrderData) => {
  const res = await fetch("http://localhost:4000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) throw new Error("Failed to create order");

  return res.json();
};
