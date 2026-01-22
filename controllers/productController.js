import Product from "../models/product.js";
import { createProductSchema, updateProductSchema } from "../validators/productValidator.js";
//Admin: Create Product
export const createProduct = async (req, res) =>{
    try{
        const result = createProductSchema.safeParse(req.body);

        if(!result.success){
            return res.status({
                message: result.error.error.map(e => e.message),
            });
        }

        const product = await Product.create(result.data)

        res.json({
            message: "Product create successfully",
            product,
        });
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

//Public: get All Products
export const getAllProducts = async (req, res) =>{
    try{
        const products = await Product.find({ isActive: true});
        res.json(products);
    }catch(error){
        res.status(500).json({ message: error.message});
    }
};

//public: Get Single Product
export const getProductById = async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({ message: "Product not found"})
        }
        res.json(product);
    }catch(error){
        res.status(500).json({ message: error.message })
    }
};

//Admin: Upadate Product
export const updateProduct = async (req, res) =>{
    try{
        const result = updateProductSchema.safeParse(req.body);

        if(!result.success){
            res.status(400).json({
                message: result.error.error.map(e => e.message),
            });

            const product = await Product.findByIdAndUpdate(
                req.params.id,
                result.data,
                { new: true}
            );

            if(!product){
                res.status(404).json({message: "Product not found"})
            }

            res.json({
                message: "Product update successfully",
                product,
            })
        }
    }catch(error){
        res.status(500).json({message: error.error})
    }
}

//Admin: Delete Product
export const deleteProduct = async (req, res) =>{
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(400).json({ message: "Product not found"})
        }

        await product.deleteOne();

        res.json({ message: "Product deleted"
        })
    }catch(error){
        res.status(500).json( { message: error.message })
    }
}