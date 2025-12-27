import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production";

export interface UserPayload {
  id: number;
  email: string;
  role: "user";
}

export interface AdminPayload {
  id: number;
  email: string;
  role: "admin";
}

export interface AuthRequest extends Request {
  user?: UserPayload;
  admin?: AdminPayload;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate user token
export function generateUserToken(userId: number, email: string): string {
  return jwt.sign({ id: userId, email, role: "user" }, JWT_SECRET, { expiresIn: "24h" });
}

// Generate admin token
export function generateAdminToken(adminId: number, email: string): string {
  return jwt.sign({ id: adminId, email, role: "admin" }, ADMIN_JWT_SECRET, { expiresIn: "24h" });
}

// Verify user token
export function verifyUserToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch {
    return null;
  }
}

// Verify admin token
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminPayload;
    return decoded;
  } catch {
    return null;
  }
}

// Middleware to verify user token
export function authUserMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const payload = verifyUserToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = payload;
  next();
}

// Middleware to verify admin token
export function authAdminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.admin = payload;
  next();
}
