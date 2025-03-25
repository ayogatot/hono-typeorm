import { Hono } from "hono";
import storeController from "../controllers/store-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const storeRouter = new Hono();

// Public routes
storeRouter.get("/", storeController.getAllStores);
storeRouter.get("/:id", storeController.getStoreById);

// Protected routes - only ADMIN and SUPER_ADMIN can manage stores
storeRouter.use("/*", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]));
storeRouter.post("/", storeController.createStore);
storeRouter.put("/:id", storeController.updateStore);
storeRouter.delete("/:id", storeController.deleteStore);

export default storeRouter; 