import { AppDataSource } from "../database/data-source";
import { CafeItem } from "../models/CafeItem";
import { CafeMenuService } from "./cafe-menu-service";
import { UnitService } from "./unit-service";
import type { z } from "zod";
import type { createCafeItemValidator, updateCafeItemValidator } from "../validators/cafe-items-validator";
import { 
  defaultPaginationOptions, 
  buildPagination, 
  addSearchCondition, 
  addRelationFilter 
} from "../utils/query-utils";

export class CafeItemService {
  private cafeRecipesRepository = AppDataSource.getRepository(CafeItem);
  private cafeMenuService: CafeMenuService;
  private unitService: UnitService;

  constructor() {
    this.cafeMenuService = new CafeMenuService();
    this.unitService = new UnitService();
  }

  async createCafeItem(cafeRecipesData: z.infer<typeof createCafeItemValidator>) {
    // Verify related entities exist
    const cafeMenu = await this.cafeMenuService.getCafeMenuById(cafeRecipesData.cafe_menu_id);
    const unit = await this.unitService.getUnitById(cafeRecipesData.unit_id);

    const newCafeItemData = {
      ...cafeRecipesData,
      cafe_menu: cafeMenu,
      unit: unit
    }

    // @ts-ignore
    const cafeRecipes = this.cafeRecipesRepository.create(newCafeItemData);
    await this.cafeRecipesRepository.save(cafeRecipes);
    return newCafeItemData;
  }

  async getAllCafeItem(query: any) {
    const {
      page = defaultPaginationOptions.page,
      limit = defaultPaginationOptions.limit,
      search,
      sortBy = defaultPaginationOptions.sortBy,
      sortOrder = defaultPaginationOptions.sortOrder,
      cafe_menu_id,
      unit_id
    } = query;

    let whereClause = {};

    // Add search condition
    whereClause = addSearchCondition(whereClause, ["name", "code"], search);

    // Add filter conditions
    whereClause = addRelationFilter(whereClause, "cafe_menu", "id", cafe_menu_id);
    whereClause = addRelationFilter(whereClause, "unit", "id", unit_id);

    const [cafeRecipes, total] = await this.cafeRecipesRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        unit: true,
        cafe_item_stocks: true
      },
      select: {
        id: true,
        code: true,
        name: true,
        total_quantity: true,
        created_at: true,
        updated_at: true,
        unit: {
          id: true,
          name: true
        },
      },
    });

    return {
      data: cafeRecipes,
      pagination: buildPagination(total, page, limit)
    };
  }

  async getCafeItemById(id: number) {
    const cafeRecipes = await this.cafeRecipesRepository.findOne({
      where: { id },
      relations: {
        unit: true,
      }
    });

    if (!cafeRecipes) {
      throw new Error("Cafe recipes not found");
    }

    return cafeRecipes;
  }

  async updateCafeItem(id: number, cafeRecipesData: z.infer<typeof updateCafeItemValidator>) {
    const existingCafeItem = await this.getCafeItemById(id);

    const updatedCafeItemData = {
      code: cafeRecipesData.code,
      name: cafeRecipesData.name,
      total_quantity: cafeRecipesData.total_quantity,
      unit: cafeRecipesData.unit_id ? await this.unitService.getUnitById(cafeRecipesData.unit_id) : existingCafeItem.unit
    }

    // @ts-ignore
    await this.cafeRecipesRepository.update(id, updatedCafeItemData);
    return this.getCafeItemById(id);
  }

  async deleteCafeItem(id: number) {
    await this.cafeRecipesRepository.softDelete(id);
    return { message: "Cafe recipes deleted successfully" };
  }
} 