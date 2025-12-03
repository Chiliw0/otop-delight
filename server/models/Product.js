import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  province: String,
  community: String,
  category: String,
  description: String,
  rating: { type: Number, default: 0 },
  price: { type: Number, required: true },
  unit: String,
  stock: { type: Number, required: true, default: 0 },
  imageUrl: String
});

const Product = mongoose.model('Product', productSchema);
export default Product;