import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Discount } from "../models/Discount";
import { StoreService } from "./store-service";
import type { z } from "zod";
import type { createDiscountValidator, updateDiscountValidator } from "../validators/discount-validator";

export class DiscountService {
  private discountRepository = AppDataSource.getRepository(Discount);
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  async createDiscount(discountData: z.infer<typeof createDiscountValidator>) {
    const existingDiscount = await this.discountRepository.findOne({
      where: { 
        code: discountData.code,
        store: { id: discountData.store_id }
      }
    });

    if (existingDiscount) {
      throw new Error("Discount code already exists in this store");
    }

    if (discountData.discount_percentage && discountData.discount_percentage > 100) {
      throw new Error("Discount percentage cannot exceed 100%");
    }

    // Verify store exists
    const store = await this.storeService.getStoreById(discountData.store_id);
    
    const discount = this.discountRepository.create({
      ...discountData,
      store: store
    });
    return this.discountRepository.save(discount);
  }

  async getAllDiscounts(query: any) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = "created_at", 
      sortOrder = "DESC",
      store_id 
    } = query;
    
    let whereClause: any = {};

    if (search) {
      whereClause = [
        { name: ILike(`%${search}%`) },
        { code: ILike(`%${search}%`) }
      ];
    }

    if (store_id) {
      if (Array.isArray(whereClause)) {
        // If we have search conditions, add store to each condition
        whereClause = whereClause.map(condition => ({
          ...condition,
          store: { id: store_id }
        }));
      } else {
        // If no search conditions, just add store directly
        whereClause.store = { id: store_id };
      }
    }

    const [discounts, total] = await this.discountRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        store: true
      },
      select: {
        id: true,
        name: true,
        code: true,
        quota: true,
        discount_price: true,
        discount_percentage: true,
        created_at: true,
        store: {
          id: true,
          name: true
        }
      }
    });
    
    return {
      data: discounts,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getDiscountById(id: number) {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: {
        store: true
      }
    });

    if (!discount) {
      throw new Error("Discount not found");
    }

    return discount;
  }
  
  async updateDiscount(id: number, discountData: z.infer<typeof updateDiscountValidator>) {
    const existingDiscount = await this.getDiscountById(id);

    if (discountData.code) {
      const duplicateDiscount = await this.discountRepository.findOne({
        where: { 
          code: discountData.code,
          store: { 
            id: discountData.store_id || existingDiscount.store.id 
          }
        }
      });

      if (duplicateDiscount && duplicateDiscount.id !== id) {
        throw new Error("Discount code already exists in this store");
      }
    }

    if (discountData.discount_percentage && discountData.discount_percentage > 100) {
      throw new Error("Discount percentage cannot exceed 100%");
    }

    await this.discountRepository.update(id, discountData);
    return this.getDiscountById(id);
  }

  async deleteDiscount(id: number) {
    await this.discountRepository.softDelete(id);
    return { message: "Discount deleted successfully" };
  }
} 