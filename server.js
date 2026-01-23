import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`backend running on port ${PORT}`)
});