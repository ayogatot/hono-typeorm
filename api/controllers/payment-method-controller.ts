import type { Context } from "hono";
import { PaymentMethodService } from "../services/payment-method-service";
import { response } from "../utils/response";
import { createOrUpdatePaymentMethodValidator } from "../validators/payment-method-validator";

const paymentMethodService = new PaymentMethodService();

const paymentMethodController = {
  getAllPaymentMethods: async (c: Context) => {
    try {
      const query = c.req.queries();
      const paymentMethods = await paymentMethodService.getAllPaymentMethods(query);
      return c.json(response.successPagination(paymentMethods.data, "Payment methods fetched successfully", 200, paymentMethods.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createPaymentMethod: async (c: Context) => {
    const data = await c.req.json();
    const validation = createOrUpdatePaymentMethodValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const paymentMethod = await paymentMethodService.createPaymentMethod(data);
      return c.json(response.success(paymentMethod, "PaymentMethod created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getPaymentMethodById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const paymentMethod = await paymentMethodService.getPaymentMethodById(id);
      return c.json(response.success(paymentMethod, "PaymentMethod fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updatePaymentMethod: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = createOrUpdatePaymentMethodValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedPaymentMethod = await paymentMethodService.updatePaymentMethod(id, data);
      return c.json(response.success(updatedPaymentMethod, "PaymentMethod updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deletePaymentMethod: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await paymentMethodService.deletePaymentMethod(id);
      return c.json(response.success(res, "PaymentMethod deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default paymentMethodController;
