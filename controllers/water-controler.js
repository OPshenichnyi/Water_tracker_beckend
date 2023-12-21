import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/User.js";

const waterRate = async (req, res) => {
  const { _id } = req.user;
  const { waterRate } = req.body;
  const user = await User.findOne({ _id });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  await User.findByIdAndUpdate(_id, { waterRate });
  res.status(201).json({
    message: "Completed",
  });
};

export default {
  waterRate: ctrlWrapper(waterRate),
};
