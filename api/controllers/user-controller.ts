import type { Context } from "hono";
import { UserService } from "../services/user-service";
import { response } from "../utils/response";
import { registerValidator, loginValidator, updatePasswordValidator, updateProfileValidator } from "../validators/user-validator";

const userService = new UserService();

const userController = {
  register: async (c: Context) => {
    const data = await c.req.json();
    const validation = registerValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const user = await userService.register(data);
      return c.json(response.success(user, "User registered successfully", 201));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  login: async (c: Context) => {
    const data = await c.req.json();
    const validation = loginValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const result = await userService.login(data);
      return c.json(response.success(result, "Login successful", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getProfile: async (c: Context) => {
    const user = c.get('user');
    try {
      const profile = await userService.findById(user.id);
      return c.json(response.success(profile, "Profile fetched successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updateProfile: async (c: Context) => {
    const user = c.get('user');
    const data = await c.req.json();
    const validation = updateProfileValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedUser = await userService.updateProfile(
        user.id,
        data.name,
        data.email
      );
      return c.json(response.success(updatedUser, "Profile updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  updatePassword: async (c: Context) => {
    const user = c.get('user');
    const data = await c.req.json();
    const validation = updatePasswordValidator.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    try {
      const updatedUser = await userService.updatePassword(
        user.id,
        data.old_password,
        data.new_password
      );
      return c.json(response.success(updatedUser, "Password updated successfully", 200));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getAllUsers: async (c: Context) => {
    try {
      const query = c.req.queries();

      const users = await userService.getAllUsers(query);
      return c.json(response.successPagination(users.data, "Users fetched successfully", 200, users.pagination));
    } catch (error: any) {
      throw error;
    }
  }
};

export default userController; 