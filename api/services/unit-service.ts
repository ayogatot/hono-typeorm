import { AppDataSource } from "../database/data-source";
import { Unit } from "../models/Unit";

export class UnitService {
  private unitRepository = AppDataSource.getRepository(Unit);

  async createUnit(unitData: Partial<Unit>) {
    const unit = this.unitRepository.create(unitData);
    return this.unitRepository.save(unit);
  }

  async getAllUnits() {
    return this.unitRepository.find();
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
    await this.unitRepository.delete(id);
    return { message: "Unit deleted successfully" };
  }
} 