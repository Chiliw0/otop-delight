import { Product } from "@/types/product";

// ข้อมูลจำลองสินค้า (Mock Data) ชุดใหญ่
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "ผ้าไหมมัดหมี่",
    description: "ผ้าไหมมัดหมี่ทอมือ ลายสวยงาม คุณภาพดี จากภูมิปัญญาชาวบ้าน",
    price: 2500,
    imageUrl: "/public/images/cover1-15.jpg",
    category: "เครื่องแต่งกาย",
    province: "ขอนแก่น",
    community: "บ้านโนนทัน",
    rating: 4.8,
    stock: 15,
  },
  {
    id: "2",
    name: "ผ้าทอลายน้ำไหล",
    description: "ผ้าทอมือลายน้ำไหล เอกลักษณ์จังหวัดน่าน เนื้อผ้าแน่น",
    price: 1800,
    imageUrl: "/public/images/E2-768x512.jpg",
    category: "เครื่องแต่งกาย",
    province: "น่าน",
    community: "ท่าวังผา",
    rating: 4.8,
    stock: 8,
  },
  {
    id: "3",
    name: "หมอนอิงลายขิด",
    description: "หมอนอิงผ้าทอมือ ลายไทยเอกลักษณ์ภาคอีสาน หนุนสบาย",
    price: 380,
    imageUrl: "/public/images/S237a1d8625f0468daf25c556a27c9f207.jpg",
    category: "ของตกแต่ง",
    province: "ยโสธร",
    community: "บ้านศรีฐาน",
    rating: 4.4,
    stock: 25,
  },
  {
    id: "4",
    name: "ผ้าบาติกเขียนเทียน",
    description: "ผ้าบาติก ลายสวย สีสันสดใส ตัดเย็บประณีต ใส่สบาย",
    price: 320,
    imageUrl: "/public/images/Dark-Brown-And-White-Elegant-Aesthetic-Fashion-YouTube-Thumbnail-2.webp",
    category: "เครื่องแต่งกาย",
    province: "ยะลา",
    community: "บ้านกาลอ",
    rating: 4.5,
    stock: 20,
  },
  {
    id: "5",
    name: "เสื่อกกจันทบุรี",
    description: "เสื่อกกทอมือ ลวดลายสวยงาม เย็นสบาย",
    price: 550,
    imageUrl: "/public/images/images.jpeg",
    category: "ของใช้",
    province: "จันทบุรี",
    community: "บางสระเก้า",
    rating: 4.6,
    stock: 15,
  },
  {
    id: "6",
    name: "น้ำพริกกากหมูทรงเครื่อง",
    description: "น้ำพริกกากหมูสูตรโบราณ รสชาติเข้มข้น กรอบอร่อย ไม่ใส่วัตถุกันเสีย",
    price: 120,
    imageUrl: "/public/images/maxresdefault.jpg",
    category: "อาหาร",
    province: "เชียงใหม่",
    community: "บ้านแม่แตง",
    rating: 4.9,
    stock: 50,
  },
  {
    id: "7",
    name: "กาแฟดอยช้างคั่วบด",
    description: "กาแฟคั่วอาราบิก้าแท้ 100% จากดอยสูง กลิ่นหอม รสชาตินุ่ม",
    price: 250,
    imageUrl: "/public/images/DoichaangcoffeeNewpack2022-1.jpg",
    category: "อาหาร",
    province: "เชียงราย",
    community: "บ้านดอยช้าง",
    rating: 4.9,
    stock: 40,
  },
  {
    id: "8",
    name: "เซรามิกช้างไทยเขียนลาย",
    description: "เซรามิกทำมือ ลวดลายช้างไทย วาดลวดลายด้วยความประณีต",
    price: 850,
    imageUrl: "/public/images/Product_43123_759089563_fullsize.jpg",
    category: "ของตกแต่ง",
    province: "ลำปาง",
    community: "บ้านเกาะกลาง",
    rating: 4.7,
    stock: 12,
  },
  {
    id: "9",
    name: "ครีมมะขามพะเยา",
    description: "ครีมขัดผิวจากมะขามธรรมชาติ ช่วยให้ผิวขาวกระจ่างใส",
    price: 150,
    imageUrl: "/public/images/ws3hed.jpg",
    category: "เครื่องสำอาง",
    province: "พะเยา",
    community: "กลุ่มแม่บ้านพะเยา",
    rating: 4.7,
    stock: 60,
  },
  {
    id: "10",
    name: "ข้าวสังข์หยดเมืองพัทลุง",
    description: "ข้าวกล้องเพื่อสุขภาพ อุดมด้วยวิตามินและสารต้านอนุมูลอิสระ",
    price: 180,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    category: "อาหาร",
    province: "พัทลุง",
    community: "นาขยาด",
    rating: 4.8,
    stock: 100,
  },
  {
    id: "11",
    name: "เครื่องเงินน่าน",
    description: "เครื่องประดับเงินแท้ ทำมือ ลวดลายเอกลักษณ์ล้านนา",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
    category: "เครื่องประดับ",
    province: "น่าน",
    community: "ปัว",
    rating: 4.9,
    stock: 10,
  },
  {
    id: "12",
    name: "กล้วยตากบางกระทุ่ม",
    description: "กล้วยน้ำว้าตากธรรมชาติ หวานหอม อร่อย สะอาด",
    price: 100,
    imageUrl: "/public/images/RK0209_ImageBanner_1140x507.jpg",
    category: "อาหาร",
    province: "พิษณุโลก",
    community: "บางกระทุ่ม",
    rating: 4.6,
    stock: 80,
  },
  {
    id: "13",
    name: "กระเป๋าจักสานผักตบชวา",
    description: "กระเป๋าจักสานทอมือ วัสดุธรรมชาติ ดีไซน์ทันสมัย แข็งแรงทนทาน",
    price: 450,
    imageUrl: "/public/images/16379978951.jpg",
    category: "ของใช้",
    province: "นครราชสีมา",
    community: "บ้านกอก",
    rating: 4.5,
    stock: 30,
  },
  {
    id: "14",
    name: "ชามตราไก่",
    description: "ชามเซรามิกตราไก่ ของแท้จากลำปาง ทนทาน สวยงาม",
    price: 50,
    imageUrl: "/public/images/โอทอป-2-2023-09-20-ท้าย.png",
    category: "ของใช้",
    province: "ลำปาง",
    community: "เกาะคา",
    rating: 4.5,
    stock: 200,
  },
  {
    id: "15",
    name: "ทุเรียนทอดระยอง",
    description: "ทุเรียนหมอนทองทอดกรอบ แผ่นใหญ่ เต็มคำ",
    price: 350,
    imageUrl: "/public/images/frieddurian1.webp",
    category: "อาหาร",
    province: "ระยอง",
    community: "ตะพง",
    rating: 4.9,
    stock: 40,
  },
  {
    id: "16",
    name: "มีดอรัญญิก",
    description: "มีดทำครัวเหล็กกล้า ตีด้วยมือ คมทนทาน",
    price: 600,
    imageUrl: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=400",
    category: "ของใช้",
    province: "พระนครศรีอยุธยา",
    community: "อรัญญิก",
    rating: 4.7,
    stock: 20,
  },
  {
    id: "17",
    name: "สบู่สมุนไพรขมิ้นชัน",
    description: "สบู่ทำจากสมุนไพรธรรมชาติ ช่วยบำรุงผิวพรรณ ลดผดผื่น",
    price: 80,
    imageUrl: "/public/images/384543292.jpg",
    category: "ของใช้",
    province: "ปราจีนบุรี",
    community: "บ้านนาดี",
    rating: 4.6,
    stock: 100,
  },
  {
    id: "18",
    name: "ไข่เค็มไชยา",
    description: "ไข่เค็มแดงมัน อร่อย สะอาด ถูกหลักอนามัย",
    price: 150,
    imageUrl: "/public/images/Salted-egg-001-1.jpg",
    category: "อาหาร",
    province: "สุราษฎร์ธานี",
    community: "ไชยา",
    rating: 4.8,
    stock: 100,
  },
  {
    id: "19",
    name: "น้ำตาลมะพร้าวแม่กลอง",
    description: "น้ำตาลมะพร้าวแท้ หอมหวานธรรมชาติ ไม่ผสมน้ำตาลทราย",
    price: 80,
    imageUrl: "/public/images/ap7pfg.jpg",
    category: "อาหาร",
    province: "สมุทรสงคราม",
    community: "อัมพวา",
    rating: 4.9,
    stock: 60,
  },
  {
    id: "20",
    name: "โคมไฟไม้ไผ่",
    description: "โคมไฟสานจากไม้ไผ่ ดีไซน์โมเดิร์น ให้แสงนวลตา",
    price: 450,
    imageUrl: "/public/images/pendant-light-thara-bamboo-pendant-light-shade-12-21-inches-33322237001925_65c33df32c433__1200x1200.jpg",
    category: "ของตกแต่ง",
    province: "ชลบุรี",
    community: "พนัสนิคม",
    rating: 4.5,
    stock: 25,
  },
];

// ฟังก์ชันดึงสินค้าทั้งหมด (จำลอง Delay เหมือนโหลดจาก API)
export const fetchProducts = async (): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts;
};

// ฟังก์ชันดึงสินค้าตาม ID
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

// --- ส่วนสำหรับการสั่งซื้อ (คงไว้เหมือนเดิม) ---
export interface OrderData {
  customer: {
    name: string;
    phone: string;
    address: string;
    province: string;
    zipcode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  date: string;
}

export const createOrder = async (orderData: OrderData): Promise<{ success: boolean; orderId: string }> => {
  console.log("Saving order to DB:", orderData);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, orderId: `ORD-${Date.now()}` };
};