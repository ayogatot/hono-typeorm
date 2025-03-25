import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Store } from "../models/Store";

export class StoreService {
  private storeRepository = AppDataSource.getRepository(Store);

  async createStore(storeData: Partial<Store>) {
    const store = this.storeRepository.create(storeData);
    return this.storeRepository.save(store);
  }

  async getAllStores(query: any) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = "created_at", 
      sortOrder = "DESC",
      type,
      status 
    } = query;
    
    let whereClause: any = {};

    if (search) {
      whereClause = [
        { name: ILike(`%${search}%`) }
      ];
    }

    if (type || status) {
      if (Array.isArray(whereClause)) {
        // If we have search conditions, add filters to each condition
        whereClause = whereClause.map(condition => ({
          ...condition,
          ...(type && { type }),
          ...(status && { status })
        }));
      } else {
        // If no search conditions, just add filters directly
        if (type) whereClause.type = type;
        if (status) whereClause.status = status;
      }
    }

    const [stores, total] = await this.storeRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });
    
    return {
      data: stores,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getStoreById(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id }
    });

    if (!store) {
      throw new Error("Store not found");
    }

    return store;
  }
  
  async updateStore(id: number, storeData: Partial<Store>) {
    const store = await this.getStoreById(id);
    
    if (!store) {
      throw new Error("Store not found");
    }

    await this.storeRepository.update(id, storeData);
    return this.getStoreById(id);
  }

  async deleteStore(id: number) {
    await this.storeRepository.softDelete(id);
    return { message: "Store deleted successfully" };
  }
} 