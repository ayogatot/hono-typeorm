import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

interface JwtPayload extends JWTPayload {
  id: number;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class JWT {
  static async sign(payload: JwtPayload): Promise<string> {
    return await sign(payload, JWT_SECRET);
  }

  static async verify(token: string): Promise<JwtPayload> {
    try {
      return await verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static async decode(token: string): Promise<JwtPayload> {
    try {
      return await verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new Error("Failed to decode token");
    }
  }

  static extractToken(authHeader: string | undefined): string {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }
    return authHeader.split(" ")[1];
  }
} 