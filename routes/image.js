const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require(`path`);

//  Multer Configuration Starts Here
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, `./../Images`);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, +Date.now() + "." + ext);
  },
});
//  Multer Configuration Finishes Here

//   Add a  image
const upload = multer({
  storage: storage,
}).single("image");

router.post(
  "/saveImages",

  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(500).json(err);
      } else {
        next();
      }
    });
  },
  (req, res, next) => {
    try {
      const url = req.protocol + "://" + req.get("host");
      const reqData = req.body;
      const imagePath = req.file.filename;
      res.json(imagePath);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
);

module.exports = router;
