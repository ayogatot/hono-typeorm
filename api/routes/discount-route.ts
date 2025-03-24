import { Hono } from "hono";
import discountController from "../controllers/discount-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const discountRoutes = new Hono();

// Public routes
discountRoutes.get("/", discountController.getAllDiscounts);
discountRoutes.get("/:id", discountController.getDiscountById);

// Protected routes - only ADMIN and SUPER_ADMIN can manage discounts
discountRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]));
discountRoutes.post("/", discountController.createDiscount);
discountRoutes.put("/:id", discountController.updateDiscount);
discountRoutes.delete("/:id", discountController.deleteDiscount);

export default discountRoutes; 