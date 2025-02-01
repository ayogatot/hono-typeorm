import { AppDataSource } from "../database/data-source";
import { Category } from "../models/Category";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async createCategory(categoryData: Partial<Category>) {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async getAllCategories() {
    return this.categoryRepository.find();
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
    await this.categoryRepository.delete(id);
    return { message: "Category deleted successfully" };
  }
}
