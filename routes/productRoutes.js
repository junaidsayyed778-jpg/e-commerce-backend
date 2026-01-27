import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, isAdmin, isSeller  } from "../middlewares/authGuard.js";
import  cache  from "../middlewares/cacheMiddleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";


const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Product route working");
});


//Public
router.get("/", cache(()=>"products:all", 600), getAllProducts)
router.get("/:id", cache((req)=>`products:${req.params.id}`, 600), asyncHandler(getProductById));

//Admin Only
router.post("/", protect,
  (req, res, next) =>{
    if(req.user.role === "admin" || req.user.role === "seller"){
      return next();
    }
     return res.status(403).json({ message: "Admin or seller only"})
  },
  asyncHandler(createProduct)
);


router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
