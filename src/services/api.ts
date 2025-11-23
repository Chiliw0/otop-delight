import { Product } from "@/types/product";

// Mock data - will be replaced with real API calls
const mockProducts: Product[] = [
  {
    id: "1",
    name: "ผ้าไหมมัดหมี่",
    description: "ผ้าไหมมัดหมี่ทอมือ ลายสวยงาม คุณภาพดี",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
    category: "เครื่องแต่งกาย",
    province: "ขอนแก่น",
    community: "บ้านโนนทัน",
    rating: 4.8,
    stock: 15,
  },
  {
    id: "2",
    name: "กระเป๋าจักสาน",
    description: "กระเป๋าจักสานทอมือ วัสดุธรรมชาติ",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
    category: "เครื่องใช้",
    province: "นครราชสีมา",
    community: "บ้านกอก",
    rating: 4.5,
    stock: 30,
  },
  {
    id: "3",
    name: "น้ำพริกกากหมู",
    description: "น้ำพริกกากหมูสูตรโบราณ รสชาติเข้มข้น",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
    category: "อาหาร",
    province: "เชียงใหม่",
    community: "บ้านแม่แตง",
    rating: 4.9,
    stock: 50,
  },
  {
    id: "4",
    name: "เซรามิกงามช้าง",
    description: "เซรามิกทำมือ ลวดลายช้างไทย",
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400",
    category: "ของตุ้งติ้ง",
    province: "ลำปาง",
    community: "บ้านเกาะกลาง",
    rating: 4.7,
    stock: 12,
  },
  {
    id: "5",
    name: "สบู่สมุนไพร",
    description: "สบู่ทำจากสมุนไพรธรรมชาติ",
    price: 80,
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400",
    category: "ของใช้",
    province: "ปราจีนบุรี",
    community: "บ้านนาดี",
    rating: 4.6,
    stock: 100,
  },
  {
    id: "6",
    name: "หมอนอิง",
    description: "หมอนอิงผ้าทอมือ ลายไทย",
    price: 380,
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
    category: "เครื่องใช้",
    province: "เชียงราย",
    community: "บ้านหนองบัว",
    rating: 4.4,
    stock: 25,
  },
  {
    id: "7",
    name: "กาแฟดอยช้าง",
    description: "กาแฟคั่วอาราบิก้าจากดอยสูง",
    price: 250,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    category: "อาหาร",
    province: "เชียงใหม่",
    community: "บ้านดอยช้าง",
    rating: 4.9,
    stock: 40,
  },
  {
    id: "8",
    name: "กระเป๋าผ้าบาติก",
    description: "กระเป๋าผ้าบาติก ลายสวย สีสดใส",
    price: 320,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
    category: "เครื่องแต่งกาย",
    province: "ยะลา",
    community: "บ้านกาลอ",
    rating: 4.5,
    stock: 20,
  },
];

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts;
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProducts.find((p) => p.id === id);
};

export const getCategories = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.category))];
};

export const getProvinces = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.province))].sort();
};
