import mongoose from "mongoose";

import { getTime } from "./utils.js";

const { Schema, model } = mongoose;

const memoSchema = new Schema({
  update_time: { type: String, default: () => getTime() },
  create_time: { type: String, default: () => getTime() },
  contents: { type: String, require: true },
  files: {
    type: [
      {
        type: { type: String },
        path: { type: String },
      },
    ],
  },
});

const memoModel = model("memo", memoSchema);

export default memoModel;
