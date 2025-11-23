import { Product } from "@/types/product";

const API_BASE_URL = "https://otop.cdd.go.th/otopapi";
const API_TOKEN = "Bearer o29IKqqFy7HucJfWcGgbcLtRRjlUoDe7";

// Helper function to map API response to Product type
const mapApiProductToProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct.id?.toString() || apiProduct.product_id?.toString() || "",
    name: apiProduct.name || apiProduct.product_name || "ไม่มีชื่อสินค้า",
    description: apiProduct.description || apiProduct.detail || "ไม่มีรายละเอียด",
    price: parseFloat(apiProduct.price || apiProduct.product_price || "0"),
    imageUrl: apiProduct.image_url || apiProduct.image || apiProduct.product_image || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
    category: apiProduct.category || apiProduct.category_name || "ทั่วไป",
    province: apiProduct.province || apiProduct.province_name || "ไม่ระบุ",
    community: apiProduct.community || apiProduct.community_name || "ไม่ระบุ",
    rating: parseFloat(apiProduct.rating || "4.5"),
    stock: parseInt(apiProduct.stock || apiProduct.quantity || "10"),
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        Authorization: API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different possible response structures
    const products = data.data || data.products || data || [];
    
    return Array.isArray(products) 
      ? products.map(mapApiProductToProduct)
      : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array on error
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: {
        Authorization: API_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const product = data.data || data.product || data;
    
    return mapApiProductToProduct(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    // Try to fetch from list if single product fetch fails
    const products = await fetchProducts();
    return products.find((p) => p.id === id);
  }
};

export const getCategories = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.category))];
};

export const getProvinces = (products: Product[]): string[] => {
  return [...new Set(products.map((p) => p.province))].sort();
};
