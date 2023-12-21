import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
      console.log("Server runing on 3000 PORT");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
