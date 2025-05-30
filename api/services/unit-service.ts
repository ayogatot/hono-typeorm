import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Unit } from "../models/Unit";

export class UnitService {
  private unitRepository = AppDataSource.getRepository(Unit);

  async createUnit(unitData: Partial<Unit>) {
    const unit = this.unitRepository.create(unitData);
    return this.unitRepository.save(unit);
  }

  async getAllUnits(query: any) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = "created_at", 
      sortOrder = "DESC",
      type 
    } = query;
    
    let whereClause: any = {};

    if (search) {
      whereClause = [
        { name: ILike(`%${search}%`) }
      ];
    }

    if (type) {
      if (Array.isArray(whereClause)) {
        // If we have search conditions, add type to each condition
        whereClause = whereClause.map(condition => ({
          ...condition,
          type
        }));
      } else {
        // If no search conditions, just add type directly
        whereClause.type = type;
      }
    }

    const [units, total] = await this.unitRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit
    });
    
    return {
      data: units,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getUnitById(id: number) {
    return this.unitRepository.findOne({
      where: { id },
      relations: ["items"],
    });
  }
  
  async updateUnit(id: number, unitData: Partial<Unit>) {
    await this.unitRepository.update(id, unitData);
    return this.getUnitById(id);
  }

  async deleteUnit(id: number) {
    await this.unitRepository.softDelete(id);
    return { message: "Unit deleted successfully" };
  }
} 