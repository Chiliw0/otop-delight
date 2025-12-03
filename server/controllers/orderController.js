import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer, items, total, subtotal, shippingCost, discount } = req.body;
    
    // กำหนดสถานะตามวิธีชำระเงิน
    let orderStatus = 'paid';
    if (customer.paymentMethod === 'cod') {
        orderStatus = 'unpaid'; // เก็บปลายทาง = ยังไม่จ่าย
    }

    const orderItems = [];

    // ตัด Stock
    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { _id: item._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );

      if (!product) {
        throw new Error(`สินค้า "${item.name}" หมดหรือมีไม่เพียงพอ`);
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // สร้าง Order
    const newOrder = new Order({
      customer,
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      total,
      status: orderStatus,
      date: new Date()
    });

    await newOrder.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      orderId: newOrder._id,
      order: newOrder
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Order Error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ' 
    });
  } finally {
    session.endSession();
  }
};