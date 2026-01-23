import express from "express";
import { protect } from "../middlewares/authGuard.js";
import { placeOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.post("/place-order", protect, placeOrder)

export default router;