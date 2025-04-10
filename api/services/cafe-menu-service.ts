import { AppDataSource } from "../database/data-source";
import { CafeMenu } from "../models/CafeMenu";
import { CafeRecipe } from "../models/CafeRecipe";
import { Store } from "../models/Store";
import { CafeItem } from "../models/CafeItem";
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
  private storeRepository = AppDataSource.getRepository(Store);
  private cafeItemRepository = AppDataSource.getRepository(CafeItem);


  async createCafeMenu(cafeMenuData: z.infer<typeof createCafeMenuValidator>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify store exists
      const store = await this.storeRepository.findOne({ where: { id: cafeMenuData.store_id } });

      // Create cafe menu
      const newCafeMenuData = {
        ...cafeMenuData,
        store: store,
        status: cafeMenuData.status || "AVAILABLE",
        type: cafeMenuData.type || "DRINK"
      }

      // @ts-ignore
      const cafeMenu = queryRunner.manager.create(CafeMenu, newCafeMenuData);
      await queryRunner.manager.save(cafeMenu);

      // Create recipes
      for (const recipe of cafeMenuData.recipes) {
        const cafeItem = await this.cafeItemRepository.findOne({ where: { id: recipe.cafe_item_id } });
        
        // @ts-ignore
        const newRecipe = queryRunner.manager.create(CafeRecipe, {
          cafe_menu: cafeMenu,  
          cafe_item: cafeItem,
          used_quantity: recipe.used_quantity
        });
        
        await queryRunner.manager.save(newRecipe);
      }

      await queryRunner.commitTransaction();
      return this.getCafeMenuById(cafeMenu.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
        cafe_recipes: {
          cafe_item: {
            unit: true
          },
        },
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
        cafe_recipes: {
          id: true,
          used_quantity: true,
          cafe_item: {
            id: true,
            name: true,
            unit: {
              name: true
            }
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
        cafe_recipes: true
      }
    });

    if (!cafeMenu) {
      throw new Error("Cafe menu not found");
    }

    return cafeMenu;
  }

  async updateCafeMenu(id: number, cafeMenuData: z.infer<typeof updateCafeMenuValidator>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingCafeMenu = await queryRunner.manager.findOne(CafeMenu, {
        where: { id },
        relations: {
          store: true,
          cafe_recipes: true
        }
      });

      if (!existingCafeMenu) {
        throw new Error("Cafe menu not found");
      }

      // Update cafe menu data
      const updatedCafeMenuData: Partial<CafeMenu> = {
        name: cafeMenuData.name,
        image: cafeMenuData.image,
        status: cafeMenuData.status,
        type: cafeMenuData.type,
        selling_price: cafeMenuData.selling_price,
      }

      // Handle store update if provided
      if (cafeMenuData.store_id) {
        const store = await this.storeRepository.findOne({ where: { id: cafeMenuData.store_id } });
        if (!store) {
          throw new Error("Store not found");
        }
        updatedCafeMenuData.store = store;
      }

      await queryRunner.manager.update(CafeMenu, id, updatedCafeMenuData);

      // Handle recipe updates if provided
      if (cafeMenuData.recipes) {
        // Delete existing recipes
        await queryRunner.manager.delete(CafeRecipe, { cafe_menu: { id } });

        // Create new recipes
        for (const recipe of cafeMenuData.recipes) {
          const cafeItem = await this.cafeItemRepository.findOne({ 
            where: { id: recipe.cafe_item_id } 
          });
          
          if (!cafeItem) {
            throw new Error(`Cafe item with id ${recipe.cafe_item_id} not found`);
          }

          const newRecipe = queryRunner.manager.create(CafeRecipe, {
            cafe_menu: existingCafeMenu,
            cafe_item: cafeItem,
            used_quantity: recipe.used_quantity
          });
          
          await queryRunner.manager.save(newRecipe);
        }
      }

      await queryRunner.commitTransaction();
      return this.getCafeMenuById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCafeMenu(id: number) {
    await this.cafeMenuRepository.softDelete(id);
    return { message: "Cafe menu deleted successfully" };
  }
} 