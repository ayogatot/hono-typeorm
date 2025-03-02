import type { Context } from "hono";
import { SyncService } from "../services/sync-service";

export class SyncController {
  private syncService: SyncService;

  constructor() {
    this.syncService = new SyncService();
  }

  async sync(c: Context) {
    try {
      await this.syncService.sync();
      return c.json({
        success: true,
        message: "Data synchronized successfully"
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return c.json({
        success: false,
        message: "Failed to synchronize data",
        error: errorMessage
      }, 500);
    }
  }
} 