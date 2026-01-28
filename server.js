import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

import { connectQueue } from "./utils/queue.js";
import { startOrderConsumer } from "./consumers/orderConsumer.js";

import { globalErrorHandler } from "./middlewares/errorMiddleware.js";
import AppError from "./utils/AppError.js";
import corsOptions from "./config/cors.js";
import morgan from "morgan";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"))



app.get("/", (req, res)=>{
    res.send("backend succesfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

//404 handler
app.use( (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404))
});

//gloabal error handler
app.use(globalErrorHandler);

const startServer = async() => {
    try{
        await connectDB();
       

        await connectQueue();
     

        await startOrderConsumer();
      
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(` Backend runnig on port ${PORT}`)
        });
    }catch(error){
        console.log("Failed to start server:", error.message);
        process.exit(1)
    }
};
startServer();