import { Hono } from "hono";
import imageController from "../controllers/image-controller";
import { authMiddleware, requireRole } from "../middlewares/auth-middleware";

const imageRoutes = new Hono();

// Only authenticated users can upload images
imageRoutes.use("/*", authMiddleware);
imageRoutes.post("/", imageController.uploadImage);

export default imageRoutes; 