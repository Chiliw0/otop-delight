import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderData } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Printer, Home, Download } from "lucide-react";
// หากต้องการเซฟเป็นรูปภาพ ต้องลง html2canvas เพิ่ม: npm install html2canvas
// import html2canvas from "html2canvas"; 

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  // รับข้อมูลที่ส่งมาจากหน้า Checkout
  const { order, orderId } = location.state as { order: OrderData; orderId: string } || {};

  // ถ้าไม่มีข้อมูล (เข้าหน้านี้โดยตรง) ให้เด้งกลับหน้าแรก
  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  // ฟังก์ชันสำหรับเซฟเป็นรูปภาพ (ต้องติดตั้ง html2canvas ก่อน)
  /*
  const handleDownloadImage = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `receipt-${orderId}.png`;
      link.click();
    }
  };
  */

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        
        {/* ส่วนหัวแสดงสถานะ (ซ่อนตอนปริ้น) */}
        <div className="mb-8 text-center print:hidden">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">สั่งซื้อสำเร็จ!</h1>
          <p className="text-muted-foreground">ขอบคุณที่อุดหนุนสินค้าชุมชน OTOP</p>
        </div>

        {/* ใบเสร็จ */}
        <div className="mx-auto max-w-2xl">
          <div ref={receiptRef} className="bg-white text-black shadow-lg print:shadow-none">
            <Card className="border-0 sm:border">
              <CardHeader className="border-b pb-4 text-center">
                <CardTitle className="text-2xl font-bold">ใบเสร็จรับเงิน / RECEIPT</CardTitle>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>OTOP Thailand Delights</p>
                  <p>เลขที่คำสั่งซื้อ: {orderId}</p>
                  <p>วันที่: {new Date(order.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* ข้อมูลลูกค้า */}
                <div className="grid gap-2 text-sm">
                  <h3 className="font-semibold">ข้อมูลผู้ซื้อ</h3>
                  <div className="grid grid-cols-[100px_1fr]">
                    <span className="text-muted-foreground">ชื่อ-นามสกุล:</span>
                    <span>{order.customer.name}</span>
                    <span className="text-muted-foreground">เบอร์โทรศัพท์:</span>
                    <span>{order.customer.phone}</span>
                    <span className="text-muted-foreground">ที่อยู่จัดส่ง:</span>
                    <span>
                      {order.customer.address} จ.{order.customer.province} {order.customer.zipcode}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* รายการสินค้า */}
                <div>
                  <h3 className="mb-4 font-semibold">รายการสินค้า</h3>
                  <div className="space-y-3">
                    {/* Header ตาราง */}
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground md:text-sm">
                      <div className="col-span-6">สินค้า</div>
                      <div className="col-span-2 text-center">จำนวน</div>
                      <div className="col-span-2 text-right">ราคา/หน่วย</div>
                      <div className="col-span-2 text-right">รวม</div>
                    </div>
                    
                    {/* รายการ */}
                    {order.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 text-sm">
                        <div className="col-span-6 font-medium">{item.name}</div>
                        <div className="col-span-2 text-center">x{item.quantity}</div>
                        <div className="col-span-2 text-right">฿{item.price.toLocaleString()}</div>
                        <div className="col-span-2 text-right font-medium">฿{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* สรุปยอดเงิน */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-primary">฿{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t bg-muted/10 py-6 text-center text-sm text-muted-foreground">
                <p>ขอบคุณที่ใช้บริการ OTOP Thailand<br/>สินค้าจะถูกจัดส่งภายใน 3-5 วันทำการ</p>
              </CardFooter>
            </Card>
          </div>

          {/* ปุ่ม Action (ซ่อนตอนปริ้น) */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center print:hidden">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" />
              กลับหน้าหลัก
            </Button>
            <Button className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              พิมพ์ / บันทึกเป็น PDF
            </Button>
            {/* ปุ่มสำหรับ html2canvas ถ้าต้องการใช้
            <Button variant="secondary" className="gap-2" onClick={handleDownloadImage}>
              <Download className="h-4 w-4" />
              บันทึกเป็นรูปภาพ
            </Button>
            */}
          </div>
        </div>
      </div>

      {/* Style สำหรับการพิมพ์ */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          /* แสดงเฉพาะส่วนใบเสร็จ */
          div[class*="bg-white"] {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
          }
          div[class*="bg-white"] * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;