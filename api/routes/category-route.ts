import { Hono } from "hono";

import categoryController from "../controllers/category-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const categoryRoutes = new Hono();

// Public routes
categoryRoutes.get("/", categoryController.getAllCategories);
categoryRoutes.get("/:id", categoryController.getCategoryById);

// Protected routes - only ADMIN and CASHIER can manage categories
categoryRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]));
categoryRoutes.post("/", categoryController.createCategory);
categoryRoutes.put("/:id", categoryController.updateCategory);
categoryRoutes.delete("/:id", categoryController.deleteCategory);

export default categoryRoutes;
