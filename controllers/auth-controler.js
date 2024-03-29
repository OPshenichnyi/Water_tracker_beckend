import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError, cloudinary } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

const avatarsDir = path.resolve("public", "avatars");

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already exist");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      userName: newUser.userName,
      avatarURL: newUser.avatarURL,
      gender: newUser.gender,
      waterRate: newUser.waterRate,
    },
  });
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (user.avatarURL === "") {
    const userName = user.userName;
    const avatarLetter = userName.charAt(0).toUpperCase();

    const avatarURL = `${avatarLetter}`;

    await User.findByIdAndUpdate(user._id, { avatarURL });
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    user: {
      email: user.email,
      userName: user.userName,
      avatarURL: user.avatarURL,
      gender: user.gender,
      waterRate: user.waterRate,
    },
    token,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "File not found, File extention not allow");
  }

  const fileData = await cloudinary.uploader.upload(req.file.path, {
    floader: "posters",
    width: 400,
    height: 400,
    crop: "fill",
  });

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    }
  });

  const avatarURL = fileData.secure_url;
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

const getCurrent = async (req, res) => {
  const { userName, email, avatarURL, gender, waterRate } = req.user;
  res.json({
    email,
    userName,
    avatarURL,
    gender,
    waterRate,
  });
};

const updateProfil = async (req, res) => {
  const { _id } = req.user;
  const { userName, gender, email, oldPassword, newPassword } = req.body;

  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (oldPassword) {
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }
  }

  const updatedFields = {};
  if (email && email !== user.email) {
    updatedFields.email = email;
  }
  if (userName && userName !== user.userName) {
    updatedFields.userName = userName;
  }
  if (gender && gender !== user.gender) {
    updatedFields.gender = gender;
  }

  if (newPassword) {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    updatedFields.password = hashPassword;
  }

  await User.findByIdAndUpdate(_id, updatedFields, { new: true });
  const responseUser = {
    email: updatedFields.email || user.email,
    userName: updatedFields.userName || user.userName,
    gender: updatedFields.gender || user.gender,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  res.json(responseUser);
};

const waterRate = async (req, res) => {
  const { _id } = req.user;
  const { waterRate } = req.body;
  const user = await User.findOne({ _id });
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  await User.findByIdAndUpdate(_id, { waterRate });
  res.status(200, "New water rate value").json({
    waterRate,
  });
};

const dontSleep = async (req, res) => {
  res.status(200, "I dont sleep").json({ sleep: "I dont sleep" });
};
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
  getCurrent: ctrlWrapper(getCurrent),
  updateProfil: ctrlWrapper(updateProfil),
  waterRate: ctrlWrapper(waterRate),
  dontSleep: ctrlWrapper(dontSleep),
};
