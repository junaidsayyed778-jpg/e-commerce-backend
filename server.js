import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import { connectQueue } from "./utils/queue.js";
import { startOrderConsumer } from "./consumers/orderConsumer.js";


dotenv.config();
connectDB();

const app = express();
app.use(express.json());


app.get("/", (req, res)=>{
    res.send("backend succesfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes)

const startServer = async() => {
    try{
        await connectQueue();
        startOrderConsumer();
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