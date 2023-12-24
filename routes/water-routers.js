import express from "express";
import { authenticate, isValidId } from "../middlewares/index.js";
import * as waterSchemas from "../models/Water.js";
import * as userSchemas from "../models/User.js";
import { validateBody } from "../decorators/index.js";
import waterControler from "../controllers/water-controler.js";
import authControler from "../controllers/auth-controler.js";

const waterRouter = express.Router();
const waterRateSchema = validateBody(userSchemas.waterRateSchema);
const addWaterSchema = validateBody(waterSchemas.addWaterVolumeSchema);
const updateWaterVolumeSchema = validateBody(
  waterSchemas.updateWaterVolumeSchema
);
const getWaterVolumeSchema = validateBody(
  waterSchemas.getWaterVolumeMonthSchema
);

waterRouter.use(authenticate);

waterRouter.patch("/water-rate", waterRateSchema, authControler.waterRate);

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


waterRouter.get("/month", getWaterVolumeSchema, waterControler.getWaterVolume);
waterRouter.get("/today", waterControler.dailyWaterConsumption);


export default waterRouter;
