import { Hono } from "hono";
import cafeMenuController from "../controllers/cafe-menu-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const cafeMenuRoutes = new Hono();

// Public routes
cafeMenuRoutes.get("/", cafeMenuController.getAllCafeMenus);
cafeMenuRoutes.get("/:id", cafeMenuController.getCafeMenuById);

// Protected routes - only ADMIN and CASHIER can manage cafe menus
cafeMenuRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER", "SUPER_ADMIN"]));
cafeMenuRoutes.post("/", cafeMenuController.createCafeMenu);
cafeMenuRoutes.put("/:id", cafeMenuController.updateCafeMenu);
cafeMenuRoutes.delete("/:id", cafeMenuController.deleteCafeMenu);

export default cafeMenuRoutes; 