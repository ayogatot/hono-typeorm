import { Hono } from "hono";
import expenseController from "../controllers/expense-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const expenseRoutes = new Hono();

// All expense routes require authentication and ADMIN role
expenseRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]));
expenseRoutes.get("/", expenseController.getAllExpenses);
expenseRoutes.get("/:id", expenseController.getExpenseById);
expenseRoutes.post("/", expenseController.createExpense);
expenseRoutes.put("/:id", expenseController.updateExpense);
expenseRoutes.delete("/:id", expenseController.deleteExpense);

export default expenseRoutes; 