const express = require("express");
const multer = require("multer");

const cloudinary = require("../config/cloudinary");
const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
----------------------------------
Cloudinary Storage
----------------------------------
*/

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pk-blogs/profile-images",
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
Multer
----------------------------------
*/

const upload = multer({
  storage,
});

/*
----------------------------------
Routes
----------------------------------
*/

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post(
  "/forgot-password",
  forgotPassword
);

router.put(
  "/reset-password/:token",
  resetPassword
);

router.get(
  "/profile",
  protect,
  getUserProfile
);

router.put(
  "/profile/image",
  protect,
  upload.single("image"),
  uploadProfileImage
);

router.put(
  "/profile",
  protect,
  updateUserProfile
);

module.exports = router;