import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const placeOrder = async (req, res) =>{
    try{
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId});

        if(!cart || cart.items.length === 0){
            return res.status(400).json({ message: "Cart is empty"})
        }

        //stock check
        for (let item of cart.items){
            const product = await Product.findById(item.product)
            if(!product || product.stock < item.quantity){
                return res.status(400).json({
                    message: `Not enough stock for ${product?.name}`,
                });
            }
        }

        //create order
        const order = await Order.create({
            user: userId,
            items: cart.items,
            totalAmount: cart.totalPrice,
        });

        //reduce stock
        for(let item of cart.items){
            await Product.findByIdAndUpdate(item.product,{
                $inc: {stock: -item.quantity},
            });
        }

        //clear cart 
        cart.items =[];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}