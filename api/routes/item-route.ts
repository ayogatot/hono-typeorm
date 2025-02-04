import { Hono } from "hono";
import itemController from "../controllers/item-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const itemRoutes = new Hono();

// Public routes
itemRoutes.get("/", itemController.getAllItems);
itemRoutes.get("/:id", itemController.getItemById);

// Protected routes - only ADMIN and CASHIER can manage items
itemRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER"]));
itemRoutes.post("/", itemController.createItem);
itemRoutes.put("/:id", itemController.updateItem);
itemRoutes.delete("/:id", itemController.deleteItem);

export default itemRoutes; 