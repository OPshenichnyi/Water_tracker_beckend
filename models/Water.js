import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

const monthRegEx = /^\d{4}-\d{2}(?:-\d{2}(?:T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2})?)?$/;

// MONGOSE SCHEMA
const waterSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: [true, "Add value water volume"],
    },
    date: {
      type: Date,
      required: [true, "Must be data and time"],
      // default: Date.now,
    },
    owner: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

waterSchema.post("save", handleSaveError);
waterSchema.pre("findOneAndUpdate", preUpdate);
waterSchema.post("findOneAndUpdate", handleSaveError);

const Water = model("water", waterSchema);
export default Water;

// JOI SCHEMA

export const addWaterVolumeSchema = Joi.object({
  waterVolume: Joi.number().integer().max(5000).required(),
  date: Joi.date().iso().required().required(),
});

export const updateWaterVolumeSchema = Joi.object({
  waterVolume: Joi.number().integer().max(5000),
  date: Joi.date().iso(),
});

export const getWaterVolumeMonthSchema = Joi.object({
  date: Joi.string().required()
});
