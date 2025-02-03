import type { Context } from "hono";
import { ExpenseService } from "../services/expense-service";
import { response } from "../utils/response";
import { createExpenseValidator, updateExpenseValidator } from "../validators/expense-validator";

const expenseService = new ExpenseService();

const expenseController = {
  getAllExpenses: async (c: Context) => {
    try {
      const query = c.req.queries();
      const expenses = await expenseService.getAllExpenses(query);
      return c.json(response.successPagination(expenses.data, "Expenses fetched successfully", 200, expenses.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createExpense: async (c: Context) => {
    const data = await c.req.json();
    const validation = createExpenseValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const user = c.get("user");
      const expense = await expenseService.createExpense({ ...data, added_by: user.id });
      return c.json(response.success(expense, "Expense created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getExpenseById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const expense = await expenseService.getExpenseById(id);
      return c.json(response.success(expense, "Expense fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateExpense: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateExpenseValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedExpense = await expenseService.updateExpense(id, data);
      return c.json(response.success(updatedExpense, "Expense updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteExpense: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await expenseService.deleteExpense(id);
      return c.json(response.success(res, "Expense deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default expenseController; 