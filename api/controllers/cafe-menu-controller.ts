import type { Context } from "hono";
import { CafeMenuService } from "../services/cafe-menu-service";
import { response } from "../utils/response";
import { createCafeMenuValidator, updateCafeMenuValidator } from "../validators/cafe-menu-validator";

const cafeMenuService = new CafeMenuService();

const cafeMenuController = {
  getAllCafeMenus: async (c: Context) => {
    try {
      const query = c.req.queries();
      const cafeMenus = await cafeMenuService.getAllCafeMenus(query);
      return c.json(response.successPagination(cafeMenus.data, "Cafe menus fetched successfully", 200, cafeMenus.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createCafeMenu: async (c: Context) => {
    const data = await c.req.json();
    const validation = createCafeMenuValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const cafeMenu = await cafeMenuService.createCafeMenu(data);
      return c.json(response.success(cafeMenu, "Cafe menu created successfully", 201));
    } catch (error: any) {
      throw error;
    }
  },

  getCafeMenuById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const cafeMenu = await cafeMenuService.getCafeMenuById(id);
      return c.json(response.success(cafeMenu, "Cafe menu fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateCafeMenu: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateCafeMenuValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const updatedCafeMenu = await cafeMenuService.updateCafeMenu(id, data);
      return c.json(response.success(updatedCafeMenu, "Cafe menu updated successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },

  deleteCafeMenu: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await cafeMenuService.deleteCafeMenu(id);
      return c.json(response.success(res, "Cafe menu deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default cafeMenuController; 