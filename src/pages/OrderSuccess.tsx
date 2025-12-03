import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderData } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Printer, Home, Download } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const { order, orderId } = location.state as { order: any; orderId: string } || {};

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isUnpaid = order.status === 'unpaid';

  return (
    <div className="min-h-screen bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        
        <div className="mb-8 text-center print:hidden">
          <div className="mb-4 flex justify-center">
             <CheckCircle className={`h-16 w-16 ${isUnpaid ? 'text-yellow-500' : 'text-green-500'}`} />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
              {isUnpaid ? "บันทึกคำสั่งซื้อสำเร็จ" : "สั่งซื้อสำเร็จ!"}
          </h1>
          <p className="text-muted-foreground">
              {isUnpaid ? "กรุณาเตรียมเงินสดสำหรับชำระปลายทาง (COD)" : "ขอบคุณที่อุดหนุนสินค้าชุมชน OTOP"}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div ref={receiptRef} className="bg-white text-black shadow-lg print:shadow-none">
            <Card className="border-0 sm:border">
              <CardHeader className="text-center border-b pb-6">
                <CardTitle className="text-2xl font-bold">OTOP DELIGHT</CardTitle>
                <div className="text-sm text-muted-foreground mt-2">
                  ใบเสร็จรับเงิน / Receipt<br />
                  Order ID: {orderId}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  วันที่: {new Date(order.date).toLocaleString('th-TH')}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-1">ผู้สั่งซื้อ</h3>
                    <p>{order.customer.name}</p>
                    <p>{order.customer.phone}</p>
                  </div>
                  <div className="sm:text-right">
                    <h3 className="font-semibold mb-1">จัดส่งที่</h3>
                    <p className="whitespace-pre-wrap">{order.customer.address}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">รายการสินค้า</h3>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-6 text-center">{item.quantity}x</span>
                          <span>{item.name}</span>
                        </div>
                        <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">รวมราคาสินค้า (Subtotal)</span>
                    <span>฿{order.subtotal?.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        ค่าจัดส่ง ({order.customer?.shippingMethod === 'express' ? 'EMS' : 'ธรรมดา'})
                    </span>
                    <span>฿{order.shippingCost?.toLocaleString()}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                        <span>ส่วนลดคูปอง</span>
                        <span>-฿{order.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">ยอดสุทธิ</span>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">฿{order.total.toLocaleString()}</div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${isUnpaid ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {isUnpaid ? 'รอชำระเงิน' : 'ชำระเงินแล้ว'}
                        </div>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                <p className="w-full">ขอบคุณที่สนับสนุนสินค้าภูมิปัญญาไทย</p>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center print:hidden">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/")}>
              <Home className="h-4 w-4" /> กลับหน้าหลัก
            </Button>
            <Button className="gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> พิมพ์ใบเสร็จ
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #root { margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          div[class*="bg-white"] {
            visibility: visible; position: absolute; left: 0; top: 0; width: 100%; box-shadow: none;
          }
          div[class*="bg-white"] * { visibility: visible; }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;