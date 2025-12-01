import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Wallet, Smartphone, Truck } from "lucide-react";
import { useState, useMemo } from "react";
import { createOrder, OrderData } from "@/services/api";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    zipcode: "",
  });

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<number>(0);
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cod">("card");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const shippingFee = useMemo(() => (shipping === "express" ? 60 : 30), [shipping]);

  const subtotal = getCartTotal();
  const discount = promoApplied;
  const total = Math.max(0, subtotal - discount + shippingFee);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-2xl font-bold text-muted-foreground">ไม่มีสินค้าในตะกร้า</h2>
        <Button onClick={() => navigate("/")}>กลับไปเลือกสินค้า</Button>
      </div>
    );
  }

  const applyPromo = () => {
    // ตัวอย่าง: รหัส "SAVE50" ให้ส่วนลด 50
    if (promo.trim().toUpperCase() === "SAVE50") {
      setPromoApplied(50);
      toast.success("ใช้คูปองสำเร็จ: ลด 50 บาท");
    } else if (promo.trim() === "") {
      setPromoApplied(0);
      toast.error("กรุณากรอกรหัสคูปอง");
    } else {
      setPromoApplied(0);
      toast.error("คูปองไม่ถูกต้อง");
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData: OrderData = {
      customer: { ...formData, shippingMethod: shipping },
      items: cart.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      date: new Date().toISOString(),
    };

    try {
      const result = await createOrder(orderData);
      toast.success("สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ");
      clearCart();
      navigate("/order-success", {
        state: {
          order: orderData,
          orderId: result.orderId,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        ย้อนกลับ
      </Button>

      <h1 className="mb-6 text-3xl font-extrabold">เช็คเอาต์</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลผู้รับ / ที่อยู่จัดส่ง</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input id="name" placeholder="สมชาย ใจดี" required value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input id="phone" type="tel" placeholder="0812345678" required value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Textarea id="address" placeholder="บ้านเลขที่, หมู่บ้าน, แขวง/ตำบล" required value={formData.address} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="province">จังหวัด</Label>
                    <Input id="province" placeholder="กรุงเทพฯ" required value={formData.province} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zipcode">รหัสไปรษณีย์</Label>
                    <Input id="zipcode" placeholder="10110" required value={formData.zipcode} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label>วิธีจัดส่ง</Label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setShipping("standard")} className={`flex-1 rounded-md border p-2 text-left ${shipping === "standard" ? "border-primary bg-primary/5" : "border-border"}`}>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">ธรรมดา</div>
                            <div className="text-xs text-muted-foreground">30 ฿ — 3-5 วัน</div>
                          </div>
                        </div>
                      </button>
                      <button type="button" onClick={() => setShipping("express")} className={`flex-1 rounded-md border p-2 text-left ${shipping === "express" ? "border-primary bg-primary/5" : "border-border"}`}>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">ด่วน</div>
                            <div className="text-xs text-muted-foreground">60 ฿ — 1-2 วัน</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>วิธีชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPaymentMethod("card")} className={`flex-1 flex items-center gap-3 rounded-lg border p-3 ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <CreditCard className="h-5 w-5" />
                    <div className="text-sm">บัตรเครดิต / เดบิต</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("wallet")} className={`flex-1 flex items-center gap-3 rounded-lg border p-3 ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Wallet className="h-5 w-5" />
                    <div className="text-sm">Wallet</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("cod")} className={`flex-1 flex items-center gap-3 rounded-lg border p-3 ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="h-5 w-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">COD</div>
                    <div className="text-sm">เก็บเงินปลายทาง</div>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="รหัสคูปอง" value={promo} onChange={(e) => setPromo(e.target.value)} />
                  <Button onClick={applyPromo} className="col-span-1">ใช้คูปอง</Button>
                  <div className="col-span-1 text-sm text-muted-foreground self-center">{promoApplied ? `ลด ${promoApplied} ฿` : ""}</div>
                </div>
              </CardContent>
            </Card>

          </form>
        </div>

        {/* Right: Summary */}
        <aside className="sticky top-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>สรุปรายการ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                      <div className="max-w-[160px]">
                        <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                        <div className="text-xs text-muted-foreground">x{item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <div>ยอดรวม</div>
                <div>฿{subtotal.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>ค่าจัดส่ง</div>
                <div>฿{shippingFee.toLocaleString()}</div>
              </div>
              <div className="flex justify-between text-sm text-emerald-600">
                <div>ส่วนลด</div>
                <div>-฿{discount.toLocaleString()}</div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-sm font-medium">รวมทั้งสิ้น</div>
                <div className="text-2xl font-extrabold">฿{total.toLocaleString()}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="checkout-form" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? "กำลังประมวลผล..." : `ชำระเงิน ${total.toLocaleString()} ฿`}
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;