import { Hono } from "hono";
import itemStockController from "../controllers/item-stock-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const itemStockRoutes = new Hono();

// All routes require authentication
itemStockRoutes.use("/*", authMiddleware);

// Read operations - ADMIN and CASHIER
itemStockRoutes.get("/", itemStockController.getAllItemStocks);
itemStockRoutes.get("/:id", itemStockController.getItemStockById);

// Write operations - only ADMIN and SUPER_ADMIN
itemStockRoutes.use("/*", requireRole(["ADMIN", "SUPER_ADMIN", "CASHIER"]));
itemStockRoutes.post("/", itemStockController.createItemStock);
itemStockRoutes.put("/:id", itemStockController.updateItemStock);
itemStockRoutes.delete("/:id", itemStockController.deleteItemStock);
itemStockRoutes.post("/batch", itemStockController.batchCreateItemStock);

export default itemStockRoutes; 