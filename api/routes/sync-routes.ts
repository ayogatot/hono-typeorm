import { Hono } from "hono";
import { SyncController } from "../controllers/sync-controller";

const syncRouter = new Hono();
const syncController = new SyncController();

syncRouter.post("/sync-data", (c) => syncController.sync(c));

export default syncRouter; 