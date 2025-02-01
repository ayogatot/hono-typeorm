import { Repository } from "typeorm";
import { User } from "../models/User";
import { AppDataSource } from "../database/data-source";
import { registerValidator, loginValidator } from "../validators/user-validator";
import { z } from "zod";
import { JWT } from "../utils/jwt"; 

export class UserService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
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

    return this.userRepository.save(user);
  }

  async login(request: z.infer<typeof loginValidator>): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: request.email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const validPassword = await Bun.password.verify(request.password, user.password);
    if (!validPassword) {
      throw new Error("Invalid email or password");
    }

    const token = await JWT.sign({
      id: user.id,
      email: user.email,
      role: user.role
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

  async updateProfile(
    id: number,
    name: string,
    email: string
  ): Promise<User> {
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
} 