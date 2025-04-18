import { Hono } from "hono";

import paymentMethodController from "../controllers/payment-method-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const paymentMethodRoutes = new Hono();

// Public routes
paymentMethodRoutes.get("/", paymentMethodController.getAllPaymentMethods);
paymentMethodRoutes.get("/:id", paymentMethodController.getPaymentMethodById);

// Protected routes - only ADMIN and SUPER_ADMIN can manage categories
paymentMethodRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]));
paymentMethodRoutes.post("/", paymentMethodController.createPaymentMethod);
paymentMethodRoutes.put("/:id", paymentMethodController.updatePaymentMethod);
paymentMethodRoutes.delete("/:id", paymentMethodController.deletePaymentMethod);

export default paymentMethodRoutes;