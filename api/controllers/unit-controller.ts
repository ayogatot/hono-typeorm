import type { Context } from "hono";
import { UnitService } from "../services/unit-service";
import { response } from "../utils/response";
import { createUnitValidator, updateUnitValidator } from "../validators/unit-validator";

const unitService = new UnitService();

const unitController = {
  getAllUnits: async (c: Context) => {
    try {
      const units = await unitService.getAllUnits();
      return c.json(response.success(units, "Units fetched successfully", 200));
    } catch (error: any) {
      return c.json(response.error(error.message, 400));
    }
  },

  createUnit: async (c: Context) => {
    const data = await c.req.json();
    const validation = createUnitValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const unit = await unitService.createUnit(data);
      return c.json(response.success(unit, "Unit created successfully", 201));
    } catch (error: any) {
      return c.json(response.error(error.message, 400));
    }
  },

  getUnitById: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const unit = await unitService.getUnitById(id);
      return c.json(response.success(unit, "Unit fetched successfully", 200));
    } catch (error: any) {
      return c.json(response.error(error.message, 404));
    }
  },

  updateUnit: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    const data = await c.req.json();
    const validation = updateUnitValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedUnit = await unitService.updateUnit(id, data);
      return c.json(response.success(updatedUnit, "Unit updated successfully", 200));
    } catch (error: any) {
      return c.json(response.error(error.message, 400));
    }
  },

  deleteUnit: async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    try {
      const res = await unitService.deleteUnit(id);
      return c.json(response.success(res, "Unit deleted successfully", 200));
    } catch (error: any) {
      return c.json(response.error(error.message, 400));
    }
  },
};

export default unitController; 