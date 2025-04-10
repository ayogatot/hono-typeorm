import { Hono } from "hono";
import cafeRecipesController from "../controllers/cafe-item-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const cafeRecipesRoutes = new Hono();

// Public routes
cafeRecipesRoutes.get("/", cafeRecipesController.getAllCafeRecipes);
cafeRecipesRoutes.get("/:id", cafeRecipesController.getCafeRecipesById);

// Protected routes - only ADMIN and CASHIER can manage cafe recipes
cafeRecipesRoutes.use("/*", authMiddleware, requireRole(["ADMIN", "CASHIER", "SUPER_ADMIN"]));
cafeRecipesRoutes.post("/", cafeRecipesController.createCafeRecipes);
cafeRecipesRoutes.put("/:id", cafeRecipesController.updateCafeRecipes);
cafeRecipesRoutes.delete("/:id", cafeRecipesController.deleteCafeRecipes);

export default cafeRecipesRoutes; 