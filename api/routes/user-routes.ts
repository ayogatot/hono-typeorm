import { Hono } from "hono";
import userController from "../controllers/user-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const userRoutes = new Hono();

// Public routes
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);

// Protected routes
userRoutes.use("/profile/*", authMiddleware);
userRoutes.get("/profile", userController.getProfile);
userRoutes.put("/profile", userController.updateProfile);
userRoutes.put("/profile/password", userController.updatePassword);

// Add this route before other routes
userRoutes.use("/", authMiddleware, requireRole(["ADMIN"]));
userRoutes.get("/", userController.getAllUsers);

export default userRoutes; 