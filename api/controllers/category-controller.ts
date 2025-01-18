import type { Context } from "hono";
import { CategoryService } from "../services/category-service";

const categoryService = new CategoryService();

const categoryController = {
  getAllCategories: async (c: Context) => {
    const categories = await categoryService.getAllCategories();
    return c.json(categories);
  },

  createCategory: async (c: Context) => {
    const data = await c.req.json();
    const category = await categoryService.createCategory(data);
    return c.json(category, 201);
  },

  getCategoryById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const category = await categoryService.getCategoryById(id);
    if (category) {
      return c.json(category);
    }
    return c.notFound();
  },

  updateCategory: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const updatedCategory = await categoryService.updateCategory(id, data);
    if (updatedCategory) {
      return c.json(updatedCategory);
    }
    return c.notFound();
  },

  deleteCategory: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const response = await categoryService.deleteCategory(id);
    return c.json(response);
  },
};

export default categoryController;
