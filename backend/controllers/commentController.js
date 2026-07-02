const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// =======================================
// Create Comment
// =======================================

const createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;

    if (!comment) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    // Create Comment
    const newComment = await Comment.create({
      comment,
      user: req.user._id,
      post: postId,
    });

    // =======================================
    // Create Notification
    // =======================================

    const post = await Post.findById(postId);

    if (
      post &&
      post.author.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        post: post._id,
        type: "comment",
        message: `${req.user.name} commented on your post.`,
      });
    }

    // Return Populated Comment
    const populatedComment = await Comment.findById(
      newComment._id
    ).populate("user", "name _id");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Get Comments
// =======================================

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({
      post: postId,
    })
      .populate("user", "name _id")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// Delete Comment
// =======================================

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
  
};