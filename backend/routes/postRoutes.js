const express = require("express");

const router = express.Router();

const { protect ,admin} = require("../middleware/authMiddleware");

const {
  createPost,getPosts, getPostById,updatePost, deletePost,getMyPosts,toggleLike,} = require("../controllers/postController");

router.post("/", protect, createPost);
router.get(
  "/my-posts",
  protect,
  getMyPosts
);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", protect, updatePost);
router.put("/:id/like", protect, toggleLike);
router.delete("/:id", protect, deletePost);

module.exports = router;