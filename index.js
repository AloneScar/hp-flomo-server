import express from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import MemoRoutes from "./route.js";
import cors from "cors";
import upload from "express-fileupload";

dotenv.config();

const app = express();

app.use(cors());
app.use(upload());
app.use(express.json());

// routes
app.use("/api/memos", MemoRoutes);

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connect to mongodb well");
    app.listen(5555, "0.0.0.0", () => {
      console.log(`server running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
