import express from "express";
import { protect } from "../middlewares/authGuard.js";
import { placeOrder } from "../controllers/orderController.js";
import { publishOrder } from "../utils/queue.js";

const router = express.Router();
router.post("/", async(req, res)=>{
    const order = {
        orderId: Date.now(),
        items: req.body.items,
        price: req.body.price,
        user: req.body.user,
    };

    await publishOrder(order);

    res.status(201).json({
        message: "Order placed successfully",
        order
    })
})
router.post("/", protect, placeOrder);
router.post("/place-order", protect, placeOrder)

export default router;