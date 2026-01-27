import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema } from "../validators/authValidators.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

/* REGISTER */
export const registerUser = asyncHandler(async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const { name, email, password } = result.data;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/* LOGIN */
export const loginUser = asyncHandler(async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError("Invalid credentials format", 400);
  }

  const { email, password } = result.data;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 400);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successfully",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
