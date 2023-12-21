//Libary
import express from "express";
import "dotenv/config";
import logger from "morgan";
import cors from "cors";
//Path
import authRouter from "./routes/auth-routers.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found path" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});
export default app;
