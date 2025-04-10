import { Hono } from "hono";
import cafeItemStockController from "../controllers/cafe-item-stock-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const cafeItemStockRoutes = new Hono();

// Public routes
cafeItemStockRoutes.get("/", cafeItemStockController.getAllCafeItemStocks);
cafeItemStockRoutes.get("/:id", cafeItemStockController.getCafeItemStockById);

// Protected routes - only ADMIN and CASHIER can manage cafe item stocks
cafeItemStockRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER", "SUPER_ADMIN"]));
cafeItemStockRoutes.post("/", cafeItemStockController.createCafeItemStock);
cafeItemStockRoutes.put("/:id", cafeItemStockController.updateCafeItemStock);
cafeItemStockRoutes.delete("/:id", cafeItemStockController.deleteCafeItemStock);

export default cafeItemStockRoutes; 