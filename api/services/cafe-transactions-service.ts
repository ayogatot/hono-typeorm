import { AppDataSource } from "../database/data-source";
import { CafeTransactions } from "../models/CafeTransactions";
import { CafeTransactionsMenus } from "../models/CafeTransactionsMenu";
import { CafeMenu } from "../models/CafeMenu";
import { CafeRecipe } from "../models/CafeRecipe";
import { User } from "../models/User";
import { Discount } from "../models/Discount";
import { PaymentMethod } from "../models/PaymentMethod";
import { CafeItemStock } from "../models/CafeItemStock";

import { Store } from "../models/Store";
import type { z } from "zod";
import type { createCafeTransactionValidator, updateCafeTransactionValidator } from "../validators/cafe-transactions-validator";
import { 
  defaultPaginationOptions, 
  buildPagination, 
  addSearchCondition, 
  addFilterCondition, 
  addRelationFilter 
} from "../utils/query-utils";
import type { DeepPartial } from "typeorm";
export class CafeTransactionsService {
  private cafeTransactionsRepository = AppDataSource.getRepository(CafeTransactions);
  private cafeTransactionsMenusRepository = AppDataSource.getRepository(CafeTransactionsMenus);
  private cafeMenuRepository = AppDataSource.getRepository(CafeMenu);
  private cafeRecipeRepository = AppDataSource.getRepository(CafeRecipe);
  private cafeItemStockRepository = AppDataSource.getRepository(CafeItemStock);
  private userRepository = AppDataSource.getRepository(User);
  private discountRepository = AppDataSource.getRepository(Discount);
  private paymentMethodRepository = AppDataSource.getRepository(PaymentMethod);
  private storeRepository = AppDataSource.getRepository(Store);

  async createCafeTransaction(transactionData: z.infer<typeof createCafeTransactionValidator>, cashierId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify related entities exist
      const buyer = transactionData.buyer_id ? await this.userRepository.findOne({ where: { id: transactionData.buyer_id } }) : undefined;
      const store = await this.storeRepository.findOne({ where: { id: transactionData.store_id } });
      const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: transactionData.payment_method_id } });
      
      if (!store || !paymentMethod) {
        throw new Error("One or more related entities not found");
      }

      // Calculate subtotal and total from menu items
      let subtotal = 0;
      for (const menu of transactionData.menus) {
        const cafeMenu = await this.cafeMenuRepository.findOne({ 
          where: { id: menu.cafe_menu_id }
        });

        if (!cafeMenu) {
          throw new Error(`Cafe menu with id ${menu.cafe_menu_id} not found`);
        }

        subtotal += cafeMenu.selling_price * menu.quantity;
      }

      let discount = undefined;
      let discountValue = 0;
      if (transactionData.discount_id) {
        discount = await this.discountRepository.findOne({ where: { id: transactionData.discount_id } });
        if (!discount) {
          throw new Error("Discount not found");
        }
        if(discount.discount_price) {
          discountValue = discount.discount_price;
        } else {
          discountValue = discount.discount_percentage * subtotal / 100;
        }
      }

      // Calculate total with discount
      const total = subtotal - (subtotal * (discountValue / 100));

      // Create transaction
      const newTransactionData = {
        ...transactionData,
        buyer,
        cashier: { id: cashierId },
        discount,
        payment_method: paymentMethod,
        store,
        subtotal,
        total
      }

      const transaction = queryRunner.manager.create(CafeTransactions, newTransactionData as DeepPartial<CafeTransactions>);
      await queryRunner.manager.save(transaction);

      // Create transaction menus and update quantities
      for (const menu of transactionData.menus) {
        const cafeMenu = await this.cafeMenuRepository.findOne({ 
          where: { id: menu.cafe_menu_id },
          relations: { cafe_recipes: { cafe_item: true } }
        });

        if (!cafeMenu) {
          throw new Error(`Cafe menu with id ${menu.cafe_menu_id} not found`);
        }

        // Create transaction menu
        const transactionMenu = queryRunner.manager.create(CafeTransactionsMenus, {
          cafe_transaction: transaction,
          cafe_menu: cafeMenu,
          quantity: menu.quantity,
          total_price: cafeMenu.selling_price * menu.quantity
        });
        await queryRunner.manager.save(transactionMenu);

        // Update quantities for each recipe item
        for (const recipe of cafeMenu.cafe_recipes) {
          const totalUsedQuantity = recipe.used_quantity * menu.quantity;
          recipe.cafe_item.total_quantity = (recipe.cafe_item.total_quantity || 0) - totalUsedQuantity;

          const cafeItemStocks = await this.cafeItemStockRepository.find({
            where: { cafe_items: { id: recipe.cafe_item.id } },
            order: { created_at: "ASC" },
          });

          let remainingQuantity = totalUsedQuantity;
          for (const stock of cafeItemStocks) {
            if (remainingQuantity <= 0) break;
            if (stock.quantity > remainingQuantity) {
              stock.quantity -= remainingQuantity;
              remainingQuantity = 0;
            } else {
              remainingQuantity -= stock.quantity;
              stock.quantity = 0;
            }
          }

          await queryRunner.manager.save(cafeItemStocks);

          await queryRunner.manager.save(recipe.cafe_item);
        }
      }

      await queryRunner.commitTransaction();
      return this.getCafeTransactionById(transaction.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllCafeTransactions(query: any) {
    const {
      page = defaultPaginationOptions.page,
      limit = defaultPaginationOptions.limit,
      search,
      sortBy = defaultPaginationOptions.sortBy,
      sortOrder = defaultPaginationOptions.sortOrder,
      store_id,
      status
    } = query;

    let whereClause = {};

    // Add search condition
    whereClause = addSearchCondition(whereClause, ["name", "phone_number"], search);

    // Add filter conditions
    whereClause = addFilterCondition(whereClause, "status", status);
    whereClause = addRelationFilter(whereClause, "store", "id", store_id);

    const [transactions, total] = await this.cafeTransactionsRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        buyer: true,
        cashier: true,
        discount: true,
        payment_method: true,
        store: true,
        cafe_transactions_menus: {
          cafe_menu: true
        }
      },
    });

    return {
      data: transactions,
      pagination: buildPagination(total, page, limit)
    };
  }

  async getCafeTransactionById(id: number) {
    const transaction = await this.cafeTransactionsRepository.findOne({
      where: { id },
      relations: {
        buyer: true,
        cashier: true,
        discount: true,
        payment_method: true,
        store: true,
        cafe_transactions_menus: {
          cafe_menu: true
        }
      }
    });

    if (!transaction) {
      throw new Error("Cafe transaction not found");
    }

    return transaction;
  }

  async updateCafeTransaction(id: number, transactionData: z.infer<typeof updateCafeTransactionValidator>) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingTransaction = await queryRunner.manager.findOne(CafeTransactions, {
        where: { id },
        relations: {
          buyer: true,
          cashier: true,
          discount: true,
          payment_method: true,
          store: true,
          cafe_transactions_menus: {
            cafe_menu: {
              cafe_recipes: {
                cafe_item: true
              }
            }
          }
        }
      });

      if (!existingTransaction) {
        throw new Error("Cafe transaction not found");
      }

      // Update transaction data
      const updatedTransactionData: Partial<CafeTransactions> = {
        image: transactionData.image,
        name: transactionData.name,
        address: transactionData.address,
        phone_number: transactionData.phone_number,
        term_count: transactionData.term_count,
        term_deadline: transactionData.term_deadline ? new Date(transactionData.term_deadline) : undefined,
        status: transactionData.status,
        notes: transactionData.notes
      }

      // Handle related entities updates
      if (transactionData.buyer_id) {
        const buyer = await this.userRepository.findOne({ where: { id: transactionData.buyer_id } });
        if (!buyer) throw new Error("Buyer not found");
        updatedTransactionData.buyer = buyer;
      }

      if (transactionData.cashier_id) {
        const cashier = await this.userRepository.findOne({ where: { id: transactionData.cashier_id } });
        if (!cashier) throw new Error("Cashier not found");
        updatedTransactionData.cashier = cashier;
      }

      let discount = existingTransaction.discount;
      let discountValue = 0;
      if (transactionData.discount_id) {
        // @ts-ignore
        discount = await this.discountRepository.findOne({ where: { id: transactionData.discount_id } });
        if (!discount) throw new Error("Discount not found");
        if(discount.discount_price) {
          discountValue = discount.discount_price;
        } else {
          discountValue = discount.discount_percentage * existingTransaction.subtotal / 100;
        }
        updatedTransactionData.discount = discount;
      }

      if (transactionData.payment_method_id) {
        const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: transactionData.payment_method_id } });
        if (!paymentMethod) throw new Error("Payment method not found");
        updatedTransactionData.payment_method = paymentMethod;
      }

      if (transactionData.store_id) {
        const store = await this.storeRepository.findOne({ where: { id: transactionData.store_id } });
        if (!store) throw new Error("Store not found");
        updatedTransactionData.store = store;
      }

      // Handle menu updates if provided
      if (transactionData.menus) {
        // Delete existing transaction menus
        await queryRunner.manager.delete(CafeTransactionsMenus, { cafe_transaction: { id } });

        // Calculate new subtotal and total
        let subtotal = 0;
        for (const menu of transactionData.menus) {
          const cafeMenu = await this.cafeMenuRepository.findOne({ 
            where: { id: menu.cafe_menu_id }
          });

          if (!cafeMenu) {
            throw new Error(`Cafe menu with id ${menu.cafe_menu_id} not found`);
          }

          subtotal += cafeMenu.selling_price * menu.quantity;
        }

        const total = subtotal - (subtotal * (discountValue / 100));
        updatedTransactionData.subtotal = subtotal;
        updatedTransactionData.total = total;

        // Create new transaction menus and update quantities
        for (const menu of transactionData.menus) {
          const cafeMenu = await this.cafeMenuRepository.findOne({ 
            where: { id: menu.cafe_menu_id },
            relations: { cafe_recipes: { cafe_item: true } }
          });

          if (!cafeMenu) {
            throw new Error(`Cafe menu with id ${menu.cafe_menu_id} not found`);
          }

          // Create transaction menu
          const transactionMenu = queryRunner.manager.create(CafeTransactionsMenus, {
            cafe_transaction: existingTransaction,
            cafe_menu: cafeMenu,
            quantity: menu.quantity,
            total_price: cafeMenu.selling_price * menu.quantity
          });
          await queryRunner.manager.save(transactionMenu);

          // Update quantities for each recipe item
          for (const recipe of cafeMenu.cafe_recipes) {
            const totalUsedQuantity = recipe.used_quantity * menu.quantity;
            recipe.cafe_item.total_quantity = (recipe.cafe_item.total_quantity || 0) - totalUsedQuantity;
            await queryRunner.manager.save(recipe.cafe_item);
          }
        }
      }

      await queryRunner.manager.update(CafeTransactions, id, updatedTransactionData);
      await queryRunner.commitTransaction();
      return this.getCafeTransactionById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCafeTransaction(id: number) {
    await this.cafeTransactionsRepository.softDelete(id);
    return { message: "Cafe transaction deleted successfully" };
  }
} 