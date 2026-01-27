// middlewares/authGuard.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const protect = async (req, res, next) => {
    
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, 
      process.env.JWT_ACCESS_SECRET,
    {
      issuer: "ecommerce-api",
      audience: "ecommerce-client",
    });
    if(decoded.type !== "access"){
      return res.status(401).json({ message: "Invalid token type"})
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized, token failed" });
  }
};


// Admin-only middleware
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

//seller
export const isSeller = (req, res, next) =>{
  if(!req.user){
    return res.status(401).json({message: "Unauthorized"})
  }

  if(req.user.role !== "seller"){
    return res.status(403).json({message: 'Seller access only'})
  }

  next();
}

