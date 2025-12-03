import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import Routes (ต้องมี .js ต่อท้ายเสมอในโหมดนี้)
import orderRoutes from './server/routes/orderRoutes.js';
import locationRoutes from './server/routes/locationRoutes.js';
import Product from './server/models/Product.js'; // ถ้าจะใช้ Product ในไฟล์นี้

dotenv.config();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8080"], // รองรับทั้ง 2 port เผื่อไว้
    credentials: true,
}));
app.use(express.json());

// Connect Database
mongoose.connect(process.env.MONGO_URI, {
    dbName: "otop_db", 
})
.then(() => console.log("✅ MongoDB connected (otop_db)"))
.catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);

// Test Route for Products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: "Invalid product ID" });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);