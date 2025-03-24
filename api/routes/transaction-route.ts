import { Hono } from "hono";
import transactionController from "../controllers/transaction-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const transactionRoutes = new Hono();

// All routes require authentication
transactionRoutes.use("/*", authMiddleware);

// Read operations - ADMIN and CASHIER
transactionRoutes.use("/", requireRole(["ADMIN", "SUPER_ADMIN", "CASHIER"]));
transactionRoutes.get("/", transactionController.getAllTransactions);
transactionRoutes.get("/:id", transactionController.getTransactionById);

// Write operations - ADMIN and CASHIER
transactionRoutes.post("/", transactionController.createTransaction);
transactionRoutes.put("/:id", transactionController.updateTransaction);

// Delete operations - only ADMIN
transactionRoutes.use("/*/delete", requireRole(["ADMIN", "SUPER_ADMIN"]));
transactionRoutes.delete("/:id", transactionController.deleteTransaction);

export default transactionRoutes; 