import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

// Have four type users hi have other rules acces:
// provider - owner product,
// customer - sale product owner,
// manager - create orders customer,
// logist - delivery product

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//+ User schema moongose
const userSchema = new Schema(
  {
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userName: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["man", "girl"],
      default: "man",
    },
    waterRate: {
      type: Number,
      default: 2000,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
//+ END User schema Moongose

//+ User schema Joi

export const registerAndLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(8).max(48).required(),
  gender: Joi.string().valid("man", "girl").default("man"),
});


export const updateProfilSchema = Joi.object({
  userName: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  password: Joi.string().min(8).max(48),
  gender: Joi.string().valid("man", "girl"),
  oldPassword: Joi.string(),
  newPassword: Joi.string().min(8).max(48), 
  confirmNewPassword: Joi.string().min(8).max(48),
});

export const waterRateSchema = Joi.object({
  waterRate: Joi.number().integer().max(15000).required(),
});

