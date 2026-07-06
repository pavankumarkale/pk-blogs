const express = require("express");
const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

/*
----------------------------------
Cloudinary Storage
----------------------------------
*/

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pk-blogs",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
});

/*
----------------------------------
File Validation
----------------------------------
*/

const fileFilter = (req, file, cb) => {

  const allowedTypes =
    /jpg|jpeg|png|webp/;

  const extname =
    allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

  const mimetype =
    allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed"));
};

/*
----------------------------------
Multer
----------------------------------
*/

const upload = multer({
  storage,
  fileFilter,
});

/*
----------------------------------
Upload Route
----------------------------------
*/

router.post(
  "/",
  upload.single("image"),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image file",
      });
    }

    res.status(200).json({
      message: "Image Uploaded Successfully",

      // Cloudinary URL
      imagePath: req.file.path,
    });

  }
);

module.exports = router;