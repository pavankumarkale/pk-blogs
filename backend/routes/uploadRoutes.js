const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpg|jpeg|png|webp/;

  const extname =
    allowedTypes.test(
      path.extname(file.originalname)
        .toLowerCase()
    );

  const mimetype =
    allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
});

router.post(
  "/",
  upload.single("image"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image file"
      });
    }

    res.status(200).json({
      message: "Image Uploaded Successfully",
      imagePath: `/uploads/${req.file.filename}`,
    });

  }
);

module.exports = router;