import type { Context } from "hono";
import { TransactionService } from "../services/transaction-service";
import { response } from "../utils/response";
import { createTransactionValidator, updateTransactionValidator } from "../validators/transaction-validator";

const transactionService = new TransactionService();

const transactionController = {
  getAllTransactions: async (c: Context) => {
    try {
      const query = c.req.queries();
      const transactions = await transactionService.getAllTransactions(query);
      return c.json(response.successPagination(transactions.data, "Transactions fetched successfully", 200, transactions.pagination));
    } catch (error: any) {
      throw error;
    }
  },

  createTransaction: async (c: Context) => {
    const data = await c.req.json();
    const validation = createTransactionValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const user = c.get("user");
      const transaction = await transactionService.createTransaction(data, user.id);
      return c.json(response.success(transaction, "Transaction created successfully", 201));
    } catch (error: any) {
      throw error;
    }
  },

  getTransactionById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const transaction = await transactionService.getTransactionById(id);
      return c.json(response.success(transaction, "Transaction fetched successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },

  updateTransaction: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateTransactionValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const updatedTransaction = await transactionService.updateTransaction(id, data);
      return c.json(response.success(updatedTransaction, "Transaction updated successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },

  deleteTransaction: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await transactionService.deleteTransaction(id);
      return c.json(response.success(res, "Transaction deleted successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },
};

export default transactionController; 