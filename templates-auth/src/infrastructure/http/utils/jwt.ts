import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
