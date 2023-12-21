import express from "express";
import { authenticate } from "../middlewares/index.js";
import * as waterSchemas from "../models/Water.js";
import { validateBody } from "../decorators/index.js";

const waterRouter = express.Router();
const waterRateSchema = validateBody(waterSchemas.waterRateSchema);

// waterRouter.patch("/water-rate", waterRateSchema);

export default waterRouter;
