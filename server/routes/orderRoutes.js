import express from 'express';
import { createOrder } from '../controllers/orderController.js'; // อย่าลืม .js

const router = express.Router();

router.post('/', createOrder);

export default router;