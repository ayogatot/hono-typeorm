import { AppDataSource } from "../database/data-source";
import { Category } from "../models/Category";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  // Create Category
  async createCategory(categoryData: Partial<Category>) {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  // Get All Categories
  async getAllCategories() {
    return this.categoryRepository.find();
  }

  // Get Category by ID
  async getCategoryById(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ["items"], // Optional: if you want to load related items
    });
  }

  // Update Category
  async updateCategory(id: number, categoryData: Partial<Category>) {
    await this.categoryRepository.update(id, categoryData);
    return this.getCategoryById(id); // Return updated category
  }

  // Delete Category
  async deleteCategory(id: number) {
    await this.categoryRepository.delete(id);
    return { message: "Category deleted successfully" };
  }
}
