import type { Context } from "hono";
import { ItemService } from "../services/item-service";
import { response } from "../utils/response";
import { createItemValidator, updateItemValidator } from "../validators/item-validator";

const itemService = new ItemService();

const itemController = {
  getAllItems: async (c: Context) => {
    try {
      const query = c.req.queries();
      const items = await itemService.getAllItems(query);
      return c.json(response.successPagination(items.data, "Items fetched successfully", 200, items.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createItem: async (c: Context) => {
    const data = await c.req.json();
    const validation = createItemValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const item = await itemService.createItem(data);
      return c.json(response.success(item, "Item created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getItemById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const item = await itemService.getItemById(id);
      return c.json(response.success(item, "Item fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateItem: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateItemValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedItem = await itemService.updateItem(id, data);
      console.log({updatedItem})
      return c.json(response.success(updatedItem, "Item updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteItem: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await itemService.deleteItem(id);
      return c.json(response.success(res, "Item deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default itemController; 