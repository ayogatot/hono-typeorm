import { Hono } from "hono";
import termPaymentController from "../controllers/term-payment-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const termPaymentRoutes = new Hono();

// All routes require authentication and ADMIN/CASHIER role
termPaymentRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER"]));
termPaymentRoutes.get("/", termPaymentController.getAllTermPayments);
termPaymentRoutes.get("/:id", termPaymentController.getTermPaymentById);
termPaymentRoutes.post("/", termPaymentController.createTermPayment);
termPaymentRoutes.put("/:id", termPaymentController.updateTermPayment);
termPaymentRoutes.delete("/:id", termPaymentController.deleteTermPayment);

export default termPaymentRoutes; 