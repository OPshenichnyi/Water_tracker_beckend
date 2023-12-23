import express from "express";
import { authenticate, isValidId } from "../middlewares/index.js";
import * as waterSchemas from "../models/Water.js";
import * as userSchemas from "../models/User.js";
import { validateBody } from "../decorators/index.js";
import waterControler from "../controllers/water-controler.js";

const waterRouter = express.Router();
const waterRateSchema = validateBody(userSchemas.waterRateSchema);
const addWaterSchema = validateBody(waterSchemas.addWaterVolumeSchema);
const updateWaterVolumeSchema = validateBody(
  waterSchemas.updateWaterVolumeSchema
);

waterRouter.use(authenticate);

waterRouter.patch("/water-rate", waterRateSchema, waterControler.waterRate);

waterRouter.post("/water", addWaterSchema, waterControler.addWaterVolume);

waterRouter.patch(
  "/water/:waterId/water-volume",
  isValidId,
  updateWaterVolumeSchema,
  waterControler.updateWaterVolume
);

waterRouter.delete(
  "/water/:waterId",
  isValidId,
  waterControler.deleteWaterVolume
);


waterRouter.get( "/today",  waterControler.dailyWaterConsumption)

export default waterRouter;
