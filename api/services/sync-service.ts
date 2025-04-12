import { AppDataSource } from "../database/data-source";
import { Category } from "../models/Category";
import { Item } from "../models/Item";
import { Unit } from "../models/Unit";
import { PaymentMethod } from "../models/PaymentMethod";

import categories from "../datasource/categories.json";
import units from "../datasource/units.json";
import items from "../datasource/items.json";
import paymentMethods from "../datasource/payment-method.json";
import { Store } from "../models/Store";
import { User } from "../models/User";
export class SyncService {
  private categoryRepository = AppDataSource.getRepository(Category);
  private unitRepository = AppDataSource.getRepository(Unit);
  private itemRepository = AppDataSource.getRepository(Item);
  private paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);
  private storeRepository = AppDataSource.getRepository(Store);
  private userRepository = AppDataSource.getRepository(User);

  private generateCleanPrice(): number {
    const pricePoints = [500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
    const basePrice = pricePoints[Math.floor(Math.random() * pricePoints.length)];
    const additionalAmount = Math.floor(Math.random() * 4) * 250;
    return basePrice + additionalAmount;
  }

  async sync() {
    const newUser = new User();
    newUser.name = "Super Admin";
    newUser.email = "superadmin@gmail.com";
    newUser.password = await Bun.password.hash("superadmin");
    newUser.role = "SUPER_ADMIN";

    await this.categoryRepository.insert(categories);
    await this.unitRepository.insert(units);
    await this.paymentMethodRepository.insert(paymentMethods);
    await this.storeRepository.insert({
      name: "Toko Berkah Jaya",
      address: "Jl. Raya No. 123",
      phone_number: "081234567890",
      email: "tokoberkahjaya@gmail.com"
    });
    await this.userRepository.insert(newUser);


    const mappedItems = items.map((item) => ({
      category: { id: item.category_id },
      unit: { id: item.unit_id },
      name: item.name,
      total_quantity: 0,
      selling_price: this.generateCleanPrice(),
      status: "ACTIVE",
      store: { id: 1 }
    }));

    await this.itemRepository.insert(mappedItems);
  }
}
