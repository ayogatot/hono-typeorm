import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Bank } from "../models/Bank";
import { StoreService } from "./store-service";
import type { z } from "zod";
import type { createBankValidator, updateBankValidator } from "../validators/bank-validator";

export class BankService {
  private bankRepository = AppDataSource.getRepository(Bank);
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  async createBank(bankData: z.infer<typeof createBankValidator>) {
    const bank = this.bankRepository.create({
      ...bankData,
    });
    return this.bankRepository.save(bank);
  }

  async getAllBanks(query: any) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = "created_at", 
      sortOrder = "DESC",
    } = query;
    
    let whereClause: any = {};

    if (search) {
      whereClause = [
        { name: ILike(`%${search}%`) },
        { account_name: ILike(`%${search}%`) },
        { account_number: ILike(`%${search}%`) },
      ];
    } 

    const [banks, total] = await this.bankRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return {
      data: banks,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getBankById(id: number) {
    const bank = await this.bankRepository.findOne({
      where: { id },
    });

    if (!bank) {
      throw new Error("Bank not found");
    }

    return bank;
  }
  
  async updateBank(id: number, bankData: z.infer<typeof updateBankValidator>) {
    const existingBank = await this.getBankById(id);

    if (!existingBank) {
        throw new Error("Bank not found");
    }

    existingBank.name = bankData.name;  
    existingBank.account_name = bankData.account_name;
    existingBank.account_number = bankData.account_number;

    await this.bankRepository.save(existingBank);
    return this.getBankById(id);
  }

  async deleteBank(id: number) {
    await this.bankRepository.softDelete(id);
    return { message: "Bank deleted successfully" };
  }
} 