import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartSheet from "@/components/CartSheet";
import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import { fetchProducts, getCategories, getProvinces } from "@/services/api";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const categories = getCategories(products);
  const provinces = getProvinces(products);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesProvince =
      selectedProvince === "" || product.province === selectedProvince;

    return matchesSearch && matchesCategory && matchesProvince;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />

      {/* Hero Section */}
      <section className="bg-hero-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            ยินดีต้อนรับสู่ OTOP Thailand
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            สินค้าชุมชนคุณภาพดี จากทุกจังหวัดทั่วไทย
          </p>
          <div className="mx-auto max-w-2xl">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-64">
            <FilterSidebar
              categories={categories}
              provinces={provinces}
              selectedCategory={selectedCategory}
              selectedProvince={selectedProvince}
              onCategoryChange={setSelectedCategory}
              onProvinceChange={setSelectedProvince}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                สินค้าทั้งหมด ({filteredProducts.length} รายการ)
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;
