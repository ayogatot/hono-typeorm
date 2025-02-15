import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Item } from "../models/Item";

export class ItemService {
  private itemRepository = AppDataSource.getRepository(Item);

  async createItem(itemData: Partial<Item>) {
    if (itemData.code) {
      const existingItem = await this.itemRepository.findOne({
        where: { code: itemData.code },
      });

      if (existingItem) {
        throw new Error("Item code already exists");
      }
    }

    // Set default values for total quantity and status
    itemData.total_quantity = 0;
    itemData.status = "ACTIVE";
    itemData.selling_price = itemData.selling_price || 0; // Add default selling price if not provided

    const item = this.itemRepository.create(itemData);
    return this.itemRepository.save(item);
  }

  async getAllItems(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = query;

    const whereClause = search
      ? [{ name: ILike(`%${search}%`) }, { code: ILike(`%${search}%`) }]
      : {};

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
        item_stocks: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
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
      relations: ["category", "unit", "item_stocks"],
    });

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  async updateItem(id: number, itemData: Partial<Item>) {
    if (itemData.code) {
      const existingItem = await this.itemRepository.findOne({
        where: { code: itemData.code },
      });

      if (!existingItem) {
        throw new Error("Item not found");
      }

      itemData.total_quantity = existingItem.total_quantity;
    }

    await this.itemRepository.update(id, itemData);
    return this.getItemById(id);
  }

  async deleteItem(id: number) {
    await this.itemRepository.softDelete(id);
    return { message: "Item deleted successfully" };
  }
}
