import type { Context } from "hono";
import { DashboardService } from "../services/dashboard-service";

const dashboardService = new DashboardService();

const dashboardController = {
  getDashboardMetrics: async (c: Context) => {
    try {
      const metrics = await dashboardService.getDashboardMetrics();
      return c.json({
        success: true,
        data: metrics,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return c.json(
        {
          success: false,
          message: "Failed to fetch dashboard metrics",
          error: errorMessage,
        },
        500
      );
    }
  },

  getTotalRevenue: async (c: Context) => {
    try {
      const revenue = await dashboardService.getTotalRevenue();
      return c.json({
        success: true,
        data: revenue,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return c.json({
        success: false,
        message: "Failed to fetch total revenue",
        error: errorMessage,
      }, 500);
    }
  }
};

export default dashboardController;
