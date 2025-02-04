import type { Context, Next } from "hono";
import { JWT } from "../utils/jwt";

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    const token = JWT.extractToken(authHeader);
    const payload = await JWT.verify(token);

    c.set("user", payload);
    await next();
  } catch (error) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
}

export function requireRole(roles: string[]) {
  return async function (c: Context, next: Next) {
    const user = c.get("user");
    if (!user || !roles.includes(user.role)) {
      c.status(403);
      return c.json({ message: "Forbidden" });
    }
    await next();
  };
} 