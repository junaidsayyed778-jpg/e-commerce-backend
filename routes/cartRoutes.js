import express from "express";
import { isAdmin, protect } from "../middlewares/authGuard.js";
import {
    addToCart,
    decreaseCartQuantity,
    getCart,
    increaseCartQuantity,
    removeFromCart,
    updateCartQuantity
} from "../controllers/cartController.js"

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartQuantity);
router.put("/increase", protect, increaseCartQuantity)
router.put("/decrease", protect, decreaseCartQuantity)
router.delete("/:productId",isAdmin, protect, removeFromCart);

export default router;