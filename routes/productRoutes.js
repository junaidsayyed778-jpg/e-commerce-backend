import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, isAdmin, isSeller  } from "../middlewares/authGuard.js";


const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Product route working");
});


//Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

//Admin Only
router.post("/", protect, isAdmin, createProduct);
router.post("/", protect, isSeller, createProduct)
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
