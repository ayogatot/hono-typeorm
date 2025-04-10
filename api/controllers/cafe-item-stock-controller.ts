import type { Context } from "hono";
import { CafeItemStockService } from "../services/cafe-item-stock-service";
import { response } from "../utils/response";
import { createCafeItemStockValidator, updateCafeItemStockValidator } from "../validators/cafe-item-stock-validator";

const cafeItemStockService = new CafeItemStockService();

const cafeItemStockController = {
  getAllCafeItemStocks: async (c: Context) => {
    try {
      const query = c.req.queries();
      const cafeItemStocks = await cafeItemStockService.getAllCafeItemStocks(query);
      return c.json(response.successPagination(cafeItemStocks.data, "Cafe item stocks fetched successfully", 200, cafeItemStocks.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createCafeItemStock: async (c: Context) => {
    const data = await c.req.json();
    const validation = createCafeItemStockValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const cafeItemStock = await cafeItemStockService.createCafeItemStock(data);
      return c.json(response.success(cafeItemStock, "Cafe item stock created successfully", 201));
    } catch (error: any) {
      throw error;
    }
  },

  getCafeItemStockById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const cafeItemStock = await cafeItemStockService.getCafeItemStockById(id);
      return c.json(response.success(cafeItemStock, "Cafe item stock fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateCafeItemStock: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateCafeItemStockValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const updatedCafeItemStock = await cafeItemStockService.updateCafeItemStock(id, data);
      return c.json(response.success(updatedCafeItemStock, "Cafe item stock updated successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },

  deleteCafeItemStock: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await cafeItemStockService.deleteCafeItemStock(id);
      return c.json(response.success(res, "Cafe item stock deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default cafeItemStockController; 