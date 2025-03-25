import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Expense } from "../models/Expense";
import { StoreService } from "./store-service";
import type { z } from "zod";
import type { createExpenseValidator, updateExpenseValidator } from "../validators/expense-validator";

export class ExpenseService {
  private expenseRepository = AppDataSource.getRepository(Expense);
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  async createExpense(expenseData: z.infer<typeof createExpenseValidator>) {
    // Verify store exists
    const store = await this.storeService.getStoreById(expenseData.store_id);
    
    const expense = this.expenseRepository.create({
      ...expenseData,
      store: store
    });
    return this.expenseRepository.save(expense);
  }

  async getAllExpenses(query: any) {
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
        { note: ILike(`%${search}%`) }
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

    const [expenses, total] = await this.expenseRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        added_by: true,
        store: true
      },
      select: {
        id: true,
        price: true,
        note: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        added_by: {
          id: true,
          name: true,
          email: true,
        },
        store: {
          id: true,
          name: true
        }
      }
    });
    
    return {
      data: expenses,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getExpenseById(id: number) {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: {
        added_by: true,
        store: true
      }
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    return expense;
  }
  
  async updateExpense(id: number, expenseData: z.infer<typeof updateExpenseValidator>) {
    const existingExpense = await this.getExpenseById(id);

    if (!existingExpense) {
      throw new Error("Expense not found");
    }

    existingExpense.note = expenseData.note;  
    existingExpense.price = expenseData.price;
    existingExpense.store = await this.storeService.getStoreById(expenseData.store_id);

    await this.expenseRepository.save(existingExpense);
    return this.getExpenseById(id);
  }

  async deleteExpense(id: number) {
    await this.expenseRepository.softDelete(id);
    return { message: "Expense deleted successfully" };
  }
} 