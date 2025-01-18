import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
// import { handle } from "hono/vercel";

import { AppDataSource } from "./database/data-source";
import categoryRoute from "./routes/category-route";
import { errorMiddleware } from "./middlewares/error-middleware";

try {
  const { isInitialized } = await AppDataSource.initialize();
  console.log("Database initialize status:", isInitialized);
} catch (e) {
  console.log(e);
}

const app = new Hono();

app
  .use(cors())
  .use(logger())
  .get("/check-health", (c) => c.text("OK"))
  .route("/api/categories", categoryRoute)
  .onError(errorMiddleware);

export default app;

// for vercel use
// const handler = handle(app);

// export const GET = handler;
// export const POST = handler;
// export const PATCH = handler;
// export const PUT = handler;
// export const OPTIONS = handler;
