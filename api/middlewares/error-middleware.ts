import { type ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { response } from "../utils/response";

export const errorMiddleware: ErrorHandler = (err, c) => {
  console.error("Error:", err);
  
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json(response.error(err.message, err.status));
  }

  // Handle ZodError or other validation errors
  if (err.name === "ZodError") {
    c.status(400);
    // @ts-ignore
    return c.json(response.error(err.errors || err.message, 400));
  }

  // Handle other errors
  const status = err instanceof HTTPException ? err.status : 500;
  c.status(status);
  return c.json(response.error(err.message || "Internal Server Error", status));
};
