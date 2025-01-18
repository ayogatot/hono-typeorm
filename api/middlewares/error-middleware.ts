import { type ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const errorMiddleware: ErrorHandler = (err, c) => {
  const status = err instanceof HTTPException ? err.status : 500;
  c.status(status);
  return c.json({ message: err.message });
};
