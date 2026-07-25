import * as productService from '../services/product.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createProduct = asyncHandler(async (req, res) => {
    const { storeId, ...productData } = req.body;
    const product = await productService.createProduct(productData, storeId);
    res.status(201).json({ success: true, data: product });
});

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, data: products });
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body, req.user.id, req.user.role);
    res.status(200).json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id, req.user.id, req.user.role);
    res.status(204).json({ success: true, data: {} });
});