import express from "express";
import { authenticate, isEmptyBody } from "../middlewares/index.js";
import * as waterSchemas from "../models/Water.js";
import { validateBody } from "../decorators/index.js";
import waterControler from "../controllers/water-controler.js";

const waterRouter = express.Router();
const waterRateSchema = validateBody(waterSchemas.waterRateSchema);

waterRouter.patch(
  "/water-rate",
  authenticate,
  isEmptyBody,
  waterRateSchema,
  waterControler.waterRate
);

export default waterRouter;
