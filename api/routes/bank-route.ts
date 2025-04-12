import { Hono } from "hono";
import bankController from "../controllers/bank-controller";

const bankRoutes = new Hono();

// All bank routes require authentication and ADMIN role
bankRoutes.get("/", bankController.getAllBanks);
bankRoutes.get("/:id", bankController.getBankById);
bankRoutes.post("/", bankController.createBank);
bankRoutes.put("/:id", bankController.updateBank);
bankRoutes.delete("/:id", bankController.deleteBank);

export default bankRoutes; 