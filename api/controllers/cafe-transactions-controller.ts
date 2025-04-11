import type { Context } from "hono";
import { CafeTransactionsService } from "../services/cafe-transactions-service";
import { response } from "../utils/response";
import { createCafeTransactionValidator, updateCafeTransactionValidator } from "../validators/cafe-transactions-validator";

const cafeTransactionsService = new CafeTransactionsService();

const cafeTransactionsController = {
  getAllCafeTransactions: async (c: Context) => {
    try {
      const query = c.req.queries();
      const transactions = await cafeTransactionsService.getAllCafeTransactions(query);
      return c.json(response.successPagination(transactions.data, "Cafe transactions fetched successfully", 200, transactions.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createCafeTransaction: async (c: Context) => {
    const data = await c.req.json();
    const validation = createCafeTransactionValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const user = c.get("user");
      const transaction = await cafeTransactionsService.createCafeTransaction(data, user.id);
      return c.json(response.success(transaction, "Cafe transaction created successfully", 201));
    } catch (error: any) {
      throw error;
    }
  },

  getCafeTransactionById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const transaction = await cafeTransactionsService.getCafeTransactionById(id);
      return c.json(response.success(transaction, "Cafe transaction fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateCafeTransaction: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateCafeTransactionValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const updatedTransaction = await cafeTransactionsService.updateCafeTransaction(id, data);
      return c.json(response.success(updatedTransaction, "Cafe transaction updated successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },

  deleteCafeTransaction: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await cafeTransactionsService.deleteCafeTransaction(id);
      return c.json(response.success(res, "Cafe transaction deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default cafeTransactionsController; 