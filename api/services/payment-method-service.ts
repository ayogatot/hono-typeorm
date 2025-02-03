import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { PaymentMethod } from "../models/PaymentMethod";

export class PaymentMethodService {
  private paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);

  async createPaymentMethod(paymentMethodData: Partial<PaymentMethod>) {
    const paymentMethod = this.paymentMethodRepository.create(paymentMethodData);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async getAllPaymentMethods(query: any) {
    const { page = 1, limit = 10, search, sortBy = "created_at", sortOrder = "DESC" } = query;
    
    const whereClause = search 
      ? [
          { name: ILike(`%${search}%`) }
        ]
      : {};

    const [paymentMethods, total] = await this.paymentMethodRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });
    
    return {
      data: paymentMethods,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getPaymentMethodById(id: number) {
    return this.paymentMethodRepository.findOne({
      where: { id },
    });
  }
  
  async updatePaymentMethod(id: number, paymentMethodData: Partial<PaymentMethod>) {
    await this.paymentMethodRepository.update(id, paymentMethodData);
    return this.getPaymentMethodById(id);
  }

  async deletePaymentMethod(id: number) {
    await this.paymentMethodRepository.softDelete(id);
    return { message: "PaymentMethod deleted successfully" };
  }
}
