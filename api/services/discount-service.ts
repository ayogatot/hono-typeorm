import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Discount } from "../models/Discount";

export class DiscountService {
  private discountRepository = AppDataSource.getRepository(Discount);

  async createDiscount(discountData: Partial<Discount>) {
    const existingDiscount = await this.discountRepository.findOne({
      where: { code: discountData.code }
    });

    if (existingDiscount) {
      throw new Error("Discount code already exists");
    }

    const discount = this.discountRepository.create(discountData);
    return this.discountRepository.save(discount);
  }

  async getAllDiscounts(query: any) {
    const { page = 1, limit = 10, search, sortBy = "created_at", sortOrder = "DESC" } = query;
    
    const whereClause = search 
      ? [
          { name: ILike(`%${search}%`) },
          { code: ILike(`%${search}%`) }
        ]
      : {};

    const [discounts, total] = await this.discountRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
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
    });

    if (!discount) {
      throw new Error("Discount not found");
    }

    return discount;
  }
  
  async updateDiscount(id: number, discountData: Partial<Discount>) {
    if (discountData.code) {
      const existingDiscount = await this.discountRepository.findOne({
        where: { code: discountData.code }
      });

      if (existingDiscount && existingDiscount.id !== id) {
        throw new Error("Discount code already exists");
      }
    }

    await this.discountRepository.update(id, discountData);
    return this.getDiscountById(id);
  }

  async deleteDiscount(id: number) {
    await this.discountRepository.softDelete(id);
    return { message: "Discount deleted successfully" };
  }
} 