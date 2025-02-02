import type { Context } from "hono";
import { CategoryService } from "../services/category-service";
import { response } from "../utils/response";
import { createCategoryValidator, updateCategoryValidator } from "../validators/category-validator";

const categoryService = new CategoryService();

const categoryController = {
  getAllCategories: async (c: Context) => {
    const categories = await categoryService.getAllCategories();
    return c.json(response.success(categories, "Categories fetched successfully", 200));
  },

  createCategory: async (c: Context) => {
    const data = await c.req.json();
    const validation = createCategoryValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const category = await categoryService.createCategory(data);
      return c.json(response.success(category, "Category created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getCategoryById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const category = await categoryService.getCategoryById(id);
      return c.json(response.success(category, "Category fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateCategory: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateCategoryValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedCategory = await categoryService.updateCategory(id, data);
      return c.json(response.success(updatedCategory, "Category updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteCategory: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await categoryService.deleteCategory(id);
      return c.json(response.success(res, "Category deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default categoryController;
