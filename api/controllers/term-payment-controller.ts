import type { Context } from "hono";
import { TermPaymentService } from "../services/term-payment-service";
import { response } from "../utils/response";
import { createTermPaymentValidator, updateTermPaymentValidator } from "../validators/term-payment-validator";

const termPaymentService = new TermPaymentService();

const termPaymentController = {
  getAllTermPayments: async (c: Context) => {
    try {
      const query = c.req.queries();
      const termPayments = await termPaymentService.getAllTermPayments(query);
      return c.json(response.successPagination(termPayments.data, "Term payments fetched successfully", 200, termPayments.pagination));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createTermPayment: async (c: Context) => {
    const data = await c.req.json();
    const validation = createTermPaymentValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const termPayment = await termPaymentService.createTermPayment(data);
      return c.json(response.success(termPayment, "Term payment created successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getTermPaymentById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const termPayment = await termPaymentService.getTermPaymentById(id);
      return c.json(response.success(termPayment, "Term payment fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateTermPayment: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateTermPaymentValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedTermPayment = await termPaymentService.updateTermPayment(id, data);
      return c.json(response.success(updatedTermPayment, "Term payment updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  deleteTermPayment: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await termPaymentService.deleteTermPayment(id);
      return c.json(response.success(res, "Term payment deleted successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default termPaymentController; 