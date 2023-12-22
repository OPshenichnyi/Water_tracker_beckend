import express from "express";
import { authenticate, isEmptyBody } from "../middlewares/index.js";
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

waterRouter.patch(
  "/water-rate",
  authenticate,
  isEmptyBody,
  waterRateSchema,
  waterControler.waterRate
);

waterRouter.post(
  "/water",
  authenticate,
  isEmptyBody,
  addWaterSchema,
  waterControler.addWaterVolume
);

waterRouter.patch(
  "/water/:waterId/water-volume",
  authenticate,
  isEmptyBody,
  updateWaterVolumeSchema,
  waterControler.updateWaterVolume
);

waterRouter.delete(
  "/water/:waterId",
  authenticate,
  waterControler.deleteWaterVolume
);

export default waterRouter;
