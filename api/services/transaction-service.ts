import { ILike, In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Transaction } from "../models/Transaction";
import { TransactionItem } from "../models/TransactionItem";
import { ItemStock } from "../models/ItemStock";
import { Item } from "../models/Item";

export class TransactionService {
  private transactionRepository = AppDataSource.getRepository(Transaction);
  private transactionItemRepository = AppDataSource.getRepository(TransactionItem);
  private itemStockRepository = AppDataSource.getRepository(ItemStock);
  private itemRepository = AppDataSource.getRepository(Item);

  async createTransaction(transactionData: any, userId: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate total first
      let subtotal = 0;

      // Process each item to calculate subtotal
      for (const item of transactionData.items) {
        const existingItem = await this.itemRepository.findOne({
          where: { id: item.item },
        });

        if (!existingItem) {
          throw new Error("Item not found");
        }

        if (existingItem.total_quantity < item.quantity) {
          throw new Error("Item stock is not enough");
        }

        subtotal += item.quantity * existingItem.selling_price;
      }

      if (transactionData.term_deadline) {
        transactionData.term_deadline = new Date(transactionData.term_deadline);
      }

      // Create the transaction first
      const transaction = this.transactionRepository.create({
        ...transactionData,
        subtotal,
        total: subtotal, // Will be updated if discount exists
        cashier: userId,
        status: transactionData.term_count ? "NOT_PAID" : "PAID",
      }); // get the first item because the .create behavior is returning an array

      // Apply discount if exists
      // if (transactionData.discount) {
      //   const discountRepo = AppDataSource.getRepository("Discount");
      //   const discount = await discountRepo.findOne({
      //     where: { id: transactionData.discount }
      //   });
      //   if (discount) {
      //     transaction.total = subtotal - discount.discount_price;
      //   }
      // }

      // Save transaction
      const savedTransaction = await queryRunner.manager.save(
        Transaction,
        transaction
      );

      // Now process items and create transaction items
      for (const item of transactionData.items) {
        const existingItem = await this.itemRepository.findOne({
          where: { id: item.item },
        });

        if (!existingItem) {
          throw new Error("Item not found");
        }

        const itemStocks = await this.itemStockRepository.find({
          where: { item: { id: item.item } },
          order: { created_at: "ASC" },
        });

        let remainingQuantity = item.quantity;

        // Distribute quantity across available stocks
        for (const stock of itemStocks) {
          if (remainingQuantity <= 0) break;

          const quantityFromStock = Math.min(stock.quantity, remainingQuantity);
          remainingQuantity -= quantityFromStock;
          stock.quantity -= quantityFromStock;

          // Create transaction item
          const transactionItem = this.transactionItemRepository.create({
            // @ts-ignore
            transaction: savedTransaction,
            item_stock: stock,
            quantity: quantityFromStock,
            total_price: quantityFromStock * existingItem.selling_price,
          });

          // Save transaction item
          await queryRunner.manager.save(transactionItem);

          // Save updated stock
          await queryRunner.manager.save(stock);
        }

        // Update item total quantity
        existingItem.total_quantity -= item.quantity;
        await queryRunner.manager.save(existingItem);
      }

      await queryRunner.commitTransaction();

      return this.getTransactionById(
        savedTransaction.length > 0
          ? savedTransaction[0].id
            // @ts-ignore
          : savedTransaction.id
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllTransactions(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "created_at",
      sortOrder = "DESC",
      status,
      paymentMethodIds,
    } = query;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (paymentMethodIds && paymentMethodIds !== "" && paymentMethodIds.length > 0 && paymentMethodIds[0] !== "") {
      const paymentMethodIdsArray = paymentMethodIds[0].split(",");
      whereClause.payment_method = In(paymentMethodIdsArray);
    }

    if (search) {
      whereClause.transaction_items = {
        item_stock: {
          item: {
            name: ILike(`%${search}%`)
          }
        }
      };
    }

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        cashier: true,
        buyer: true,
        discount: true,
        payment_method: true,
        transaction_items: {
          item_stock: {
            item: true,
          },
        },
        term_payments: true,
      },
    });

    return {
      data: transactions,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        cashier: true,
        buyer: true,
        discount: true,
        payment_method: true,
        transaction_items: {
          item_stock: {
            item: true,
          },
        },
        term_payments: true,
      },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return transaction;
  }

  async updateTransaction(id: number, transactionData: Partial<Transaction>) {
    const transaction = await this.getTransactionById(id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    await this.transactionRepository.update(id, transactionData);
    return this.getTransactionById(id);
  }

  async deleteTransaction(id: number) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await this.getTransactionById(id);

      // Restore item stock quantities
      for (const transactionItem of transaction.transaction_items) {
        const itemStock = transactionItem.item_stock;
        itemStock.quantity += transactionItem.quantity;
        await queryRunner.manager.save(itemStock);

        // Update item total quantity
        const item = await this.itemRepository.findOne({
          where: { id: itemStock.item.id },
        });
        if (item) {
          item.total_quantity += transactionItem.quantity;
          await queryRunner.manager.save(item);
        }
      }

      await queryRunner.manager.softDelete(Transaction, id);
      await queryRunner.commitTransaction();

      return { message: "Transaction deleted successfully" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
