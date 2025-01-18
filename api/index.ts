import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { AppDataSource } from "./database/data-source";
import categoryRoute from "./routes/category-route";
import { errorMiddleware } from "./middlewares/error-middleware";

try {
  const { isInitialized } = await AppDataSource.initialize();
  console.log("Database initialize status:", isInitialized);
} catch (e) {
  console.log(e);
}

const app = new Hono().basePath("/api");

app
  .use(cors())
  .use(logger())
  .get("/check-health", (c) => c.text("OK"))
  .route("/categories", categoryRoute)
  .onError(errorMiddleware);

export default app;