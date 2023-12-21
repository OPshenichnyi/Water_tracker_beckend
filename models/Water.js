// import { Schema, model } from "mongoose";
import Joi from "joi";
// import { handleSaveError, preUpdate } from "./hooks.js";

// const waterSchema = new Schema({});

export const waterRateSchema = Joi.object({
  waterRate: Joi.number().integer().max(15000).required(),
});
