import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: String,
    address: String,
    province: String,
    zipcode: String,
    shippingMethod: String,
    paymentMethod: String // เก็บวิธีชำระเงิน (card, wallet, cod)
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  // รายละเอียดราคา
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  status: { type: String, default: 'pending' }, // paid, unpaid, pending
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;