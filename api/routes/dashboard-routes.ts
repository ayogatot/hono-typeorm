import { Hono } from "hono";
import dashboardController from "../controllers/dashboard-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const dashboardRouter = new Hono();

dashboardRouter.use("/*", authMiddleware, requireRole(["ADMIN"]));
dashboardRouter.get("/items", dashboardController.getDashboardMetrics);
dashboardRouter.get("/revenue", dashboardController.getTotalRevenue);

export default dashboardRouter; 