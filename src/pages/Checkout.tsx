import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-2xl font-bold text-muted-foreground">ไม่มีสินค้าในตะกร้า</h2>
        <Button onClick={() => navigate("/")}>กลับไปเลือกสินค้า</Button>
      </div>
    );
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData: OrderData = {
      customer: formData,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: getCartTotal(),
      date: new Date().toISOString(),
    };

    try {
      // รับค่า orderId ที่ return กลับมา
      const result = await createOrder(orderData);
      
      toast.success("สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ");
      clearCart();
      
      // เปลี่ยนจาก navigate("/") เป็นการส่งข้อมูลไปหน้า order-success
      navigate("/order-success", { 
        state: { 
          order: orderData, 
          orderId: result.orderId 
        } 
      });
      
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-background px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        ย้อนกลับ
      </Button>

      <h1 className="mb-8 text-3xl font-bold">ชำระเงิน</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ฟอร์มที่อยู่ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ที่อยู่จัดส่ง</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input id="name" placeholder="สมชาย ใจดี" required value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" type="tel" placeholder="0812345678" required value={formData.phone} onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Textarea id="address" placeholder="บ้านเลขที่, หมู่บ้าน..." required value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="province">จังหวัด</Label>
                    <Input id="province" placeholder="กรุงเทพฯ" required value={formData.province} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zipcode">รหัสไปรษณีย์</Label>
                    <Input id="zipcode" placeholder="10110" required value={formData.zipcode} onChange={handleInputChange} />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* สรุปรายการ */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สรุปรายการสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex gap-4">
                    <span className="font-medium text-muted-foreground">x{item.quantity}</span>
                    <span className="line-clamp-1 max-w-[180px]">{item.name}</span>
                  </div>
                  <div className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-primary text-lg">฿{getCartTotal().toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="checkout-form" 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "กำลังบันทึก..." : "ยืนยันการสั่งซื้อ"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;