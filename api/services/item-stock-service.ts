import { AppDataSource } from "../database/data-source";
import { ItemStock } from "../models/ItemStock";
import { Item } from "../models/Item";

export class ItemStockService {
  private itemStockRepository = AppDataSource.getRepository(ItemStock);
  private itemRepository = AppDataSource.getRepository(Item);

  async createItemStock(itemStockData: Partial<ItemStock>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the item stock
      const itemStock = this.itemStockRepository.create(itemStockData);
      await queryRunner.manager.save(itemStock);


      if (!itemStockData.item) {
        throw new Error("Item not found");
      }
      // Update the item's total quantity
      const item = await this.itemRepository.findOne({
        // @ts-ignore
        where: { id: itemStockData.item }
      });

      if (!item) {
        throw new Error("Item not found");
      }

      item.total_quantity = (item.total_quantity || 0) + itemStock.quantity;
      await queryRunner.manager.save(item);

      await queryRunner.commitTransaction();
      return itemStock;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllItemStocks(query: any) {
    const {
      page = 1,
      limit = 10,
      itemId,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = query;

    const whereClause = itemId ? { item: { id: itemId } } : {};

    const [itemStocks, total] = await this.itemStockRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: ["added_by"],
    });

    return {
      data: itemStocks,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  async getItemStockById(id: number) {
    const itemStock = await this.itemStockRepository.findOne({
      where: { id },
      relations: ["item", "added_by"],
    });

    if (!itemStock) {
      throw new Error("ItemStock not found");
    }

    return itemStock;
  }

  async updateItemStock(id: number, itemStockData: Partial<ItemStock>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingItemStock = await this.itemStockRepository.findOne({
        where: { id },
        relations: ["item"],
      });

      if (!existingItemStock) {
        throw new Error("ItemStock not found");
      }

      // If quantity is being updated, update the item's total_quantity
      if (itemStockData.quantity !== undefined) {
        const quantityDiff = itemStockData.quantity - existingItemStock.quantity;
        const item = await this.itemRepository.findOne({
          where: { id: existingItemStock.item.id }
        });

        if (!item) {
          throw new Error("Item not found");
        }

        item.total_quantity = (item.total_quantity || 0) + quantityDiff;
        await queryRunner.manager.save(item);
      }

      // Update the item stock
      await queryRunner.manager.update(ItemStock, id, itemStockData);
      const updatedItemStock = await this.getItemStockById(id);

      await queryRunner.commitTransaction();
      return updatedItemStock;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteItemStock(id: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const itemStock = await this.itemStockRepository.findOne({
        where: { id },
        relations: ["item"],
      });

      if (!itemStock) {
        throw new Error("ItemStock not found");
      }

      // Update the item's total quantity
      const item = await this.itemRepository.findOne({
        where: { id: itemStock.item.id }
      });

      if (!item) {
        throw new Error("Item not found");
      }

      item.total_quantity = (item.total_quantity || 0) - itemStock.quantity;
      await queryRunner.manager.save(item);

      // Soft delete the item stock
      await queryRunner.manager.softDelete(ItemStock, id);

      await queryRunner.commitTransaction();
      return { message: "ItemStock deleted successfully" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
} 