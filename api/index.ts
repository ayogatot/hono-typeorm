import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { AppDataSource } from "./database/data-source";
import { errorMiddleware } from "./middlewares/error-middleware";

import categoryRoute from "./routes/category-route";
import userRoutes from "./routes/user-routes";
import unitRoutes from "./routes/unit-route";
import paymentMethodRoutes from "./routes/payment-method-route";
import discountRoutes from "./routes/discount-route";
import expenseRoutes from "./routes/expense-route";
import itemRoutes from "./routes/item-route";
import itemStockRoutes from "./routes/item-stock-route";
import transactionRoutes from "./routes/transaction-route";
import termPaymentRoutes from "./routes/term-payment-route";
import imageRoutes from "./routes/image-route";
import syncRoutes from "./routes/sync-routes";

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
  .route("/users", userRoutes)
  .route("/units", unitRoutes)
  .route("/discounts", discountRoutes)
  .route("/payment-methods", paymentMethodRoutes)
  .route("/expenses", expenseRoutes)
  .route("/items", itemRoutes)
  .route("/item-stocks", itemStockRoutes)
  .route("/transactions", transactionRoutes)
  .route("/term-payments", termPaymentRoutes)
  .route("/images", imageRoutes)
  .route("/sync", syncRoutes)
  .onError(errorMiddleware);

export default app;