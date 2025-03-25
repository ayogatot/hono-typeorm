import { ILike, In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Item } from "../models/Item";
import { StoreService } from "./store-service";
import type { z } from "zod";
import type { createItemValidator, updateItemValidator } from "../validators/item-validator";

export class ItemService {
  private itemRepository = AppDataSource.getRepository(Item);
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  async createItem(itemData: z.infer<typeof createItemValidator>) {
    if (itemData.code) {
      const existingItem = await this.itemRepository.findOne({
        where: { 
          code: itemData.code,
          store: { id: itemData.store_id }
        },
      });

      if (existingItem) {
        throw new Error("Item code already exists in this store");
      }
    }

    // Verify store exists
    const store = await this.storeService.getStoreById(itemData.store_id);

    const newItemData = {
      ...itemData,
      store: store,
      total_quantity: 0,
      status: "ACTIVE",
      selling_price: itemData.selling_price || 0
    }

    // @ts-ignore
    const item = this.itemRepository.create(newItemData);
    return this.itemRepository.save(item);
  }

  async getAllItems(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "created_at",
      sortOrder = "DESC",
      categoryIds,
      unitId,
      store_id
    } = query;

    let whereClause: any = {};

    if (search) {
      whereClause = [
        { name: ILike(`%${search}%`) },
        { code: ILike(`%${search}%`) }
      ];
    }

    if (categoryIds && categoryIds !== "" && categoryIds.length > 0 && categoryIds[0] !== "") {
      const categoryIdsArray = categoryIds[0].split(",");
      if (Array.isArray(whereClause)) {
        whereClause = whereClause.map(condition => ({
          ...condition,
          category: { id: In(categoryIdsArray) }
        }));
      } else {
        whereClause.category = { id: In(categoryIdsArray) };
      }
    }

    if (unitId) {
      if (Array.isArray(whereClause)) {
        whereClause = whereClause.map(condition => ({
          ...condition,
          unit: { id: unitId }
        }));
      } else {
        whereClause.unit = { id: unitId };
      }
    }

    if (store_id) {
      if (Array.isArray(whereClause)) {
        whereClause = whereClause.map(condition => ({
          ...condition,
          store: { id: store_id }
        }));
      } else {
        whereClause.store = { id: store_id };
      }
    }

    const [items, total] = await this.itemRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        category: true,
        unit: true,
        store: true,
        item_stocks: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
        image: true,
        total_quantity: true,
        selling_price: true,
        status: true,
        created_at: true,
        updated_at: true,
        category: {
          id: true,
          name: true,
        },
        unit: {
          id: true,
          name: true,
        },
        store: {
          id: true,
          name: true
        },
        item_stocks: {
          id: true,
          quantity: true,
          buying_price: true,
          sell_price: true,
        },
      },
    });

    return {
      data: items,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  async getItemById(id: number) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: {
        category: true,
        unit: true,
        store: true,
        item_stocks: true
      }
    });

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  async updateItem(id: number, itemData: z.infer<typeof updateItemValidator>) {
    const existingItem = await this.getItemById(id);

    if (itemData.code) {
      const duplicateItem = await this.itemRepository.findOne({
        where: { 
          code: itemData.code,
          store: { 
            id: itemData.store_id || existingItem.store.id 
          }
        }
      });

      if (duplicateItem && duplicateItem.id !== id) {
        throw new Error("Item code already exists in this store");
      }
    }

    const updatedItemData = {
      category: itemData.category,
      unit: itemData.unit,
      code: itemData.code,
      name: itemData.name,
      image: itemData.image,
      status: itemData.status,
      selling_price: itemData.selling_price,
      store: itemData.store_id ? await this.storeService.getStoreById(itemData.store_id) : existingItem.store,
    }

    // @ts-ignore
    await this.itemRepository.update(id, updatedItemData);
    return this.getItemById(id);
  }

  async deleteItem(id: number) {
    await this.itemRepository.softDelete(id);
    return { message: "Item deleted successfully" };
  }
}
