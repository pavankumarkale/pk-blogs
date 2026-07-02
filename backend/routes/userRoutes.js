const express = require("express");
const multer = require("multer");
const path = require("path");

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
  admin
} = require("../middleware/authMiddleware");


const router = express.Router();

const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(null, "uploads/");
  },

  filename(req, file, cb) {

    cb(
      null,
      `profile-${Date.now()}${path.extname(file.originalname)}`
    );

  },

});

const upload = multer({
  storage,
});

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