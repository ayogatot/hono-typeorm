import type { Context } from "hono";
import { CategoryService } from "../services/category-service";
import { response } from "../utils/response";
import { categoryValidator } from "../validators/category-validator";
const categoryService = new CategoryService();

const categoryController = {
  getAllCategories: async (c: Context) => {
    const categories = await categoryService.getAllCategories();
    return c.json(response.success(categories, "Categories fetched successfully", 200));
  },

  createCategory: async (c: Context) => {
    const data = await c.req.json();
    const validation = categoryValidator.safeParse(data);
    if (!validation.success) {
      return c.json(response.error(validation.error.message, 400));
    }
    const category = await categoryService.createCategory(data);
    return c.json(response.success(category, "Category created successfully", 201));
  },

  getCategoryById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const category = await categoryService.getCategoryById(id);
    if (category) {
      return c.json(response.success(category, "Category fetched successfully", 200));
    }
    return c.notFound();
  },

  updateCategory: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = categoryValidator.safeParse(data);
    if (!validation.success) {
      return c.json(response.error(validation.error.message, 400));
    }

    const updatedCategory = await categoryService.updateCategory(id, data);
    if (updatedCategory) {
      return c.json(response.success(updatedCategory, "Category updated successfully", 200));
    }
    return c.notFound();
  },

  deleteCategory: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const res = await categoryService.deleteCategory(id);
    return c.json(response.success(res, "Category deleted successfully", 200));
  },
};

export default categoryController;
