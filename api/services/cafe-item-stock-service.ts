import { AppDataSource } from "../database/data-source";
import { CafeItemStock } from "../models/CafeItemStock";
import { CafeItemService } from "./cafe-item-service";
import { UserService } from "./user-service";
import type { z } from "zod";
import type { createCafeItemStockValidator, updateCafeItemStockValidator } from "../validators/cafe-item-stock-validator";
import { 
  defaultPaginationOptions, 
  buildPagination, 
  addSearchCondition, 
  addFilterCondition, 
  addRelationFilter 
} from "../utils/query-utils";

export class CafeItemStockService {
  private cafeItemStockRepository = AppDataSource.getRepository(CafeItemStock);
  private cafeItemService: CafeItemService;
  private userService: UserService;

  constructor() {
    this.cafeItemService = new CafeItemService();
    this.userService = new UserService();
  }

  async createCafeItemStock(cafeItemStockData: z.infer<typeof createCafeItemStockValidator>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify related entities exist
      const cafeItem = await this.cafeItemService.getCafeItemById(cafeItemStockData.cafe_item_id);
      const user = await this.userService.findById(cafeItemStockData.added_by_id);

      if (!cafeItem) {
        throw new Error("Cafe item not found");
      }

      // Create new cafe item stock
      const newCafeItemStockData = {
        ...cafeItemStockData,
        cafe_items: cafeItem,
        added_by: user
      }

      const cafeItemStock = queryRunner.manager.create(CafeItemStock, newCafeItemStockData);
      await queryRunner.manager.save(cafeItemStock);

      // Update cafe item total quantity
      cafeItem.total_quantity = (cafeItem.total_quantity || 0) + cafeItemStockData.quantity;
      await queryRunner.manager.save(cafeItem);

      await queryRunner.commitTransaction();
      return cafeItemStock;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllCafeItemStocks(query: any) {
    const {
      page = defaultPaginationOptions.page,
      limit = defaultPaginationOptions.limit,
      search,
      sortBy = defaultPaginationOptions.sortBy,
      sortOrder = defaultPaginationOptions.sortOrder,
      cafe_item_id,
      added_by_id
    } = query;

    let whereClause = {};

    // Add search condition
    whereClause = addSearchCondition(whereClause, ["id"], search);

    // Add filter conditions
    whereClause = addRelationFilter(whereClause, "cafe_item", "id", cafe_item_id);
    whereClause = addRelationFilter(whereClause, "added_by", "id", added_by_id);

    const [cafeItemStocks, total] = await this.cafeItemStockRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        cafe_items: true,
        added_by: true,
      },
      select: {
        id: true,
        initial_quantity: true,
        quantity: true,
        buying_price: true,
        sell_price: true,
        created_at: true,
        updated_at: true,
        added_by: {
          id: true,
          name: true,
          email: true
        },
      },
    });

    return {
      data: cafeItemStocks,
      pagination: buildPagination(total, page, limit)
    };
  }

  async getCafeItemStockById(id: number) {
    const cafeItemStock = await this.cafeItemStockRepository.findOne({
      where: { id },
      relations: {
        cafe_items: true,
        added_by: true
      }
    });

    if (!cafeItemStock) {
      throw new Error("Cafe item stock not found");
    }

    return cafeItemStock;
  }

  async updateCafeItemStock(id: number, cafeItemStockData: z.infer<typeof updateCafeItemStockValidator>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingCafeItemStock = await queryRunner.manager.findOne(CafeItemStock, {
        where: { id },
        relations: {
          cafe_items: true,
          added_by: true
        }
      });

      if (!existingCafeItemStock) {
        throw new Error("Cafe item stock not found");
      }

      const updatedCafeItemStockData = {
        initial_quantity: cafeItemStockData.initial_quantity,
        quantity: cafeItemStockData.quantity,
        buying_price: cafeItemStockData.buying_price,
        sell_price: cafeItemStockData.sell_price,
        added_by: cafeItemStockData.added_by_id 
          ? await this.userService.findById(cafeItemStockData.added_by_id) 
          : existingCafeItemStock.added_by
      }

      // Calculate the quantity difference
      const quantityDiff = (cafeItemStockData.quantity || 0) - (existingCafeItemStock.quantity || 0);

      // Update the cafe item stock
      await queryRunner.manager.update(CafeItemStock, id, updatedCafeItemStockData);

      // Update the cafe item's total quantity if there's a change
      if (quantityDiff !== 0) {
        const cafeItem = existingCafeItemStock.cafe_items;
        cafeItem.total_quantity = (cafeItem.total_quantity || 0) + quantityDiff;
        await queryRunner.manager.save(cafeItem);
      }

      await queryRunner.commitTransaction();
      return this.getCafeItemStockById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCafeItemStock(id: number) {
    await this.cafeItemStockRepository.softDelete(id);
    return { message: "Cafe item stock deleted successfully" };
  }
} 