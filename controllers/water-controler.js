import { HttpError, getPointsMonth } from "../helpers/index.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import User from "../models/User.js";
import Water from "../models/Water.js";
import { now } from "mongoose";

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

const getWaterVolume = async (req, res) => {
  const { date } = req.body;
  const { _id: owner } = req.user;
  const _id = owner.toString();
  const { waterRate } = await User.findOne({ _id });
  const { fromDateFind, toDateFind } = getPointsMonth(date);
  const result = await Water.aggregate([
    {
      // Фільтрує документи за двома критеріями
      $match: {
        date: { $gt: fromDateFind, $lt: toDateFind },
        // Вибирає документ який попадає у діапазон між початковою prev датою та кінцевою next
        owner: { $eq: _id },
        // Вибираємо документи де поле owner
      },
    },
    {
      $group: {
        // Групує документи по даті
        _id: {
          //_id форматується до рядкового представлення  дати за допомогою  dateToString
          $dateToString: {
            date: "$date",
            format: "%Y-%m-%d",
          },
        },
        // Сумує дані по унікальній даті в totalWaterVolume
        totalWaterVolume: { $sum: "$waterVolume" },
        // Показує кількість водних порцій
        waterServings: { $count: {} },
      },
    },
    {
      // Формує кінцевий вид документа
      $project: {
        _id: 0, // Користувача
        date: "$_id", // Дата
        dailyNormFulfillment: {
          // Вираховуємо процене споживання води
          $round: [
            {
              $multiply: [{ $divide: ["$totalWaterVolume", waterRate] }, 100],
            },
            0,
          ],
        },
        //Розраховує щоденну норму споживання води,
        //waterRate ділить на 1000 і округляє до одного десяткового знаку.
        WaterRate: {
          $round: [{ $divide: [waterRate, 1000] }, 1],
        },
        // waterServings: Показує кількість водних порцій.
        servingOfWater: "$waterServings",
      },
    },
  ]);
  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ result });
};

export default {
  waterRate: ctrlWrapper(waterRate),
  addWaterVolume: ctrlWrapper(addWaterVolume),
  updateWaterVolume: ctrlWrapper(updateWaterVolume),
  deleteWaterVolume: ctrlWrapper(deleteWaterVolume),
  getWaterVolume: ctrlWrapper(getWaterVolume),
};
