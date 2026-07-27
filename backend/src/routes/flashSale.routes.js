import express from 'express';
import { getFlashSales, createFlashSale } from '../controllers/flashSale.controller.js';

const router = express.Router();

router.get('/', getFlashSales);
router.post('/', createFlashSale);

export default router;