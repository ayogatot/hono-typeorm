import { AppDataSource } from "../database/data-source";
import { CafeMenu } from "../models/CafeMenu";
import { StoreService } from "./store-service";
import type { z } from "zod";
import type { createCafeMenuValidator, updateCafeMenuValidator } from "../validators/cafe-menu-validator";
import { 
  defaultPaginationOptions, 
  buildPagination, 
  addSearchCondition, 
  addFilterCondition, 
  addRelationFilter 
} from "../utils/query-utils";

export class CafeMenuService {
  private cafeMenuRepository = AppDataSource.getRepository(CafeMenu);
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  async createCafeMenu(cafeMenuData: z.infer<typeof createCafeMenuValidator>) {
    // Verify store exists
    const store = await this.storeService.getStoreById(cafeMenuData.store_id);

    const newCafeMenuData = {
      ...cafeMenuData,
      store: store,
      status: cafeMenuData.status || "AVAILABLE",
      type: cafeMenuData.type || "DRINK"
    }

    // @ts-ignore
    const cafeMenu = this.cafeMenuRepository.create(newCafeMenuData);
    return this.cafeMenuRepository.save(cafeMenu);
  }

  async getAllCafeMenus(query: any) {
    const {
      page = defaultPaginationOptions.page,
      limit = defaultPaginationOptions.limit,
      search,
      sortBy = defaultPaginationOptions.sortBy,
      sortOrder = defaultPaginationOptions.sortOrder,
      type,
      store_id,
      status
    } = query;

    let whereClause = {};

    // Add search condition
    whereClause = addSearchCondition(whereClause, ["name"], search);

    // Add filter conditions
    whereClause = addFilterCondition(whereClause, "type", type);
    whereClause = addFilterCondition(whereClause, "status", status);
    whereClause = addRelationFilter(whereClause, "store", "id", store_id);

    const [cafeMenus, total] = await this.cafeMenuRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        store: true,
        item_stocks: true,
        cafe_recipes: true
      },
      select: {
        id: true,
        name: true,
        image: true,
        selling_price: true,
        status: true,
        type: true,
        created_at: true,
        updated_at: true,
        store: {
          id: true,
          name: true
        },
        item_stocks: {
          id: true,
          quantity: true
        },
        cafe_recipes: {
          id: true,
          total_quantity: true,
          unit: {
            id: true,
            name: true
          }
        }
      },
    });

    return {
      data: cafeMenus,
      pagination: buildPagination(total, page, limit)
    };
  }

  async getCafeMenuById(id: number) {
    const cafeMenu = await this.cafeMenuRepository.findOne({
      where: { id },
      relations: {
        store: true,
        item_stocks: true,
        cafe_recipes: true
      }
    });

    if (!cafeMenu) {
      throw new Error("Cafe menu not found");
    }

    return cafeMenu;
  }

  async updateCafeMenu(id: number, cafeMenuData: z.infer<typeof updateCafeMenuValidator>) {
    const existingCafeMenu = await this.getCafeMenuById(id);

    const updatedCafeMenuData = {
      name: cafeMenuData.name,
      image: cafeMenuData.image,
      status: cafeMenuData.status,
      type: cafeMenuData.type,
      selling_price: cafeMenuData.selling_price,
      store: cafeMenuData.store_id ? await this.storeService.getStoreById(cafeMenuData.store_id) : existingCafeMenu.store,
    }

    // @ts-ignore
    await this.cafeMenuRepository.update(id, updatedCafeMenuData);
    return this.getCafeMenuById(id);
  }

  async deleteCafeMenu(id: number) {
    await this.cafeMenuRepository.softDelete(id);
    return { message: "Cafe menu deleted successfully" };
  }
} 