import { Hono } from "hono";
import cafeTransactionsController from "../controllers/cafe-transactions-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const cafeTransactionsRoutes = new Hono();

// Public routes
cafeTransactionsRoutes.get("/", cafeTransactionsController.getAllCafeTransactions);

// Protected routes - only ADMIN and CASHIER can manage transactions
cafeTransactionsRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER", "SUPER_ADMIN"]));
cafeTransactionsRoutes.post("/", cafeTransactionsController.createCafeTransaction);
cafeTransactionsRoutes.get("/:id", cafeTransactionsController.getCafeTransactionById);
cafeTransactionsRoutes.put("/:id", cafeTransactionsController.updateCafeTransaction);
cafeTransactionsRoutes.delete("/:id", cafeTransactionsController.deleteCafeTransaction);

export default cafeTransactionsRoutes; 