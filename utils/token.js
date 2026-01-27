import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, type: "access" },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
      issuer: "ecommerce-api",
      audience: "ecommerce-client",
    }, // short-lived token
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
      issuer: "ecommerce-api",
      audience: "ecommerce-client",
    }, // long-lived token
  );
};
