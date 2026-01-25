import Product from "../models/product.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import AppError from "../utils/AppError.js";

/**
 * ADMIN: Create Product
 */
export const createProduct = asyncHandler(async (req, res) => {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(
      result.error.issues.map((e) => e.message).join(", "),
      400
    );
  }

  const product = await Product.create(result.data);

  res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

/**
 * PUBLIC: Get All Products
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true });

  if (!products.length) {
    throw new AppError("No products found", 404);
  }

  res.json(products);
});

/**
 * PUBLIC: Get Single Product
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json(product);
});

/**
 * ADMIN: Update Product
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(
      result.error.issues.map((e) => e.message).join(", "),
      400
    );
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    result.data,
    { new: true }
  );

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({
    message: "Product updated successfully",
    product,
  });
});

/**
 * ADMIN: Delete Product
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  await product.deleteOne();

  res.json({
    message: "Product deleted successfully",
  });
});
