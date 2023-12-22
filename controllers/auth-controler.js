import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError, cloudinary} from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { nanoid } from "nanoid";
import fs from "fs";
import path from 'path';

const avatarsDir = path.resolve("public", "avatars")

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
    email: newUser.email,
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


  if (user.avatarURL === "V") {
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
    token,
    user: {
      email: user.email,
    },
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  const {_id} = req.user

  if (!req.file) {
      throw HttpError(400, 'File not found, File extention not allow');
  }
 
  const fileData = await cloudinary.uploader.upload(req.file.path, {
     floader: "posters",
  })

  fs.unlink(req.file.path, (err) => {
    if (err) {
        console.error(`Error deleting file: ${err}`);
    }
  });

  const avatarURL = fileData.secure_url;
  await User.findByIdAndUpdate(_id, {avatarURL} )

  res.json({
      avatarURL,
  })
}

const getCurrent = async (req, res) => {
  const { userName, email, avatarURL, gender, waterRate } = req.user;
  res.json({
    email,
    userName,
    avatarURL, 
    gender,
    waterRate
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
  getCurrent: ctrlWrapper(getCurrent),

};

