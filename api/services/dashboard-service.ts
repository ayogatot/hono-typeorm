import { AppDataSource } from "../database/data-source";
import { Between } from "typeorm";
import { Item } from "../models/Item";
import { ItemStock } from "../models/ItemStock";
import { Transaction } from "../models/Transaction";

export class DashboardService {
  private itemRepository = AppDataSource.getRepository(Item);
  private itemStockRepository = AppDataSource.getRepository(ItemStock);
  private transactionRepository = AppDataSource.getRepository(Transaction);

  async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalItems,
      totalItemStocks,
      todayItems,
      todayItemStocks
    ] = await Promise.all([
      this.itemRepository.count(),
      
      this.itemStockRepository.count(),
      
      this.itemRepository.count({
        where: {
          created_at: Between(today, tomorrow)
        }
      }),
      
      this.itemStockRepository.count({
        where: {
          created_at: Between(today, tomorrow)
        }
      })
    ]);

    return {
      total_items: totalItems,
      total_item_stocks: totalItemStocks,
      today_items: todayItems,
      today_item_stocks: todayItemStocks
    };
  }

  async getTotalRevenue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [ totalTransaction, todayTransaction, totalRevenue, todayRevenue ] = await Promise.all([
      this.transactionRepository.count(),
      this.transactionRepository.count({
        where: {
          created_at: Between(today, tomorrow)
        }
      }),
      this.transactionRepository.sum("total", {status: "PAID"}),
      this.transactionRepository.sum("total", {status: "PAID", created_at: Between(today, tomorrow)})
    ]);

    return {
      total_transaction: totalTransaction,
      today_transaction: todayTransaction,
      total_revenue: totalRevenue,
      today_revenue: todayRevenue
    };
  }
}
