import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.AUTH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.AUTH_TOKEN_EXPIRY,
    }
  );
};


export { generateToken };