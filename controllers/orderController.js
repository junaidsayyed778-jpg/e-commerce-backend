import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import { publishOrder } from "../utils/queue.js";

//place order

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id; 

    // get cart
    const cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart || cart.items.length === 0) {
        await session.abortTransaction();
        return res.status(400).json({ Message: "Cart is empty"});
    }

    //validate stock for each item

    for(const item of cart.items){
            const product = await Product.findById(item.product).session(session);


        if(!product){
            throw new Error(`${product.name} is out of stock`)
        }
    }

    //reduce stock 
    for(const item of cart.items){
        const update = await Product.findByIdAndUpdate(
            {
                _id: item.product,
                stock: {$gte: item.quantity}
            },
            {
                $inc:{stock: -item.quantity}
            },
            {new: true, session}
        );

        if(!update){
            throw new Error("Stock update failed")
        }
    }

    //create order
    const order = await Order.create(
        [
            {
                user: userId,
                items: cart.items,
                totalAmount: cart.totalPrice,
                status: "paid"
            }
        ],
        { session }
    );

    //clear cart
    await Cart.deleteOne({ user: userId}).session(session);

    await session.commitTransaction();

    //publish to RabbitMQ
    await publishOrder(order[0]);

    res.status(201).json({
        Message: "Order placed succefully",
        order: order[0]
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
        message: error.message
    });

  }finally{
    session.endSession();
  }
};
