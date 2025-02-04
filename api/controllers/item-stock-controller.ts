import type { Context } from "hono";
import { ItemStockService } from "../services/item-stock-service";
import { response } from "../utils/response";
import { createItemStockValidator, updateItemStockValidator } from "../validators/item-stock-validator";

const itemStockService = new ItemStockService();

const itemStockController = {
  getAllItemStocks: async (c: Context) => {
    try {
      const query = c.req.queries();
      const itemStocks = await itemStockService.getAllItemStocks(query);
      return c.json(response.successPagination(itemStocks.data, "Item stocks fetched successfully", 200, itemStocks.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createItemStock: async (c: Context) => {
    const data = await c.req.json();
    const validation = createItemStockValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const user = c.get("user");
      const itemStock = await itemStockService.createItemStock({ 
        ...data, 
        added_by: user.id 
      });
      return c.json(response.success(itemStock, "Item stock created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getItemStockById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const itemStock = await itemStockService.getItemStockById(id);
      return c.json(response.success(itemStock, "Item stock fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateItemStock: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateItemStockValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedItemStock = await itemStockService.updateItemStock(id, data);
      return c.json(response.success(updatedItemStock, "Item stock updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteItemStock: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await itemStockService.deleteItemStock(id);
      return c.json(response.success(res, "Item stock deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default itemStockController; 