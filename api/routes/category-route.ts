import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { categoryValidator } from "../validators/category-validator";
import categoryController from "../controllers/category-controller";

const categoryRoute = new Hono();

categoryRoute.get("/", categoryController.getAllCategories);
categoryRoute.post(
  "/",
  zValidator("json", categoryValidator),
  categoryController.createCategory
);
categoryRoute.get("/:id", categoryController.getCategoryById);
categoryRoute.put(
  "/:id",
  zValidator("json", categoryValidator),
  categoryController.updateCategory
);
categoryRoute.delete("/:id", categoryController.deleteCategory);

export default categoryRoute;
