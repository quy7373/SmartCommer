import { Router } from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllCategories);
router.post('/', authenticate, authorize(['ADMIN', 'OWNER']), createCategory);
router.put('/:id', authenticate, authorize(['ADMIN', 'OWNER']), updateCategory);
router.delete('/:id', authenticate, authorize(['ADMIN', 'OWNER']), deleteCategory);

export default router;