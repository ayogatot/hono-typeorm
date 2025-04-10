import type { Context } from "hono";
import { CafeItemService } from "../services/cafe-item-service";
import { response } from "../utils/response";
import { createCafeItemValidator, updateCafeItemValidator } from "../validators/cafe-items-validator";

const cafeItemService = new CafeItemService();

const cafeRecipesController = {
  getAllCafeRecipes: async (c: Context) => {
    try {
      const query = c.req.queries();
      const cafeItems = await cafeItemService.getAllCafeItem(query);
      return c.json(response.successPagination(cafeItems.data, "Cafe recipes fetched successfully", 200, cafeItems.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createCafeRecipes: async (c: Context) => {
    const data = await c.req.json();
    const validation = createCafeItemValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const cafeItem = await cafeItemService.createCafeItem(data);
      return c.json(response.success(cafeItem, "Cafe recipes created successfully", 201));
    } catch (error: any) {
      throw error;
    }
  },

  getCafeRecipesById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const cafeItem = await cafeItemService.getCafeItemById(id);
      return c.json(response.success(cafeItem, "Cafe recipes fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateCafeRecipes: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateCafeItemValidator.safeParse(data);
    if (!validation.success) {
      throw validation.error;
    }

    try {
      const updatedCafeItem = await cafeItemService.updateCafeItem(id, data);
      return c.json(response.success(updatedCafeItem, "Cafe recipes updated successfully", 200));
    } catch (error: any) {
      throw error;
    }
  },

  deleteCafeRecipes: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await cafeItemService.deleteCafeItem(id);
      return c.json(response.success(res, "Cafe recipes deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default cafeRecipesController; 