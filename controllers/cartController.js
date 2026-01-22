
import Cart from "../models/cart.js";
import Product from "../models/product.js";


//Add Into Cart
export const addToCart = async (req, res) => {

  try{

        const {productId, quantity} = req.body;

        if(!quantity || quantity < 1){
            return res.status(400).json({ message: "Invalid quantity"})
        }

        const product = await Product.findById(productId);

        if(!product || !product.isActive){
            return res.status(404).json({ Message: "Product not found"})
        }

        let cart = await Cart.findOne({ user: req.user.id});

        if(!cart){
            cart = await Cart.create({
                user: req.user.id,
                items: [],
                totalPrice: 0,
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if(itemIndex > -1)  {
            const newQty = cart.items[itemIndex].quantity + quantity;

            //Stock check

            if(newQty > product.stock){
                return res.status(400).json({ message: `only ${product.stock} is available`})
            }

            cart.items[itemIndex].quantity += newQty;
        }else
        {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
            });
        }

        cart.totalPrice = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        
        await cart.save();

        res.json({message: "Item added to cart",
            cart
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
};

// Get Cart
export const getCart = async (req, res) =>{
    console.log("USER:", req.user);

    try {
        const cart = await Cart.findOne({ user: req.user.id})
        .populate("items.product", "name price image");

        if(!cart){
            return res.json({ items: [], totalPrice: 0})
        }

        res.json(cart);
    }catch(error){
        res.status(500).json({ message: error.message })
    }
};

//Update Cart
export const updateCartQuantity = async (req, res)=>{
    try{
        const {productId, quantity} = req.body;
        const userId = req.user._id;

        if(!productId || quantity == null){
            return res.status(400).json( {message: "productId and quantity required"})
        }

        if(quantity < 0){
            return res.status(400).json({ message: "Quantity must be at least 1"})
        }

        const cart = await Cart.findOne({ user: userId});

        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if(itemIndex === -1) {
            return res.status(404).json({ message: "Product not in cart" })
        }

       if(quantity === 0){
        cart.items.splice(itemIndex, 1);
       }else{
        cart.items[itemIndex].quantity = quantity;
       }

       cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
       );

        await cart.save();

        res.status(200).json({
            message: "Cart quantity updated",
            cart,
        });

    }catch(error){
        res.status(500).json({ message: error.message})
    }
}

//increase cart items

export const increaseCartQuantity = async (req, res) =>{
    try{
        const { productId } = req.body;

        if(!productId){
            return res.status(400).json({ message: "productId required"})
        }

        const cart = await Cart.findOne( { user: req.user.id })

        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() ===  productId
        );

        if(itemIndex === -1){
            return res.status(404).json({ message: "Item not in cart"})
        }

        // stock check
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found"})
        }

        if(cart.items[itemIndex].quantity >= product.stock){
            return res.status(400).json({
                 message: "Stock limit reached",

            });

            //increase quantity
            cart.items[itemIndex].quantity += 1;

            //recalculate total
            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            await cart.save();

            res.status(200).json({
                message: "Quantity increases",
                cart,
            });
        }
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

// decrease cart items
export const decreaseCartQuantity = async (req, res) => {
    try{
        const {productId} = req.body;

        const cart = await Cart.findOne( { user: req.user.id })

        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if(itemIndex === -1){
            return res.status(404).json({ message: "Item not in cart"})
        }

        //quantity check
        if(cart.items[itemIndex].quantity > 1){
            cart.items[itemIndex].quantity -= 1;
        }else{
            cart.items.splice(itemIndex, 1);
        }

        //recalculate total
        cart.totalPrice = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await cart.save();

        res.json({
            message: "Quantity updated",
            cart
        });
    }catch(error){
        res.status(500).json({ message: error.message})
    }
}

//Remove from cart
export const removeFromCart = async(req, res) =>{
    try{
        const {productId} = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId});
        if(!cart){
            return res.status(404).json({ message: "Cart not found"})
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await cart.save();

        res.status(200).json({
            message: "Item removed",
            cart
        });
    }catch(error){
        res.status(500).json({ message: error.message})
    }
}