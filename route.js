import express from "express";
import { body, validationResult } from "express-validator";

import memoModel from "./model.js";
import { getTime } from "./utils.js";

const router = express.Router();

const getAllMemos = async (_, res) => {
  await memoModel
    .find()
    .sort({ create_time: -1 })
    .then((memos) => res.json(memos))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: `[ERROR] Server error.` });
    });
};

const createOneMemo = async (req, res) => {
  const { contents } = req.body;
  let memo = {
    contents: "",
    files: []
  };
  let _files = req.files;
  if (contents !== undefined) {
    if (contents.trim() === "") {
      contents = undefined;
    }
  }
  if (contents === undefined && _files === null) {
    return res.status(400).json({ msg: `[ERROR] Server error` });
  }
  if (_files !== null) {
    let { files } = _files;
    if (files[0] === undefined) {
      files = [files];
    }
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `./files/${file.md5}.${file.name.split(".")[1]}`;
        file.mv(filePath);
        memo.files.push({type: file.name.split('.')[1], path: filePath})
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ msg: `[ERROR] Server error` });
    }
  }
  memo.contents = contents
  const MemoDoc = new memoModel(memo);
  await MemoDoc.save()
    .then((memo) => {
      console.log(`"Created new memo, _id: ${memo._id}`);
      res.status(200).json(memo);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: `[ERROR] Server error.` });
    });
};

const deleteAllMemos = async (_, res) => {
  await memoModel
    .deleteMany({})
    .then((ret) => {
      console.log(ret);
      res.status(200).json({ msg: "[SUCCESS] Deleted." });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: `[ERROR] Server error.` });
    });
};

const getOneMemo = async (req, res) => {
  console.log(req.params.id);
  await memoModel
    .findById(req.params.id)
    .then((memo) => res.json(memo))
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: `[ERROR] Server error.` });
    });
};

const updateMemo = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.send({ errors: result.array() });
  }
  const { contents } = req.body;
  await memoModel
    .updateOne(
      { _id: req.params.id },
      {
        $set: {
          update_time: getTime(),
          contents: contents,
        },
      }
    )
    .then(() => {
      console.log(`Updated an memo, _id: ${req.params.id}`);
      res.status(200).json({ msg: "[SUCCESS] Updated." });
    })
    .catch((err) => {
      console.log(`[ERROR] ${err}`);
      res.status(400).json({ msg: "[ERROR] Server error." });
    });
};

const deleteOneMemo = async (req, res) => {
  await memoModel
    .deleteOne({ _id: req.params.id })
    .then((ret) => {
      console.log(ret);
      res.status(200).json({ msg: "[SUCCESS] Deleted." });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: `[ERROR] Server error.` });
    });
};

router.route("/").get(getAllMemos).post(createOneMemo).delete(deleteAllMemos);

router
  .route("/:id")
  .get(getOneMemo)
  .post(body("contents"), updateMemo)
  .delete(deleteOneMemo);

export default router;
