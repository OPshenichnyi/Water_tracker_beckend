import express from "express";
import { authenticate, isValidId } from "../middlewares/index.js";
import * as waterSchemas from "../models/Water.js";
import { validateBody } from "../decorators/index.js";
import waterControler from "../controllers/water-controler.js";

const waterRouter = express.Router();
const addWaterSchema = validateBody(waterSchemas.addWaterVolumeSchema);
const updateWaterVolumeSchema = validateBody(
  waterSchemas.updateWaterVolumeSchema
);
const getWaterVolumeSchema = validateBody(
  waterSchemas.getWaterVolumeMonthSchema
);

waterRouter.use(authenticate);

waterRouter.post("/water", addWaterSchema, waterControler.addWaterVolume);

waterRouter.patch("/water/:waterId/water-volume", isValidId, updateWaterVolumeSchema, waterControler.updateWaterVolume);

waterRouter.delete("/water/:waterId", isValidId, waterControler.deleteWaterVolume);

waterRouter.get("/month/:date", waterControler.getWaterVolume);

waterRouter.get("/today", waterControler.dailyWaterConsumption);

export default waterRouter;
