import { Hono } from "hono";
import unitController from "../controllers/unit-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const unitRoutes = new Hono();

// Public routes
unitRoutes.get("/", unitController.getAllUnits);
unitRoutes.get("/:id", unitController.getUnitById);

// Protected routes - only ADMIN and CASHIER can manage units
unitRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER"]));
unitRoutes.post("/", unitController.createUnit);
unitRoutes.put("/:id", unitController.updateUnit);
unitRoutes.delete("/:id", unitController.deleteUnit);

export default unitRoutes; 