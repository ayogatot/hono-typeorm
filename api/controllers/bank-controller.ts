import type { Context } from "hono";
import { ExpenseService } from "../services/expense-service";
import { response } from "../utils/response";
import { createExpenseValidator, updateExpenseValidator } from "../validators/expense-validator";
import { BankService } from "../services/bank-service";
import { createBankValidator, updateBankValidator } from "../validators/bank-validator";

const bankService = new BankService();

const bankController = {
  getAllBanks: async (c: Context) => {
    try {
      const query = c.req.queries();
      const banks = await bankService.getAllBanks(query);
      return c.json(response.successPagination(banks.data, "Banks fetched successfully", 200, banks.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createBank: async (c: Context) => {
    const data = await c.req.json();
    const validation = createBankValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const bank = await bankService.createBank(data);
      return c.json(response.success(bank, "Bank created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getBankById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const bank = await bankService.getBankById(id);
      return c.json(response.success(bank, "Bank fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateBank: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateBankValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedBank = await bankService.updateBank(id, data);
      return c.json(response.success(updatedBank, "Bank updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteBank: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await bankService.deleteBank(id);
      return c.json(response.success(res, "Bank deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default bankController; 