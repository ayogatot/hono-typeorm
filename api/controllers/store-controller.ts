import type { Context } from "hono";
import { StoreService } from "../services/store-service";
import { response } from "../utils/response";
import { createStoreValidator, updateStoreValidator } from "../validators/store-validator";

const storeService = new StoreService();

const storeController = {
  getAllStores: async (c: Context) => {
    try {
      const query = c.req.queries();
      const stores = await storeService.getAllStores(query);
      return c.json(response.successPagination(stores.data, "Stores fetched successfully", 200, stores.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createStore: async (c: Context) => {
    const data = await c.req.json();
    const validation = createStoreValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const store = await storeService.createStore(data);
      return c.json(response.success(store, "Store created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getStoreById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const store = await storeService.getStoreById(id);
      return c.json(response.success(store, "Store fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateStore: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateStoreValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedStore = await storeService.updateStore(id, data);
      return c.json(response.success(updatedStore, "Store updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteStore: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await storeService.deleteStore(id);
      return c.json(response.success(res, "Store deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default storeController; 