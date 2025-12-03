import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { createOrder, OrderData } from "@/services/api";

// Interface สำหรับรับข้อมูลจาก API (Location)
interface Province { id: number; name_th: string; }
interface Amphoe { id: number; name_th: string; province_id: number; }
interface Tambon { id: number; name_th: string; zip_code: number; amphure_id: number; }

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // State เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    amphoe: "", // เพิ่ม field นี้
    tambon: "", // เพิ่ม field นี้
    zipcode: "",
  });

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<number>(0);
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet" | "cod">("card");

  // State สำหรับ Dropdown
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [amphoes, setAmphoes] = useState<Amphoe[]>([]);
  const [tambons, setTambons] = useState<Tambon[]>([]);

  const API_BASE = (import.meta.env && (import.meta.env.VITE_API_URL as string)) || "http://localhost:4000";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const shippingFee = useMemo(() => (shipping === "express" ? 60 : 30), [shipping]);
  const subtotal = getCartTotal();
  const discount = promoApplied;
  const total = Math.max(0, subtotal - discount + shippingFee);

  // 1. โหลดจังหวัดตอนเริ่ม
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/locations/provinces`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setProvinces(data || []);
      } catch (err) {
        console.warn("Error loading provinces:", err);
      }
    };
    loadProvinces();
  }, []);

  // 2. เมื่อเลือกจังหวัด -> เก็บชื่อลงฟอร์ม + เอา ID ไปดึงอำเภอ
  const onProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = Number(e.target.value);
    const selectedProv = provinces.find(p => p.id === provinceId);
    
    if (!selectedProv) return;

    // Reset ข้อมูลลูก
    setFormData(prev => ({ 
        ...prev, 
        province: selectedProv.name_th, 
        amphoe: "", 
        tambon: "", 
        zipcode: "" 
    }));
    setAmphoes([]);
    setTambons([]);

    try {
      const res = await fetch(`${API_BASE}/api/locations/amphoes?province_id=${provinceId}`);
      const data = await res.json();
      setAmphoes(data || []);
    } catch (err) {
      console.warn(err);
    }
  };

  // 3. เมื่อเลือกอำเภอ -> เก็บชื่อลงฟอร์ม + เอา ID ไปดึงตำบล
  const onAmphoeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const amphoeId = Number(e.target.value);
    const selectedAmphoe = amphoes.find(a => a.id === amphoeId);

    if (!selectedAmphoe) return;

    setFormData(prev => ({ 
        ...prev, 
        amphoe: selectedAmphoe.name_th, 
        tambon: "", 
        zipcode: "" 
    }));
    setTambons([]);

    try {
        // ส่ง query param เป็น amphoe_id (ตาม backend ที่แก้ไว้)
      const res = await fetch(`${API_BASE}/api/locations/tambons?amphoe_id=${amphoeId}`);
      const data = await res.json();
      setTambons(data || []);
    } catch (err) {
      console.warn(err);
    }
  };

  // 4. เมื่อเลือกตำบล -> เก็บชื่อลงฟอร์ม + ใส่รหัสไปรษณีย์ให้อัตโนมัติ
  const onTambonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tambonId = Number(e.target.value);
    const selectedTambon = tambons.find(t => t.id === tambonId);

    if (selectedTambon) {
        setFormData(prev => ({
            ...prev,
            tambon: selectedTambon.name_th,
            zipcode: String(selectedTambon.zip_code)
        }));
    }
  };

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "SAVE50") {
      setPromoApplied(50);
      toast.success("ใช้คูปองสำเร็จ: ลด 50 บาท");
    } else {
      setPromoApplied(0);
      toast.error("คูปองไม่ถูกต้อง");
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // เช็คว่ากรอกครบไหม
    if(!formData.province || !formData.amphoe || !formData.tambon) {
        toast.error("กรุณาเลือกที่อยู่ให้ครบถ้วน");
        return;
    }

    setIsProcessing(true);
    
    // รวมที่อยู่เป็น string เดียว (หรือจะส่งแยก field ก็ได้แล้วแต่ backend รับ)
    const fullAddress = `${formData.address} ต.${formData.tambon} อ.${formData.amphoe} จ.${formData.province} ${formData.zipcode}`;

    const orderData: OrderData = {
      customer: { 
          ...formData, 
          address: fullAddress, // ส่งที่อยู่รวมไป
          shippingMethod: shipping 
      },
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

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-2xl font-bold text-muted-foreground">ไม่มีสินค้าในตะกร้า</h2>
        <Button onClick={() => navigate("/")}>กลับไปเลือกสินค้า</Button>
      </div>
    );
  }

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
                  <Label htmlFor="address">ที่อยู่ (บ้านเลขที่, หมู่บ้าน)</Label>
                  <Textarea id="address" placeholder="123/45 หมู่ 6" required value={formData.address} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* จังหวัด */}
                  <div className="grid gap-2">
                    <Label>จังหวัด</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={onProvinceChange}
                        defaultValue=""
                    >
                      <option value="" disabled>เลือกจังหวัด</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>{p.name_th}</option>
                      ))}
                    </select>
                  </div>

                  {/* อำเภอ */}
                  <div className="grid gap-2">
                    <Label>อำเภอ/เขต</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={onAmphoeChange}
                        disabled={!formData.province}
                        defaultValue=""
                    >
                      <option value="" disabled>เลือกอำเภอ</option>
                      {amphoes.map((a) => (
                        <option key={a.id} value={a.id}>{a.name_th}</option>
                      ))}
                    </select>
                  </div>

                  {/* ตำบล */}
                  <div className="grid gap-2">
                    <Label>ตำบล/แขวง</Label>
                    <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={onTambonChange}
                        disabled={!formData.amphoe}
                        defaultValue=""
                    >
                      <option value="" disabled>เลือกตำบล</option>
                      {tambons.map((t) => (
                        <option key={t.id} value={t.id}>{t.name_th}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="zipcode">รหัสไปรษณีย์</Label>
                    <Input id="zipcode" value={formData.zipcode} readOnly className="bg-muted" />
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
                    <div className="text-sm">บัตรเครดิต</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("wallet")} className={`flex-1 flex items-center gap-3 rounded-lg border p-3 ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Wallet className="h-5 w-5" />
                    <div className="text-sm">Wallet</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("cod")} className={`flex-1 flex items-center gap-3 rounded-lg border p-3 ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="h-5 w-5 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs">COD</div>
                    <div className="text-sm">ปลายทาง</div>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="รหัสคูปอง (SAVE50)" value={promo} onChange={(e) => setPromo(e.target.value)} />
                  <Button type="button" onClick={applyPromo} className="col-span-1">ใช้คูปอง</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right: Summary */}
        <aside className="sticky top-20 h-fit">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>สรุปรายการ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-md object-cover" />}
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
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                    <div>ส่วนลด</div>
                    <div>-฿{discount.toLocaleString()}</div>
                </div>
              )}

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