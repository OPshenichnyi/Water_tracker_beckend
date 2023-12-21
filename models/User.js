import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, preUpdate } from "./hooks.js";

// Have four type users hi have other rules acces:
// provider - owner product,
// customer - sale product owner,
// manager - create orders customer,
// logist - delivery product

const statusUser = ["provider", "customer", "manager", "logist"];

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//+ User schema moongose
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Name is required"],
    },
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
    subscription: {
      type: String,
      enum: statusUser,
      require: [true, "Select type user"],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    userPhone: {
      type: String,
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

export const userSignupSchema = Joi.object({
  userName: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid(...statusUser)
    .required()
    .messages({ "any.required": "Please select type user" }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
  }),
});
