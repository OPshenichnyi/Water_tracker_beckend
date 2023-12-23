import { HttpError } from "../helpers/index.js";
const getMonthBreakPoints = (date) => {
  const [year, month] = date
    .split("-")
    .map((el, idx) => (idx === 1 ? Number(el) - 1 : Number(el)));
  const prev = new Date(Date.UTC(year, month, 1, 0, 0, 0, -1));
  const next = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
  return { prev, next };
};

const getPointsMonth = (data) => {
  const [yyyy, mm] = data.split("-");
  const year = Number(yyyy);
  const month = Number(mm) - 1;

  console.log(year, month);
};

export default getPointsMonth;
