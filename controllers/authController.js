import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import  jwt  from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        // zod validation
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            });
        }

        const { name, email, password } = result.data;

        //check user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already registered" })
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //insert user in MongoDB
        const user = await User.create({
            name, 
            email,
            password: hashPassword
        });
        res.status(201).json({
            message: ("User registered successfully"),
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message})

    }
};

export const loginUser = async (req, res)=>
    {
      try{
        const result = loginSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({message: "Invalid credentials formats"})
        }

        const { email, password} = result.data;

        //find user
        const user = await User.findOne({ email }).select("+password");
        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        }

        //generate jwt 
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        res.json({
            message: "Login succesful",
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

      }catch(error){
         res.status(500).json({ message: error.message });
      }

}
export const isAdmin = (req, res, next) =>{
        if(req.user.role !== "admin"){
            return res.status(403).json({message: "Admon acces only"}) 
        }
        next();
      }
