import { Router } from 'express';
import { createProduct, getAllProducts, getBestSellerProducts, getNewestProducts, getRecommendedProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/best-seller', getBestSellerProducts);
router.get('/newest', getNewestProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, authorize(['ADMIN', 'OWNER']), createProduct);
router.put('/:id', authenticate, authorize(['ADMIN', 'OWNER']), updateProduct);
router.delete('/:id', authenticate, authorize(['ADMIN', 'OWNER']), deleteProduct);

export default router;