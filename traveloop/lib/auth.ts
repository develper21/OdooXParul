import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "30d";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable.");
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePasswords(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function createJwtToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwtToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
