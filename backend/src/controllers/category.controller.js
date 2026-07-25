import * as categoryService from '../services/category.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, parentId } = req.body;
    const category = await categoryService.createCategory(name, slug, req.user.id, parentId);
    res.status(201).json({ success: true, data: category });
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryService.updateCategory(id, name, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await categoryService.deleteCategory(id, req.user.id, req.user.role);
    res.status(204).json({ success: true, data: {} });
});