import mongoose from "mongoose";
import { required } from "zod/mini";

const orderSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
                price: Number,
            },
        ],
        totalAmount:{
            type: Number,
            required: true,
        },
        status:{
            type: String,
            enum:["pending", "paid", "shipped", "delivered"],
            default:"pending"
        },
    },
    {timestamps: true}
);

export default mongoose.model("Order", orderSchema)