const User = require("../models/User");

const Post = require("../models/Post");

const Comment = require("../models/Comment");


const dashboard = async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalPosts =
      await Post.countDocuments();

    const totalComments =
      await Comment.countDocuments();

      // Calculate Total Likes
const allPosts = await Post.find();

let totalLikes = 0;

allPosts.forEach((post) => {
  totalLikes += post.likes.length;
});

// Calculate Total Categories
const uniqueCategories = [
  ...new Set(
    allPosts.map((post) => post.category)
  ),
];

const totalCategories =
  uniqueCategories.length;

  // Calculate Most Popular Category

const categoryCount = {};

allPosts.forEach((post) => {

  if (categoryCount[post.category]) {

    categoryCount[post.category]++;

  } else {

    categoryCount[post.category] = 1;

  }

});

let mostPopularCategory = "No Categories";

let mostPopularCategoryCount = 0;

for (const category in categoryCount) {

  if (categoryCount[category] > mostPopularCategoryCount) {

    mostPopularCategory = category;

    mostPopularCategoryCount =
      categoryCount[category];

  }

}


// =============================
// Most Liked Post
// =============================

let mostLikedPost = "No Posts";

let mostLikedPostLikes = 0;

allPosts.forEach((post) => {

  const likes = post.likes.length;

  if (likes > mostLikedPostLikes) {

    mostLikedPost = post.title;

    mostLikedPostLikes = likes;

  }

});

// =============================
// Recent Posts
// =============================

const recentPosts = await Post.find()
  .populate("author", "name")
  .sort({ createdAt: -1 })
  .limit(5);

  // =============================
// Latest Registered Users
// =============================

const latestUsers = await User.find()
  .select("name email createdAt")
  .sort({ createdAt: -1 })
  .limit(5);

  // =============================
// User Registration Chart
// =============================

const allUsers = await User.find().select("createdAt");

const registrationByMonth = {};

allUsers.forEach((user) => {

  const month = new Date(user.createdAt)
    .toLocaleString("default", {
      month: "short",
    });

  if (registrationByMonth[month]) {

    registrationByMonth[month]++;

  } else {

    registrationByMonth[month] = 1;

  }

});

    res.status(200).json({

  totalUsers,

  totalPosts,

  totalComments,

  totalLikes,
  totalCategories,
  mostPopularCategory,

  mostPopularCategoryCount,
  mostLikedPost,

  mostLikedPostLikes,
  recentPosts,
  latestUsers,
  registrationByMonth,
});

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

const getUsers = async (req, res) => {

  try {

    const users = await User.find()

      .select("-password")

      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

const deleteUser = async (req, res) => {

  try {

    const user =
      await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({

        message: "User not found",

      });

    }

    await user.deleteOne();

    res.status(200).json({

      message: "User deleted successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

const getPosts = async (req, res) => {

  try {

    const posts = await Post.find()

      .populate("author", "name email")

      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

const deletePost = async (req, res) => {

  try {

    const post =
      await Post.findById(req.params.id);

    if (!post) {

      return res.status(404).json({

        message: "Post not found",

      });

    }

    await post.deleteOne();

    res.status(200).json({

      message: "Post deleted successfully",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  dashboard,

  getUsers,

  deleteUser,

  getPosts,

  deletePost,

};