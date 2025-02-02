import { type ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { response } from "../utils/response";

export const errorMiddleware: ErrorHandler = (err, c) => {
  const status = err instanceof HTTPException ? err.status : 500;
  c.status(status);
  return c.json(response.error(JSON.parse(err.message) || err.message, status));
};
