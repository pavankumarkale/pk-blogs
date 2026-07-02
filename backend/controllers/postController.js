const Post = require("../models/Post");
const Notification = require("../models/Notification");

// ==============================
// Create Post
// ==============================

const createPost = async (req, res) => {
  try {
    const { title, content, image, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        message: "Title, content and category are required",
      });
    }

    const post = await Post.create({
      title,
      content,
      image,
      category,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get All Posts
// ==============================

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Get Single Post
// ==============================

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email profileImage");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// Update Post
// ==============================

const updatePost = async (req, res) => {
  try {

    const { title, content, image, category } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this post",
      });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    post.category = category || post.category;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post Updated Successfully",
      post: updatedPost,
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// Delete Post
// ==============================

const deletePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post Deleted Successfully",
    });

  } catch (error) {

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// Like / Unlike Post
// ==============================

const toggleLike = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {

      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );

    } else {

  // Add Like
  post.likes.push(req.user._id);

  // Create Notification
  if (
    post.author.toString() !==
    req.user._id.toString()
  ) {

    await Notification.create({

      recipient: post.author,

      sender: req.user._id,

      post: post._id,

      type: "like",

      message: `${req.user.name} liked your post.`,

    });

  }

}

    await post.save();

    res.status(200).json({
      message: alreadyLiked
        ? "Post Unliked"
        : "Post Liked",
      likes: post.likes,
      totalLikes: post.likes.length,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==============================
// Get Logged-in User Posts
// ==============================

const getMyPosts = async (req, res) => {

  try {

    const posts = await Post.find({
      author: req.user._id,
    })
      .populate("author", "name email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==============================
// Export Controllers
// ==============================

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts,
};