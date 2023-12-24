import { HttpError } from "../helpers/index.js";

const getPointsMonth = (data) => {
  const [yyyy, mm] = data.split("-");
  const year = Number(yyyy);
  const month = Number(mm) - 1;
  const fromDateFind = new Date(Date.UTC(year, month, 1, 0, 0, 0, -1));
  const toDateFind = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
  return { fromDateFind, toDateFind };
};

export default getPointsMonth;
