import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Expense } from "../models/Expense";

export class ExpenseService {
  private expenseRepository = AppDataSource.getRepository(Expense);

  async createExpense(expenseData: Partial<Expense>) {
    const expense = this.expenseRepository.create(expenseData);
    return this.expenseRepository.save(expense);
  }

  async getAllExpenses(query: any) {
    const { page = 1, limit = 10, search, sortBy = "created_at", sortOrder = "DESC" } = query;
    
    const whereClause = search 
      ? [
          { note: ILike(`%${search}%`) }
        ]
      : {};

    const [expenses, total] = await this.expenseRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        added_by: true
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
      relations: ["added_by"],
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    return expense;
  }
  
  async updateExpense(id: number, expenseData: Partial<Expense>) {
    await this.expenseRepository.update(id, expenseData);
    return this.getExpenseById(id);
  }

  async deleteExpense(id: number) {
    await this.expenseRepository.softDelete(id);
    return { message: "Expense deleted successfully" };
  }
} 