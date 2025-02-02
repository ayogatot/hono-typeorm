import { AppDataSource } from "../database/data-source";
import { PaymentMethod } from "../models/PaymentMethod";

export class PaymentMethodService {
  private paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);

  async createPaymentMethod(paymentMethodData: Partial<PaymentMethod>) {
    const paymentMethod = this.paymentMethodRepository.create(paymentMethodData);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async getAllPaymentMethods() {
    return this.paymentMethodRepository.find();
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
