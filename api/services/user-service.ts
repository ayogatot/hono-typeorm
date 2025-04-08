import { Repository } from "typeorm";
import { User } from "../models/User";
import { AppDataSource } from "../database/data-source";
import {
  registerValidator,
  loginValidator,
} from "../validators/user-validator";
import { z } from "zod";
import { JWT } from "../utils/jwt";
import { ILike } from "typeorm";
import { StoreService } from "./store-service";

export class UserService {
  private readonly userRepository: Repository<User>;
  private readonly storeService: StoreService;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.storeService = new StoreService();
  }

  async register(request: z.infer<typeof registerValidator>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: request.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash the password using Bun.password
    const hashedPassword = await Bun.password.hash(request.password);

    const user = new User();
    user.name = request.name;
    user.email = request.email;
    user.password = hashedPassword;
    user.role = request.role;
    user.store = await this.storeService.getStoreById(request.store_id);

    return this.userRepository.save(user);
  }

  async login(
    request: z.infer<typeof loginValidator>
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: request.email },
      relations: {
        store: true,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const validPassword = await Bun.password.verify(
      request.password,
      user.password
    );
    if (!validPassword) {
      throw new Error("Invalid email or password");
    }

    const token = await JWT.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      store_id: user.store?.id || null,
      store: user.store,
    });

    return { user, token };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateProfile(id: number, name: string, email: string): Promise<User> {
    const user = await this.findById(id);

    // Check if new email is already taken by another user
    if (email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new Error("Email already taken");
      }
    }

    user.name = name;
    user.email = email;

    await this.userRepository.update(id, user);
    return this.findById(id);
  }

  async updateUser(id: number, data: any): Promise<User> {
    const user = await this.findById(id);
    if (data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new Error("Email already taken");
      }
    }
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<User> {
    const user = await this.findById(id);

    const validPassword = await Bun.password.verify(oldPassword, user.password);
    if (!validPassword) {
      throw new Error("Invalid current password");
    }

    const hashedPassword = await Bun.password.hash(newPassword);
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async getAllUsers(query: any) {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = query;

    const whereClause: any = {};

    if (search) {
      whereClause.name = ILike(`%${search}%`);
    }

    if (role) {
      whereClause.role = role;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: whereClause,
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        store: {
          id: true,
          name: true,
        },
        created_at: true,
      },
      relations: {
        store: true,
      },
    });

    return {
      data: users,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    };
  }

  async adminUpdatePassword(userId: number, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await Bun.password.hash(newPassword);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: "Password updated successfully" };
  }
}
