import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "@/services/api";
import Navbar from "@/components/Navbar";
import CartSheet from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ArrowLeft, ShoppingCart, Star, MapPin, Package } from "lucide-react";
import { Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="mb-4 text-2xl font-bold">ไม่พบสินค้า</h2>
        <Button onClick={() => navigate("/")}>กลับหน้าหลัก</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับหน้าหลัก
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{product.province}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span>หมวดหมู่: {product.category}</span>
              </div>
              <div className="text-muted-foreground">
                ชุมชน: {product.community}
              </div>
            </div>

            <div className="rounded-lg bg-accent p-4">
              <div className="text-3xl font-bold text-primary">
                ฿{product.price.toLocaleString()}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">รายละเอียดสินค้า</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>สต็อกสินค้า:</span>
              <span
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.stock > 0
                  ? `มีสินค้า ${product.stock} ชิ้น`
                  : "สินค้าหมด"}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
            </Button>
          </div>
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default ProductDetail;
