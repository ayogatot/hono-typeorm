import type { Context } from "hono";
import { DriveService } from "../utils/drive";
import { response } from "../utils/response";

const driveService = new DriveService();

const imageController = {
  uploadImage: async (c: Context) => {
    try {
      const file = await c.req.parseBody();
      const fileData = file["image"] as File;

      if (!fileData) {
        throw new Error("No file uploaded");
      }

      // Validate file type
      if (!fileData.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const result = await driveService.uploadFile(fileData);
      return c.json(
        response.success(result, "Image uploaded successfully", 201)
      );
    } catch (error: any) {
      throw error;
    }
  },
};

export default imageController;
