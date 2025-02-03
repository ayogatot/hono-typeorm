import { ILike } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Category } from "../models/Category";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(categoryData: Partial<Category>) {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async getAllCategories(query: any) {
    const { page = 1, limit = 10, search, sortBy = "created_at", sortOrder = "DESC" } = query;
    
    const whereClause = search 
      ? [
          { name: ILike(`%${search}%`) }
        ]
      : {};

    const [categories, total] = await this.categoryRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return {
      data: categories,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      }
    };
  }

  async getCategoryById(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ["items"],
    });
  }
  
  async updateCategory(id: number, categoryData: Partial<Category>) {
    await this.categoryRepository.update(id, categoryData);
    return this.getCategoryById(id);
  }

  async deleteCategory(id: number) {
    await this.categoryRepository.softDelete(id);
    return { message: "Category deleted successfully" };
  }
}
