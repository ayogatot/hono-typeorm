import type { Context } from "hono";
import { DiscountService } from "../services/discount-service";
import { response } from "../utils/response";
import { createDiscountValidator, updateDiscountValidator } from "../validators/discount-validator";

const discountService = new DiscountService();

const discountController = {
  getAllDiscounts: async (c: Context) => {
    try {
      const query = c.req.queries();
      const discounts = await discountService.getAllDiscounts(query);
      return c.json(response.successPagination(discounts.data, "Discounts fetched successfully", 200, discounts.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createDiscount: async (c: Context) => {
    const data = await c.req.json();
    const validation = createDiscountValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const discount = await discountService.createDiscount(data);
      return c.json(response.success(discount, "Discount created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getDiscountById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const discount = await discountService.getDiscountById(id);
      return c.json(response.success(discount, "Discount fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateDiscount: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateDiscountValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedDiscount = await discountService.updateDiscount(id, data);
      return c.json(response.success(updatedDiscount, "Discount updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteDiscount: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await discountService.deleteDiscount(id);
      return c.json(response.success(res, "Discount deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default discountController; 