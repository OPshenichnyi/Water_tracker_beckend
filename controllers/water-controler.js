import { HttpError } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/User.js";
import Water from "../models/Water.js";

const waterRate = async (req, res) => {
  const { _id } = req.user;
  const { waterRate } = req.body;
  const user = await User.findOne({ _id });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  await User.findByIdAndUpdate(_id, { waterRate });
  res.status(201).json({
    waterRate,
  });
};

const addWaterVolume = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Water.create({ ...req.body, owner });
  const { waterVolume, date, _id } = result;
  res.status(201).json({ _id, date, owner, waterVolume });
};

const updateWaterVolume = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;
  const result = await Water.findOneAndUpdate(
    { _id: waterId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  const { _id, waterVolume, date } = result;
  res.status(201).json({ _id, waterVolume, date, owner });
};

const deleteWaterVolume = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;
  const result = await Water.findOneAndDelete({ _id: waterId, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Delete success" });
};

const dailyWaterConsumption = async (req, res) =>{
  const { _id: owner } = req.user;

  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
 
  const totalWaterConsumption = await Water.aggregate([
    {
      $match: {
        owner,
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalWaterVolume: { $sum: "$waterVolume" },
      },
    },
  ]);

  const waterRecords = await Water.find({
    owner,
    date: { $gte: startDate, $lt: endDate },
  });
  
  const dailyTotal = waterRecords.reduce((total, record) => total + record.waterVolume, 0);
  
  const user = await User.findOne({ _id: owner });
  if (!user) {
    throw HttpError(401, "User not found");
  }

  const waterRate = user.waterRate || 0;

  const percentage = waterRate > 0 ? Math.min(Math.round((dailyTotal / waterRate) * 100), 100) : 0;

  res.json({
    percentage,
    dailyTotal,
    waterRate,
    waterRecords,
  });
}

export default {
  waterRate: ctrlWrapper(waterRate),
  addWaterVolume: ctrlWrapper(addWaterVolume),
  updateWaterVolume: ctrlWrapper(updateWaterVolume),
  deleteWaterVolume: ctrlWrapper(deleteWaterVolume),
  dailyWaterConsumption: ctrlWrapper(dailyWaterConsumption)
};
