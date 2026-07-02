const express = require("express");

const router = express.Router();

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const {
  dashboard,
  getUsers,
  deleteUser,
  getPosts,
  deletePost,
} = require("../controllers/adminController");


// Dashboard

router.get(
  "/dashboard",
  protect,
  admin,
  dashboard
);


// Users

router.get(
  "/users",
  protect,
  admin,
  getUsers
);

router.delete(
  "/users/:id",
  protect,
  admin,
  deleteUser
);


// Posts

router.get(
  "/posts",
  protect,
  admin,
  getPosts
);

router.delete(
  "/posts/:id",
  protect,
  admin,
  deletePost
);

module.exports = router;